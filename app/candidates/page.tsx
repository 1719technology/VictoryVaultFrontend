"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Search, DollarSign, Filter, ArrowRight, Star } from "lucide-react";

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
  disclaimers: string;
  refundPolicy: string;
  priority: "high" | "medium" | "low";
}

const PER_PAGE = 6;

export default function CandidatesPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

  const [all, setAll] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "raised" | "name">("priority");
  const [page, setPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/v1/all_campaign`, {
          headers: { "X-API-Key": API_KEY },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();

        const list: Campaign[] = (Array.isArray(json) ? json : json.campaigns || []).map((c: any) => ({
          id: Number(c.id),
          campaignName: c.campaignName || "",
          shortDescription: c.shortDescription || "",
          fullDescription: c.fullDescription || "",
          heroImage: c.heroImage || "",
          additionalImages: c.additionalImages || [],
          fundingGoal: Number(c.fundingGoal ?? 0),
          amount_donated: Number(c.amount_donated ?? 0),
          currency: c.currency || "USD",
          disclaimers: c.disclaimers || "",
          refundPolicy: c.refundPolicy || "",
          priority: (c.priority as "high" | "medium" | "low") || "low",
        }));

        setAll(list);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [API, API_KEY]);

  const filtered = useMemo(() => {
    let arr = all.filter((c) =>
      c.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const priorityRank = { high: 3, medium: 2, low: 1 };
    arr.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return priorityRank[b.priority] - priorityRank[a.priority];
        case "raised":
          return b.amount_donated - a.amount_donated;
        case "name":
          return a.campaignName.localeCompare(b.campaignName);
      }
    });
    return arr;
  }, [all, searchTerm, sortBy]);

  const paged = useMemo(() => filtered.slice(0, page * PER_PAGE), [filtered, page]);

  const priorityStyle = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-gray-100 text-gray-800",
  };
  const priorityIcon = {
    high: <Star className="h-3 w-3 fill-current" />,
    medium: <Star className="h-3 w-3" />,
    low: null,
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-5xl font-extrabold text-red-600 animate-pulse tracking-widest">
          VV
        </div>
      </div>
    );

  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Campaign Candidates</h1>
          <p className="text-base sm:text-lg text-red-100 mb-4">
            Support candidates aligned with your values
          </p>
          <div className="inline-flex bg-white/20 px-4 py-2 rounded-lg space-x-6 text-sm sm:text-base">
            <span>Total: {all.length}</span>
            <span>Showing: {paged.length}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters((f) => !f)}
            className="border-gray-300 w-full lg:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg mb-6 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Sort By</Label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "priority" | "raised" | "name")}
                  className="mt-1 block w-full border px-3 py-2 rounded"
                >
                  <option value="priority">Priority</option>
                  <option value="raised">Funds Raised</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy("priority");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.map((c) => {
            const pct = c.fundingGoal
              ? Math.round((c.amount_donated || 0) / c.fundingGoal * 100)
              : 0;
            return (
              <Card key={c.id} className="border-red-100 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                        {c.heroImage && (
                          <img
                            src={c.heroImage}
                            alt={c.campaignName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">
                          {c.campaignName}
                        </CardTitle>
                        <p className="text-red-600 text-sm truncate">
                          {c.shortDescription}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityStyle[c.priority]}`}
                    >
                      {priorityIcon[c.priority]}
                      <span className="ml-1 capitalize">{c.priority}</span>
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{c.fullDescription}</p>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised: {c.currency} {(c.amount_donated || 0).toLocaleString()}</span>
                      <span>Goal: {c.currency} {(c.fundingGoal || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <span>{pct}% funded</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/donate?campaignId=${c.id}`}>
                      <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Donate
                      </Button>
                    </Link>
                    <Link href={`/candidates/${c.id}`}>
                      <Button variant="outline" className="border-gray-300">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {paged.length < filtered.length && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="border-gray-300"
            >
              Load More Candidates
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
