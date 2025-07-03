// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Navigation } from "@/components/navigation"
// import { Footer } from "@/components/footer"
// import { Eye, EyeOff, Mail, Lock, Flag } from "lucide-react"
// import Link from "next/link"

// export default function SignInPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)

//   const handleEmailSignIn = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     console.log("Email sign in:", { email, password, rememberMe })
//     setIsLoading(false)
//   }

//   const handleGoogleSignIn = async () => {
//     setIsLoading(true)

//     // Simulate Google OAuth
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     console.log("Google sign in initiated")
//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <Navigation />

//       <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-md space-y-8">
//           {/* Header */}
//           <div className="text-center">
//             <div className="flex justify-center mb-4">
//               <div className="bg-red-100 p-3 rounded-full">
//                 <Flag className="h-8 w-8 text-red-600" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
//             <p className="mt-2 text-gray-600">Sign in to your WinRed account</p>
//           </div>

//           <Card className="border-red-100 shadow-lg">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl text-center text-gray-900">Sign In</CardTitle>
//               <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Google Sign In */}
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full border-gray-300 hover:bg-gray-50"
//                 onClick={handleGoogleSignIn}
//                 disabled={isLoading}
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     fill="#4285F4"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="#34A853"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="#FBBC05"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="#EA4335"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 Continue with Google
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <Separator className="w-full" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white px-2 text-gray-500">Or continue with email</span>
//                 </div>
//               </div>

//               {/* Email Sign In Form */}
//               <form onSubmit={handleEmailSignIn} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium text-gray-700">
//                     Email Address
//                   </Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-sm font-medium text-gray-700">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="remember-me"
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
//                     />
//                     <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
//                       Remember me
//                     </Label>
//                   </div>
//                   <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-500 font-medium">
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
//                   {isLoading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </form>

//               <div className="text-center">
//                 <p className="text-sm text-gray-600">
//                   Don't have an account?{" "}
//                   <Link href="/signup" className="text-red-600 hover:text-red-500 font-medium">
//                     Sign up here
//                   </Link>
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Security Notice */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <Lock className="h-5 w-5 text-blue-600" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-blue-800">Secure Sign In</h3>
//                 <p className="mt-1 text-sm text-blue-700">
//                   Your account is protected with bank-level security. We use industry-standard encryption to keep your
//                   information safe.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Help Section */}
//           <div className="text-center">
//             <p className="text-sm text-gray-500">
//               Need help signing in?{" "}
//               <Link href="/contact" className="text-red-600 hover:text-red-500 font-medium">
//                 Contact Support
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   )
// }

"use client";

import React, { useState } from "react";
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
import { GoogleLogin } from "@react-oauth/google";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const KEY = process.env.NEXT_PUBLIC_API_KEY!;

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/v1/auth_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Sign-in failed");
      }
      const { token, user } = await res.json();
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/auth/auth_login`, {
        headers: { "X-API-Key": KEY },
      });
      if (!res.ok) throw new Error("Could not initiate Google sign-in");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Flag className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your VictoryVault account</p>
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

              {/* Google Sign In */}
              {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                  // 1) grab the ID token Google gave you
                  const idToken = credentialResponse.credential;
                  // 2) send that to your backend
                  fetch(`${API}/api/v1/auth_login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: idToken }),
                  })
                    .then((res) => res.json())
                    .then(({ token }) => {
                      localStorage.setItem("token", token);
                      router.push("/home");
                    })
                    .catch((e) => setError(e.message));
                  console.log("ID Token:", idToken);
                  console.log("CredentialResponse:", credentialResponse);

                }}

                onError={() => {
                  setError("Google sign-in failed");
                  setIsLoading(false);
                }}
                width="300"
              /> */}
              <GoogleLogin
                width={500}
                onSuccess={(credentialResponse) => {
                  // 1) Grab the ID token Google gave you
                  const idToken = credentialResponse.credential;
                  console.log("ID Token:", idToken);
                  console.log("CredentialResponse:", credentialResponse);

                  // 2) Send that to your backend and handle errors
                  fetch(`${API}/api/v1/auth_login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: idToken }),
                  })
                    .then(async (res) => {
                      const json = await res.json();
                      if (!res.ok) {
                        // Jump to .catch with the server’s error message or a generic one
                        throw new Error(json.message || `HTTP ${res.status}`);
                      }
                      return json;
                    })
                    .then(({ token }) => {
                      // On success, store your own auth token and navigate
                      localStorage.setItem("token", token);
                      router.push("/admin");
                    })
                    .catch((e) => {
                      // On any error (500, 401, network), show feedback instead
                      setError(e.message || "Login failed");
                    });
                }}
                onError={() => {
                  // Fired if the Google SDK itself fails
                  setError("Google sign-in failed");
                  setIsLoading(false);
                }}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((f) => !f)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-500">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-red-600 hover:text-red-500 font-medium">
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
                <h3 className="text-sm font-medium text-blue-800">Secure Sign In</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Your account is protected with bank-level security.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help signing in?{" "}
              <Link href="/contact" className="text-red-600 hover:text-red-500 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
