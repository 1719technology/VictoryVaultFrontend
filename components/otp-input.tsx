// "use client"

// import { useRef, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from "react"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"

// interface OtpInputProps {
//     length?: number
//     value: string
//     onChange: (value: string) => void
//     disabled?: boolean
// }

// export function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
//     const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null))

//     const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
//         const newValue = e.target.value
//         if (/^\d*$/.test(newValue)) {
//             const newOtp = value.split("")
//             newOtp[index] = newValue
//             onChange(newOtp.join(""))

//             // Move to next input if a digit was entered
//             if (newValue && index < length - 1) {
//                 inputRefs.current[index + 1]?.focus()
//             }
//         }
//     }

//     const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
//         if (e.key === "Backspace" && !value[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus()
//         }
//     }

//     const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
//         e.preventDefault()
//         const pasteData = e.clipboardData.getData("text/plain").slice(0, length)
//         if (/^\d*$/.test(pasteData)) {
//             onChange(pasteData.padEnd(length, " ").slice(0, length))
//             // Focus the last input if paste data fills all fields
//             if (pasteData.length >= length) {
//                 inputRefs.current[length - 1]?.focus()
//             } else {
//                 inputRefs.current[pasteData.length]?.focus()
//             }
//         }
//     }

//     return (
//         <div className="flex justify-center gap-2">
//             {Array.from({ length }).map((_, index) => (
//                 <Input
//                     key={index}
//                     type="text"
//                     maxLength={1}
//                     value={value[index] || ""}
//                     onChange={(e) => handleChange(e, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     onPaste={handlePaste}
//                     ref={(el) => {
//                         inputRefs.current[index] = el;
//                     }}
//                     className={cn(
//                         "w-12 h-12 text-center text-2xl font-bold",
//                         "border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500",
//                         disabled && "opacity-50 cursor-not-allowed",
//                     )}
//                     disabled={disabled}
//                     aria-label={`OTP digit ${index + 1}`}
//                 />

//             ))}
//         </div>
//     )
// }

"use client"

import { useRef, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OtpInputProps {
    length?: number
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null))

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value
        if (/^\d*$/.test(newValue)) {
            const newOtp = value.split("")
            newOtp[index] = newValue
            onChange(newOtp.join(""))

            if (newValue && index < length - 1) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const paste = e.clipboardData.getData("text").slice(0, length)
        if (/^\d*$/.test(paste)) {
            onChange(paste.padEnd(length, " ").slice(0, length))
            if (paste.length >= length) {
                inputRefs.current[length - 1]?.focus()
            } else {
                inputRefs.current[paste.length]?.focus()
            }
        }
    }

    return (
        <div className="flex justify-center gap-2">
            {Array.from({ length }).map((_, i) => (
                <Input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    ref={(el) => {
                        inputRefs.current[i] = el;
                    }}
                    className={cn(
                        "w-12 h-12 text-center text-2xl font-bold",
                        "border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled}
                    aria-label={`OTP digit ${i + 1}`}
                />
            ))}
        </div>
    )
}
