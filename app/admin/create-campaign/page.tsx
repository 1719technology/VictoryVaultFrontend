"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CampaignForm, type CampaignData } from "@/components/campaign-form"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_BASE_URL!

async function createCampaign(data: CampaignData): Promise<{ success: boolean; message: string }> {
  console.log("Sending campaign payload:", data)

  const formData = new FormData()

  // Append scalar values
  formData.append("campaignName", data.title)
  formData.append("tagline", data.tagline)
  formData.append("category", data.category)
  formData.append("visibility", data.visibility)
  formData.append("fundingGoal", data.targetAmount.toString())
  formData.append("currency", data.currency)
  formData.append("duration", data.duration.toString())
  formData.append("endDate", data.endDate)
  formData.append("description", data.description)
  formData.append("videoUrl", data.videoUrl)
  formData.append("recipientName", data.recipientName)
  formData.append("recipientOrganization", data.recipientOrganization)
  formData.append("recipientRelationship", data.recipientRelationship)
  formData.append("fundDelivery", data.fundDelivery)
  formData.append("donorUpdates", data.donorUpdates.toString())
  formData.append("facebookSharing", data.facebookSharing.toString())
  formData.append("twitterSharing", data.twitterSharing.toString())
  formData.append("linkedInSharing", data.linkedInSharing.toString())
  formData.append("refundPolicy", data.refundPolicy)
  formData.append("disbursementSchedule", data.disbursementSchedule)
  formData.append("disclaimers", data.disclaimers)
  formData.append("termsAccepted", data.termsAccepted.toString())
  formData.append("advancedFeaturesEnabled", data.advancedFeaturesEnabled.toString())
  formData.append("teamCollaboration", data.teamCollaboration.toString())
  formData.append("customDonationAmounts", data.customDonationAmounts.toString())
  formData.append("donorRecognition", data.donorRecognition.toString())
  formData.append("analyticsIntegration", data.analyticsIntegration.toString())

  // Append cover image if present
  if (data.coverImage instanceof File) {
    formData.append("coverImage", data.coverImage)
  }

  // Append gallery images
  data.imageGallery.forEach((file, index) => {
    if (file instanceof File) {
      formData.append(`imageGallery`, file)
    }
  })

  try {
    const token = localStorage.getItem("authToken")
    if (!token) {
      throw new Error("User is not authenticated. Please sign in again.")
    }

    const res = await fetch(`${API}/api/v1/create_campaign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })


    const result = await res.json()
    console.log("Backend response:", res.status, result)

    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}: ${JSON.stringify(result)}`)
    }

    // Redirect after success
    if (typeof window !== "undefined") {
      window.location.href = "/admin"
    }

    return { success: true, message: result.message || "Campaign created successfully." }
  } catch (error: any) {
    console.error("Campaign creation failed:", error)
    throw new Error(error.message || "An unexpected error occurred.")
  }
}

export default function CreateCampaignPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (data: CampaignData) => {
    setIsSaving(true)
    setMessage(null)
    try {
      const result = await createCampaign(data)
      setMessage({ type: "success", text: result.message })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
          <p className="text-gray-600">Set up your new political campaign with all the necessary details.</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
              }`}
          >
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <CampaignForm onSubmit={handleSubmit} isSaving={isSaving} />
      </div>

      <Footer />
    </div>
  )
}
