"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Eye, Search, ArrowLeft } from "lucide-react"

interface Registration {
  id: string
  userName: string
  email: string
  organizationType: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  documents: {
    taxId: string
    bankingInfo: string
    organizationProof: string
  }
  notes?: string
}

export default function RegistrationReviewPage() {
  const [selectedDocUrl, setSelectedDocUrl] = useState("")
  const [docDialogOpen, setDocDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [registrations] = useState<Registration[]>([
    {
      id: "1",
      userName: "John Smith",
      email: "john@example.com",
      organizationType: "PAC",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      documents: {
        taxId: "https://example.com/docs/tax-id.pdf",
        bankingInfo: "https://example.com/docs/banking-info.pdf",
        organizationProof: "https://example.com/docs/org-proof.pdf"
      },
      notes: "Waiting review"
    },
    {
      id: "2",
      userName: "Alice Johnson",
      email: "alice@example.com",
      organizationType: "Campaign Org",
      submittedAt: "2024-01-10T09:00:00Z",
      status: "approved",
      documents: {
        taxId: "https://example.com/docs/tax-id-2.pdf",
        bankingInfo: "https://example.com/docs/banking-info-2.pdf",
        organizationProof: "https://example.com/docs/org-proof-2.pdf"
      },
      notes: "Approved and verified"
    }
  ])

  const filteredRegistrations = registrations.filter(reg =>
    (statusFilter === "all" || reg.status === statusFilter) &&
    (reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) || reg.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    }
    return (
      <Badge variant="outline" className={statusMap[status as keyof typeof statusMap] || "bg-gray-100"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleDocumentView = (url: string) => {
    setSelectedDocUrl(url)
    setDocDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6 bg-white text-gray-900">
      <div className="flex items-center gap-4">
        <Link
          href="/super-admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-700">Registration Review (Read-Only)</h1>
          <p className="text-sm text-gray-600">View documents submitted by users for verification</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredRegistrations.map((reg) => (
          <Card key={reg.id} className="p-4 border-red-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <h2 className="font-bold text-lg text-red-800">{reg.userName}</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Email: {reg.email}</div>
                  <div>Organization: {reg.organizationType}</div>
                  <div>Submitted: {new Date(reg.submittedAt).toLocaleDateString()}</div>
                  <div>Status: {getStatusBadge(reg.status)}</div>
                  {reg.notes && (
                    <div className="bg-gray-50 p-2 mt-2 rounded border text-sm text-gray-700">
                      <strong>Notes:</strong> {reg.notes}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => handleDocumentView(reg.documents.taxId)}
                  className="w-full"
                >
                  Tax ID
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDocumentView(reg.documents.bankingInfo)}
                  className="w-full"
                >
                  Banking Info
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDocumentView(reg.documents.organizationProof)}
                  className="w-full"
                >
                  Org Proof
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Document Dialog Viewer */}
      <Dialog open={docDialogOpen} onOpenChange={setDocDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <iframe
              src={selectedDocUrl}
              className="w-full h-[400px] border"
              title="Document Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
