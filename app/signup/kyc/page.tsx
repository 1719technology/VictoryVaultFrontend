"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VVLoader from "@/components/vvloader";

export default function KYCPage() {
  const [loading, setLoading] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id || !user?.firstName) {
      router.push("/signin");
      return;
    }

    const startKYC = async () => {
      try {
        const res = await fetch("/api/v1/start-veriff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to start KYC");

        // If backend response confirms verification is successful
        if (data.status === "success" || data.verified === true) {
          setVerificationSuccess(true);
        } else {
          setErrorMessage("Verification failed or incomplete.");
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Something went wrong during verification.");
      } finally {
        setLoading(false);
      }
    };

    startKYC();
  }, [router]);

  if (loading) return <VVLoader />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {verificationSuccess ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              Verification Successful
            </h1>
            <p className="text-gray-600 text-center">
              Your identity has been verified successfully. You can now log in.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
            <p className="text-gray-600 text-center">
              {errorMessage || "Unable to complete verification. Please try again."}
            </p>
            <button
              onClick={() => router.push("/signin")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
