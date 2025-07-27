"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import VVLoader from "@/components/vvloader";
import {
  User,
  Building,
  MapPin,
  CreditCard,
  Bell,
  Save,
  ArrowLeft,
  Target,
  FileText,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  organizationName: string;
  organizationType: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  //bankName: string;
  //accountType: string;
  routingNumber: string;
  accountNumber: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  profilePicture: string; // direct Cloudinary URL
}

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "campaign">("profile");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showBankInfo, setShowBankInfo] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setMessage({ type: "error", text: "Unauthorized. Please sign in again." });
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API}/api/v1/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("[PROFILE API] Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data = await res.json();
        console.log("[PROFILE API] Data received:", data);

        setProfileData(data); // API returns direct URL for profilePicture
      } catch {
        setMessage({ type: "error", text: "Failed to load profile. Please refresh the page." });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [API]);

  const updateProfileField = (field: keyof ProfileData, value: any) => {
    if (profileData) setProfileData({ ...profileData, [field]: value });
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size exceeds 10MB limit." });
      return;
    }

    // TODO: Replace with Cloudinary upload widget if needed
    setMessage({ type: "error", text: "Direct file uploads not implemented. Use Cloudinary." });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      console.log("[PROFILE SAVE] Sending payload:", profileData);

      const res = await fetch(`${API}/api/v1/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMessage({ type: "error", text: "Error updating profile" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
  <>
    {/* Loader at top-level */}
    {isLoading && <VVLoader />}

    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-red-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-red-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600">Manage your profile and campaign defaults</p>
          </div>
        </div>

        {/* Profile Picture with Cloudinary Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {profileData?.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-red-500 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-red-200 flex items-center justify-center text-gray-400">
                <User className="h-12 w-12" />
              </div>
            )}

            {/* Cloudinary Upload Widget */}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                sources: ["local", "camera"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["jpg", "png", "jpeg", "gif"],
                maxFileSize: 10000000,
              }}
              onSuccess={(result: any) => {
                if (result?.event === "success") {
                  const url = result.info.secure_url;
                  setProfileData((prev) => (prev ? { ...prev, profilePicture: url } : null));
                  setMessage({ type: "success", text: "Profile picture updated" });
                }
              }}
            >
              {({ open }) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <Upload className="h-4 w-4" />
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("campaign")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "campaign"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Target className="h-4 w-4 inline mr-2" />
            Campaign Defaults
          </button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && profileData && (
          <form onSubmit={handleProfileSubmit} className="space-y-8">
            {/* Personal Info */}
            <Card className="border-red-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Personal Information
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name, Email, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => updateProfileField("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => updateProfileField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => updateProfileField("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => updateProfileField("phone", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => updateProfileField("dateOfBirth", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="border-green-100">
              <CardHeader>
                <MapPin className="h-5 w-5 text-green-600" />
                Mailing Address
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Street Address</Label>
                  <Input
                    value={profileData.street}
                    onChange={(e) => updateProfileField("street", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input value={profileData.city} onChange={(e) => updateProfileField("city", e.target.value)} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={profileData.state} onChange={(e) => updateProfileField("state", e.target.value)} />
                  </div>
                  <div>
                    <Label>Zip Code</Label>
                    <Input value={profileData.zipCode} onChange={(e) => updateProfileField("zipCode", e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label>Country</Label>
                  <select
                    value={profileData.country}
                    onChange={(e) => updateProfileField("country", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Banking Info (toggle) */}
            <Card className="border-purple-100">
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Banking Information
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowBankInfo(!showBankInfo)}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  {showBankInfo ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" /> Show
                    </>
                  )}
                </Button>
              </CardHeader>
              {showBankInfo && (
                <CardContent className="space-y-6">
                  <div>
                    <Label>Routing Number</Label>
                    <Input
                      value={profileData.routingNumber}
                      onChange={(e) => updateProfileField("routingNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input
                      type="password"
                      value={profileData.accountNumber}
                      onChange={(e) => updateProfileField("accountNumber", e.target.value)}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Notification Preferences */}
            <Card className="border-yellow-100">
              <CardHeader>
                <Bell className="h-5 w-5 text-yellow-600" />
                Notification Preferences
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profileData.emailNotifications}
                    onChange={(e) => updateProfileField("emailNotifications", e.target.checked)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                  <Label>Email Notifications</Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profileData.smsNotifications}
                    onChange={(e) => updateProfileField("smsNotifications", e.target.checked)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                  <Label>SMS Notifications</Label>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white px-8">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Campaign Defaults Tab */}
        {activeTab === "campaign" && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <Card className="border-red-100">
              <CardHeader>
                <FileText className="h-5 w-5 text-red-600" />
                <CardTitle className="text-xl text-gray-900">Campaign Defaults</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>Static placeholder — no API yet.</p>
              </CardContent>
            </Card>
          </form>
        )}
      </div>

      <Footer />
    </div>
  </>
);
}
