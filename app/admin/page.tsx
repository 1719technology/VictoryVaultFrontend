'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VVLoader from "@/components/vvloader";

interface Campaign {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  campaignType: string;
  category: string;
  fundingGoal: number;
  fundingRaised: number; // Donation per campaign
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
  status: 'Active' | 'Paused' | 'Deleted';
}

export default function AdminPage() {
  const router = useRouter();
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
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    console.log("AdminPage localStorage -> token:", token, "userId:", userId);
    if (!token || !userId) {
      router.replace('/signin');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Fetch campaigns
    fetch(`${API}/api/v1/user_campaign`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error('Error loading campaigns');
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
          currency: obj.currency ?? 'USD',
          heroImage: obj.heroImage,
          additionalImages: obj.additionalImages ?? [],
          videoUrl: obj.videoUrl ?? '',
          recipientName: obj.recipientName ?? '',
          recipientOrganization: obj.recipientOrganization ?? '',
          recipientRelationship: obj.recipientRelationship ?? '',
          fundDelivery: obj.fundDelivery ?? '',
          campaignDuration: obj.campaignDuration,
          endDate: obj.endDate,
          visibility: obj.visibility ?? 'public',
          refundPolicy: obj.refundPolicy ?? '',
          disbursementSchedule: obj.disbursementSchedule ?? '',
          disclaimers: obj.disclaimers ?? '',
          complianceAgreement: !!obj.complianceAgreement,
          termsAccepted: !!obj.termsAccepted,
          advancedFeaturesEnabled: !!obj.advancedFeaturesEnabled,
          teamCollaboration: !!obj.teamCollaboration,
          customDonationAmounts: !!obj.customDonationAmounts,
          donorRecognition: !!obj.donorRecognition,
          analyticsIntegration: !!obj.analyticsIntegration,
          status: (obj.status as 'Active' | 'Paused' | 'Deleted') || 'Active',
        }));

        setCampaigns(arr);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unexpected error'))
      .finally(() => setLoading(false));

    // Fetch total donations (authorized)
    fetch(`${API}/api/v1/total_raised`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error('Error fetching total raised');
        const totalData = await res.json();

        if (typeof totalData === 'number') {
          setTotalRaised(totalData);
        } else if (typeof (totalData as TotalDataResponse).totalRaised === 'number') {
          setTotalRaised((totalData as TotalDataResponse).totalRaised);
        } else {
          setTotalRaised(0);
        }
      })
      .catch(() => setTotalRaised(0));
  }, [API, router]);

  // Counts
  const activeCount = campaigns.filter((c) => c.status === 'Active').length;
  const pausedCount = campaigns.filter((c) => c.status === 'Paused').length;
  const deletedCount = campaigns.filter((c) => c.status === 'Deleted').length;

  // Edit modal handlers
  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditForm({ ...campaign });
  };

  const closeEditModal = () => {
    setEditingCampaign(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof Campaign, value: string | number) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    const res = await fetch(`${API}/api/v1/update_campaign/${editingCampaign.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === editingCampaign.id ? { ...c, ...(editForm as Campaign) } : c))
      );
      closeEditModal();
    } else {
      alert('Failed to update campaign');
    }
  };

  // Delete modal handlers
  const confirmDelete = (id: number) => setToDeleteId(id);
  const cancelDelete = () => setToDeleteId(null);

  const doDelete = async () => {
    if (toDeleteId == null) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    await fetch(`${API}/api/v1/delete_campaign/${toDeleteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCampaigns((prev) =>
      prev.map((c) => (c.id === toDeleteId ? { ...c, status: 'Deleted' } : c))
    );
    setToDeleteId(null);
  };

  return (
    <>
      {loading && <VVLoader />}

      {!loading && (
        <div className="min-h-screen bg-gray-50">
          {/* Header/Nav */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <span className="text-2xl font-bold">VICTORYVAULT</span>
              <nav className="hidden lg:flex space-x-6">
                <Link href="/admin" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
                <Link href="/admin/create-campaign" className="text-gray-600 hover:text-gray-800">Campaigns</Link>
                <Link href="/admin/reports" className="text-gray-600 hover:text-gray-800">Reports</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/admin/create-campaign">
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg">New Campaign</button>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    router.push('/signin');
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Overview */}
          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold">Dashboard</div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => router.push('/admin/create-campaign')}
              >
                + Create New Campaign
              </button>
            </div>

            <p className="text-lg text-gray-600 mb-6">
              Welcome back! Here's an overview of your campaigns and activities.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="text-md font-semibold">Active Campaigns</h4>
                <p className="text-2xl font-bold mt-2">{activeCount}</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="text-md font-semibold">Paused Campaigns</h4>
                <p className="text-2xl font-bold mt-2">{pausedCount}</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-300 rounded">
                <h4 className="text-md font-semibold">Deleted Campaigns</h4>
                <p className="text-2xl font-bold mt-2">{deletedCount}</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="text-md font-semibold">Total Donations</h4>
                <p className="text-2xl font-bold mt-2">${totalRaised.toLocaleString()}</p>
              </div>
            </div>

            {/* Campaign Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="bg-white shadow rounded-lg border border-gray-200 p-4 flex flex-col relative"
                >
                  {c.status !== 'Active' && (
                    <div
                      className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${c.status === 'Paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {c.status === 'Paused' ? 'Paused by Admin' : 'Deleted by Admin'}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      {c.heroImage ? (
                        <img src={c.heroImage} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Img
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{c.name}</h3>
                      <p className="text-sm text-gray-500">{c.campaignType}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mb-4 space-y-1">
                    <p><span className="font-medium">Goal:</span> ${c.fundingGoal.toLocaleString()}</p>
                    <p><span className="font-medium">Raised:</span> ${c.fundingRaised.toLocaleString()}</p>
                    <p><span className="font-medium">Duration:</span> {c.campaignDuration} days</p>
                    <p><span className="font-medium">Relationship:</span> {c.recipientRelationship}</p>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${Math.round((c.fundingRaised / c.fundingGoal) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((c.fundingRaised / c.fundingGoal) * 100)}% funded
                    </p>
                  </div>

                  <div className="flex justify-between mt-auto space-x-2">
                    {/* View Button */}
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedCampaign", JSON.stringify(c));
                        router.push(`/admin/campaign/${c.id}`);
                      }}
                      className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedCampaign", JSON.stringify(c));
                        router.push(`/admin/campaign/${c.id}/edit`);
                      }}
                      className="flex-1 bg-yellow-500 text-white text-sm px-3 py-2 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => confirmDelete(c.id)}
                      className="flex-1 bg-red-500 text-white text-sm px-3 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions Section */}
            <section className="mt-12">
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

            {/* Delete Modal */}
            {toDeleteId !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                  <p className="mb-4 text-gray-600">Are you sure you want to delete this campaign?</p>
                  <div className="flex justify-end space-x-3">
                    <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button onClick={doDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {editingCampaign && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <form onSubmit={submitEdit} className="bg-white p-6 rounded shadow w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Edit Campaign</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      className="w-full border px-4 py-2 rounded"
                      placeholder="Campaign Title"
                      value={editForm.name ?? ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                    />
                    <textarea
                      className="w-full border px-4 py-2 rounded"
                      placeholder="Description"
                      value={editForm.description ?? ''}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full border px-4 py-2 rounded"
                      placeholder="Funding Goal"
                      value={editForm.fundingGoal ?? 0}
                      onChange={(e) => handleEditChange('fundingGoal', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={closeEditModal} type="button" className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}
