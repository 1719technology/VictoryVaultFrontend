"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRightCircle,
  ArrowLeftCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Campaign {
  id: number;
  campaignName: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  additionalImages: string[];
  fundingGoal: number;
  amount_donated: number;
  currency: string;
  recipientName: string;
  recipientOrganization: string | null;
  recipientRelationship: string;
  videoUrl: string;
  endDate: string;
  disclaimers: string;
  refundPolicy: string;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const path = usePathname();
  const id = path.split("/").pop();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "video" | "policies">("overview");

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const KEY = process.env.NEXT_PUBLIC_API_KEY!;

  useEffect(() => {
    if (!id) return;
    async function fetchCampaign() {
      try {
        const res = await fetch(`${API}/api/v1/single_campaign/${id}`, {
          headers: { "x-api-key": KEY },
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const wrapper = await res.json();
        setCampaign(wrapper.campaign as Campaign);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unexpected error.");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [id, API, KEY]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-5xl font-extrabold text-red-600 animate-pulse">VV</div>
      </div>
    );

  if (error) return <p className="p-8 text-center text-red-600">Error: {error}</p>;
  if (!campaign) return <p className="p-8 text-center">Not found.</p>;

  const images = [campaign.heroImage, ...(campaign.additionalImages || [])];
  const pct = Math.min(Math.round((campaign.amount_donated / campaign.fundingGoal) * 100), 100);

  const nextImg = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevImg = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b px-4 py-3 flex items-center z-20">
        <button
          onClick={() => router.push("/candidates")}
          className="text-gray-600 hover:text-red-600 mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold truncate">{campaign.campaignName}</h1>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Hero Banner */}
        <div className="relative h-64 w-full">
          <Image
            src={campaign.heroImage}
            alt={campaign.campaignName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
            <p className="text-white text-sm">{campaign.shortDescription}</p>
          </div>
        </div>

        {/* Progress & Donate Info */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Raised: {campaign.currency} {campaign.amount_donated.toLocaleString()}</span>
              <span>Goal: {campaign.currency} {campaign.fundingGoal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{pct}% funded</span>
              <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex space-x-4 border-b mb-4">
            {["overview", "gallery", "video", "policies"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 border-b-2 text-sm capitalize ${
                  activeTab === tab
                    ? "border-red-600 text-red-600 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab as typeof activeTab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-700">{campaign.fullDescription}</p>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Recipient</h2>
                <p>Name: {campaign.recipientName}</p>
                {campaign.recipientOrganization && <p>Organization: {campaign.recipientOrganization}</p>}
                <p>Relationship: {campaign.recipientRelationship}</p>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && images.length > 1 && (
            <div className="relative">
              <div className="h-56 w-full relative rounded-lg overflow-hidden">
                <Image
                  src={images[galleryIndex]}
                  alt={`Gallery ${galleryIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"
              >
                <ArrowLeftCircle className="text-white h-6 w-6" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"
              >
                <ArrowRightCircle className="text-white h-6 w-6" />
              </button>
            </div>
          )}

          {/* Video Tab */}
          {activeTab === "video" && campaign.videoUrl && (
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Campaign Video</h2>
              <iframe
                width="100%"
                height="300"
                src={campaign.videoUrl.replace("watch?v=", "embed/")}
                title="Campaign video"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Disclaimers</h2>
                <p>{campaign.disclaimers}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Refund Policy</h2>
                <p>{campaign.refundPolicy}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Donate Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <span className="text-gray-600 text-sm">
          {pct}% funded • {campaign.currency} {campaign.amount_donated.toLocaleString()} raised
        </span>
        <Button
          onClick={() => router.push(`/donate?campaignId=${campaign.id}`)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <DollarSign className="mr-2 h-5 w-5" /> Donate
        </Button>
      </div>
    </div>
  );
}
