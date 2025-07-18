"use server"

export interface ProfileData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string

  // Organization Details
  organizationName: string
  organizationType: string
  taxId: string
  website: string

  // Mailing Address
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string

  // Banking Information
  bankName: string
  accountType: string
  routingNumber: string
  accountNumber: string

  // Notification Preferences
  emailNotifications: boolean
  smsNotifications: boolean
  campaignUpdates: boolean
  donationReceipts: boolean
  marketingEmails: boolean
}

export interface CampaignDefaults {
  // Campaign Basics
  defaultTitle: string
  defaultTagline: string
  defaultCategory: string
  defaultVisibility: "public" | "private"

  // Financial Details
  defaultTargetAmount: number
  defaultCurrency: string
  defaultDuration: number
  defaultEndDate: string

  // Campaign Content
  defaultDescription: string
  defaultCoverImage: string
  defaultVideoUrl: string
  defaultImageGallery: string[]

  // Recipient & Settings
  defaultRecipientName: string
  defaultRecipientOrganization: string
  defaultRecipientRelationship: string
  defaultFundDelivery: "direct" | "escrow"
  defaultDonorUpdates: boolean

  // Social Sharing
  defaultFacebookSharing: boolean
  defaultTwitterSharing: boolean
  defaultLinkedInSharing: boolean

  // Legal & Compliance
  defaultRefundPolicy: string
  defaultDisbursementSchedule: string
  defaultDisclaimers: string
  defaultTermsAccepted: boolean
}

// Mock function to fetch profile data
export async function fetchProfileData(): Promise<ProfileData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",

    organizationName: "Conservative Action PAC",
    organizationType: "Political Action Committee",
    taxId: "12-3456789",
    website: "https://conservativeaction.org",

    streetAddress: "123 Liberty Street",
    city: "Austin",
    state: "Texas",
    zipCode: "78701",
    country: "United States",

    bankName: "First National Bank",
    accountType: "Business Checking",
    routingNumber: "111000025",
    accountNumber: "****5678",

    emailNotifications: true,
    smsNotifications: false,
    campaignUpdates: true,
    donationReceipts: true,
    marketingEmails: false,
  }
}

// Mock function to fetch campaign defaults
export async function fetchCampaignDefaults(): Promise<CampaignDefaults> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    defaultTitle: "Support Conservative Values",
    defaultTagline: "Help us defend traditional American principles and constitutional rights.",
    defaultCategory: "Political",
    defaultVisibility: "public",

    defaultTargetAmount: 10000,
    defaultCurrency: "USD",
    defaultDuration: 60,
    defaultEndDate: "2024-12-31",

    defaultDescription:
      "Join us in supporting conservative candidates and causes that align with traditional American values. Your contribution will help fund grassroots campaigns, voter outreach, and policy advocacy efforts.",
    defaultCoverImage: "",
    defaultVideoUrl: "",
    defaultImageGallery: [],

    defaultRecipientName: "Conservative Action PAC",
    defaultRecipientOrganization: "Conservative Action PAC",
    defaultRecipientRelationship: "Organization",
    defaultFundDelivery: "direct",
    defaultDonorUpdates: true,

    defaultFacebookSharing: true,
    defaultTwitterSharing: true,
    defaultLinkedInSharing: false,

    defaultRefundPolicy: "Refunds will be processed within 30 days of request for unused funds only.",
    defaultDisbursementSchedule: "Funds will be disbursed monthly to approved recipients.",
    defaultDisclaimers: "This campaign complies with all FEC regulations and contribution limits.",
    defaultTermsAccepted: false,
  }
}

// Mock function to update profile data
export async function updateProfileData(data: ProfileData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate potential error
  if (Math.random() < 0.1) {
    throw new Error("Failed to update profile. Please try again.")
  }

  console.log("Profile updated:", data)
  return { success: true, message: "Profile updated successfully!" }
}

// Mock function to update campaign defaults
export async function updateCampaignDefaults(data: CampaignDefaults) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate potential error
  if (Math.random() < 0.1) {
    throw new Error("Failed to update campaign defaults. Please try again.")
  }

  console.log("Campaign defaults updated:", data)
  return { success: true, message: "Campaign defaults updated successfully!" }
}
