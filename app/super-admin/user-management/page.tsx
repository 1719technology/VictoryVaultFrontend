"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Trash2, Play, Pause, Shield, Eye } from "lucide-react"
import { toast } from "sonner"

const API = process.env.NEXT_PUBLIC_API_BASE_URL as string

interface AdminUser {
  id: string
  fullName: string
  email: string
  role: "user" | "admin" | "super-admin"
  status: "active" | "paused" | "deleted"
  registrationStatus: "pending" | "approved" | "rejected"
  organizationType: string
  createdAt: string
  campaignCount: number
  lastLogin: string
  totalDonations: number
  notes?: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [viewUser, setViewUser] = useState<AdminUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"pause" | "activate" | "delete" | "restore" | "role">("pause")
  const [newRole, setNewRole] = useState("user")
  const [notes, setNotes] = useState("")

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const queryParams = new URLSearchParams()
    if (roleFilter !== "all") queryParams.append("role", roleFilter)
    if (statusFilter === "active") queryParams.append("isActive", "true")
    if (statusFilter === "deleted") queryParams.append("deleted", "true")

    try {
      const res = await fetch(`${API}/api/v1/admin/users?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      setUsers(data.users || [])
    } catch {
      toast.error("Failed to fetch users")
    }
  }, [roleFilter, statusFilter])

  const fetchSingleUser = async (userId: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await fetch(`${API}/api/v1/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      setViewUser(data)
      setViewDialogOpen(true)
    } catch {
      toast.error("Failed to load user details")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAction = (user: AdminUser, type: typeof actionType) => {
    setSelectedUser(user)
    setActionType(type)
    setDialogOpen(true)
  }

  const handleUserAction = async () => {
    if (!selectedUser) return
    const token = localStorage.getItem("token")
    if (!token) return

    const id = selectedUser.id
    let endpoint = ""
    let method: "PATCH" | "DELETE" | "PUT" = "PATCH"
    let body: string | null = null

    switch (actionType) {
      case "pause":
        endpoint = `/api/v1/admin/users/${id}/disable`
        break
      case "activate":
        endpoint = `/api/v1/admin/users/${id}/enable`
        break
      case "restore":
        endpoint = `/api/v1/admin/users/${id}/restore`
        break
      case "delete":
        endpoint = `/api/v1/admin/users/${id}`
        method = "DELETE"
        break
      case "role":
        endpoint = `/api/v1/admin/users/${id}`
        method = "PUT"
        body = JSON.stringify({ role: newRole })
        break
    }

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body
      })

      if (!res.ok) throw new Error()

      toast.success(`${actionType[0].toUpperCase() + actionType.slice(1)} successful`)
      setDialogOpen(false)
      fetchUsers()
    } catch {
      toast.error(`Failed to ${actionType} user`)
    }
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="p-6 space-y-6">
      <Link href="/super-admin" className="text-sm text-red-600 hover:underline inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-700">User Management</h1>
          <p className="text-gray-600">Manage all registered users and their accounts</p>
        </div>
      </div>

      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                <Input
                  className="pl-10 border-red-300"
                  placeholder="Name or Email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="border-red-300"><SelectValue placeholder="All Roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-red-300"><SelectValue placeholder="All Statuses" /></SelectTrigger>
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

      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="p-4 border-red-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg text-red-700">{user.fullName}</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                  <p>Org Type: {user.organizationType}</p>
                  <p>Campaigns: {user.campaignCount}</p>
                  <p>Total Donations: ${user.totalDonations.toLocaleString()}</p>
                  <p>Last Login: {new Date(user.lastLogin).toLocaleDateString("en-GB")}</p>
                  <p>Registered: {new Date(user.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Badge>{user.status}</Badge>
                <Badge variant="outline">{user.registrationStatus}</Badge>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleAction(user, "pause")}><Pause className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleAction(user, "activate")}><Play className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleAction(user, "delete")}><Trash2 className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleAction(user, "restore")}><Shield className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => fetchSingleUser(user.id)}><Eye className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700">
              {actionType === "role" ? "Change Role" : `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} User`}
            </DialogTitle>
            <DialogDescription>
              {selectedUser ? `Performing \"${actionType}\" on ${selectedUser.fullName}` : ""}
            </DialogDescription>
          </DialogHeader>

          {actionType === "role" ? (
            <>
              <Label>Select New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <Label>Optional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add reason or notes for this action..."
              />
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white" onClick={handleUserAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700">User Details</DialogTitle>
          </DialogHeader>

          {viewUser ? (
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {viewUser.fullName}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Role:</strong> {viewUser.role}</p>
              <p><strong>Status:</strong> {viewUser.status}</p>
              <p><strong>Registration Status:</strong> {viewUser.registrationStatus}</p>
              <p><strong>Organization:</strong> {viewUser.organizationType}</p>
              <p><strong>Campaigns:</strong> {viewUser.campaignCount}</p>
              <p><strong>Total Donations:</strong> ${viewUser.totalDonations.toLocaleString()}</p>
              <p><strong>Last Login:</strong> {new Date(viewUser.lastLogin).toLocaleDateString("en-GB")}</p>
              <p><strong>Created:</strong> {new Date(viewUser.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}

          <DialogFooter>
            <Button className="bg-red-600 text-white" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
