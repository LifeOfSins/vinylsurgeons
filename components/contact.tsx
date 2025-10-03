import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default function ContactSection() {
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
                    action=""
                    className="border px-4 bg-zinc-50 py-12 lg:px-0 lg:py-24">
                    <Card className="mx-auto max-w-lg p-8 sm:p-16 border-primary">
                        <h3 className="text-xl font-semibold">Contact Us</h3>
                        <p className="mt-4 text-sm">Fill out the form below to schedule your private softball lesson in Pittsburgh, PA.</p>

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
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="space-y-2">
                                    Phone Number
                                </Label>
                                <Input
                                    type="tel"
                                    id="phone"
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
                                />
                            </div>
                            <Button>Let's Get Started!</Button>
                        </div>
                    </Card>
                </form>
            </div>
        </section>
    )
}
