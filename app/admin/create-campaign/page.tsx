"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CampaignForm, CampaignData } from "@/components/campaign-form";
import { createCampaign } from "./action";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function CreateCampaignPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // For active highlight

  const handleSubmit = async (data: CampaignData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const maxLen = 255;
      const fieldsToCheck = [
        { key: "title", label: "Campaign Name" },
        { key: "tagline", label: "Tagline" },
        { key: "description", label: "Description" },
        { key: "recipientName", label: "Recipient Name" },
        { key: "recipientOrganization", label: "Recipient Organization" },
        { key: "refundPolicy", label: "Refund Policy" },
        { key: "disbursementSchedule", label: "Disbursement Schedule" },
        { key: "disclaimers", label: "Disclaimers" },
      ];

      for (const field of fieldsToCheck) {
        const value = (data as any)[field.key];
        if (value && value.length > maxLen) {
          throw new Error(`${field.label} cannot exceed ${maxLen} characters`);
        }
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("You must be logged in to create a campaign.");

      const result = await createCampaign(data, token); // Pass raw CampaignData
      setMessage({ type: "success", text: result.message });

      router.push("/admin");
    } catch (error) {
      console.error("CreateCampaignPage error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/admin"
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
          <p className="text-gray-600">
            Set up your new political campaign with all the necessary details.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <CampaignForm onSubmit={handleSubmit} isSaving={isSaving} />
      </div>

      <Footer />

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2 md:py-3">
          {/* Dashboard */}
          <Link
            href="/admin"
            className={`flex flex-col items-center flex-1 transition ${pathname === "/admin" ? "text-red-600" : "text-gray-500"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke={pathname === "/admin" ? "red" : "gray"}
              className="w-5 h-5 md:w-6 md:h-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v10m-4 0h8"
              />
            </svg>
            <span className="text-xs font-medium">Dashboard</span>
          </Link>

          {/* Campaigns */}
          <Link
            href="/admin/create-campaign"
            className={`flex flex-col items-center flex-1 transition ${pathname === "/admin/create-campaign" ? "text-red-600" : "text-gray-500"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke={pathname === "/admin/create-campaign" ? "red" : "gray"}
              className="w-5 h-5 md:w-6 md:h-6 mb-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium">Campaigns</span>
          </Link>

          {/* Transactions */}
          <Link
            href="/admin/transactions"
            className={`flex flex-col items-center flex-1 transition ${pathname === "/admin/transactions" ? "text-red-600" : "text-gray-500"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke={pathname === "/admin/transactions" ? "red" : "gray"}
              className="w-5 h-5 md:w-6 md:h-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a5 5 0 00-10 0v2M5 9h14v10H5V9z"
              />
            </svg>
            <span className="text-xs font-medium">Transactions</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
