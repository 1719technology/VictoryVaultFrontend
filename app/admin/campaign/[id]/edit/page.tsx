"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from 'next-cloudinary';

interface CampaignData {
  id: number;
  campaignName: string;
  campaignType: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  fundingGoal: number;
  currency: string;
  heroImage: string;
  additionalImages: string[];
  videoUrl: string;
  recipientName: string;
  recipientOrganization: string;
  recipientRelationship: string;
  fundDelivery: string;
  campaignDuration: number;
  endDate: string;
  visibility: string;
  complianceAgreement: boolean;
  termsAccepted: boolean;
  refundPolicy: string;
  disbursementSchedule: string;
  disclaimers: string;
  advancedFeaturesEnabled: boolean;
  teamCollaboration: boolean;
  customDonationAmounts: boolean;
  donorRecognition: boolean;
  analyticsIntegration: boolean;
}

export default function EditCampaignPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formData, setFormData] = useState<CampaignData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedCampaign");
    if (saved) {
      const data = JSON.parse(saved);

      setFormData({
        id: data.id || 0,
        campaignName: data.campaignName || data.name || "",
        campaignType: data.campaignType || data.category || "political",
        shortDescription: data.shortDescription || "",
        fullDescription: data.fullDescription || data.description || "",
        category: data.category || "",
        fundingGoal: Number(data.fundingGoal ?? 0),
        currency: data.currency || "USD",
        heroImage: data.heroImage || data.photo || "",
        additionalImages: data.additionalImages || [],
        videoUrl: data.videoUrl || "",
        recipientName: data.recipientName || "",
        recipientOrganization: data.recipientOrganization || "",
        recipientRelationship: data.recipientRelationship || "Self",
        fundDelivery: data.fundDelivery || "direct",
        campaignDuration: Number(data.campaignDuration ?? 30),
        endDate: data.endDate?.split("T")[0] || "",
        visibility: data.visibility || "public",
        complianceAgreement: Boolean(data.complianceAgreement),
        termsAccepted: Boolean(data.termsAccepted),
        refundPolicy: data.refundPolicy || "",
        disbursementSchedule: data.disbursementSchedule || "",
        disclaimers: data.disclaimers || "",
        advancedFeaturesEnabled: Boolean(data.advancedFeaturesEnabled),
        teamCollaboration: Boolean(data.teamCollaboration),
        customDonationAmounts: Boolean(data.customDonationAmounts),
        donorRecognition: Boolean(data.donorRecognition),
        analyticsIntegration: Boolean(data.analyticsIntegration),
      });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { id, value, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === "number" ? Number(value) : value,
    });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { id, checked } = e.target;
    setFormData({ ...formData, [id]: checked });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      additionalImages: e.target.value.split(",").map((url) => url.trim()),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    // Remove `id` from the payload
    const { id: _id, ...payload } = formData;
    console.log("Updating campaign with ID:", id);

    const res = await fetch(`${API}/api/v1/update_campaign/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...payload,
        //userId,
        fundingGoal: Number(formData.fundingGoal),
        campaignDuration: Number(formData.campaignDuration),
      }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const errorText = await res.text();
      alert(`Failed to update campaign: ${errorText}`);
    }
  };


  if (!formData) {
    return <p className="p-6 text-gray-600">Loading campaign details...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold mb-4">Edit Campaign</h2>

      {/* Campaign Name */}
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input id="campaignName" value={formData.campaignName} onChange={handleChange} />
      </div>

      {/* Campaign Type */}
      <div>
        <Label htmlFor="campaignType">Campaign Type</Label>
        <select id="campaignType" value={formData.campaignType} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="political">Political</option>
          <option value="education">Education</option>
          <option value="medical">Medical</option>
          <option value="community">Community</option>
        </select>
      </div>

      {/* Short Description */}
      <div>
        <Label htmlFor="shortDescription">Tagline</Label>
        <Input id="shortDescription" value={formData.shortDescription} onChange={handleChange} />
      </div>

      {/* Full Description */}
      <div>
        <Label htmlFor="fullDescription">Description</Label>
        <textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Funding Goal */}
      <div>
        <Label htmlFor="fundingGoal">Funding Goal</Label>
        <Input id="fundingGoal" type="number" value={formData.fundingGoal} onChange={handleChange} />
      </div>

      {/* Currency */}
      <div>
        <Label htmlFor="currency">Currency</Label>
        <select id="currency" value={formData.currency} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Hero Image */}
      <div>
        <Label>Hero Image</Label>
        {formData.heroImage && (
          <div className="mb-2">
            <img src={formData.heroImage} alt="Hero" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            multiple: false,
            maxFiles: 1,
            clientAllowedFormats: ["jpg", "png", "jpeg"],
            maxFileSize: 10000000,
          }}
          onSuccess={(result) => {
            if (result.event === "success" && result.info?.secure_url) {
              setFormData((prev) => ({ ...prev!, heroImage: result.info.secure_url }));
            }
            setUploadingHero(false); // stop loader
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                if (open) {
                  setUploadingHero(true);
                  open();
                }
              }}
              className="border p-3 rounded-md text-gray-600 hover:text-red-600 flex items-center gap-2"
            >
              {uploadingHero ? (
                <span className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full"></span>
              ) : (
                "Upload Hero Image"
              )}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Gallery Images */}
      <div>
        <Label>Gallery Images</Label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {formData.additionalImages.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt={`Gallery ${index}`} className="w-20 h-20 object-cover rounded" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev!,
                    additionalImages: prev!.additionalImages.filter((_, i) => i !== index),
                  }))
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            multiple: true,
            maxFiles: 5,
            clientAllowedFormats: ["jpg", "png", "jpeg"],
            maxFileSize: 10000000,
          }}
          onSuccess={(result) => {
            if (result.event === "success" && result.info?.secure_url) {
              setFormData((prev) => ({
                ...prev!,
                additionalImages: [...prev!.additionalImages, result.info.secure_url],
              }));
            }
            setUploadingGallery(false); // stop loader
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                if (open) {
                  setUploadingGallery(true);
                  open();
                }
              }}
              className="border p-3 rounded-md text-gray-600 hover:text-red-600 flex items-center gap-2"
            >
              {uploadingGallery ? (
                <span className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full"></span>
              ) : (
                "Upload Gallery Images"
              )}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Campaign Video Upload */}
      <div>
        <Label>Campaign Video</Label>
        {formData.videoUrl && (
          <div className="mb-2">
            <video src={formData.videoUrl} controls className="w-64 rounded border" />
          </div>
        )}
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
              setFormData((prev) => ({ ...prev!, videoUrl: result.info.secure_url }));
            }
            setUploadingVideo(false); // stop loader
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                if (open) {
                  setUploadingVideo(true);
                  open();
                }
              }}
              className="border p-3 rounded-md text-gray-600 hover:text-red-600 flex items-center gap-2"
            >
              {uploadingVideo ? (
                <span className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full"></span>
              ) : (
                "Upload Video"
              )}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Recipient Name */}
      <div>
        <Label htmlFor="recipientName">Recipient Name</Label>
        <Input id="recipientName" value={formData.recipientName} onChange={handleChange} />
      </div>

      {/* Recipient Organization */}
      <div>
        <Label htmlFor="recipientOrganization">Recipient Organization</Label>
        <Input id="recipientOrganization" value={formData.recipientOrganization} onChange={handleChange} />
      </div>

      {/* Recipient Relationship */}
      <div>
        <Label htmlFor="recipientRelationship">Recipient Relationship</Label>
        <select
          id="recipientRelationship"
          value={formData.recipientRelationship}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Self">Self</option>
          <option value="Family Member">Family Member</option>
          <option value="Organization">Organization</option>
        </select>
      </div>

      {/* Fund Delivery */}
      <div>
        <Label htmlFor="fundDelivery">Fund Delivery</Label>
        <select id="fundDelivery" value={formData.fundDelivery} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="direct">Direct</option>
          <option value="escrow">Escrow</option>
        </select>
      </div>

      {/* Duration & End Date */}
      <div>
        <Label htmlFor="campaignDuration">Duration (days)</Label>
        <Input id="campaignDuration" value={formData.campaignDuration} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} />
      </div>

      {/* Visibility */}
      <div>
        <Label htmlFor="visibility">Visibility</Label>
        <select id="visibility" value={formData.visibility} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Policies */}
      <div>
        <Label htmlFor="refundPolicy">Refund Policy</Label>
        <textarea
          id="refundPolicy"
          value={formData.refundPolicy}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <Label htmlFor="disbursementSchedule">Disbursement Schedule</Label>
        <textarea
          id="disbursementSchedule"
          value={formData.disbursementSchedule}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <Label htmlFor="disclaimers">Disclaimers</Label>
        <textarea
          id="disclaimers"
          value={formData.disclaimers}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Checkboxes */}
      {[
        "advancedFeaturesEnabled",
        "teamCollaboration",
        "customDonationAmounts",
        "donorRecognition",
        "analyticsIntegration",
        "complianceAgreement",
        "termsAccepted",
      ].map((field) => (
        <div key={field} className="flex items-center space-x-3">
          <input
            type="checkbox"
            id={field}
            checked={formData[field as keyof CampaignData] as boolean}
            onChange={handleCheckbox}
          />
          <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</Label>
        </div>
      ))}

      <Button type="submit" className="bg-red-600 text-white">
        Update Campaign
      </Button>
    </form>
  );
}
