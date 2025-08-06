"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VVLoader from "@/components/vvloader";
import { Users, DollarSign, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface Campaign {
  id: number;
  title: string;
  description?: string;
  office?: string;
  state?: string;
  goal: number;
  amount_donated: number;
  email: string;
  photo?: string;
  duration?: string | number;
  status?: "Active" | "Paused" | "Deleted";
}

export default function HomePage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Paused" | "Deleted">("All");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API}/api/v1/all_campaign`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          setCampaigns([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const list: Campaign[] = (
          Array.isArray(data) ? data : Array.isArray(data.campaigns) ? data.campaigns : []
        ).map((c: Record<string, any>) => ({
          id: c.id,
          title: c.campaignName || "Untitled",
          description: c.fullDescription || c.shortDescription || "",
          office: c.campaignType || "",
          state: c.recipientName || "", // <-- CHANGE THIS
          goal: Number(c.fundingGoal || 0),
          amount_donated: Number(c.amount_donated || 0),
          email: c.email || "",
          photo: c.heroImage || "",
          duration: c.campaignDuration || "",
          status: (c.status as "Active" | "Paused" | "Deleted") || "Active",
        }));

        setCampaigns(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [API]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, filterStatus]);

  if (loading) return <VVLoader />;
  if (error) return <p className="p-8 text-red-600 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empower Conservative
            <span className="block text-blue-100">Leadership</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
            Join thousands of patriots supporting conservative candidates and causes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3">
              <DollarSign className="mr-2 h-5 w-5" />
              Make a Donation
            </Button>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3">
              <Users className="mr-2 h-5 w-5" />
              Join the Movement
            </Button>
          </div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-1/2"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border rounded px-3 py-2"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>
      </section>

      {/* New Graphic: Seats & Funding */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-extrabold text-red-600">25,000</div>
            <p className="text-gray-700 text-lg font-medium mt-2">Seats at Risk</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-extrabold text-blue-600">$50B</div>
            <p className="text-gray-700 text-lg font-medium mt-2">To Secure America</p>
          </div>
        </div>
      </section>

      {/* Campaign Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Campaigns</h2>
            <p className="text-xl text-gray-600">Every campaign you create, every dollar raised.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {filteredCampaigns.map((c) => (
              <Card
                key={c.id}
                className="hover:shadow-lg border-red-100 flex flex-col h-full justify-between"
              >
                {/* Card Header */}
                <CardHeader className="text-center flex flex-col flex-shrink-0">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                    {c.photo && (
                      <div className="relative w-full h-full">
                        <Image src={c.photo} alt={c.title} layout="fill" objectFit="cover" />
                      </div>
                    )}
                  </div>

                  {/* Candidate Name */}
                  <CardTitle className="truncate max-w-full">{c.title}</CardTitle>

                  {/* Recipient Name (in red, slightly smaller) */}
                  {c.state && (
                    <p className="text-red-600 text-sm font-medium mt-1">{c.state}</p>
                  )}

                  {/* Spacer */}
                  <div className="h-5" />
                  <div className="h-5" />

                  {/* Description */}
                  {c.description && (
                    <p className="text-gray-600 mt-2 mb-4 line-clamp-3 break-words text-sm">
                      {c.description}
                    </p>
                  )}
                </CardHeader>

                {/* Card Content */}
                <CardContent className="flex flex-col flex-grow justify-end">
                  <Link href={`/donate?campaignId=${c.id}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-auto">
                      Support {c.title || "Campaign"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
