"use server"

import type { CampaignData } from "@/components/campaign-form"

export async function createCampaign(data: CampaignData): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  // Basic validation
  if (!data.title || !data.tagline || !data.category) {
    throw new Error("Missing required campaign fields.")
  }

  if (!data.termsAccepted) {
    throw new Error("You must accept the terms and conditions.")
  }

  // Generate a unique ID for the new campaign
  const campaignId = `campaign-${Date.now()}`

  // In a real application, this would save to a database
  const newCampaign = {
    ...data,
    id: campaignId,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    pausedAt: null,
    deletedAt: null,
  }

  console.log("Created campaign:", newCampaign)
  return { success: true, message: "Campaign created successfully!" }
}
