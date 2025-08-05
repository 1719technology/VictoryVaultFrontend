"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import VVLoader from "@/components/vvloader";

interface Campaign {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  campaignType: string;
  category: string;
  fundingGoal: number;
  fundingRaised: number;
  currency: string;
  heroImage: string;
  additionalImages: string[];
  videoUrl: string;
  recipientName: string;
  recipientOrganization: string;
  recipientRelationship: string;
  fundDelivery: string;
  campaignDuration: number | string;
  endDate: string;
  visibility: string;
  refundPolicy: string;
  disbursementSchedule: string;
  disclaimers: string;
  complianceAgreement: boolean;
  termsAccepted: boolean;
  advancedFeaturesEnabled: boolean;
  teamCollaboration: boolean;
  customDonationAmounts: boolean;
  donorRecognition: boolean;
  analyticsIntegration: boolean;
  status: "Active" | "Paused" | "Deleted";
}

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalRaised, setTotalRaised] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editForm, setEditForm] = useState<Partial<Campaign>>({});

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  type TotalDataResponse = { totalRaised: number };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.replace("/signin");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Fetch campaigns
    fetch(`${API}/api/v1/user_campaign`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error("Error loading campaigns");
        const data = await res.json();

        const arr: Campaign[] = (
          Array.isArray(data) ? data : (data as { campaigns?: unknown[] }).campaigns ?? []
        ).map((obj: any) => ({
          id: obj.id,
          name: obj.campaignName,
          shortDescription: obj.shortDescription,
          description: obj.fullDescription,
          campaignType: obj.campaignType ?? obj.category,
          category: obj.category,
          fundingGoal: Number(obj.fundingGoal),
          fundingRaised: Number(obj.amount_donated ?? 0),
          currency: obj.currency ?? "USD",
          heroImage: obj.heroImage,
          additionalImages: obj.additionalImages ?? [],
          videoUrl: obj.videoUrl ?? "",
          recipientName: obj.recipientName ?? "",
          recipientOrganization: obj.recipientOrganization ?? "",
          recipientRelationship: obj.recipientRelationship ?? "",
          fundDelivery: obj.fundDelivery ?? "",
          campaignDuration: obj.campaignDuration,
          endDate: obj.endDate,
          visibility: obj.visibility ?? "public",
          refundPolicy: obj.refundPolicy ?? "",
          disbursementSchedule: obj.disbursementSchedule ?? "",
          disclaimers: obj.disclaimers ?? "",
          complianceAgreement: !!obj.complianceAgreement,
          termsAccepted: !!obj.termsAccepted,
          advancedFeaturesEnabled: !!obj.advancedFeaturesEnabled,
          teamCollaboration: !!obj.teamCollaboration,
          customDonationAmounts: !!obj.customDonationAmounts,
          donorRecognition: !!obj.donorRecognition,
          analyticsIntegration: !!obj.analyticsIntegration,
          status: (obj.status as "Active" | "Paused" | "Deleted") || "Active",
        }));

        setCampaigns(arr);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unexpected error"))
      .finally(() => setLoading(false));

    // Fetch total donations
    fetch(`${API}/api/v1/total_raised`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error("Error fetching total raised");
        const totalData = await res.json();

        if (typeof totalData === "number") {
          setTotalRaised(totalData);
        } else if (typeof (totalData as TotalDataResponse).totalRaised === "number") {
          setTotalRaised((totalData as TotalDataResponse).totalRaised);
        } else {
          setTotalRaised(0);
        }
      })
      .catch(() => setTotalRaised(0));
  }, [API, router]);

  const activeCount = campaigns.filter((c) => c.status === "Active").length;
  const pausedCount = campaigns.filter((c) => c.status === "Paused").length;
  const deletedCount = campaigns.filter((c) => c.status === "Deleted").length;

  const confirmDelete = (id: number) => setToDeleteId(id);
  const cancelDelete = () => setToDeleteId(null);

  const doDelete = async () => {
    if (toDeleteId == null) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    await fetch(`${API}/api/v1/delete_campaign/${toDeleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCampaigns((prev) =>
      prev.map((c) => (c.id === toDeleteId ? { ...c, status: "Deleted" } : c))
    );
    setToDeleteId(null);
  };

  return (
    <>
      {loading && <VVLoader />}

      {!loading && (
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Fixed Header */}
          <header className="bg-white shadow fixed top-0 left-0 right-0 z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
              <span className="text-xl md:text-2xl font-bold">VICTORYVAULT</span>
              <div className="flex items-center space-x-3 md:space-x-4">
                <Link href="/admin/create-campaign">
                  <button className="px-4 md:px-6 py-2 bg-red-600 text-white rounded-lg text-sm md:text-base">
                    New Campaign
                  </button>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    router.push("/signin");
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm md:text-base"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="pt-20 px-4 md:px-6">
            {/* Dashboard overview */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl md:text-2xl font-bold">Dashboard</div>
              <button
                className="bg-red-600 text-white px-3 md:px-4 py-2 rounded hover:bg-red-700 text-sm md:text-base"
                onClick={() => router.push("/admin/create-campaign")}
              >
                + Create New Campaign
              </button>
            </div>

            <p className="text-base md:text-lg text-gray-600 mb-6">
              Welcome back! Here's an overview of your campaigns and activities.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="text-sm md:text-md font-semibold">Active Campaigns</h4>
                <p className="text-xl md:text-2xl font-bold mt-2">{activeCount}</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="text-sm md:text-md font-semibold">Paused Campaigns</h4>
                <p className="text-xl md:text-2xl font-bold mt-2">{pausedCount}</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-300 rounded">
                <h4 className="text-sm md:text-md font-semibold">Deleted Campaigns</h4>
                <p className="text-xl md:text-2xl font-bold mt-2">{deletedCount}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="text-sm md:text-md font-semibold">Total Donations</h4>
                <p className="text-xl md:text-2xl font-bold mt-2">
                  ${totalRaised.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Campaign Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {campaigns.map((c) => {
                const progress =
                  c.fundingGoal > 0
                    ? Math.round((c.fundingRaised / c.fundingGoal) * 100)
                    : 0;

                return (
                  <div
                    key={c.id}
                    className="bg-white shadow rounded-lg border border-gray-200 p-4 flex flex-col relative"
                  >
                    {c.status !== "Active" && (
                      <div
                        className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
                          c.status === "Paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {c.status === "Paused" ? "Paused by Admin" : "Deleted by Admin"}
                      </div>
                    )}

                    {/* Image and Title */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        {c.heroImage ? (
                          <img
                            src={c.heroImage}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Img
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {c.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{c.campaignType}</p>
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="text-sm text-gray-700 mb-4 space-y-1">
                      <p className="truncate">
                        <span className="font-medium">Goal:</span> $
                        {c.fundingGoal.toLocaleString()}
                      </p>
                      <p className="truncate">
                        <span className="font-medium">Raised:</span> $
                        {c.fundingRaised.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {c.campaignDuration} days
                      </p>
                      <p className="truncate">
                        <span className="font-medium">Relationship:</span>{" "}
                        {c.recipientRelationship}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progress}% funded</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-auto space-x-2">
                      <button
                        onClick={() => {
                          localStorage.setItem("selectedCampaign", JSON.stringify(c));
                          router.push(`/admin/campaign/${c.id}`);
                        }}
                        className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          localStorage.setItem("selectedCampaign", JSON.stringify(c));
                          router.push(`/admin/campaign/${c.id}/edit`);
                        }}
                        className="flex-1 bg-yellow-500 text-white text-sm px-3 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => confirmDelete(c.id)}
                        className="flex-1 bg-red-500 text-white text-sm px-3 py-2 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <section className="mb-24">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/create-campaign">
                  <div className="border border-blue-300 rounded p-6 text-center hover:shadow cursor-pointer">
                    <div className="text-blue-500 text-2xl mb-2">＋</div>
                    <div className="text-blue-600 font-medium">Create New Campaign</div>
                  </div>
                </Link>
                <Link href="/admin/UserProfiles">
                  <div className="border border-purple-300 rounded p-6 text-center hover:shadow cursor-pointer">
                    <div className="text-purple-500 text-2xl mb-2">⚙️</div>
                    <div className="text-purple-600 font-medium">Account Settings</div>
                  </div>
                </Link>
                <Link href="/admin/analytics">
                  <div className="border border-green-300 rounded p-6 text-center hover:shadow cursor-pointer">
                    <div className="text-green-500 text-2xl mb-2">📈</div>
                    <div className="text-green-600 font-medium">View Analytics</div>
                  </div>
                </Link>
              </div>
            </section>
          </main>

          {/* Bottom Navigation */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2 md:py-3">
              {/* Dashboard */}
              <Link
                href="/admin"
                className={`flex flex-col items-center flex-1 transition ${
                  pathname === "/admin" ? "text-red-600" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke={pathname === "/admin" ? "red" : "gray"}
                  className="w-5 h-5 md:w-6 md:h-6 mb-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7m-9 2v10m-4 0h8"
                  />
                </svg>
                <span className="text-xs font-medium">Dashboard</span>
              </Link>

              {/* Campaigns */}
              <Link
                href="/admin/create-campaign"
                className={`flex flex-col items-center flex-1 transition ${
                  pathname === "/admin/create-campaign" ? "text-red-600" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke={pathname === "/admin/create-campaign" ? "red" : "gray"}
                  className="w-5 h-5 md:w-6 md:h-6 mb-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-medium">Campaigns</span>
              </Link>

              {/* Transactions */}
              <Link
                href="/admin/transactions"
                className={`flex flex-col items-center flex-1 transition ${
                  pathname === "/admin/transactions" ? "text-red-600" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke={pathname === "/admin/transactions" ? "red" : "gray"}
                  className="w-5 h-5 md:w-6 md:h-6 mb-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 9V7a5 5 0 00-10 0v2M5 9h14v10H5V9z"
                  />
                </svg>
                <span className="text-xs font-medium">Transactions</span>
              </Link>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
