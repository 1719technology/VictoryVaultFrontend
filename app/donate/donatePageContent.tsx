"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  DollarSign,
  Shield,
  CreditCard,
  MapPin,
  Building,
} from "lucide-react";

interface CampaignDetail {
  id: number;
  title: string;
  description: string;
}

export interface DonatePageContentProps {
  campaignId: string | null;
}


export default function DonatePageContent({ campaignId }: DonatePageContentProps) {
  const router = useRouter();

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const presetAmounts = ["25", "50", "100", "250", "500", "1000"];
  const getCurrentAmount = () => customAmount || amount;

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] =
    useState<"weekly" | "monthly" | "quarterly">("monthly");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    employer: "",
    occupation: "",
    cardNumber: "",
    expire_month: "",
    expire_year: "",
    cvv: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const KEY = process.env.NEXT_PUBLIC_API_KEY!;

  useEffect(() => {
    if (!campaignId) return;
    setLoadingCampaign(true);
    fetch(`${API}/api/v1/single_campaign/${campaignId}`, {
      headers: { "x-api-key": KEY },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!json.campaign) throw new Error("Malformed response");
        const c = json.campaign;
        setCampaign({ id: c.id, title: c.title, description: c.description });
      })
      .catch(() => setCampaignError("Could not load campaign"))
      .finally(() => setLoadingCampaign(false));
  }, [API, KEY, campaignId]);

  const handleAmountSelect = (a: string) => {
    setAmount(a);
    setCustomAmount("");
  };
  const handleCustomAmountChange = (v: string) => {
    setCustomAmount(v);
    setAmount("");
  };
  const handleInput = (field: keyof typeof formData, v: string) =>
    setFormData((f) => ({ ...f, [field]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!campaign) {
      setError("Please select a campaign first.");
      return;
    }

    if (!getCurrentAmount()) {
      setError("Please select or enter an amount.");
      return;
    }

    const {
      first_name,
      last_name,
      email,
      cardNumber,
      expire_month,
      expire_year,
      cvv,
      zip_code,
    } = formData;

    if (!first_name || !last_name || !email || !cardNumber || !expire_month || !expire_year || !cvv) {
      setError("Please fill all required fields.");
      return;
    }

    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (zip_code && !zipRegex.test(zip_code)) {
      setError("Please enter a valid US ZIP code (e.g. 12345 or 12345-6789).");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        campaignId: campaign.id,
        amount: parseFloat(getCurrentAmount()),
        first_name,
        last_name,
        email,
        cardNumber,
        expire_month,
        expire_year,
        cvv,
        phone_number: formData.phone_number,
        address: formData.address,
        city: formData.city,
        cause: campaign.title,
        state: formData.state,
        zip_code: formData.zip_code,
        employer: formData.employer,
        occupation: formData.occupation,
        // Removed 'status' and renamed 'phone' to 'phone_number'
      };

      console.log("📦 Payload being sent:", payload);

      const res = await fetch(`${API}/api/v1/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": KEY,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("📬 Response status:", res.status);
      console.log("📨 Response body:", responseText);

      if (!res.ok) {
        try {
          const err = JSON.parse(responseText);
          throw new Error(err.message || "Donation failed");
        } catch {
          throw new Error("Unexpected error: " + responseText);
        }
      }

      router.push("/thank-you");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Make Your Donation</h1>
          <p className="text-lg text-red-100">Support the campaign you care about.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-8">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Donating For</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingCampaign ? (
              <p className="text-gray-600">Loading…</p>
            ) : campaign ? (
              <>
                <h3 className="text-lg font-semibold">{campaign.title}</h3>
                <p className="text-sm text-gray-700">{campaign.description}</p>
              </>
            ) : (
              <p className="text-gray-500">No campaign selected</p>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/candidates")}
              disabled={loadingCampaign}
            >
              {campaign ? "Change Campaign" : "Select Campaign"}
            </Button>
            {campaignError && <p className="text-red-600 text-sm">{campaignError}</p>}
          </CardContent>
        </Card>
      </section>

      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>
                <DollarSign className="mr-2 text-red-600 inline" /> Donation Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {presetAmounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => handleAmountSelect(a)}
                    className={`p-2 rounded-lg border-2 font-semibold ${amount === a ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"}`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <div>
                <Label htmlFor="customAmount">Custom Amount</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-10"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <input
                    id="recurring"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="recurring">Make recurring</Label>
                </div>
                {isRecurring && (
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value as "weekly" | "monthly" | "quarterly")}
                    className="mt-2 w-full"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>
                <Shield className="mr-2 text-red-600 inline" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInput("first_name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInput("last_name", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInput("email", e.target.value)}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInput("phone_number", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInput("address", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInput("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInput("state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleInput("zip_code", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer">Employer</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="employer"
                      className="pl-10"
                      value={formData.employer}
                      onChange={(e) => handleInput("employer", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInput("occupation", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>
                <CreditCard className="mr-2 text-red-600 inline" /> Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInput("cardNumber", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expire_month">Expiry Month (MM) *</Label>
                  <Input
                    id="expire_month"
                    placeholder="MM"
                    value={formData.expire_month}
                    onChange={(e) => handleInput("expire_month", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expire_year">Expiry Year (YY) *</Label>
                  <Input
                    id="expire_year"
                    placeholder="YY"
                    value={formData.expire_year}
                    onChange={(e) => handleInput("expire_year", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInput("cvv", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-50 p-4 rounded-lg border-gray-200 border">
            <h3 className="font-semibold mb-2">Important Legal Information</h3>
            <p className="text-sm">• Contributions are not tax-deductible.</p>
            <p className="text-sm">• Must be U.S. citizen or permanent resident.</p>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 font-semibold"
              disabled={
                isLoading ||
                !campaign ||
                !getCurrentAmount() ||
                !formData.first_name ||
                !formData.last_name ||
                !formData.email ||
                !formData.cardNumber ||
                !formData.expire_month ||
                !formData.expire_year ||
                !formData.cvv
              }
            >
              {isLoading ? "Processing…" : <><Shield className="mr-2 inline" /> Donate ${getCurrentAmount()}</>}
            </Button>
          </div>

          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </form>
      </div>

      <Footer />
    </div>
  )
};
