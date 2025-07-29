"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Campaign {
  title: string;
  description: string;
  heroImage: string;
  goal: number;
  owner: { name: string };
}

export default function CampaignPage() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`https://api.victoryvault.gop/api/v1/campaigns/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch campaign");

        const data = await res.json();
        setCampaign(data);
      } catch (err) {
        setError("Campaign not found or API error");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex justify-center items-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex justify-center items-center flex-1 text-red-600 font-medium">
          {error || "Campaign not found"}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img
              src={campaign.heroImage}
              alt={campaign.title}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{campaign.title}</h1>
          <p className="text-red-100 mt-2">By {campaign.owner.name}</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-700 mb-6">{campaign.description}</p>
        <p className="text-lg font-semibold mb-4">Goal: ${campaign.goal}</p>

        <Button
          onClick={() => alert("Go to donation flow")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          Donate Now
        </Button>
      </main>

      <Footer />
    </div>
  );
}
