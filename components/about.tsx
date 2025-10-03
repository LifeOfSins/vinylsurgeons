import React from "react";

import Image from 'next/image'
import { FlipWords } from "@/components/ui/flip-words";

export default function AboutCoach() {
    return (
        <section className="py-16 md:py-32" id="ourCoach">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative text-neutral-600 z-10 max-w-xl text-4xl font-medium lg:text-5xl">Meet Our Amazing Coach - Isabella</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/isabella-portrait.jpeg" className="rounded-[15px] dark:block" alt="Isabella's portrait" width={1207} height={929} />
                        </div>
                    </div>

                    <div className="relative space-y-4">
                        <p className="text-muted-foreground">
                            Hi, I’m Isabella! Softball has been my passion since I first stepped on the field at 9 years old. Over the years, I’ve been featured in several local articles, received college offers, and competed at a high level at Carlow University, where I received an athletic scholarship!
                        </p>
                        <p className="text-muted-foreground">Now, I’m excited to share my knowledge and experience with the next generation of players in Pittsburgh. My coaching focuses on developing strong fundamentals, building confidence, and tailoring each session to meet your individual goals.</p>

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4">
                                <p>Isabella always plays hard. She is a perfectionist. She is a good left-handed batter and a slap hitter with a lot of speed. She is a very good middle infielder and can also play in the outfield. Isabella is an athlete that always plays to the best of her ability 100 percent of the time. She’s always trying to make herself better and I think that is very important.</p>
                                

                                <div className="mt-6 space-y-3">
                                    <cite className="block font-medium">3n2 Sports Coach, 18u Travel Softball</cite>
                                    <img className="h-5 dark:invert" src="/3n2.png" alt="Nvidia Logo" height="20" width="auto" />
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
