"use client";

import type { CampaignApiPayload } from "@/components/campaign-form";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function createCampaign(
  data: CampaignApiPayload,
  token: string
): Promise<{ success: boolean; message: string }> {
  console.log("[createCampaign] START");

  try {
    // Debug log
    console.log("[createCampaign] Incoming data:", {
      title: data.title,
      category: data.category,
      targetAmount: data.targetAmount,
      termsAccepted: data.termsAccepted,
    });

    // Validate minimal required fields
    if (!data.title || !data.category || data.targetAmount <= 0 || !data.termsAccepted) {
      throw new Error("Missing or invalid required campaign fields.");
    }


    // Build payload for backend
    const payload = {
      userId: data.userId,
      campaignName: data.title,
      campaignType: data.category?.toLowerCase(), // ensures "Political" → "political"
      shortDescription: data.tagline,
      fullDescription: data.description,
      category: data.category,
      fundingGoal: data.targetAmount,
      currency: data.currency,
      heroImage: data.coverImage,        // url
      additionalImages: data.imageGallery, // url
      videoUrl: data.videoUrl,
      recipientName: data.recipientName,
      recipientRelationship: "Self",
      fundDelivery: "direct",
      campaignDuration: data.duration,
      endDate: data.endDate,
      visibility: data.visibility,
      amount_donated: 0,
      complianceAgreement: data.termsAccepted,
      termsAccepted: data.termsAccepted,
      refundPolicy: data.refundPolicy,
      disbursementSchedule: data.disbursementSchedule,
      disclaimers: data.disclaimers,
      advancedFeaturesEnabled: data.advancedFeaturesEnabled,
      teamCollaboration: data.teamCollaboration,
      customDonationAmounts: data.customDonationAmounts,
      donorRecognition: data.donorRecognition,
      analyticsIntegration: data.analyticsIntegration,
    };

    console.log("[createCampaign] Payload ready to send:", payload);

    if (!token) throw new Error("User is not authenticated. Please sign in again.");
    console.log(API);

    const response = await fetch(`${API}/api/v1/create_campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Safely parse JSON
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }

    console.log("[createCampaign] API response:", { status: response.status, result });

    if (!response.ok) {
      throw new Error(result.message || `Error ${response.status}: ${JSON.stringify(result)}`);
    }

    return { success: true, message: result.message || "Campaign created successfully." };
  } catch (err) {
    console.error("[createCampaign] FAILED:", err);
    throw err;
  }
}
