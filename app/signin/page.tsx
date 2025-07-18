"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Eye, EyeOff, Mail, Lock, Flag } from "lucide-react";
import Link from "next/link";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export default function SignInPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.password) setOtp(parsed.password); // assuming password is reused as OTP
      } catch (e) {
        console.warn("Failed to parse user from localStorage");
      }
    }
  }, []);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = { email, password };
      console.log("Payload:", payload);

      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (!res.ok) {
        // If specific error, handle it here
        if (data?.error === "Please verify your email first") {
          setError("You must verify your email before logging in. Please check your inbox.");
          return;
        }

        // Otherwise throw generic error
        throw new Error(data.message || "OTP request failed");
      }

      setOtpSent(true);
    } catch (err: any) {
      console.error("OTP Request Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "OTP verification failed");
      }
      const { token } = await res.json();
localStorage.setItem("authToken", token); // FIXED: store with correct key
router.push("/admin");

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Navigation />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Flag className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to your VictoryVault account
            </p>
          </div>

          <Card className="border-red-100 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-gray-900">
                Sign In
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <GoogleLogin
                width={500}
                onSuccess={(credentialResponse: CredentialResponse) => {
                  const idToken = credentialResponse.credential;
                  if (!idToken) {
                    setError("Google did not return a valid credential.");
                    return;
                  }
                  fetch(`${API}/api/v1/auth_login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: idToken }),
                  })
                    .then(async (res) => {
                      const json = await res.json();
                      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
                      return json;
                    })
                    .then(({ token }) => {
                      localStorage.setItem("token", token);
                      router.push("/admin");
                    })
                    .catch((e) => {
                      setError(e.message || "Login failed");
                    });
                }}
                onError={() => {
                  setError("Google sign-in failed");
                  setIsLoading(false);
                }}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with email OTP
                  </span>
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP…" : "Request OTP"}
                  </Button>
                </form>

              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter the 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying…" : "Verify & Sign In"}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account? {" "}
                  <Link
                    href="/signup"
                    className="text-red-600 hover:text-red-500 font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-blue-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Secure Sign In
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Your account is protected with bank-level security.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help signing in? {" "}
              <Link
                href="/contact"
                className="text-red-600 hover:text-red-500 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
