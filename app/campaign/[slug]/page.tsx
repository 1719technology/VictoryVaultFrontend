"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { webinyClient } from "@/lib/webinyclient";
import { GET_CAMPAIGN_BY_SLUG } from "@/lib/webinyQueries";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// --- Types for Webiny response ---
interface GetCampaignBySlugResponse {
  getCampaign: {
    data: {
      title: string;
      description: string;
      heroImage: string;
      goal: number;
      owner: {
        name: string;
      };
    } | null;
    error?: {
      message: string;
    };
  };
}

export default function CampaignPage() {
  const { slug } = useParams();

  // --- Campaign state ---
  const [campaign, setCampaign] = useState<GetCampaignBySlugResponse["getCampaign"]["data"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- REAL API CALL (commented for now) ---
  /*
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await webinyClient.request<GetCampaignBySlugResponse>(
          GET_CAMPAIGN_BY_SLUG,
          { slug }
        );

        if (data.getCampaign.data) {
          setCampaign(data.getCampaign.data);
        } else {
          setError(data.getCampaign.error?.message || "Campaign not found");
        }
      } catch (err) {
        setError("Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [slug]);
  */

  // --- MOCK DATA (temporary) ---
  useEffect(() => {
    setTimeout(() => {
      setCampaign({
        title: "Save the Rainforest",
        description:
          "Help us protect endangered rainforests by funding conservation efforts, supporting local communities, and preserving biodiversity.",
        heroImage: "https://placehold.co/300x300?text=Rainforest",
        goal: 50000,
        owner: { name: "John Doe" },
      });
      setLoading(false);
    }, 500); // simulate API delay
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex justify-center items-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex justify-center items-center flex-1 text-red-600 font-medium">
          {error}
        </div>
        <Footer />
      </div>
    );
  }

  // --- No Campaign ---
  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex justify-center items-center flex-1 text-gray-600">
          No campaign found
        </div>
        <Footer />
      </div>
    );
  }

  // --- Page Content ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img
              src={campaign.heroImage}
              alt={campaign.title}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{campaign.title}</h1>
          <p className="text-red-100 mt-2">By {campaign.owner.name}</p>
        </div>
      </section>

      {/* Campaign Details */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-700 mb-6">{campaign.description}</p>
        <p className="text-lg font-semibold mb-4">Goal: ${campaign.goal}</p>

        {/* Donate Button */}
        <Button
          onClick={() => alert("Go to donation flow")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          Donate Now
        </Button>
      </main>

      <Footer />
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { webinyClient } from "@/lib/webinyClient";
// import { GET_CAMPAIGN_BY_SLUG } from "@/lib/webinyQueries";
// import { Navigation } from "@/components/navigation";
// import { Footer } from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// // --- Types for Webiny response ---
// interface GetCampaignBySlugResponse {
//   getCampaign: {
//     data: {
//       title: string;
//       description: string;
//       heroImage: string;
//       goal: number;
//       owner: {
//         name: string;
//       };
//     } | null;
//     error?: {
//       message: string;
//     };
//   };
// }

// export default function CampaignPage() {
//   const { slug } = useParams();
//   const [campaign, setCampaign] = useState<GetCampaignBySlugResponse["getCampaign"]["data"]>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // --- Fetch campaign from Webiny ---
//   useEffect(() => {
//     const fetchCampaign = async () => {
//       try {
//         const data = await webinyClient.request<GetCampaignBySlugResponse>(
//           GET_CAMPAIGN_BY_SLUG,
//           { slug }
//         );

//         if (data.getCampaign.data) {
//           setCampaign(data.getCampaign.data);
//         } else {
//           setError(data.getCampaign.error?.message || "Campaign not found");
//         }
//       } catch (err) {
//         setError("Failed to load campaign");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCampaign();
//   }, [slug]);

//   // --- Loading State ---
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

//   // --- Error State ---
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
//         <Navigation />
//         <div className="flex justify-center items-center flex-1 text-red-600 font-medium">
//           {error}
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // --- No Campaign ---
//   if (!campaign) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
//         <Navigation />
//         <div className="flex justify-center items-center flex-1 text-gray-600">
//           No campaign found
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // --- Page Content ---
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
//       <Navigation />

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="flex justify-center mb-4">
//             <img
//               src={campaign.heroImage}
//               alt={campaign.title}
//               className="w-32 h-32 rounded-full border-4 border-white object-cover"
//             />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold">{campaign.title}</h1>
//           <p className="text-red-100 mt-2">By {campaign.owner.name}</p>
//         </div>
//       </section>

//       {/* Campaign Details */}
//       <main className="max-w-4xl mx-auto px-4 py-8">
//         <p className="text-gray-700 mb-6">{campaign.description}</p>
//         <p className="text-lg font-semibold mb-4">Goal: ${campaign.goal}</p>

//         {/* Donate Button */}
//         <Button
//           onClick={() => alert("Go to donation flow")}
//           className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
//         >
//           Donate Now
//         </Button>
//       </main>

//       <Footer />
//     </div>
//   );
// }
