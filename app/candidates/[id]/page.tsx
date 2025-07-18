"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  end_date: string;
  photo: string;
  email: string;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const path = usePathname();
  const id = path.split("/").pop();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log("single_campaign response:", wrapper);
        const realCampaign = wrapper.campaign;
        if (!realCampaign) throw new Error("Malformed response");
        setCampaign(realCampaign as Campaign);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [id, API, KEY]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-5xl font-extrabold text-red-600 animate-pulse tracking-widest">
          VV
        </div>
      </div>
    );

  if (error) return <p className="p-8 text-center text-red-600">Error: {error}</p>;
  if (!campaign) return <p className="p-8 text-center">Not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
      {campaign.photo && (
        <div className="w-full h-64 relative mb-6 rounded overflow-hidden">
          <Image
            src={`${API}/uploads/${campaign.photo}`}
            alt={campaign.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}
      <p className="mb-4">{campaign.description}</p>
      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>Goal: ${campaign.goal.toLocaleString()}</span>
        <span>Ends: {new Date(campaign.end_date).toLocaleDateString()}</span>
      </div>
      <Button
        onClick={() => router.push(`/donate?campaignId=${campaign.id}`)}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Donate
      </Button>
    </div>
  );
}
