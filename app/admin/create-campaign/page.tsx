// 'use client';

// import React, { useState } from 'react';
// import CreateCampaign501c3Form from '@/components/create-campaign-501c3-form';

// // 501(c)(4) form component
// function CreateCampaign501c4Form() {
//   const [organizationName, setOrganizationName] = useState('');
//   const [ein, setEin] = useState('');
//   const [purpose, setPurpose] = useState('');
//   const [address, setAddress] = useState('');
//   const [contactInfo, setContactInfo] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('501(c)(4) Campaign Submitted', {
//       organizationName,
//       ein,
//       purpose,
//       address,
//       contactInfo,
//     });
//     // Reset or redirect as needed
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
//           Organization Name
//         </label>
//         <input
//           type="text"
//           id="organizationName"
//           value={organizationName}
//           onChange={(e) => setOrganizationName(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="ein" className="block text-sm font-medium text-gray-700">
//           EIN (Employer Identification Number)
//         </label>
//         <input
//           type="text"
//           id="ein"
//           value={ein}
//           onChange={(e) => setEin(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
//           Purpose/Activities
//         </label>
//         <textarea
//           id="purpose"
//           value={purpose}
//           onChange={(e) => setPurpose(e.target.value)}
//           rows={4}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//           Address
//         </label>
//         <input
//           type="text"
//           id="address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
//           Contact Information
//         </label>
//         <input
//           type="text"
//           id="contactInfo"
//           value={contactInfo}
//           onChange={(e) => setContactInfo(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           required
//         />
//       </div>
//       <button
//         type="submit"
//         className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//       >
//         Create 501(c)(4) Campaign
//       </button>
//     </form>
//   );
// }

// // Main page component
// export default function CreateCampaignPage() {
//   const [campaignType, setCampaignType] = useState<string | null>(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [fundingGoal, setFundingGoal] = useState('');
//   const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
//   const [files, setFiles] = useState<FileList | null>(null);
//   const [videoUrl, setVideoUrl] = useState('');

//   // Handler for 501(c)(3) form
//   const handleC3Submit = (formData: any) => {
//     console.log('501(c)(3) Campaign Submitted', formData);
//     // TODO: reset form or redirect
//   };

//   // Handler for other campaign types
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Campaign Submitted', { title, description, fundingGoal, mediaType, files, videoUrl });
//     // Reset or redirect as needed
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setFiles(e.target.files);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
//       {!campaignType ? (
//         <div className="space-y-4">
//           <p className="text-lg">Select the type of campaign you want to create:</p>
//           <div className="space-y-2">
//             {['Candidate', 'Cause', 'Political Organization', '501(c)(3)', '501(c)(4)'].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setCampaignType(type)}
//                 className="block w-full rounded-md border border-gray-300 py-2 px-4 text-center hover:bg-gray-50"
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>
//       ) : campaignType === '501(c)(3)' ? (
//         <CreateCampaign501c3Form onSubmit={handleC3Submit} />
//       ) : campaignType === '501(c)(4)' ? (
//         <CreateCampaign501c4Form />
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//               Campaign or Cause Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//               Campaign or Cause Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={4}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700">
//               Funding Goal ($)
//             </label>
//             <input
//               type="number"
//               id="fundingGoal"
//               value={fundingGoal}
//               onChange={(e) => setFundingGoal(e.target.value)}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">
//               Media Type
//             </label>
//             <select
//               id="mediaType"
//               value={mediaType}
//               onChange={(e) => setMediaType(e.target.value as 'photo' | 'video')}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             >
//               <option value="photo">Upload Photos</option>
//               <option value="video">Add Video URL</option>
//             </select>
//           </div>
//           {mediaType === 'photo' && (
//             <div>
//               <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
//                 Upload Photos
//               </label>
//               <input
//                 type="file"
//                 id="photos"
//                 accept="image/*"
//                 multiple

//                 onChange={handleFileChange}
//                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               />
//             </div>
//           )}

//           {mediaType === 'video' && (
//             <div>
//               <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
//                 Video URL (YouTube or Vimeo)
//               </label>
//               <input
//                 type="url"
//                 id="videoUrl"
//                 value={videoUrl}
//                 onChange={(e) => setVideoUrl(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//           )}

//           <button
//             type="submit"
//             className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             Create Campaign
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [files, setFiles] = useState<FileList | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1) Get the token from localStorage
    const token = localStorage.getItem("token");
    console.log("▶️ Retrieved token:", token);
    if (!token) {
      setError("You must be signed in to create a campaign.");
      setIsLoading(false);
      return;
    }

    // 2) Build payload
    const payload: any = {
      title,
      description,
      goal: Number(fundingGoal),
      end_date: endDate,
      email,
      photo:
        mediaType === "photo" && files && files[0]
          ? files[0].name
          : mediaType === "video"
          ? videoUrl
          : "",
      status: "urgent", // if your API requires it
    };
    console.log("📝 Creating campaign with payload:", payload);

    try {
      // 3) Send request with Bearer token
      const res = await fetch(`${API}/api/v1/create_campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // 4) Handle non-200
      if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          console.error("❌ API rejected payload:", errJson);
          errMsg = errJson.message || errMsg;
        } catch {
          const text = await res.text();
          console.error("❌ API rejected (non-JSON):", text);
          errMsg = text || errMsg;
        }
        throw new Error(errMsg);
      }

      // 5) On success, navigate
      const data = await res.json();
      console.log("✅ Created campaign:", data);
      router.push(`/admin`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Campaign Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Campaign Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Funding Goal ($)
          </label>
          <input
            type="number"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* Creator Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Campaign Media
          </label>
          <select
            value={mediaType}
            onChange={(e) =>
              setMediaType(e.target.value as "photo" | "video")
            }
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="photo">Upload Photo</option>
            <option value="video">Video URL</option>
          </select>
        </div>

        {/* Photo / Video */}
        {mediaType === "photo" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
        )}

        {/* Submit */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white"
          >
            {isLoading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}
