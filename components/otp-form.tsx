import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Get email from localStorage
    const signupEmail = localStorage.getItem('signup_email')
    if (signupEmail) {
      setEmail(signupEmail)
    } else {
      // If no email found, redirect to sign up
      router.push('/dashboard/sign-up')
    }
  }, [router])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (error) {
        setError(error.message)
      } else {
        // Clear stored email
        localStorage.removeItem('signup_email')
        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) return

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        setError(error.message)
      } else {
        setError('')
        // You could show a success message instead
      }
    } catch (err) {
      setError('Failed to resend code')
    }
  }
  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}
    >
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form className="flex flex-col items-center justify-center p-6 md:p-8" onSubmit={handleVerifyOTP}>
            <FieldGroup>
              <Field className="items-center text-center">
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to {email}
                </p>
                {error && (
                  <div className="mt-2">
                    <Alert variant="destructive" appearance="light" close={true} onClose={() => setError('')}>
                      <AlertIcon>
                        <TriangleAlert />
                      </AlertIcon>
                      <AlertTitle>{error}</AlertTitle>
                    </Alert>
                  </div>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                                <InputOTP
                  maxLength={6}
                  id="otp"
                  required
                  containerClassName="gap-4 relative items-center justify-center"
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center">
                  Enter the 6-digit code sent to your email.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading || otp.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
                <FieldDescription className="text-center">
                  Didn&apos;t receive the code? <button type="button" onClick={handleResendCode} className="text-primary underline">Resend</button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Image"
              className="max-h-72 w-auto object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
