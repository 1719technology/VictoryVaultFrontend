'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: number;
  name: string;
  status: 'Active' | 'Closed';
  fundingGoal: number;
  fundingRaised: number;
}

export default function AdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalRaised, setTotalRaised] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Campaign>>({});

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch campaigns + total raised
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }
    let email: string;
    try {
      email = JSON.parse(atob(token.split('.')[1])).email;
    } catch {
      setError('Invalid token.');
      setLoading(false);
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    Promise.all([
      fetch(`${API}/api/v1/all_campaign/${encodeURIComponent(email)}`, { headers }),
      fetch(`${API}/api/v1/total_raised/${encodeURIComponent(email)}`, { headers }),
    ])
      .then(async ([res1, res2]) => {
        if (!res1.ok) throw new Error('Failed to load campaigns');
        if (!res2.ok) throw new Error('Failed to load total');
        const cd = await res1.json();
        const td = await res2.json();
        return [cd, td] as [any, any];
      })
      .then(([campaignData, totalData]) => {
        const list = Array.isArray(campaignData)
          ? campaignData
          : campaignData.campaigns ?? [];
        setCampaigns(list);
        setTotalRaised(
          typeof totalData === 'number'
            ? totalData
            : totalData.totalRaised ?? null
        );
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [API]);

  // Start editing a campaign
  const handleStartEdit = (c: Campaign) => {
    setEditingId(c.id);
    setEditForm({ ...c });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (editingId == null) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `${API}/api/v1/update_campaign/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${text}`);
      }
      // Update local state
      setCampaigns(prev =>
        prev.map(c => (c.id === editingId ? { ...(c as any), ...(editForm as any) } as Campaign : c))
      );
      setEditingId(null);
      setEditForm({});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete with confirmation
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/v1/delete_campaign/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete failed: ${text}`);
      }
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
    return <p className="p-8">Loading your dashboard…</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Menu</h2>
        <ul>
          <li className="mb-4">
            <Link href="/admin/edit-profile" className="hover:underline">
              Edit Profile
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/create-campaign" className="hover:underline">
              Create Campaign
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/analytics" className="hover:underline">
              Analytics
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-2">Your Campaigns</h1>
        {totalRaised !== null && (
          <p className="mb-6 text-lg">
            Total Raised: <strong>${totalRaised}</strong>
          </p>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {campaigns.length === 0 ? (
          <p>You have no campaigns yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-white p-6 rounded-lg shadow-md">
                {editingId === c.id ? (
                  // Inline edit form
                  <>
                    <input
                      className="w-full mb-2 border px-2 py-1"
                      value={editForm.name ?? ''}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                    <select
                      className="w-full mb-2 border px-2 py-1"
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          status: e.target.value as 'Active' | 'Closed',
                        }))
                      }
                    >
                      <option>Active</option>
                      <option>Closed</option>
                    </select>
                    <input
                      type="number"
                      className="w-full mb-2 border px-2 py-1"
                      value={editForm.fundingGoal ?? 0}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          fundingGoal: Number(e.target.value),
                        }))
                      }
                    />
                    <input
                      type="number"
                      className="w-full mb-2 border px-2 py-1"
                      value={editForm.fundingRaised ?? 0}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          fundingRaised: Number(e.target.value),
                        }))
                      }
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // Display mode
                  <>
                    <h3 className="text-xl font-semibold mb-2">{c.name}</h3>
                    <p
                      className={`mb-2 ${
                        c.status === 'Active'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      Status: {c.status}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(c.fundingRaised / c.fundingGoal) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      ${c.fundingRaised} of ${c.fundingGoal}
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartEdit(c)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
