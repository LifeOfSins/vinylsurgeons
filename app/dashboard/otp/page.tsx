'use client'
import { OTPForm } from "@/components/otp-form"

export default function OTPPage() {
  return (
    <div className="flex min-h-svh w-full bg-neutral-950 items-center justify-center p-6 md:p-10 dark">
      <div className="w-full max-w-sm md:max-w-3xl">
        <OTPForm />
      </div>
    </div>
  )
}
