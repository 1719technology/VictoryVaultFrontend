'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be signed in to create a campaign.");
      setIsLoading(false);
      return;
    }

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
    };

    try {
      const res = await fetch(`${API}/api/v1/create_campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errMsg = errJson.message || errMsg;
        } catch {
          errMsg = await res.text();
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      // 1) stash the new campaign so AdminPage can prepend it
      sessionStorage.setItem("newCampaign", JSON.stringify(data));
      // 2) navigate back to dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
        <Link href="/admin">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

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
