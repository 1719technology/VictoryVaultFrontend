"use client"

interface Campaign {
  id: string
  title: string
  status: "active" | "paused" | "deleted"
  donations: string
  progress: string
  createdAt: string
  pausedAt: string | null
  deletedAt: string | null
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL as string

function getStatusOverrides(): Record<string, Campaign["status"]> {
  if (typeof window === "undefined") return {}
  return JSON.parse(localStorage.getItem("campaign_status_overrides") || "{}")
}

function setStatusOverride(id: string, status: Campaign["status"]) {
  if (typeof window === "undefined") return
  const overrides = getStatusOverrides()
  overrides[id] = status
  localStorage.setItem("campaign_status_overrides", JSON.stringify(overrides))
}

export async function getCampaigns(): Promise<Campaign[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("google_token") : null

  if (!token) {
    throw new Error("Google token not found in localStorage.")
  }

  const response = await fetch(`${API}/api/v1/all_campaign/email`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch campaigns from backend")
  }

  const data = await response.json()
  const campaigns: Campaign[] = data.campaigns || []

  // Apply status overrides from localStorage
  const overrides = getStatusOverrides()
  return campaigns.map((c) => {
    if (overrides[c.id]) {
      const overriddenStatus = overrides[c.id]
      return {
        ...c,
        status: overriddenStatus,
        pausedAt: overriddenStatus === "paused" ? c.pausedAt || new Date().toISOString() : null,
        deletedAt: overriddenStatus === "deleted" ? c.deletedAt || new Date().toISOString() : null,
      }
    }
    return c
  })
}

// Frontend-only simulated updates
export async function pauseCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  setStatusOverride(campaignId, "paused")
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, message: `Campaign ${campaignId} paused (saved locally)` }
}

export async function resumeCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  setStatusOverride(campaignId, "active")
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, message: `Campaign ${campaignId} resumed (saved locally)` }
}

export async function restoreCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  setStatusOverride(campaignId, "active")
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, message: `Campaign ${campaignId} restored (saved locally)` }
}

// Real API for deletion
export async function deleteCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("google_token") : null

  if (!token) {
    return { success: false, message: "Google token not found." }
  }

  const res = await fetch(`${API}/api/v1/delete_campaign/${campaignId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    return { success: false, message: "Failed to delete campaign" }
  }

  // Save deleted status locally
  setStatusOverride(campaignId, "deleted")

  return { success: true, message: "Campaign deleted successfully" }
}
