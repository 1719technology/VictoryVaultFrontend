"use server"

export type ProfileData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  organizationName: string
  organizationType: string
  taxId: string
  website: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  bankName: string
  accountType: string
  routingNumber: string
  accountNumber: string
  emailNotifications: boolean
  smsNotifications: boolean
}

export type CampaignDefaults = {
  defaultTitle: string
  defaultTagline: string
  defaultCategory: string
  defaultVisibility: "public" | "private"
  defaultTargetAmount: number
  defaultCurrency: string
  defaultDuration: number
  defaultEndDate: string
  defaultDescription: string
  defaultCoverImage: string
  defaultVideoUrl: string
  defaultRecipientName: string
  defaultRecipientOrganization: string
  defaultRecipientRelationship: string
  defaultFundDelivery: "direct" | "escrow"
  defaultDonorUpdates: boolean
  defaultFacebookSharing: boolean
  defaultTwitterSharing: boolean
  defaultLinkedInSharing: boolean
  defaultRefundPolicy: string
  defaultDisbursementSchedule: string
  defaultDisclaimers: string
  defaultTermsAccepted: boolean
}

// Mock data for demonstration purposes
let mockProfileData: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  dateOfBirth: "1980-01-01",
  organizationName: "Republican Victory Fund",
  organizationType: "Political Action Committee",
  taxId: "XX-XXXXXXX",
  website: "https://www.republicanfund.org",
  streetAddress: "123 Main St",
  city: "Anytown",
  state: "CA",
  zipCode: "90210",
  country: "United States",
  bankName: "First National Bank",
  accountType: "Business Checking",
  routingNumber: "123456789",
  accountNumber: "987654321",
  emailNotifications: true,
  smsNotifications: false,
}

let mockCampaignDefaults: CampaignDefaults = {
  defaultTitle: "Support Our Cause",
  defaultTagline: "Join us in making a difference for conservative values.",
  defaultCategory: "Political",
  defaultVisibility: "public",
  defaultTargetAmount: 10000,
  defaultCurrency: "USD",
  defaultDuration: 30,
  defaultEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
  defaultDescription:
    "This campaign aims to raise funds for critical initiatives supporting Republican candidates and policies. Your contribution helps us advocate for freedom, prosperity, and traditional American values.",
  defaultCoverImage: "/placeholder.svg?height=400&width=800",
  defaultVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  defaultRecipientName: "Republican National Committee",
  defaultRecipientOrganization: "RNC",
  defaultRecipientRelationship: "Organization",
  defaultFundDelivery: "direct",
  defaultDonorUpdates: true,
  defaultFacebookSharing: true,
  defaultTwitterSharing: true,
  defaultLinkedInSharing: false,
  defaultRefundPolicy: "All donations are final and non-refundable.",
  defaultDisbursementSchedule: "Funds are disbursed weekly to the designated recipient.",
  defaultDisclaimers: "Contributions are not tax-deductible. Paid for by the Republican Victory Fund.",
  defaultTermsAccepted: true,
}

export async function fetchProfileData(): Promise<ProfileData> {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockProfileData
}

export async function updateProfileData(data: ProfileData): Promise<{ success: boolean; message: string }> {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Basic validation
  if (!data.firstName || !data.lastName || !data.email || !data.phone) {
    throw new Error("Missing required profile fields.")
  }

  mockProfileData = { ...mockProfileData, ...data }
  return { success: true, message: "Profile updated successfully!" }
}

export async function fetchCampaignDefaults(): Promise<CampaignDefaults> {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCampaignDefaults
}

export async function updateCampaignDefaults(data: CampaignDefaults): Promise<{ success: boolean; message: string }> {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Basic validation
  if (!data.defaultTitle || !data.defaultTagline || !data.defaultCategory) {
    throw new Error("Missing required campaign default fields.")
  }

  mockCampaignDefaults = { ...mockCampaignDefaults, ...data }
  return { success: true, message: "Campaign defaults updated successfully!" }
}
