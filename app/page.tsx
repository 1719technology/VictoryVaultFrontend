"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VVLoader from "@/components/vvloader";
import { Users, DollarSign, Target, Shield, ArrowRight } from "lucide-react";
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

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Paused" | "Deleted">("All");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      try {
        // Fetch campaigns
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
          state: c.recipientRelationship || "",
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

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, filterStatus]);

  // Stats
  const totalRaised = useMemo(
    () => campaigns.reduce((sum, c) => sum + (c.amount_donated || 0), 0),
    [campaigns]
  );

  const activeCampaignCount = filteredCampaigns.filter((c) => c.status === "Active").length;

  const candidatesSupported = filteredCampaigns.filter(
    (c) => c.goal > 0 && c.amount_donated >= c.goal
  ).length;

  const winRate =
    activeCampaignCount > 0
      ? Math.round((candidatesSupported / activeCampaignCount) * 100)
      : 0;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  if (loading) return <VVLoader />;
  if (error) return <p className="p-8 text-red-600 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero */}
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

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <DollarSign className="h-8 w-8 text-red-600" />, label: "Total Raised", value: fmt(totalRaised) },
            { icon: <Users className="h-8 w-8 text-blue-600" />, label: "Active Campaigns", value: activeCampaignCount.toLocaleString() },
            { icon: <Target className="h-8 w-8 text-red-600" />, label: "Candidates Supported", value: candidatesSupported },
            { icon: <Shield className="h-8 w-8 text-blue-600" />, label: "Win Rate", value: `${winRate}%` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {icon}
              </div>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              <div className="text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Campaigns</h2>
            <p className="text-xl text-gray-600">Every campaign you create, every dollar raised.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCampaigns.map((c) => {
              const pct = c.goal > 0 ? Math.round((c.amount_donated / c.goal) * 100) : 0;
              return (
                <Card key={c.id} className="hover:shadow-lg border-red-100">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                      {c.photo && (
                        <div className="relative w-full h-full">
                          <Image src={c.photo} alt={c.title} layout="fill" objectFit="cover" />
                        </div>
                      )}
                    </div>

                    <CardTitle className="truncate">{c.title}</CardTitle>

                    <div className="text-red-600 mt-1">
                      Type: {c.office || "N/A"} • Relationship: {c.state || "N/A"}
                    </div>

                    {c.duration && (
                      <div className="text-gray-600 text-sm">Duration: {c.duration} days</div>
                    )}

                    {c.description && (
                      <p className="text-gray-600 mt-2 mb-4 line-clamp-3">{c.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Raised: {fmt(c.amount_donated)}</span>
                        <span>Goal: {fmt(c.goal)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600">
                        {pct}% of goal reached
                      </div>
                    </div>
                    <Link href={`/donate?campaignId=${c.id}`} passHref>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Support {c.title ? c.title.split(" ")[0] : "Campaign"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
