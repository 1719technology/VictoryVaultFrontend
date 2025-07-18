import { Suspense } from "react";
import VerifyOtpClient from "./verifyOtpClient";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading OTP page...</div>}>
      <VerifyOtpClient />
    </Suspense>
  );
}
