import { Suspense } from "react";
import DonatePageInner from "./donatepageinner";

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Loading donation page...</div>}>
      <DonatePageInner />
    </Suspense>
  );
}
