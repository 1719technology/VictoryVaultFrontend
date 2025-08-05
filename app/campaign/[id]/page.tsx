// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Navigation } from "@/components/navigation";
// import { Footer } from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";

// interface Campaign {
//   campaignName: string;
//   fullDescription: string;
//   heroImage: string;
//   fundingGoal: number;
//   amount_donated: number;
//   category: string;
// }

// export default function CampaignPage() {
//   const { id } = useParams();
//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [donating, setDonating] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
//   const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

//   // Fetch campaign details
//   useEffect(() => {
//     if (!id) return;

//     const fetchCampaign = async () => {
//       try {
//         const res = await fetch(`${API}/api/v1/single_campaign/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch campaign");
//         const data = await res.json();
//         setCampaign(data.campaign || data);
//       } catch (err) {
//         setError("Campaign not found or API error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCampaign();
//   }, [id, API]);

//   // Handle donation API call (no body required)
//   const handleDonate = async () => {
//     if (!id) return;

//     try {
//       setDonating(true);

//       const res = await fetch(`${API}/api/v1/donate`, {
//         method: "POST",
//         headers: {
//           "X-API-Key": API_KEY,
//         },
//       });

//       if (!res.ok) throw new Error(`Donate failed: ${res.status}`);
//       toast.success("Thank you for your donation!");
//     } catch (err) {
//       toast.error("Donation failed. Please try again.");
//     } finally {
//       setDonating(false);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
//         <Navigation />
//         <div className="flex justify-center items-center flex-1">
//           <Loader2 className="h-8 w-8 animate-spin text-red-600" />
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Error state
//   if (error || !campaign) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
//         <Navigation />
//         <div className="flex justify-center items-center flex-1 text-red-600 font-medium">
//           {error || "Campaign not found"}
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // UI
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
//       <Navigation />

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
//         <div className="max-w-5xl mx-auto text-center relative">
//           {/* Profile Image */}
//           <div className="flex justify-center mb-6">
//             <img
//               src={campaign.heroImage}
//               alt={campaign.campaignName}
//               className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
//             />
//           </div>

//           {/* Campaign Title & Category */}
//           <h1 className="text-3xl md:text-4xl font-bold">{campaign.campaignName}</h1>
//           <p className="text-red-100 mt-2 text-sm uppercase tracking-wide">
//             Category: {campaign.category}
//           </p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="max-w-3xl mx-auto px-4 py-10 text-center">
//         {/* Description */}
//         <div className="text-gray-800 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About This Campaign</h2>
//           <p className="text-gray-700 leading-relaxed">{campaign.fullDescription}</p>
//         </div>

//         {/* Goal and Raised Info */}
//         <div className="mb-8 text-lg font-semibold text-gray-800">
//           Goal: ${campaign.fundingGoal.toLocaleString()}{" "}
//           <span className="text-sm text-gray-500">
//             (Raised: ${campaign.amount_donated.toLocaleString()})
//           </span>
//         </div>

//         {/* Donate Button */}
//         <Button
//           onClick={handleDonate}
//           disabled={donating}
//           className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg rounded-lg"
//         >
//           {donating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
//           {donating ? "Processing..." : "Donate Now"}
//         </Button>
//       </main>

//       <Footer />
//     </div>
//   );
// }
