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
            name: "Karim Elmetwally",
            location: "Mansoura, Egypt",
            image: assets.testimonial_image_3,
            testimonial: "I highly recommend Meshwar! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
            rating: 5
        },
        {
            name: "Mahmoud Eldamhogi",
            location: "Mansoura, Egypt",
            image: assets.mahmoud_image,
            testimonial: "Meshwar provided an unforgettable experience. The booking was seamless and the car was in pristine condition. Highly recommended!",
            rating: 5
        }
    ];

    return (
        <section className="py-28 px-6 md:px-16 lg:px-24 xl:px-44 bg-slate-50 relative overflow-hidden">
            
            {/* Artistic Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse duration-[8000ms]" />
                <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] bg-teal-400/5 rounded-full blur-3xl" />
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative z-10"
            >
                <Title title="What Our Customers Say" subTitle="Trusted by thousands of drivers across Egypt. Here's what they love about us." />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative z-10">
                {testimonials.map((t, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-white/60 group overflow-hidden"
                    >
                        {/* Decorative gradient blob inside the card */}
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                        
                        {/* Quote mark */}
                        <span className="absolute bottom-2 right-6 text-8xl text-primary/5 font-serif leading-none select-none group-hover:text-primary/10 transition-colors duration-500 group-hover:-translate-y-2 transform origin-bottom">"</span>

                        {/* Author */}
                        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-200/50 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary rounded-full blur-sm opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                                <img className="relative w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" src={t.image} alt={t.name} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 tracking-tight">{t.name}</p>
                                <p className="text-primary/80 text-xs font-bold uppercase tracking-widest mt-0.5">{t.location}</p>
                                {/* Stars under location */}
                                <div className="flex items-center gap-1 mt-2">
                                    {Array(t.rating).fill(0).map((_, i) => (
                                        <motion.img 
                                            key={i} 
                                            src={assets.star_icon} 
                                            alt="star" 
                                            className="w-3.5 h-3.5 drop-shadow-sm"
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: index * 0.15 + i * 0.1 }}
                                            viewport={{ once: true }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-md shadow-primary/30 transform group-hover:scale-110 transition-all duration-300">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Quote */}
                        <p className="text-gray-700 text-base leading-relaxed relative z-10 font-medium italic">
                            "{t.testimonial}"
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Testimonial
