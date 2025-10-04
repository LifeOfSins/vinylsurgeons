import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                // Redirect to dashboard or home page
                router.push('/dashboard')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }
    return (
        <section className="flex items-center justify-center dark bg-neutral-950 min-h-screen px-4">
            <form
                onSubmit={handleLogin}
                className="bg-muted text-white m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div className="text-center">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="mx-auto block w-fit">
                            <Image
                                src="/logo.png"
                                alt="DeGori Proformance"
                                width={1000}
                                height={1000}
                                className="mx-auto h-24 w-auto"
                            />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">DeGori Proformance</h1>
                        <p className="text-sm">Welcome back! Sign in to continue</p>
                    </div>

                    {error && (
                        <div className="mt-4">
                            <Alert variant="destructive" appearance="light" close={true} onClose={() => setError('')}>
                                <AlertIcon>
                                    <TriangleAlert />
                                </AlertIcon>
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        </div>
                    )}

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="pwd"
                                    className="text-sm">
                                    Password
                                </Label>
                                <Button
                                    asChild
                                    variant="link"
                                    size="sm">
                                    <Link
                                        href="#"
                                        className="text-primary  text-sm">
                                        Forgot your Password ?
                                    </Link>
                                </Button>
                            </div>
                            <Input
                                type="password"
                                required
                                name="pwd"
                                id="pwd"
                                className="input sz-md variant-mixed"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </div>

                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Don't have an account ?
                        <Button
                            asChild
                            variant="link"
                            className="px-2">
                            <Link href="/dashboard/sign-up">Create Account</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
