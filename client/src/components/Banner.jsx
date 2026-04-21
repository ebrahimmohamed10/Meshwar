import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className='relative mx-4 md:mx-auto max-w-6xl rounded-3xl overflow-hidden'
        >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a6b4a] via-[#16A34A] to-[#3c9e7a]" />
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-2xl" />

            <div className='relative flex flex-col md:flex-row md:items-center justify-between px-10 md:pl-16 pt-10 md:pt-0 gap-6'>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className='text-white max-w-lg py-10'
                >
                    {/* Tag */}
                    <span className="inline-block bg-white/15 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        💼 Earn Passive Income
                    </span>

                    <h2 className='text-3xl md:text-4xl font-bold leading-tight'>
                        Do You Own a Luxury Car?
                    </h2>
                    <p className='mt-3 text-white/80 text-base leading-relaxed max-w-sm'>
                        Monetize your vehicle effortlessly. We handle insurance, driver verification and secure payments — so you earn stress-free.
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-sm text-white/70">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-300 rounded-full"/>Verified drivers</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-300 rounded-full"/>Secure payments</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-300 rounded-full"/>Full insurance</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04, backgroundColor: '#f9fafb' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/owner')}
                        className='mt-7 px-7 py-3 bg-white text-primary font-bold rounded-xl text-sm cursor-pointer transition-all shadow-lg shadow-black/20'
                    >
                        List your car →
                    </motion.button>
                </motion.div>

                <motion.img
                    initial={{ opacity: 0, x: 40, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: true }}
                    src={assets.banner_car_image}
                    alt="car"
                    className='max-h-52 md:max-h-64 object-contain drop-shadow-2xl mt-auto'
                />
            </div>
        </motion.section>
    )
}

export default Banner
