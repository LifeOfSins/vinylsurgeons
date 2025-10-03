import React from "react";
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { faCalendar, faMap, faBaseballBatBall, faBaseball, faUserCheck, faUserPlus, faUserMinus, faDumbbell, faPersonRunning, faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image'
import { ReactNode } from 'react'
import { FlipWords } from "@/components/ui/flip-words";

export default function Services() {
    const words = ["swing", "glove work", "game IQ", "fielding", "pitching", "team skills"];
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent" id="services">
            <div className="pb-18 flex justify-center items-center px-4">
                <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                    Let us help improve your
                    <FlipWords words={words} /> <br />
                </div>
            </div>
            
            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard className="pb-0 flex flex-col h-full">
                        <CardHeader className="pb-3 flex-grow">
                            <CardHeading
                                icon={faBaseballBatBall}
                                title="Hitting Lessons"
                                description="Improve swing mechanics, power, and consistency. Learn advanced drills used by college players."
                            />
                        </CardHeader>

                        <div className="relative mt-auto mb-auto">
                            <div
                                aria-hidden
                                className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-primary),var(--color-white)_100%)]"
                            />
                            <div className="aspect-76/59 h-full w-full">
                                <DualModeImage
                                    darkSrc="/hitting.webp"
                                    lightSrc="/hitting.webp"
                                    alt="payments illustration"
                                    width={1207}
                                    height={1000}
                                    className="w-full h-full object-cover object-center"
                                    style={{ objectPosition: 'center 25%' }}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard className="pb-0 flex flex-col h-full">
                        <CardHeader className="pb-3 flex-grow">
                            <CardHeading
                                icon={faBaseball}
                                title="Fielding Lessons"
                                description="Master infield & outfield fundamentals, footwork, glove work, and defensive awareness."
                            />
                        </CardHeader>

                        <div className="relative mt-auto">
                            <div
                                aria-hidden
                                className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-primary),var(--color-white)_100%)]"
                            />
                            <div className="aspect-76/59 h-full w-full object-bottom">
                                <DualModeImage
                                    darkSrc="/fielding.webp"
                                    lightSrc="/fielding.webp"
                                    alt="payments illustration"
                                    width={1207}
                                    height={1000}
                                    className="w-full h-full object-cover "
                                    style={{ objectPosition: 'center 25%' }}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Skill Development To Help You Perform Better</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <div className="flex flex-col items-center">
                                <span className="bg-muted rounded-full p-3 mb-2"><FontAwesomeIcon icon={faDumbbell} className="size-8 text-primary" /></span>
                                <span className="text-muted-foreground text-sm">Strength</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="bg-muted rounded-full p-3 mb-2"><FontAwesomeIcon icon={faPersonRunning} className="size-8 text-primary" /></span>
                                <span className="text-muted-foreground text-sm">Speed</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="bg-muted rounded-full p-3 mb-2"><FontAwesomeIcon icon={faBrain} className="size-8 text-primary" /></span>
                                <span className="text-muted-foreground text-sm">Game IQ</span>
                            </div>
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: any
    title: string
    description: string
}

const CardHeading = ({ icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-primary flex items-center gap-2">
            <FontAwesomeIcon icon={icon} className="size-4 text-primary" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
    style?: React.CSSProperties
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className, style }: DualModeImageProps) => (
    <>
        <Image
            src={darkSrc}
            className={cn('hidden dark:block', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
            style={style}
        />
        <Image
            src={lightSrc}
            className={cn('shadow dark:hidden', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
            style={style}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-linear-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-linear-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)
