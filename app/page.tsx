"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Target,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface Campaign {
  id: number;
  title: string;
  description?: string;
  office?: string;
  state?: string;
  goal?: number;
  email: string;
  photo?: string;
}

interface RaisedResponse {
  totalRaised: number;
}

export default function HomePage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [raisedMap, setRaisedMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      try {
        // 1) fetch all campaigns
        const allRes = await fetch(`${API}/api/v1/all_campaign`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!allRes.ok) {
          console.warn(`Campaigns fetch failed: ${allRes.status}`);
          setCampaigns([]);
          setRaisedMap({});
          setLoading(false);
          return;
        }

        const allJson = await allRes.json();
        const list: Campaign[] = (
          Array.isArray(allJson)
            ? allJson
            : Array.isArray(allJson.campaigns)
              ? allJson.campaigns
              : []
        ).map((c: Record<string, unknown>) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          office: c.office,
          state: c.state,
          goal: c.goal,
          email: c.email,
          photo: c.photo,
        }));

        // 2) for each, fetch total raised
        const map: Record<number, number> = {};
        await Promise.all(
          list.map(async (c) => {
            const res = await fetch(
              `${API}/api/v1/total_raised/${encodeURIComponent(c.email)}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!res.ok) {
              console.warn(`total_raised for ${c.email} failed: ${res.status}`);
              map[c.id] = 0;
              return;
            }
            const body = (await res.json()) as RaisedResponse;
            map[c.id] = body.totalRaised ?? 0;
          })
        );

        setCampaigns(list);
        setRaisedMap(map);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
      finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [API]);

  // derive stats
  const totalRaised = useMemo(
    () =>
      campaigns.reduce((sum, c) => sum + (raisedMap[c.id] ?? 0), 0),
    [campaigns, raisedMap]
  );
  const activeDonors = 156_000; // placeholder
  const candidatesSupported = campaigns.filter(c => (raisedMap[c.id] ?? 0) > 0).length;
  const winRate = useMemo(() => {
    if (!campaigns.length) return 0;
    const wins = campaigns.filter((c) => {
      const goal = c.goal ?? 0;
      return goal > 0 && (raisedMap[c.id] ?? 0) >= goal;
    }).length;
    return Math.round((wins / campaigns.length) * 100);
  }, [campaigns, raisedMap]);

  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-5xl font-extrabold text-red-600 animate-pulse tracking-widest">
        VV
      </div>
    </div>
  );
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

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <DollarSign className="h-8 w-8 text-red-600" />, label: "Total Raised", value: fmt(totalRaised) },
            { icon: <Users className="h-8 w-8 text-blue-600" />, label: "Active Donors", value: activeDonors.toLocaleString() },
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
            <p className="text-xl text-gray-600">
              Every campaign you create, every dollar raised.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.map((c) => {
              const raised = raisedMap[c.id] ?? 0;
              const goal = c.goal ?? 0;
              const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
              return (
                <Card key={c.id} className="hover:shadow-lg border-red-100">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                      {c.photo && (
                        <div className="relative w-full h-full">
                          <Image
                            src={`${API}/uploads/${c.photo}`}
                            alt={c.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      )}
                    </div>
                    <CardTitle className="truncate">{c.title}</CardTitle>
                    {c.office && c.state && (
                      <div className="text-red-600">{c.office} • {c.state}</div>
                    )}
                    {c.description && (
                      <p className="text-gray-600 mt-2 mb-4 line-clamp-3">
                        {c.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Raised: {fmt(raised)}</span>
                        <span>Goal: {fmt(goal)}</span>
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
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Support {c.title.split(" ")[0]}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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
