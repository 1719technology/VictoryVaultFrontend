"use client";
import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CampaignForm, type CampaignData } from "@/components/campaign-form";
import { createCampaign } from "./action";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function CreateCampaignPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (data: CampaignData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("You must be logged in to create a campaign.");
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Missing user ID. Please log in again.");

      /**
       * `coverImage` and `imageGallery` are already URLs provided by the form,
       * so we pass them directly to the API.
       */
      const payload = {
        ...data,
        userId,
      };

      const result = await createCampaign(payload, token);
      setMessage({ type: "success", text: result.message });

      // Redirect to dashboard after success
      window.location.href = "/admin";
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

        {/* CampaignForm now handles URL-based inputs */}
        <CampaignForm onSubmit={handleSubmit} isSaving={isSaving} />
      </div>

      <Footer />
    </div>
  );
}
