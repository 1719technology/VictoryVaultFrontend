// File: app/verify-otp/VerifyOtpClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, RotateCcw } from "lucide-react";
import { OtpInput } from "@/components/otp-input";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface ApiError {
  message?: string;
}

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    if (!isTimerActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const { message }: ApiError = await res.json();
        throw new Error(message || "OTP resend failed");
      }
      setSuccess("Verification code resent.");
      setTimeLeft(300);
      setIsTimerActive(true);
      setOtp("");
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Verify OTP
      const res = await fetch(`${API}/api/v1/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const resBody = await res.json();
      if (!res.ok) throw new Error(resBody.message || "OTP verification failed");

      const { token } = resBody;
      localStorage.setItem("authToken", token);

      // Step 2: Check user profile
      // const profileRes = await fetch(`${API}/api/v1/profile`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const profileData = await profileRes.json();

      // // Step 3: Redirect based on KYC status
      // if (profileData.kycStatus === "verified") {
      //   router.push("/admin");
      // } else {
      //   router.push("/kyc");
      // }
      // Directly redirect after OTP verification
      router.push("/admin");


    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center bg-gray-100 px-4 py-12">
        <Card className="w-full max-w-md p-6 space-y-6">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">Verify Your Account</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification code to your email address. Please enter it below to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Code sent to: {email}</span>
            </div>

            <div className="space-y-2 text-center">
              <Label className="text-base font-medium">Enter 6-digit verification code</Label>
              <OtpInput value={otp} onChange={setOtp} length={6} disabled={isLoading} />
              <p className="text-sm text-gray-500">
                Code expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
              </p>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}

            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold"
              disabled={isLoading || otp.length !== 6}
              onClick={handleVerifyOtp}
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </Button>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Didn&apos;t receive the code?</p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleResendOtp}
                disabled={isResending || isLoading || isTimerActive}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isResending ? "Resending..." : "Resend Code"}
              </Button>
              <Link href="/signin" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
