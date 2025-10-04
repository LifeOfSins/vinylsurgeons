'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactSection() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    message,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to submit form')
            } else {
                setSuccess(true)
                setShowDialog(true)
                // Reset form
                setFullName('')
                setEmail('')
                setPhone('')
                setMessage('')
            }
        } catch (err) {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-32" id="contact">
            <div className="mx-auto max-w-4xl px-4 lg:px-0">
                <h1 className="mb-12 text-center text-neutral-600 text-4xl font-semibold lg:text-5xl">Ready to take your game to the next level?</h1>

                <div className="grid divide-y bg-zinc-50 border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0">
                    <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Email</h2>
                            <Link
                                href="mailto:hello@tailus.io"
                                className="text-lg text-primary hover:underline dark:text-blue-400">
                                isabella@degoriproformance.com
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
                        <div>
                            <h3 className="mb-3 text-lg font-semibold">Phone</h3>
                            <Link
                                href="mailto:press@tailus.io"
                                className="text-lg text-primary hover:underline dark:text-blue-400">
                                412-707-7122
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="h-3 bg-zinc-50 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"></div>
                <form
                    onSubmit={handleSubmit}
                    className="border px-4 bg-zinc-50 py-12 lg:px-0 lg:py-24">
                    <Card className="mx-auto max-w-lg p-8 sm:p-16 border-primary">
                        <h3 className="text-xl font-semibold">Contact Us</h3>
                        <p className="mt-4 text-sm">Fill out the form below to schedule your private softball lesson in Pittsburgh, PA.</p>

                        {error && (
                            <div className="mt-6">
                                <Alert variant="destructive" appearance="light" close={true} onClose={() => setError('')}>
                                    <AlertIcon>
                                        <AlertTriangle />
                                    </AlertIcon>
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            </div>
                        )}

                        <div className="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="space-y-2">
                                    Full name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="space-y-2">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="phone"
                                    className="space-y-2">
                                    Phone Number
                                </Label>
                                <Input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="msg"
                                    className="space-y-2">
                                    Message
                                </Label>
                                <Textarea
                                    id="msg"
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : "Let's Get Started!"}
                            </Button>
                        </div>
                    </Card>
                </form>

                {/* Success Dialog */}
                {showDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                            <div className="flex items-center mb-4">
                                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                                <h3 className="text-lg font-semibold">Message Sent Successfully!</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Thank you for reaching out! We've received your message and will get back to you within 24 hours to schedule your private softball lesson.
                            </p>
                            <Button onClick={() => setShowDialog(false)} className="w-full">
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
