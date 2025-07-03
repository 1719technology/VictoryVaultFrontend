'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Campaign {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Closed';
  fundingGoal: number;
  fundingRaised: number;
  endDate: string;   // ISO date string
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

  // Fetch campaigns and total on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
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
        return [campaignData, totalData] as [any, any];
      })
      .then(([rawList, totalData]) => {
        const arr: Campaign[] = (
          Array.isArray(rawList) ? rawList : rawList.campaigns ?? []
        ).map((item: any) => ({
          id: item.id,
          name: item.name || item.title,
          description: item.description,
          status: item.status,
          fundingGoal: Number(item.goal ?? item.fundingGoal) || 0,
          fundingRaised: Number(item.fundingRaised ?? item.raised) || 0,
          endDate: typeof item.end_date === 'string' ? item.end_date : `${item.end_date}-01-01`,
          photo: item.photo || '',
        }));
        setCampaigns(arr);
        if (typeof totalData === 'number') setTotalRaised(totalData);
        else if (typeof totalData.totalRaised === 'number') setTotalRaised(totalData.totalRaised);
        else setTotalRaised(arr.reduce((sum, c) => sum + c.fundingRaised, 0));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [API, router]);

  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const totalDonors = 0; // placeholder

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
    setEditForm(prev => ({ ...prev, [field]: value }));
  };
  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/v1/update_campaign/${editingCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error(await res.text());
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? ({ ...c, ...(editForm as Campaign) }) : c));
      closeEditModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const confirmDelete = (id: number) => setToDeleteId(id);
  const cancelDelete = () => setToDeleteId(null);
  const doDelete = async () => {
    if (toDeleteId == null) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/v1/delete_campaign/${toDeleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setCampaigns(prev => prev.filter(c => c.id !== toDeleteId));
      cancelDelete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) return <p className="p-8">Loading…</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg">New Campaign</button>
            </Link>
            <button onClick={() => { localStorage.removeItem('token'); router.push('/signin'); }} className="text-gray-600 hover:text-gray-800">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden lg:block">
          <nav className="mt-6 space-y-2 px-4">
            <Link href="/admin" className="block px-4 py-2 hover:bg-gray-100 rounded">Dashboard</Link>
            <Link href="/admin/create-campaign" className="block px-4 py-2 hover:bg-gray-100 rounded">Campaigns</Link>
            <Link href="/admin/analytics" className="block px-4 py-2 hover:bg-gray-100 rounded">Analytics</Link>
            <Link href="/admin/profile" className="block px-4 py-2 hover:bg-gray-100 rounded">User Profile</Link>
          </nav>
          <div className="px-4 mt-auto pb-4">
            <Link href="/" className="text-indigo-600 hover:underline">View Public Site</Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8">
          {/* Metrics */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-600">Total Raised</div>
              <div className="text-3xl font-bold mt-2">${totalRaised}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-600">Active Campaigns</div>
              <div className="text-3xl font-bold mt-2">{activeCount}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-600">Total Donors</div>
              <div className="text-3xl font-bold mt-2">{totalDonors}</div>
            </div>
          </section>

          {/* Campaign List */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Your Campaigns</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg flex flex-col h-full">
                  <h4 className="text-lg font-semibold mb-2 truncate">{c.name}</h4>
                  <p className="flex-1 mb-2 text-gray-600 line-clamp-3">{c.description}</p>
                  <p className="mb-2 text-sm text-gray-500">Ends: {new Date(c.endDate).toLocaleDateString()}</p>
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button onClick={() => openEditModal(c)} className="w-full py-2 bg-yellow-500 text-white rounded-lg">Edit</button>
                    <button onClick={() => confirmDelete(c.id)} className="w-full py-2 bg-red-500 text-white rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Edit Modal */}
          {editingCampaign && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <form onSubmit={submitEdit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-auto">
                <h5 className="text-lg font-semibold mb-4">Edit Campaign</h5>
                <div className="space-y-4">
                  <div><label className="block mb-1">Name</label><input value={editForm.name||''} onChange={e => handleEditChange('name', e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
                  <div><label className="block mb-1">Description</label><textarea value={editForm.description||''} onChange={e => handleEditChange('description', e.target.value)} className="w-full border px-3 py-2 rounded h-24" /></div>
                  <div><label className="block mb-1">Status</label><select value={editForm.status||'Active'} onChange={e => handleEditChange('status', e.target.value as 'Active'|'Closed')} className="w-full border px-3 py-2 rounded"><option>Active</option><option>Closed</option></select></div>
                  <div><label className="block mb-1">Funding Goal ($)</label><input type="number" value={editForm.fundingGoal ?? 0} onChange={e => handleEditChange('fundingGoal', +e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
                  <div><label className="block mb-1">Funding Raised ($)</label><input type="number" value={editForm.fundingRaised ?? 0} onChange={e => handleEditChange('fundingRaised', +e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
                  <div><label className="block mb-1">End Date</label><input type="date" value={(editForm.endDate||'').slice(0,10)} onChange={e => handleEditChange('endDate', e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
                </div>
                <div className="mt-6 flex justify-end space-x-3"><button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button></div>
              </form>
            </div>
          )}

          {/* Delete Modal */}
          {toDeleteId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h5 className="text-lg font-semibold mb-4">Confirm Deletion</h5>
                <p className="mb-6 text-gray-600">Are you sure you want to delete this campaign?</p>
                <div className="flex justify-end space-x-3"><button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button><button onClick={doDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
