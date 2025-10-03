'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    question: string
    answer: string
}

export default function FAQs() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            question: 'What ages do you coach?',
            answer: 'We coach players of all ages, from beginners to advanced levels. Our coaching programs are tailored to meet the needs of each individual player.',
        },
        {
            id: 'item-2',
            question: 'Where are lessons held in Pittsburgh?',
            answer: 'Lessons can be held wherever is most convenient for you. We offer at-home lessons, lessons at local community centers, and at parks! We can arrange a location that works best for you.',
        },
        {
            id: 'item-3',
            question: 'Do you offer group discounts?',
            answer: 'Yes, we offer group discounts for teams and organizations. Please contact us for more information on pricing and availability.',
        },
        {
            id: 'item-4',
            question: 'What should players bring to a session?',
            answer: 'Players should bring their own gloves, bats, and any other personal equipment they prefer to use. We also recommend bringing water and snacks to stay energized during the session. We provide all necessary training equipment such as balls, cones, and training aids!',
        },
        {
            id: 'item-5',
            question: 'Do you help with softball recruiting?',
            answer: 'While my primary focus is on player development, I can share my own experience navigating the recruiting process and provide guidance for athletes interested in playing at the next level.',
        },
        {
            id: 'item-6',
            question: 'What makes your lessons different from other softball coaches in Pittsburgh?',
            answer: 'I combine personal playing experience at the collegiate level with a supportive teaching style. Every athlete gets individual attention, personalized drills, and the confidence-building mindset they need to succeed both on and off the field.',
        },
        {
            id: 'item-7',
            question: 'How do I get started?',
            answer: 'Simply reach out through the contact form or email, and I’ll follow up to discuss availability, locations, and the best plan for your athlete’s development.',
        },
    ]

    return (
        <section className="bg-zinc-50 dark:bg-background py-20" id='faqs'>
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-neutral-600 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Feel free to &apos;
                                <Link
                                    href="#"
                                    className="text-primary font-medium hover:underline">
                                    contact us
                                </Link>
                                &apos; with any questions!
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
