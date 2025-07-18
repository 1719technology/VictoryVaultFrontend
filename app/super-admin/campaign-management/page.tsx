"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Eye,
  Play,
  Pause,
  Trash2,
  Search,
  Plus,
  DollarSign,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

const API = process.env.NEXT_PUBLIC_API_BASE_URL as string

interface CampaignData {
  id: string
  title: string
  creatorName: string
  creatorEmail: string
  status: "active" | "paused" | "deleted"
  goalAmount: number
  raisedAmount: number
  donorCount: number
  createdAt: string
  endDate: string
  category: string
}

export default function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"pause" | "activate" | "delete" | "restore">("pause")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) fetchCampaigns(token)
  }, [])

  const fetchCampaigns = async (token: string) => {
    try {
      const res = await fetch(`${API}/api/v1/all_campaign`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!Array.isArray(data.campaigns)) {
        toast.error("Campaign list is empty or invalid format.")
        return
      }

      const enriched: CampaignData[] = await Promise.all(
        data.campaigns.map(async (c: Partial<CampaignData> & { email: string; name?: string }) => {
          const raisedRes = await fetch(`${API}/api/v1/total_raised/${c.email}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const raisedData = await raisedRes.json()
          return {
            ...c,
            raisedAmount: Number(raisedData.total || 0),
            goalAmount: Number(c.goalAmount || 0),
            donorCount: Number(c.donorCount || 0),
            creatorEmail: c.email,
            creatorName: c.creatorName || c.name || "",
            status: c.status || "active"
          } as CampaignData
        })
      )

      setCampaigns(enriched)
    } catch (err) {
      console.error("❌ Failed to fetch campaigns:", err)
      toast.error("Failed to fetch campaigns.")
    }
  }

  const handleCampaignAction = async (campaign: CampaignData, action: typeof actionType) => {
    setSelectedCampaign(campaign)
    setActionType(action)
    setActionDialogOpen(true)
  }

  const executeCampaignAction = async () => {
    if (!selectedCampaign) return
    const token = localStorage.getItem("token")
    if (!token) return

    let endpoint = ""
    let method: "PATCH" | "DELETE" = "PATCH"

    switch (actionType) {
      case "pause":
        endpoint = `/api/v1/admin/campaigns/${selectedCampaign.id}/disable`
        break
      case "activate":
        // ❗ Real endpoint not available yet — leave it as-is
        endpoint = `/api/v1/activate_campaign/${selectedCampaign.id}`
        break
      case "restore":
        endpoint = `/api/v1/admin/campaigns/${selectedCampaign.id}/restore`
        break
      case "delete":
        endpoint = `/api/v1/admin/campaigns/${selectedCampaign.id}`
        method = "DELETE"
        break
      default:
        return
    }

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        toast.success(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful`)
        fetchCampaigns(token)
      } else {
        toast.error(`Failed to ${actionType}`)
      }
    } catch {
      toast.error(`Failed to ${actionType}`)
    }

    setActionDialogOpen(false)
  }


  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <Link href="/super-admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Campaign Management</h1>
          <p className="text-gray-500">Manage all campaigns</p>
        </div>
        <Button className="bg-red-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Campaigns</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => {
          const progress = Math.min((campaign.raisedAmount / (campaign.goalAmount || 1)) * 100, 100).toFixed(1)

          return (
            <Card key={campaign.id} className="p-4 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{campaign.title}</h2>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-4 mt-1">
                    <span><strong>Creator:</strong> {campaign.creatorName}</span>
                    <span><strong>Category:</strong> {campaign.category}</span>
                    <span><strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
                <Badge className={
                  campaign.status === "active"
                    ? "bg-green-100 text-green-800"
                    : campaign.status === "paused"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                }>
                  {(campaign.status ?? "unknown")[0]?.toUpperCase() + (campaign.status ?? "unknown").slice(1)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Progress</p>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span><DollarSign className="inline w-4 h-4" /> Raised: ${campaign.raisedAmount.toLocaleString()}</span>
                  <span>Goal: ${campaign.goalAmount.toLocaleString()}</span>
                  <span>Donors: {campaign.donorCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline"><Eye className="w-4 h-4 mr-1" /> View Details</Button>
                {campaign.status === "active" && (
                  <Button variant="outline" onClick={() => handleCampaignAction(campaign, "pause")}><Pause className="w-4 h-4 mr-1" /> Pause</Button>
                )}
                {campaign.status === "paused" && (
                  <Button className="bg-green-600 text-white" onClick={() => handleCampaignAction(campaign, "activate")}><Play className="w-4 h-4 mr-1" /> Activate</Button>
                )}
                {campaign.status === "deleted" ? (
                  <Button variant="outline" onClick={() => handleCampaignAction(campaign, "restore")}><Play className="w-4 h-4 mr-1" /> Restore</Button>
                ) : (
                  <Button variant="destructive" onClick={() => handleCampaignAction(campaign, "delete")}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType} Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} this campaign?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button onClick={executeCampaignAction}>{actionType}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
