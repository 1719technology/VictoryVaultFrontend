
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Mail,
  Lock,
  Phone,
  Building,
  Globe,
  MapPin,
  Clock,
  Calendar,
  FileText,
  CreditCard,
  Shield,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  Flag,
} from "lucide-react";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  profilePicture: File | null;
  organizationName: string;
  website: string;
  role: "user" | "donor" | "campaigner" | "admin" | "";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timeZone: string;
  dateOfBirth: string;
  incorporationDate: string;
  governmentId: File | null;
  taxId: string;
  accountNumber: string;
  routingNumber: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profilePicture: null,
    organizationName: "",
    website: "",
    role: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    timeZone: "",
    dateOfBirth: "",
    incorporationDate: "",
    governmentId: null,
    taxId: "",
    accountNumber: "",
    routingNumber: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const totalSteps = 6

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: keyof FormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        organizationName: formData.organizationName,
        website: formData.website,
        role: formData.role,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        timeZone: formData.timeZone,
        dateOfBirth: formData.dateOfBirth,
        incorporationDate: formData.incorporationDate,
        taxId: formData.taxId,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        agreeToTerms: formData.agreeToTerms,
        agreeToPrivacy: formData.agreeToPrivacy,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
      }

      console.log("Sending registration payload:", payload)

      const res = await fetch(`${API}/api/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      console.log("API response:", json)

      if (!res.ok) {
        throw new Error(json.message || "Registration failed")
      }
      console.log("Registration succeeded:", json.message);
      window.location.href = "/register-otp?email=" + formData.email;
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }


  const timeZones = [
    "Eastern Time (ET)",
    "Central Time (CT)",
    "Mountain Time (MT)",
    "Pacific Time (PT)",
    "Alaska Time (AKT)",
    "Hawaii Time (HT)",
  ]

  const countries = ["United States", "Canada", "United Kingdom", "Australia", "Other"]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-600">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600">Password must contain:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center ${passwordRequirements.length ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordRequirements.length ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      8+ characters
                    </div>
                    <div
                      className={`flex items-center ${passwordRequirements.uppercase ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordRequirements.uppercase ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Uppercase letter
                    </div>
                    <div
                      className={`flex items-center ${passwordRequirements.lowercase ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordRequirements.lowercase ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Lowercase letter
                    </div>
                    <div
                      className={`flex items-center ${passwordRequirements.number ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordRequirements.number ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Number
                    </div>
                    <div
                      className={`flex items-center ${passwordRequirements.special ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordRequirements.special ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="mt-1 text-xs text-red-600 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  Passwords do not match
                </div>
              )}
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="profilePicture" className="text-sm font-medium text-gray-700">
                Profile Picture (Optional)
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="profilePicture"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="profilePicture"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("profilePicture", e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {formData.profilePicture && (
                <div className="mt-2 text-sm text-green-600">✓ {formData.profilePicture.name}</div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
              <p className="text-gray-600">Tell us about your organization or role</p>
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role *
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select your role</option>
                <option value="user">Individual</option>
                <option value="donor">Donor</option>
                <option value="campaigner">Campaign Manager</option>
                <option value="admin">Admin</option>
              </select>

            </div>

            {
              (formData.role !== "")
              && (
                <div>
                  <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                    Organization Name *
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="organizationName"
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
              )}

            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Website or Social Media Handle (Optional)
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="https://example.com or @username"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timeZone" className="text-sm font-medium text-gray-700">
                Time Zone *
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="timeZone"
                  value={formData.timeZone}
                  onChange={(e) => handleInputChange("timeZone", e.target.value)}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select your time zone</option>
                  {timeZones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <>
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="incorporationDate" className="text-sm font-medium text-gray-700">
                  Incorporation Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="incorporationDate"
                    type="date"
                    value={formData.incorporationDate}
                    onChange={(e) => handleInputChange("incorporationDate", e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </>
            {(formData.role !== "")
              && (
                <div>
                  <Label htmlFor="taxId" className="text-sm font-medium text-gray-700">
                    Tax ID / EIN *
                  </Label>
                  <Input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="XX-XXXXXXX"
                    required
                  />
                </div>
              )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mailing Address</h2>
              <p className="text-gray-600">We need your address for compliance purposes</p>
            </div>

            <div>
              <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                Street Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State/Province *
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                  ZIP/Postal Code *
                </Label>
                <Input
                  id="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country *
                </Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  required
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
              <p className="text-gray-600">Upload your government-issued ID for verification</p>
            </div>

            <div>
              <Label htmlFor="governmentId" className="text-sm font-medium text-gray-700">
                Government-issued ID *
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="governmentId"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500"
                    >
                      <span>Upload your ID</span>
                      <input
                        id="governmentId"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("governmentId", e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Driver's license, passport, or state ID</p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
              {formData.governmentId && (
                <div className="mt-2 text-sm text-green-600">✓ {formData.governmentId.name}</div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Your Privacy is Protected</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Your ID is encrypted and stored securely. We only use it for identity verification as required by
                    law for political contributions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Banking Information</h2>
              <p className="text-gray-600">For processing payouts and refunds</p>
            </div>

            <div>
              <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                Bank Account Number *
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="accountNumber"
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Account number"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="routingNumber" className="text-sm font-medium text-gray-700">
                Routing Number *
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="routingNumber"
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="9-digit routing number"
                  maxLength={9}
                  required
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Secure Banking</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Your banking information is encrypted with bank-level security. We use this only for legitimate
                    payouts and refunds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Terms & Preferences</h2>
              <p className="text-gray-600">Review and accept our terms, set your preferences</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  required
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-red-600 hover:text-red-500 font-medium">
                    Terms of Service
                  </Link>{" "}
                  *
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  id="agreeToPrivacy"
                  type="checkbox"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => handleInputChange("agreeToPrivacy", e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  required
                />
                <Label htmlFor="agreeToPrivacy" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-red-600 hover:text-red-500 font-medium">
                    Privacy Policy
                  </Link>{" "}
                  *
                </Label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <div>
                    <Label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </Label>
                    <p className="text-xs text-gray-500">
                      Receive updates about campaigns, donations, and platform news
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    id="smsNotifications"
                    type="checkbox"
                    checked={formData.smsNotifications}
                    onChange={(e) => handleInputChange("smsNotifications", e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <div>
                    <Label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
                      SMS Notifications
                    </Label>
                    <p className="text-xs text-gray-500">Receive urgent updates and reminders via text message</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Almost Done!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Review your information and click "Create Account" to complete your registration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join VictoryVault</h1>
          <p className="mt-2 text-gray-600">Create your account to start supporting conservative causes</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-red-100 shadow-lg">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-gray-300 hover:border-red-500 bg-transparent"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={
                (currentStep === 1 &&
                  (!formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !isPasswordValid ||
                    formData.password !== formData.confirmPassword ||
                    !formData.phone)) ||
                (currentStep === 2 &&
                  (!formData.role ||
                    !formData.organizationName ||
                    !formData.incorporationDate ||
                    !formData.taxId ||
                    !formData.timeZone ||
                    !formData.dateOfBirth)) ||
                (currentStep === 3 &&
                  (!formData.street || !formData.city || !formData.state || !formData.zipCode)) ||
                (currentStep === 4 && !formData.governmentId) ||
                (currentStep === 5 && (!formData.accountNumber || !formData.routingNumber))
              }
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.agreeToTerms || !formData.agreeToPrivacy || isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-red-600 hover:text-red-500 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
