"use server"

import type { CampaignData } from "@/components/campaign-form"

// Mock database for campaigns with status tracking
const mockCampaigns: (CampaignData & {
  status: "active" | "paused" | "deleted"
  createdAt: string
  pausedAt: string | null
  deletedAt: string | null
})[] = [
  {
    id: "campaign-1",
    title: "Elect Sarah Johnson for Congress",
    tagline: "Bringing common sense back to Washington.",
    category: "Political",
    visibility: "public",
    targetAmount: 50000,
    currency: "USD",
    duration: 60,
    endDate: "2024-11-05",
    description:
      "Sarah Johnson is a dedicated public servant committed to fiscal responsibility, individual liberty, and strong national defense. Your support will help us reach voters across the district and secure a victory for conservative principles.",
    coverImage: "/placeholder.svg?height=400&width=800",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    imageGallery: [],
    recipientName: "Sarah Johnson for Congress",
    recipientOrganization: "Sarah Johnson Campaign Committee",
    recipientRelationship: "Organization",
    fundDelivery: "direct",
    donorUpdates: true,
    facebookSharing: true,
    twitterSharing: true,
    linkedInSharing: false,
    refundPolicy: "All donations are final and non-refundable.",
    disbursementSchedule: "Funds are disbursed weekly to the campaign committee.",
    disclaimers: "Paid for by Sarah Johnson for Congress. Not authorized by any candidate or candidate's committee.",
    termsAccepted: true,
    advancedFeaturesEnabled: true,
    teamCollaboration: true,
    customDonationAmounts: true,
    donorRecognition: false,
    analyticsIntegration: true,
    status: "active",
    createdAt: "2024-01-15",
    pausedAt: null,
    deletedAt: null,
  },
  {
    id: "campaign-2",
    title: "Protect Our Second Amendment Rights",
    tagline: "Defending freedom, one right at a time.",
    category: "Political",
    visibility: "public",
    targetAmount: 25000,
    currency: "USD",
    duration: 45,
    endDate: "2024-10-20",
    description:
      "This campaign is dedicated to protecting the Second Amendment rights of law-abiding citizens. We will support legislative efforts and educational programs to ensure our constitutional freedoms are preserved.",
    coverImage: "/placeholder.svg?height=400&width=800",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    imageGallery: [],
    recipientName: "Gun Owners of America",
    recipientOrganization: "GOA",
    recipientRelationship: "Organization",
    fundDelivery: "direct",
    donorUpdates: true,
    facebookSharing: true,
    twitterSharing: true,
    linkedInSharing: true,
    refundPolicy: "Donations are non-refundable.",
    disbursementSchedule: "Funds are disbursed monthly.",
    disclaimers: "A contribution to Gun Owners of America is not tax deductible.",
    termsAccepted: true,
    advancedFeaturesEnabled: false,
    teamCollaboration: false,
    customDonationAmounts: false,
    donorRecognition: false,
    analyticsIntegration: false,
    status: "active",
    createdAt: "2024-01-10",
    pausedAt: null,
    deletedAt: null,
  },
  {
    id: "campaign-3",
    title: "Support Local Veterans Programs",
    tagline: "Honoring those who served.",
    category: "Veterans",
    visibility: "public",
    targetAmount: 15000,
    currency: "USD",
    duration: 90,
    endDate: "2025-01-15",
    description:
      "Help us provide essential services and support to local veterans. Your donation will go directly to programs offering housing assistance, job training, and mental health services for our heroes.",
    coverImage: "/placeholder.svg?height=400&width=800",
    videoUrl: "",
    imageGallery: [],
    recipientName: "Veterans Outreach Foundation",
    recipientOrganization: "VOF",
    recipientRelationship: "Organization",
    fundDelivery: "escrow",
    donorUpdates: true,
    facebookSharing: true,
    twitterSharing: false,
    linkedInSharing: false,
    refundPolicy: "Refunds are available within 7 days of donation.",
    disbursementSchedule: "Funds are disbursed quarterly.",
    disclaimers:
      "The Veterans Outreach Foundation is a 501(c)(3) nonprofit organization. Contributions are tax-deductible to the extent allowed by law.",
    termsAccepted: true,
    advancedFeaturesEnabled: false,
    teamCollaboration: false,
    customDonationAmounts: false,
    donorRecognition: true,
    analyticsIntegration: false,
    status: "paused",
    createdAt: "2024-01-05",
    pausedAt: "2024-01-20",
    deletedAt: null,
  },
]

export async function fetchCampaignById(id: string): Promise<CampaignData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const campaign = mockCampaigns.find((campaign) => campaign.id === id)
  if (!campaign) {
    return null
  }

  // Return only the CampaignData fields, excluding status tracking fields
  const { status, createdAt, pausedAt, deletedAt, ...campaignData } = campaign
  return campaignData
}

export async function updateCampaign(data: CampaignData): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  const index = mockCampaigns.findIndex((campaign) => campaign.id === data.id)
  if (index === -1) {
    throw new Error("Campaign not found.")
  }

  // Basic validation
  if (!data.title || !data.tagline || !data.category) {
    throw new Error("Missing required campaign fields.")
  }

  if (!data.termsAccepted) {
    throw new Error("You must accept the terms and conditions.")
  }

  // Update the campaign while preserving status tracking fields
  const existingCampaign = mockCampaigns[index]
  mockCampaigns[index] = {
    ...existingCampaign,
    ...data,
    // Preserve status tracking fields
    status: existingCampaign.status,
    createdAt: existingCampaign.createdAt,
    pausedAt: existingCampaign.pausedAt,
    deletedAt: existingCampaign.deletedAt,
  }

  console.log("Updated campaign:", mockCampaigns[index])
  return { success: true, message: "Campaign updated successfully!" }
}
