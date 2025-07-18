import { Suspense } from "react";
import OtpVerificationPage from "./registerOtpPageClient";

export default function RegisterOtpPage() {
  return (
    <Suspense fallback={<div>Loading OTP verification page...</div>}>
      <OtpVerificationPage />
    </Suspense>
  );
}
