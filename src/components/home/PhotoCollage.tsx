'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

export default function PhotoCollage() {
    const t = useTranslations('Home');

    // Local testimonial images
    const photos = [
        '/images/testimonials/testimonial-1.jpg',
        '/images/testimonials/testimonial-2.jpg',
        '/images/testimonials/testimonial-3.jpg',
        '/images/testimonials/testimonial-4.jpg',
        '/images/testimonials/testimonial-5.jpg',
        '/images/testimonials/testimonial-6.jpg',
        '/images/testimonials/testimonial-7.jpg',
        '/images/testimonials/testimonial-8.jpg',
        '/images/testimonials/testimonial-9.jpg',
        '/images/testimonials/testimonial-10.jpg',
        '/images/testimonials/testimonial-11.jpg',
        '/images/testimonials/testimonial-12.jpg',
        '/images/testimonials/testimonial-13.jpg',
        '/images/testimonials/testimonial-14.jpg',
        '/images/testimonials/testimonial-15.jpg',
        '/images/testimonials/testimonial-16.jpg',
        '/images/testimonials/testimonial-17.jpg',
        '/images/testimonials/testimonial-18.jpg',
        '/images/testimonials/testimonial-19.jpg',
        '/images/testimonials/testimonial-20.jpg',
        '/images/testimonials/testimonial-21.jpg',
        '/images/testimonials/testimonial-22.jpg',
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container-custom">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-4">{t('collageTitle')}</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">{t('collageSubtitle')}</p>
                    </div>
                </FadeIn>

                <div className="columns-4 gap-4 space-y-4">
                    {photos.map((photoSrc, index) => (
                        <FadeIn key={index} delay={index * 0.05} direction="up">
                            <div className="relative rounded-xl overflow-hidden group break-inside-avoid">
                                <Image
                                    src={photoSrc}
                                    alt={`Gallery image ${index + 1}`}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 active:scale-[2.5] active:z-50 active:relative active:cursor-zoom-in"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
