// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";

// interface VerificationResponse {
//   sessionId: string;
//   sessionUrl: string;
//   status: string;
// }

// const VerifyReg = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [verificationData, setVerificationData] =
//     useState<VerificationResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Get the registration data from localStorage or query params
//     const registrationData = localStorage.getItem("registrationData");

//     if (!registrationData) {
//       setError(
//         "No registration data found. Please complete registration first."
//       );
//       setLoading(false);
//       return;
//     }

//     const API = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const { firstName, lastName, email } = JSON.parse(registrationData);
//     console.log("Registration Data:", { firstName, lastName, email });

//     // Immediately trigger verification when component mounts
//     const verifyUser = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API}/api/v1/start-veriff`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ firstName, lastName, email }),
//         });

//         const data: VerificationResponse = await response.json();
//         console.log("Verification Response:", data);

//         if (response.ok) {
//           setVerificationData(data);
//           console.log("Verification Session ID:", data);

//           // Open verification URL in a new tab
//           window.open(data.sessionUrl, "_blank");
//           // Store verification session ID for future reference
//           localStorage.setItem("verificationSessionId", data.sessionId);
//           toast.success("Verification process started successfully");
//         } else {
//           throw new Error(data.status || "Verification failed");
//         }
//       } catch (err: any) {
//         setError(err.message || "Failed to start verification process");
//         toast.error(err.message || "Verification failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyUser();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//           <div className="flex flex-col items-center space-y-4">
//             <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-900">
//               Starting Verification
//             </h1>
//             <p className="text-gray-600">
//               Please wait while we prepare your identity verification...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="p-4 bg-red-100 rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-12 h-12 text-red-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Verification Error
//             </h1>
//             <p className="text-gray-600 text-center">{error}</p>
//             <button
//               onClick={() => router.push("/register")}
//               className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Back to Registration
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="p-4 bg-green-100 rounded-full">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-12 h-12 text-green-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Verification Started
//           </h1>
//           <p className="text-gray-600 text-center">
//             Your identity verification process has been started in a new tab.
//             Please complete the verification steps there.
//           </p>
//           <p className="text-gray-600 text-center">
//             You can safely close this window or return to the login.
//           </p>
//           <div className="flex space-x-4">
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Check Status
//             </button>
//             <button
//               onClick={() => router.push("/login")}
//               className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyReg;

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface VerificationResponse {
  sessionId: string;
  sessionUrl: string;
  status: string;
}

const VerifyReg = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] =
    useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const registrationData = localStorage.getItem("registrationData");

    if (!registrationData) {
      setError("No registration data found. Please complete registration first.");
      setLoading(false);
      return;
    }

    const API = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { firstName, lastName, email } = JSON.parse(registrationData);
    console.log("Registration Data:", { firstName, lastName, email });

    const verifyUser = async () => {
      try {
        setLoading(true);

        // Open a blank tab first (avoids popup blocker)
        const newTab = window.open("", "_blank");

        const response = await fetch(`${API}/api/v1/start-veriff`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email }),
        });

        const data: VerificationResponse = await response.json();
        console.log("Verification Response:", data);

        if (response.ok) {
          setVerificationData(data);
          localStorage.setItem("verificationSessionId", data.sessionId);

          // Redirect the opened tab to Veriff session
          if (newTab) {
            newTab.location.href = data.sessionUrl;
          }

          toast.success("Verification process started successfully");
        } else {
          if (newTab) newTab.close(); // close tab if verification fails
          throw new Error(data.status || "Verification failed");
        }
      } catch (err: any) {
        setError(err.message || "Failed to start verification process");
        toast.error(err.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Starting Verification</h1>
            <p className="text-gray-600">
              Please wait while we prepare your identity verification...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-red-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Error</h1>
            <p className="text-gray-600 text-center">{error}</p>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-green-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Started</h1>
          <p className="text-gray-600 text-center">
            Your identity verification process has been started in a new tab.
            Please complete the verification steps there.
          </p>
          <p className="text-gray-600 text-center">
            You can safely close this window or return to the login.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Check Status
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyReg;
