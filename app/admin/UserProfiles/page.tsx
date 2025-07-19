"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  User,
  Building,
  MapPin,
  CreditCard,
  Bell,
  Save,
  ArrowLeft,
  Upload,
  Eye,
  EyeOff,
  Target,
  DollarSign,
  FileText,
  ImageIcon,
  Users,
  Share2,
  Shield,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"
import {
  fetchProfileData,
  fetchCampaignDefaults,
  updateProfileData,
  updateCampaignDefaults,
  type ProfileData,
  type CampaignDefaults,
} from "./action" // Corrected import path

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "campaign">("profile")
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [campaignDefaults, setCampaignDefaults] = useState<CampaignDefaults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showBankingInfo, setShowBankingInfo] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, campaign] = await Promise.all([fetchProfileData(), fetchCampaignDefaults()])
        setProfileData(profile)
        setCampaignDefaults(campaign)
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load data. Please refresh the page." })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileData) return

    setIsSaving(true)
    setMessage(null)

    try {
      const result = await updateProfileData(profileData)
      setMessage({ type: "success", text: result.message })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaignDefaults) return

    setIsSaving(true)
    setMessage(null)

    try {
      const result = await updateCampaignDefaults(campaignDefaults)
      setMessage({ type: "success", text: result.message })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsSaving(false)
    }
  }

  const updateProfileField = (field: keyof ProfileData, value: any) => {
    if (profileData) {
      setProfileData({ ...profileData, [field]: value })
    }
  }

  const updateCampaignField = (field: keyof CampaignDefaults, value: any) => {
    if (campaignDefaults) {
      setCampaignDefaults({ ...campaignDefaults, [field]: value })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/admin" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Settings className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">Manage your profile and campaign defaults</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Target className="h-4 w-4 inline mr-2" />
                Campaign Defaults
              </button>
            </nav>
          </div>
        </div>

        {/* Message Display */}
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
            {/* Personal Information */}
            <Card className="border-red-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Personal Information
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => updateProfileField("firstName", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => updateProfileField("lastName", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => updateProfileField("email", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => updateProfileField("phone", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Date of Birth *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => updateProfileField("dateOfBirth", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Details */}
            <Card className="border-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl text-gray-900">Organization Details</CardTitle>
                </div>
                <CardDescription>Information about your organization or PAC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                      Organization Name
                    </Label>
                    <Input
                      id="organizationName"
                      type="text"
                      value={profileData.organizationName}
                      onChange={(e) => updateProfileField("organizationName", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizationType" className="text-sm font-medium text-gray-700">
                      Organization Type
                    </Label>
                    <select
                      id="organizationType"
                      value={profileData.organizationType}
                      onChange={(e) => updateProfileField("organizationType", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Political Action Committee">Political Action Committee</option>
                      <option value="Super PAC">Super PAC</option>
                      <option value="501(c)(3) Nonprofit">501(c)(3) Nonprofit</option>
                      <option value="501(c)(4) Social Welfare">501(c)(4) Social Welfare</option>
                      <option value="Individual">Individual</option>
                      <option value="Corporation">Corporation</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxId" className="text-sm font-medium text-gray-700">
                      Tax ID / EIN
                    </Label>
                    <Input
                      id="taxId"
                      type="text"
                      value={profileData.taxId}
                      onChange={(e) => updateProfileField("taxId", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => updateProfileField("website", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mailing Address */}
            <Card className="border-green-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-xl text-gray-900">Mailing Address</CardTitle>
                </div>
                <CardDescription>Your primary mailing address for official correspondence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
                    Street Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="streetAddress"
                      type="text"
                      value={profileData.streetAddress}
                      onChange={(e) => updateProfileField("streetAddress", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={profileData.city}
                      onChange={(e) => updateProfileField("city", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State *
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      value={profileData.state}
                      onChange={(e) => updateProfileField("state", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) => updateProfileField("zipCode", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country *
                  </Label>
                  <select
                    id="country"
                    value={profileData.country}
                    onChange={(e) => updateProfileField("country", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Banking Information */}
            <Card className="border-purple-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-xl text-gray-900">Banking Information</CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBankingInfo(!showBankingInfo)}
                    className="border-gray-300 hover:border-purple-500"
                  >
                    {showBankingInfo ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Show
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>Secure banking details for fund disbursements</CardDescription>
              </CardHeader>
              {showBankingInfo && (
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={profileData.bankName}
                        onChange={(e) => updateProfileField("bankName", e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        value={profileData.accountType}
                        onChange={(e) => updateProfileField("accountType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Business Checking">Business Checking</option>
                        <option value="Personal Checking">Personal Checking</option>
                        <option value="Business Savings">Business Savings</option>
                        <option value="Personal Savings">Personal Savings</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={profileData.routingNumber}
                        onChange={(e) => updateProfileField("routingNumber", e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        type="password"
                        value={profileData.accountNumber}
                        onChange={(e) => updateProfileField("accountNumber", e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Notification Preferences */}
            <Card className="border-yellow-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-xl text-gray-900">Notification Preferences</CardTitle>
                </div>
                <CardDescription>Choose how you want to receive updates and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={profileData.emailNotifications}
                    onChange={(e) => updateProfileField("emailNotifications", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={profileData.smsNotifications}
                    onChange={(e) => updateProfileField("smsNotifications", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
                    SMS Notifications
                  </Label>
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
        {activeTab === "campaign" && campaignDefaults && (
          <form onSubmit={handleCampaignSubmit} className="space-y-8">
            {/* Campaign Basics */}
            <Card className="border-red-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-xl text-gray-900">Campaign Basics</CardTitle>
                </div>
                <CardDescription>Default settings for new campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="defaultTitle" className="text-sm font-medium text-gray-700">
                    Default Campaign Title *
                  </Label>
                  <Input
                    id="defaultTitle"
                    type="text"
                    value={campaignDefaults.defaultTitle}
                    onChange={(e) => updateCampaignField("defaultTitle", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter a compelling campaign title"
                  />
                </div>

                <div>
                  <Label htmlFor="defaultTagline" className="text-sm font-medium text-gray-700">
                    Short Tagline (1-2 sentences) *
                  </Label>
                  <Input
                    id="defaultTagline"
                    type="text"
                    value={campaignDefaults.defaultTagline}
                    onChange={(e) => updateCampaignField("defaultTagline", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Brief description of your campaign"
                    maxLength={200}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultCategory" className="text-sm font-medium text-gray-700">
                      Default Category *
                    </Label>
                    <select
                      id="defaultCategory"
                      value={campaignDefaults.defaultCategory}
                      onChange={(e) => updateCampaignField("defaultCategory", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Political">Political</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="Community">Community</option>
                      <option value="Arts">Arts</option>
                      <option value="Veterans">Veterans</option>
                      <option value="Religious">Religious</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="defaultVisibility" className="text-sm font-medium text-gray-700">
                      Default Visibility *
                    </Label>
                    <select
                      id="defaultVisibility"
                      value={campaignDefaults.defaultVisibility}
                      onChange={(e) => updateCampaignField("defaultVisibility", e.target.value as "public" | "private")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private / Invite-Only</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card className="border-green-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-xl text-gray-900">Financial Details</CardTitle>
                </div>
                <CardDescription>Default financial settings for campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultTargetAmount">Default Target Amount</Label>
                    <Input
                      id="defaultTargetAmount"
                      type="number"
                      value={campaignDefaults.defaultTargetAmount}
                      onChange={(e) => updateCampaignField("defaultTargetAmount", Number.parseInt(e.target.value))}
                      min="0"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <select
                      id="defaultCurrency"
                      value={campaignDefaults.defaultCurrency}
                      onChange={(e) => updateCampaignField("defaultCurrency", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultDuration">Default Duration (days)</Label>
                    <Input
                      id="defaultDuration"
                      type="number"
                      value={campaignDefaults.defaultDuration}
                      onChange={(e) => updateCampaignField("defaultDuration", Number.parseInt(e.target.value))}
                      min="1"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultEndDate">Default End Date</Label>
                    <Input
                      id="defaultEndDate"
                      type="date"
                      value={campaignDefaults.defaultEndDate}
                      onChange={(e) => updateCampaignField("defaultEndDate", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Content */}
            <Card className="border-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl text-gray-900">Campaign Content</CardTitle>
                </div>
                <CardDescription>Default content and media settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="defaultDescription">Default Description</Label>
                  <textarea
                    id="defaultDescription"
                    value={campaignDefaults.defaultDescription}
                    onChange={(e) => updateCampaignField("defaultDescription", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Default campaign description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultCoverImage">Default Cover Image URL</Label>
                    <Input
                      id="defaultCoverImage"
                      type="url"
                      value={campaignDefaults.defaultCoverImage}
                      onChange={(e) => updateCampaignField("defaultCoverImage", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultVideoUrl">Default Video URL</Label>
                    <Input
                      id="defaultVideoUrl"
                      type="url"
                      value={campaignDefaults.defaultVideoUrl}
                      onChange={(e) => updateCampaignField("defaultVideoUrl", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Image Gallery</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                          <span>Upload images</span>
                          <input type="file" className="sr-only" accept="image/*" multiple />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each (max 10 images)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipient & Settings */}
            <Card className="border-purple-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-xl text-gray-900">Recipient & Settings</CardTitle>
                </div>
                <CardDescription>Default recipient and fund delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultRecipientName">Default Recipient Name</Label>
                    <Input
                      id="defaultRecipientName"
                      type="text"
                      value={campaignDefaults.defaultRecipientName}
                      onChange={(e) => updateCampaignField("defaultRecipientName", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="Who will receive the funds?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultRecipientOrganization">Default Recipient Organization</Label>
                    <Input
                      id="defaultRecipientOrganization"
                      type="text"
                      value={campaignDefaults.defaultRecipientOrganization}
                      onChange={(e) => updateCampaignField("defaultRecipientOrganization", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="Organization name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultRecipientRelationship">Relationship to Organizer</Label>
                    <select
                      id="defaultRecipientRelationship"
                      value={campaignDefaults.defaultRecipientRelationship}
                      onChange={(e) => updateCampaignField("defaultRecipientRelationship", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Self">Self</option>
                      <option value="Organization">Organization</option>
                      <option value="Family Member">Family Member</option>
                      <option value="Friend">Friend</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="defaultFundDelivery">Fund Delivery Method</Label>
                    <select
                      id="defaultFundDelivery"
                      value={campaignDefaults.defaultFundDelivery}
                      onChange={(e) =>
                        updateCampaignField("defaultFundDelivery", e.target.value as "direct" | "escrow")
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="direct">Direct Disbursement</option>
                      <option value="escrow">Escrow</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="defaultDonorUpdates"
                    checked={campaignDefaults.defaultDonorUpdates}
                    onChange={(e) => updateCampaignField("defaultDonorUpdates", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="defaultDonorUpdates">Opt-in for Donor Updates (email blasts)</Label>
                </div>
              </CardContent>
            </Card>

            {/* Social Sharing */}
            <Card className="border-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl text-gray-900">Social Sharing Defaults</CardTitle>
                </div>
                <CardDescription>Default social media sharing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="defaultFacebookSharing"
                    checked={campaignDefaults.defaultFacebookSharing}
                    onChange={(e) => updateCampaignField("defaultFacebookSharing", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="defaultFacebookSharing">Enable Facebook Sharing</Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="defaultTwitterSharing"
                    checked={campaignDefaults.defaultTwitterSharing}
                    onChange={(e) => updateCampaignField("defaultTwitterSharing", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="defaultTwitterSharing">Enable Twitter Sharing</Label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="defaultLinkedInSharing"
                    checked={campaignDefaults.defaultLinkedInSharing}
                    onChange={(e) => updateCampaignField("defaultLinkedInSharing", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="defaultLinkedInSharing">Enable LinkedIn Sharing</Label>
                </div>
              </CardContent>
            </Card>

            {/* Legal & Compliance */}
            <Card className="border-yellow-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-xl text-gray-900">Legal & Compliance</CardTitle>
                </div>
                <CardDescription>Default legal terms and compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="defaultRefundPolicy">Default Refund Policy</Label>
                  <textarea
                    id="defaultRefundPolicy"
                    value={campaignDefaults.defaultRefundPolicy}
                    onChange={(e) => updateCampaignField("defaultRefundPolicy", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Default refund policy terms..."
                  />
                </div>

                <div>
                  <Label htmlFor="defaultDisbursementSchedule">Default Disbursement Schedule</Label>
                  <textarea
                    id="defaultDisbursementSchedule"
                    value={campaignDefaults.defaultDisbursementSchedule}
                    onChange={(e) => updateCampaignField("defaultDisbursementSchedule", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="How and when funds will be disbursed..."
                  />
                </div>

                <div>
                  <Label htmlFor="defaultDisclaimers">Default Required Disclaimers</Label>
                  <textarea
                    id="defaultDisclaimers"
                    value={campaignDefaults.defaultDisclaimers}
                    onChange={(e) => updateCampaignField("defaultDisclaimers", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Required legal disclaimers..."
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="defaultTermsAccepted"
                    checked={campaignDefaults.defaultTermsAccepted}
                    onChange={(e) => updateCampaignField("defaultTermsAccepted", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="defaultTermsAccepted">
                    I confirm the accuracy of information and accept indemnification terms
                  </Label>
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
                    Save Campaign Defaults
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  )
}
