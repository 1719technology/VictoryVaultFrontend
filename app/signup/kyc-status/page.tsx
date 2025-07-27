"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VVLoader from "@/components/vvloader";

export default function KYCStatusPage() {
  const [status, setStatus] = useState("pending");
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      router.push("/signin");
      return;
    }

    const checkStatus = async () => {
      const res = await fetch(`/api/user-status?id=${user.id}`);
      const data = await res.json();

      if (data.kycStatus === "verified") {
        router.push("/admin");
      } else if (data.kycStatus === "failed") {
        router.push("/kyc");
      }
    };

    const interval = setInterval(checkStatus, 5000); // check every 5s
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <VVLoader />
      <p className="mt-4 text-gray-600">Checking your verification status…</p>
    </div>
  );
}
