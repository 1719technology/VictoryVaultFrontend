"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CampaignForm, type CampaignData } from "@/components/campaign-form"
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { fetchCampaignById, updateCampaign } from "./action"

export default function EditCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [initialCampaignData, setInitialCampaignData] = useState<CampaignData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId) {
        setMessage({ type: "error", text: "Campaign ID is missing." })
        setIsLoading(false)
        return
      }
      try {
        const data = await fetchCampaignById(campaignId)
        if (data) {
          setInitialCampaignData(data)
        } else {
          setMessage({ type: "error", text: "Campaign not found." })
        }
      } catch (error) {
        setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to load campaign data." })
      } finally {
        setIsLoading(false)
      }
    }
    loadCampaign()
  }, [campaignId])

  const handleSubmit = async (data: CampaignData) => {
    setIsSaving(true)
    setMessage(null)
    try {
      const result = await updateCampaign(data)
      setMessage({ type: "success", text: result.message })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "An unknown error occurred." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard") // Redirect back to dashboard
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!initialCampaignData && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 inline mr-2" />
            {message?.text || "Campaign data could not be loaded."}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Campaign: {initialCampaignData?.title}</h1>
          <p className="text-gray-600">Modify the details of your existing political campaign.</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {initialCampaignData && (
          <CampaignForm
            initialData={initialCampaignData}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            onCancel={handleCancel}
          />
        )}
      </div>

      <Footer />
    </div>
  )
}
