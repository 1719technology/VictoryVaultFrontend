'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Campaign {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Paused' | 'Deleted';
  fundingGoal: number;
  fundingRaised: number;
  endDate: string;
  photo: string;
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
    if (!token) {
      router.replace('/signin');
      return;
    }
    let email: string;
    try {
      email = JSON.parse(atob(token.split('.')[1])).email;
    } catch {
      setError('Invalid auth token.');
      setLoading(false);
      return;
    }
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/v1/all_campaign/${encodeURIComponent(email)}`, { headers }),
      fetch(`${API}/api/v1/total_raised/${encodeURIComponent(email)}`, { headers }),
    ])
      .then(async ([resCampaigns, resTotal]) => {
        if (!resCampaigns.ok) throw new Error('Error loading campaigns');
        if (!resTotal.ok) throw new Error('Error loading total');
        const [campaignData, totalData] = await Promise.all([resCampaigns.json(), resTotal.json()]);
        return [campaignData, totalData] as [unknown, unknown];
      })
      .then(([rawList, totalData]) => {
        const arr: Campaign[] = (
          Array.isArray(rawList)
            ? rawList
            : (rawList as { campaigns?: unknown[] }).campaigns ?? []
        ).map((item) => {
          const obj = item as Record<string, unknown>;

          return {
            id: typeof obj.id === "number" ? obj.id : 0,
            name: typeof obj.name === "string"
              ? obj.name
              : typeof obj.title === "string"
                ? obj.title
                : "Untitled",
            description: typeof obj.description === "string" ? obj.description : "",
            status:
              obj.status === "Active" || obj.status === "Paused" || obj.status === "Deleted"
                ? obj.status
                : "Active",
            fundingGoal: Number(obj.goal ?? obj.fundingGoal ?? 0),
            fundingRaised: Number(obj.fundingRaised ?? obj.raised ?? 0),
            endDate:
              typeof obj.end_date === "string"
                ? obj.end_date
                : typeof obj.end_date === "number"
                  ? new Date(obj.end_date).toISOString().split("T")[0]
                  : "2025-12-31",
            photo: typeof obj.photo === "string" ? obj.photo : "",
          };
        });
        setCampaigns(arr);
        if (typeof totalData === 'number') setTotalRaised(totalData);
        else if (typeof (totalData as TotalDataResponse).totalRaised === 'number') {
          setTotalRaised((totalData as TotalDataResponse).totalRaised);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError('An unexpected error occurred.');
      })
      .finally(() => setLoading(false));
  }, [API, router]);

  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const pausedCount = campaigns.filter(c => c.status === 'Paused').length;
  const deletedCount = campaigns.filter(c => c.status === 'Deleted').length;

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditForm({ ...campaign });
  };

  const closeEditModal = () => {
    setEditingCampaign(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof Campaign, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    const token = localStorage.getItem('authToken');
    if (!token) return;

    await fetch(`${API}/api/v1/update_campaign/${editingCampaign.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });

    setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...c, ...(editForm as Campaign) } : c));
    closeEditModal();
  };

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

    setCampaigns(prev => prev.map(c => c.id === toDeleteId ? { ...c, status: 'Deleted' } : c));
    setToDeleteId(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
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
            <button onClick={() => { localStorage.removeItem('authToken'); router.push('/signin'); }} className="text-gray-600 hover:text-gray-800">Sign Out</button>
          </div>
        </div>
      </header>

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

        <p className="text-lg text-gray-600 mb-6">Welcome back! Here's an overview of your campaigns and activities.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="text-md font-semibold">Active Campaigns</h4>
            <p className="text-2xl font-bold mt-2">{activeCount}</p>
            <p className="text-sm text-gray-500">Currently running</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="text-md font-semibold">Paused Campaigns</h4>
            <p className="text-2xl font-bold mt-2">{pausedCount}</p>
            <p className="text-sm text-gray-500">Temporarily halted</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-300 rounded">
            <h4 className="text-md font-semibold">Deleted Campaigns</h4>
            <p className="text-2xl font-bold mt-2">{deletedCount}</p>
            <p className="text-sm text-gray-500">Can be restored</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="text-md font-semibold">Total Donations</h4>
            <p className="text-2xl font-bold mt-2">${totalRaised.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Across all campaigns</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">All Campaigns</h2>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Campaign Title</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Donations</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Progress</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : c.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-2">${c.fundingRaised.toLocaleString()}</td>
                  <td className="px-4 py-2">{Math.round((c.fundingRaised / c.fundingGoal) * 100)}%</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline">View</button>
                    <button className="text-yellow-600 hover:underline" onClick={() => openEditModal(c)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => confirmDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
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
                  value={editForm.name || ''}
                  onChange={e => handleEditChange('name', e.target.value)}
                />
                <textarea
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Description"
                  value={editForm.description || ''}
                  onChange={e => handleEditChange('description', e.target.value)}
                />
                <input
                  type="number"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Funding Goal"
                  value={editForm.fundingGoal || 0}
                  onChange={e => handleEditChange('fundingGoal', Number(e.target.value))}
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
  );
}
