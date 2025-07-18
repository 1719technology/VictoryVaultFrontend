"use client";
import { useSearchParams } from "next/navigation";
import DonatePageContent from "./donatePageContent";

export default function DonatePageInner() {
  const params = useSearchParams();
  const campaignId = params.get("campaignId");
  return <DonatePageContent campaignId={campaignId} />;
}
