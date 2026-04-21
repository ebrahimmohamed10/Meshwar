import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {

    const testimonials = [
        {
            name: "Khaled Osama",
            location: "Mansoura, Egypt",
            image: assets.testimonial_image_1,
            testimonial: "I've rented from various companies, but the experience with Meshwar was exceptional. Clean cars, easy booking and great support!",
            rating: 5
        },
        {
            name: "Ebrahim Mohamed",
            location: "Cairo, Egypt",
            image: assets.testimonial_image_2,
            testimonial: "Meshwar made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
            rating: 5
        },
        {
            name: "Karim Geab",
            location: "Mansoura, Egypt",
            image: assets.testimonial_image_3,
            testimonial: "I highly recommend Meshwar! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
            rating: 5
        }
    ];

    return (
        <section className="py-24 px-6 md:px-16 lg:px-24 xl:px-44 bg-gradient-to-b from-white to-gray-50/80 relative overflow-hidden">

            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <Title title="What Our Customers Say" subTitle="Trusted by thousands of drivers across Egypt. Here's what they love about us." />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
                {testimonials.map((t, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
                        whileHover={{ y: -5 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="relative bg-white p-7 rounded-2xl shadow-md hover:shadow-xl hover:shadow-primary/8 transition-all duration-400 border border-gray-100 group"
                    >
                        {/* Quote mark */}
                        <span className="absolute top-5 right-6 text-5xl text-primary/10 font-serif leading-none select-none">"</span>

                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-4">
                            {Array(t.rating).fill(0).map((_, i) => (
                                <img key={i} src={assets.star_icon} alt="star" className="w-4 h-4" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">
                            "{t.testimonial}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <img className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20" src={t.image} alt={t.name} />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{t.location}</p>
                            </div>
                            <div className="ml-auto w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                                ✓
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Testimonial
