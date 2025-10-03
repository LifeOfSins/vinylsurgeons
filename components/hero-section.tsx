import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from './header'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ArrowRightIcon } from "lucide-react"

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="pb-12 pt-24 md:pb-32 lg:pb-56 lg:pt-30">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 xl:text-5xl">Pittsburgh’s Car Surgeons — Custom Vinyl Wraps & Styling</h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg">Premium vehicle wraps and tint services performed with surgical precision — because your car deserves expert care. Request your free quote today.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button className="group"
                                        
                                    >
                                        
                                        Request a Free Quote
                                        <ArrowRightIcon
                                            className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                                            
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">View Our Work</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center mt-2 mb-0 sm:mt-10 sm:mb-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full lg:mt-0 lg:mb-0">
                                <Image
                                    className="h-100 w-auto object-contain dark:mix-blend-lighten dark:invert-0 sm:h-[400px] lg:h-[400px]"
                                    src="/logo.png"
                                    alt="Abstract Object"
                                    height={3000}
                                    width={3000}
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
