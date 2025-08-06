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
import { CldUploadWidget } from "next-cloudinary"
import toast from "react-hot-toast";

export type CampaignData = {
  id?: string
  title: string
  tagline: string
  category: string
  visibility: "public" | "private"
  targetAmount: number
  currency: string
  duration: string
  endDate: string
  description: string
  coverImage: string;        // URL instead of File
  imageGallery: string[];    // Array of URLs instead of File[]
  videoUrl: string
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
  initialData?: CampaignData | null;
  onSubmit: (data: CampaignData) => Promise<void>; // <-- Change to CampaignData
  isSaving: boolean;
  onCancel?: () => void;
}


// export type CampaignApiPayload = Omit<CampaignData, 'coverImage' | 'imageGallery'> & {
//   heroImage: string;
//   additionalImages: string[];
//   userId?: string;
// };


export function CampaignForm({ initialData, onSubmit, isSaving, onCancel }: CampaignFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<CampaignData>({
    title: "",
    tagline: "",
    category: "Political",
    visibility: "public",
    targetAmount: 0,
    currency: "USD",
    duration: "30",
    endDate: new Date().toISOString().split("T")[0],
    description: "",
    coverImage: "",
    videoUrl: "",
    imageGallery: [],
    recipientName: "",
    recipientOrganization: "",
    recipientRelationship: "Self",
    fundDelivery: "direct",
    donorUpdates: false,
    facebookSharing: false,
    twitterSharing: false,
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
  });


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

  const [loadingHero, setLoadingHero] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);


  // Remove file handling since we're using URLs instead
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coverImage: value, // Directly set URL string
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: Number.parseInt(value) || 0,
    }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Retrieve from storage
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }


    await onSubmit(formData);
  };
  const steps = [
    {
      id: 1,
      name: "Campaign Basics",
      icon: FileText,
      content: (
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Campaign Name *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a compelling campaign name"
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
              <Input id="duration" type="text" value={formData.duration} onChange={handleChange} />
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
            {/* --- HERO IMAGE UPLOAD --- */}
            <div>
              <Label>Cover Image</Label>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                options={{
                  multiple: false,
                  maxFiles: 1,
                  clientAllowedFormats: ["jpg", "png", "jpeg"],
                  maxFileSize: 10000000,
                }}
                onSuccess={(result) => {
                  if (result?.info?.secure_url) {
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: result.info.secure_url,
                    }));
                    toast.success("Cover image uploaded successfully");
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => {
                      setLoadingHero(true);
                      if (typeof open !== "function") {
                        toast.error("Cloudinary widget failed to load");
                        setLoadingHero(false);
                        return;
                      }
                      open();
                      setTimeout(() => setLoadingHero(false), 300);
                    }}
                    className="border p-3 rounded-md text-gray-600 hover:text-red-600 flex items-center justify-center"
                  >
                    {loadingHero ? (
                      <span className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                    ) : (
                      "Upload Hero Image"
                    )}
                  </button>
                )}
              </CldUploadWidget>

              {formData.coverImage && (
                <div className="mt-3 relative">
                  <img
                    src={formData.coverImage}
                    alt="Cover Preview"
                    className="w-full h-40 object-cover rounded-md border"
                  />
                  <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>
                </div>
              )}
            </div>

            {/* --- VIDEO UPLOAD --- */}
            <div>
              <Label>Campaign Video</Label>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  resourceType: "video",
                  multiple: false,
                  maxFiles: 1,
                  clientAllowedFormats: ["mp4", "mov", "avi", "webm"],
                  maxFileSize: 50000000,
                }}
                onSuccess={(result) => {
                  if (result.event === "success" && result.info?.secure_url) {
                    setFormData((prev) => ({
                      ...prev,
                      videoUrl: result.info.secure_url,
                    }));
                    toast.success("Video uploaded successfully");
                  }
                  setLoadingVideo(false);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => {
                      if (open) {
                        setLoadingVideo(true);
                        open();
                      }
                    }}
                    className="border p-3 rounded-md text-gray-600 hover:text-red-600 flex items-center justify-center"
                  >
                    {loadingVideo ? (
                      <span className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                    ) : (
                      "Upload Video"
                    )}
                  </button>
                )}
              </CldUploadWidget>

              {formData.videoUrl && (
                <div className="mt-3">
                  <video
                    src={formData.videoUrl}
                    controls
                    className="w-full rounded-md border"
                  />
                  <p className="text-xs text-green-600 mt-1">✓ Video uploaded successfully</p>
                </div>
              )}
            </div>

          </div>
          {/* --- GALLERY UPLOAD --- */}
          <div className="mt-6">
            <Label>Gallery Images</Label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
              options={{
                multiple: true,
                maxFiles: 5,
                clientAllowedFormats: ["jpg", "png", "jpeg"],
                maxFileSize: 10000000,
              }}
              onSuccess={(result) => {
                if (result?.info?.secure_url) {
                  setFormData((prev) => ({
                    ...prev,
                    imageGallery: [...prev.imageGallery, result.info.secure_url],
                  }));
                  toast.success("Gallery image uploaded successfully");
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => {
                    setLoadingGallery(true);
                    if (typeof open !== "function") {
                      toast.error("Cloudinary widget failed to load");
                      setLoadingGallery(false);
                      return;
                    }
                    open();
                    setTimeout(() => setLoadingGallery(false), 300);
                  }}
                  className="border p-3 rounded-md text-gray-600 hover:text-red-600 flex items-center justify-center"
                >
                  {loadingGallery ? (
                    <span className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                  ) : (
                    "Upload Gallery Image"
                  )}
                </button>
              )}
            </CldUploadWidget>

            {formData.imageGallery.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {formData.imageGallery.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} className="h-24 w-full object-cover rounded-md border" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          imageGallery: prev.imageGallery.filter((_, i) => i !== index),
                        }));
                        toast.success("Image removed");
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              <Label htmlFor="recipientName">Tiltle Name</Label>
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
