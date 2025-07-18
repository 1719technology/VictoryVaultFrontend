"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  DollarSign,
  ImageIcon,
  Users,
  Shield,
  Settings,
  Loader2,
  Upload,
  Heart,
} from "lucide-react"

export type CampaignData = {
  id?: string
  title: string
  tagline: string
  category: string
  visibility: "public" | "private"
  targetAmount: number
  currency: string
  duration: number
  endDate: string
  description: string
  coverImage: File | null
  videoUrl: string
  imageGallery: File[]
  recipientName: string
  recipientOrganization: string
  recipientRelationship: string
  fundDelivery: "direct" | "escrow"
  donorUpdates: boolean
  facebookSharing: boolean
  twitterSharing: boolean
  linkedInSharing: boolean
  refundPolicy: string
  disbursementSchedule: string
  disclaimers: string
  termsAccepted: boolean
  advancedFeaturesEnabled: boolean
  teamCollaboration: boolean
  customDonationAmounts: boolean
  donorRecognition: boolean
  analyticsIntegration: boolean
}

interface CampaignFormProps {
  initialData?: CampaignData | null
  onSubmit: (data: CampaignData) => Promise<void>
  isSaving: boolean
  onCancel?: () => void
}

export function CampaignForm({ initialData, onSubmit, isSaving, onCancel }: CampaignFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<CampaignData>(
    initialData || {
      title: "",
      tagline: "",
      category: "Political",
      visibility: "public",
      targetAmount: 0,
      currency: "USD",
      duration: 30,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      description: "",
      coverImage: null,
      videoUrl: "",
      imageGallery: [],
      recipientName: "",
      recipientOrganization: "",
      recipientRelationship: "Self",
      fundDelivery: "direct",
      donorUpdates: true,
      facebookSharing: true,
      twitterSharing: true,
      linkedInSharing: false,
      refundPolicy: "",
      disbursementSchedule: "",
      disclaimers: "",
      termsAccepted: false,
      advancedFeaturesEnabled: false,
      teamCollaboration: false,
      customDonationAmounts: false,
      donorRecognition: false,
      analyticsIntegration: false,
    },
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      coverImage: file,
    }))
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      imageGallery: files,
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: Number.parseInt(value) || 0,
    }))
  }

  const handleNext = () => setStep((prev) => prev + 1)
  const handleBack = () => setStep((prev) => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const steps = [
    {
      id: 1,
      name: "Campaign Basics",
      icon: FileText,
      content: (
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a compelling campaign title"
              required
            />
          </div>
          <div>
            <Label htmlFor="tagline">Short Tagline (1-2 sentences) *</Label>
            <Input
              id="tagline"
              type="text"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Brief description of your campaign"
              maxLength={200}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="Political">Political</option>
                <option value="Education">Education</option>
                <option value="Medical">Medical</option>
                <option value="Community">Community</option>
                <option value="Arts">Arts</option>
                <option value="Veterans">Veterans</option>
                <option value="Religious">Religious</option>
              </select>
            </div>
            <div>
              <Label htmlFor="visibility">Visibility *</Label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="public">Public</option>
                <option value="private">Private / Invite-Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      ),
    },
    {
      id: 2,
      name: "Financial Details",
      icon: DollarSign,
      content: (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" value={formData.duration} onChange={handleNumberChange} min="1" />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
      ),
    },
    {
      id: 3,
      name: "Campaign Content",
      icon: ImageIcon,
      content: (
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Detailed campaign description..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="coverImage">Upload Cover Image</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.coverImage && (
                <p className="text-sm text-gray-600 mt-1">{formData.coverImage.name}</p>
              )}

            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Image Gallery</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                    <span>Upload images</span>
                    <input type="file" className="sr-only" accept="image/*" multiple />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each (max 10 images)</p>
              </div>
            </div>
          </div>
        </CardContent>
      ),
    },
    {
      id: 4,
      name: "Recipient & Settings",
      icon: Users,
      content: (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                type="text"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Who will receive the funds?"
              />
            </div>
            <div>
              <Label htmlFor="recipientOrganization">Recipient Organization</Label>
              <Input
                id="recipientOrganization"
                type="text"
                value={formData.recipientOrganization}
                onChange={handleChange}
                placeholder="Organization name"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="recipientRelationship">Relationship to Organizer</Label>
              <select
                id="recipientRelationship"
                value={formData.recipientRelationship}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="Self">Self</option>
                <option value="Organization">Organization</option>
                <option value="Family Member">Family Member</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fundDelivery">Fund Delivery Method</Label>
              <select
                id="fundDelivery"
                value={formData.fundDelivery}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="direct">Direct Disbursement</option>
                <option value="escrow">Escrow</option>
              </select>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="donorUpdates"
              checked={formData.donorUpdates}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
            />
            <Label htmlFor="donorUpdates">Opt-in for Donor Updates (email blasts)</Label>
          </div>
        </CardContent>
      ),
    },
    {
      id: 5,
      name: "Legal & Compliance",
      icon: Shield,
      content: (
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="refundPolicy">Refund Policy</Label>
            <textarea
              id="refundPolicy"
              value={formData.refundPolicy}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your refund policy terms..."
            />
          </div>
          <div>
            <Label htmlFor="disbursementSchedule">Disbursement Schedule</Label>
            <textarea
              id="disbursementSchedule"
              value={formData.disbursementSchedule}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="How and when funds will be disbursed..."
            />
          </div>
          <div>
            <Label htmlFor="disclaimers">Required Disclaimers</Label>
            <textarea
              id="disclaimers"
              value={formData.disclaimers}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter any required legal disclaimers..."
            />
          </div>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
              required
            />
            <Label htmlFor="termsAccepted">
              I confirm the accuracy of information and accept indemnification terms *
            </Label>
          </div>
        </CardContent>
      ),
    },
    {
      id: 6,
      name: "Advanced Features",
      icon: Settings,
      content: (
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="advancedFeaturesEnabled"
              checked={formData.advancedFeaturesEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
            />
            <Label htmlFor="advancedFeaturesEnabled">Enable Advanced Features</Label>
          </div>
          {formData.advancedFeaturesEnabled && (
            <div className="space-y-4 pl-6 border-l border-gray-200">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="teamCollaboration"
                  checked={formData.teamCollaboration}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <Label htmlFor="teamCollaboration">Team Collaboration</Label>
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="customDonationAmounts"
                  checked={formData.customDonationAmounts}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <Label htmlFor="customDonationAmounts">Custom Donation Amounts</Label>
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="donorRecognition"
                  checked={formData.donorRecognition}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <Label htmlFor="donorRecognition">Donor Recognition</Label>
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="analyticsIntegration"
                  checked={formData.analyticsIntegration}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <Label htmlFor="analyticsIntegration">Analytics Integration</Label>
              </div>
            </div>
          )}
        </CardContent>
      ),
    },
  ]

  const CurrentStepIcon = steps[step - 1].icon

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step > s.id ? "bg-red-600" : step === s.id ? "bg-red-500" : "bg-gray-300"
                  }`}
              >
                {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={`mt-2 text-xs font-medium ${step === s.id ? "text-red-600" : "text-gray-500"}`}>
                {s.name}
              </span>
            </div>
            {s.id < steps.length && <div className={`flex-1 h-0.5 ${step > s.id ? "bg-red-600" : "bg-gray-300"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Card */}
      <Card className="border-red-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CurrentStepIcon className="h-5 w-5 text-red-600" />
            <CardTitle className="text-xl text-gray-900">{steps[step - 1].name}</CardTitle>
          </div>
          <CardDescription>
            {initialData ? "Edit your campaign details" : "Enter your campaign details"}
          </CardDescription>
        </CardHeader>
        {steps[step - 1].content}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {step < steps.length ? (
          <Button type="button" onClick={handleNext} className="bg-red-600 hover:bg-red-700 text-white ml-auto">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-4 ml-auto">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  {initialData ? "Update Campaign" : "Create Campaign"}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}
