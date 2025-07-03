// 'use client';

// import { useState } from 'react';

// export default function EditProfilePage() {
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     bio: '',
//   });
//   const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setProfileData({
//       ...profileData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setProfilePhoto(e.target.files[0]);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Handle profile data and photo submission
//     console.log('Profile Data:', profileData);
//     console.log('Profile Photo:', profilePhoto);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//             Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             id="name"
//             value={profileData.name}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={profileData.email}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
//             Bio
//           </label>
//           <textarea
//             name="bio"
//             id="bio"
//             value={profileData.bio}
//             onChange={handleChange}
//             rows={4}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           ></textarea>
//         </div>
//         <div>
//           <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
//             Profile Photo
//           </label>
//           <input
//             type="file"
//             name="profilePhoto"
//             id="profilePhoto"
//             accept="image/*"
//             onChange={handlePhotoChange}
//             className="mt-1 block w-full text-sm text-gray-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-full file:border-0
//               file:text-sm file:font-semibold
//               file:bg-blue-50 file:text-blue-700
//               hover:file:bg-blue-100"
//           />
//           {profilePhoto && (
//             <p className="mt-2 text-sm text-gray-500">Selected file: {profilePhoto.name}</p>
//           )}
//         </div>
//         <button
//           type="submit"
//           className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Save Profile
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const KEY = process.env.NEXT_PUBLIC_API_KEY!;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Build JSON payload per your API docs:
      const payload: Record<string, any> = {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
      };
      // If your API accepts a photo field, send just the filename or base64:
      if (profilePhoto) {
        payload.photo = profilePhoto.name;
      }

      const res = await fetch(`${API}/api/v1/update_profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Failed to update profile";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      // On success, redirect back to the profile page
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profileData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isLoading}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isLoading}
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Photo upload */}
        <div>
          <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <input
            id="profilePhoto"
            name="profilePhoto"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
          />
          {profilePhoto && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {profilePhoto.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
