import { Suspense } from "react";
import DonatePageInner from "./donatePageInner";

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Loading donation page...</div>}>
      <DonatePageInner />
    </Suspense>
  );
}
