"use client";

import React from 'react'
import ColourfulText from "@/components/ui/colourful-text";
import { motion } from "motion/react";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from './header'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ArrowRightIcon, MessageCircleQuestionMark } from "lucide-react"

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section className="relative">
                    {/* Background image with low opacity */}
                    <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
                        <img
                            src="/hero.jpg"
                            alt="Hero background"
                            className="h-full w-full object-cover opacity-20"
                            aria-hidden="true"
                        />
                        <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
                    </div>
                    <div className="pb-12 pt-24 md:pb-32 lg:pb-56 lg:pt-30 relative">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                                                <h1
                                                                    className="mt-8 max-w-2xl text-white text-5xl font-black md:text-6xl lg:mt-16 xl:text-5xl"
                                                                    
                                                                >
                                                                    Private <span className="whitespace-nowrap"><ColourfulText text="Softball Lessons" /></span> in Pittsburgh
                                                                </h1>
                                <p className="mt-8 max-w-2xl text-neutral-800 text-lg font-semibold">Helping young athletes build confidence, improve mechanics, and reach their full potential.
One-on-one and small group coaching with a former collegiate softball player.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Link href="#services" passHref>
                                        <Button className="group"
                                            variant={"secondary"}
                                        >
                                           <Link href="#contact">
                                            <span>See What We Specialize In</span>                              
                                           </Link>                                           
                                           
                                           <ArrowRightIcon
                                                className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                                                
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            
                                        </Button>
                                    </Link>

                                    <Link href="#contact" passHref>
                                        <Button className="group"
                                            variant={"default"}
                                        >

                                            <Link href="#contact">
                                                <span>Start Your Training Journey</span>
                                            </Link>
                                            

                                        <ArrowRightIcon
                                            className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                                            
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        
                                        </Button>
                                    </Link>

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
