// "use client";
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { ArrowUp, ArrowDown, Menu } from 'lucide-react';

// // Placeholder data
// const stats = [
//   { id: 1, title: 'Total Donations', value: '$24.8M', trend: 12 },
//   { id: 2, title: 'Active Campaigns', value: '342', trend: -3 },
//   { id: 3, title: 'Active Candidates', value: '128', trend: 8 },
//   { id: 4, title: 'Total Donors', value: '156K', trend: 5 },
// ];

// const donationsOverTime = [
//   { date: 'Jan', amount: 4000 },
//   { date: 'Feb', amount: 7000 },
//   { date: 'Mar', amount: 6000 },
//   { date: 'Apr', amount: 9000 },
//   { date: 'May', amount: 12000 },
//   { date: 'Jun', amount: 15000 },
// ];

// const recentCampaigns = [
//   { id: 1, name: 'Campaign Alpha', raised: '$7.5K', goal: '$10K' },
//   { id: 2, name: 'Campaign Beta', raised: '$5K', goal: '$5K' },
//   { id: 3, name: 'Campaign Gamma', raised: '$3K', goal: '$8K' },
// ];

// // Utility to decode JWT payload without external library
// function decodeJwtPayload(token: string): any {
//   try {
//     const parts = token.split('.');
//     if (parts.length !== 3) return null;
//     const payload = parts[1]
//       .replace(/-/g, '+')
//       .replace(/_/g, '/');
//     const json = atob(payload);
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }

// const DashboardPage = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [userName, setUserName] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const payload = decodeJwtPayload(token);
//       setUserName(payload?.name ?? null);
//     }
//   }, []);

//   // Build navigation items
//   const navItems = [
//     { label: 'Dashboard', href: '/' },
//     { label: 'Create Campaign', href: '/admin/create-campaign' },
//     { label: 'View Campaigns', href: '/admin/campaigns' },
//     { label: 'Analytics', href: '/admin/analytics' },
//     { label: 'Candidates', href: '/candidates' },
//     userName
//       ? { label: userName, href: '#', disabled: true }
//       : { label: 'Sign In', href: '/signin', disabled: false },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 transform transition-transform duration-300 ease-in-out ${
//           menuOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <button
//           className="mb-8 text-xl"
//           onClick={() => setMenuOpen(false)}
//           aria-label="Close menu"
//         >
//           ✕
//         </button>
//         <nav className="space-y-4">
//           {navItems.map(item =>
//             item.disabled ? (
//               <span
//                 key={item.label}
//                 className="block text-lg text-gray-700 cursor-default"
//               >
//                 {item.label}
//               </span>
//             ) : (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className="block text-lg text-gray-700 hover:text-blue-600"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {item.label}
//               </Link>
//             )
//           )}
//         </nav>
//       </aside>

//       <div className="flex-1 p-8">
//         {/* Header */}
//         <header className="flex items-center mb-8">
//           <button
//             className="mr-4 text-gray-700 hover:text-gray-900"
//             onClick={() => setMenuOpen(true)}
//             aria-label="Open menu"
//           >
//             <Menu size={24} />
//           </button>
//           <h1 className="text-4xl font-bold">Dashboard</h1>
//         </header>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map(stat => (
//             <Card key={stat.id} className="p-4">
//               <CardHeader className="flex justify-between items-center">
//                 <h2 className="text-lg font-medium">{stat.title}</h2>
//                 <div
//                   className={`flex items-center space-x-1 ${
//                     stat.trend >= 0 ? 'text-green-500' : 'text-red-500'
//                   }`}
//                 >
//                   {stat.trend >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
//                   <span>{Math.abs(stat.trend)}%</span>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{stat.value}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Donations Chart */}
//         <Card className="mb-8 p-4">
//           <CardHeader>
//             <h2 className="text-xl font-semibold">Donations Over Time</h2>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={200}>
//               <LineChart data={donationsOverTime}>
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Recent Campaigns */}
//         <Card className="p-4">
//           <CardHeader className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">Recent Campaigns</h2>
//             <Button size="sm">View All</Button>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 text-left">Campaign</th>
//                     <th className="py-2 px-4 text-left">Raised</th>
//                     <th className="py-2 px-4 text-left">Goal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentCampaigns.map(c => (
//                     <tr key={c.id} className="border-t">
//                       <td className="py-2 px-4">{c.name}</td>
//                       <td className="py-2 px-4">{c.raised}</td>
//                       <td className="py-2 px-4">{c.goal}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;