"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

interface Campaign {
  id: number;
  campaignName: string;
  fullDescription: string;
  shortDescription: string;
  category: string;
  campaignType: string;
  fundingGoal: number;
  amount_donated: number;
  heroImage: string;
  additionalImages: string[];
  videoUrl: string;
  recipientName: string;
  recipientOrganization: string | null;
  recipientRelationship: string;
  fundDelivery: string;
  campaignDuration: number;
  endDate: string;
  visibility: string;
  refundPolicy: string;
  disbursementSchedule: string;
  disclaimers: string;
  complianceAgreement: boolean;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  currency: string;
  status?: "Active" | "Paused" | "Deleted";
}

export default function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/signin");
      return;
    }

    fetch(`${API}/api/v1/single_campaign/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load campaign details");
        const data = await res.json();
        setCampaign(data.campaign);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unexpected error")
      )
      .finally(() => setLoading(false));
  }, [API, id, router]);

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading campaign details...</p>;
  if (error)
    return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!campaign) return <p className="p-6 text-center">Campaign not found</p>;

  const formatCurrency = (value: number | undefined) =>
    value !== undefined ? value.toLocaleString() : "0";

  const progress = campaign.fundingGoal
    ? Math.round(((campaign.amount_donated ?? 0) / campaign.fundingGoal) * 100)
    : 0;

  // Combine hero + additional images
  const images = [campaign.heroImage, ...(campaign.additionalImages || [])];

  // Carousel navigation
  const nextImg = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevImg = () =>
    setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Arrow */}
      <header className="sticky top-0 bg-white border-b px-4 py-3 flex items-center z-20">
        <button
          onClick={() => router.push("/admin")}
          className="text-gray-600 hover:text-red-600 mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold truncate">{campaign.campaignName}</h1>
      </header>

      {/* Hero Banner */}
      <div className="relative h-80 w-full">
        <img
          src={campaign.heroImage}
          alt={campaign.campaignName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-red-900 bg-opacity-60 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-extrabold text-white">{campaign.campaignName}</h1>
          <p className="text-white text-base mt-2">{campaign.shortDescription}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Raised</span>
              <span className="font-semibold text-red-700">
                {campaign.currency} {formatCurrency(campaign.amount_donated)} /{" "}
                {campaign.currency} {formatCurrency(campaign.fundingGoal)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-600 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}% funded</p>
          </div>

          {/* About Campaign */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-red-700 mb-3">About this Campaign</h2>
            <p className="text-gray-700 leading-relaxed">{campaign.fullDescription}</p>
          </div>

          {/* Gallery with Carousel */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 relative">
              <h3 className="text-lg font-bold text-red-700 mb-3">Gallery</h3>
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img
                  src={images[galleryIndex]}
                  alt={`Gallery ${galleryIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Show arrows if more than 2 images */}
                {images.length > 2 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70"
                    >
                      <ArrowLeftCircle className="text-white h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70"
                    >
                      <ArrowRightCircle className="text-white h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Video */}
          {campaign.videoUrl && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-red-700 mb-3">Campaign Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-64 rounded-lg"
                  src={campaign.videoUrl.replace("watch?v=", "embed/")}
                  title="Campaign Video"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-red-700 mb-4">Campaign Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Category:</span> {campaign.category}
              </p>
              <p>
                <span className="font-medium">Type:</span> {campaign.campaignType}
              </p>
              <p>
                <span className="font-medium">Recipient:</span> {campaign.recipientName}
              </p>
              {campaign.recipientOrganization && (
                <p>
                  <span className="font-medium">Organization:</span>{" "}
                  {campaign.recipientOrganization}
                </p>
              )}
              <p>
                <span className="font-medium">Relationship:</span>{" "}
                {campaign.recipientRelationship}
              </p>
              <p>
                <span className="font-medium">Fund Delivery:</span>{" "}
                {campaign.fundDelivery}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {campaign.campaignDuration} days
              </p>
              <p>
                <span className="font-medium">End Date:</span>{" "}
                {new Date(campaign.endDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Visibility:</span>{" "}
                {campaign.visibility}
              </p>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-700">
            <p>
              <strong>Refund Policy:</strong> {campaign.refundPolicy}
            </p>
            <p className="mt-2">
              <strong>Disbursement Schedule:</strong> {campaign.disbursementSchedule}
            </p>
            <p className="mt-2">
              <strong>Disclaimers:</strong> {campaign.disclaimers}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/admin/campaign/${id}/edit`}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-center"
            >
              Edit
            </Link>
            <button
              onClick={() => alert("Delete functionality here")}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
