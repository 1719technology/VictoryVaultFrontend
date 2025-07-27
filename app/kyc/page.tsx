"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface VerificationResponse {
  sessionId: string;
  sessionUrl: string;
  status: string;
}

const VerifyReg = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  const API_BASE = "https://api.victoryvault.gop";

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // If no token, force login
    if (!token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      setTimeout(() => router.push("/signin"), 5000);
      return;
    }

    const startVeriff = async () => {
      try {
        setLoading(true);

        // 1. Check profile status first
        const profileRes = await fetch(`${API_BASE}/api/v1/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) throw new Error("Failed to fetch profile");

        const profile = await profileRes.json();

        // If already verified, go straight to dashboard
        if (profile.kycStatus === "verified") {
          router.push("/dashboard");
          return;
        }

        // 2. Start Veriff session
        const veriffRes = await fetch(`${API_BASE}/api/v1/start-veriff`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let data: VerificationResponse;
        try {
          data = await veriffRes.json();
        } catch {
          throw new Error("Invalid response from verification server");
        }

        if (veriffRes.ok) {
          // Save session details (optional for debugging/retry)
          localStorage.setItem("veriffSessionId", data.sessionId);
          localStorage.setItem("veriffSessionUrl", data.sessionUrl);

          // Open Veriff flow in new tab
          window.open(data.sessionUrl, "_blank");
          toast.success("Verification process started. Complete it in the new tab.");

          // Begin polling for verification result
          setPolling(true);
          pollKycStatus(token);
        } else {
          throw new Error(data.status || "Verification failed");
        }
      } catch (err: any) {
        // Clear tokens to force fresh login next time
        localStorage.removeItem("veriffSessionId");
        localStorage.removeItem("veriffSessionUrl");
        localStorage.removeItem("authToken");

        setError(err.message || "Failed to start verification process");
        toast.error(err.message || "Verification failed");

        // Extend time before redirect (8 seconds)
        setTimeout(() => router.push("/signin"), 8000);
      } finally {
        setLoading(false);
      }
    };

    startVeriff();
  }, [router]);

  /**
   * Poll backend every 5 seconds until KYC verified or timeout (5 min)
   */
  const pollKycStatus = (token: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 60 * 5s = 5 minutes

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch(`${API_BASE}/api/v1/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to check verification status");

        const profile = await res.json();

        // If verified, stop polling and redirect
        if (profile.kycStatus === "verified") {
          clearInterval(interval);
          toast.success("Verification completed!");
          router.push("/dashboard");
        }

        // Stop polling after timeout
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setError("Verification timed out. Please login and try again.");
          localStorage.removeItem("authToken");
        }
      } catch (err) {
        clearInterval(interval);
        setError("Error while checking verification status. Please login again.");
        localStorage.removeItem("authToken");
      }
    }, 5000);
  };

  // UI: Loading or Polling State
  if (loading || polling) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Waiting for Verification
            </h1>
            <p className="text-gray-600 text-center">
              Please complete the verification process in the new tab. This page
              will automatically redirect you once verification is approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UI: Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-red-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Verification Error
            </h1>
            <p className="text-gray-600 text-center">{error}</p>
            <button
              onClick={() => router.push("/signin")}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyReg;
