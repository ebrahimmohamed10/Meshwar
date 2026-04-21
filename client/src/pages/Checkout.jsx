import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'

const Checkout = () => {
  const { id } = useParams()
  const { cars, axios, pickupDate, returnDate } = useAppContext()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  })

  useEffect(() => {
    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates first.')
      navigate(`/car-details/${id}`)
    }
    setCar(cars.find(c => c._id === id))
  }, [cars, id, pickupDate, returnDate, navigate])

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 0 ? 1 : diffDays
  }

  const days = calculateDays()
  const total = car ? car.pricePerDay * days : 0
  const taxes = Math.round(total * 0.1) // 10% tax conceptual
  const grandTotal = total + taxes

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || value.replace(/\D/g, '');
      if (value.length > 19) return;
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').slice(0, 5);
    }
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    setFormData({ ...formData, [name]: value })
  }

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    setLoading(true)

    // Simulate payment processing delay (Micro-interaction for trust)
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/my-bookings')
          toast.success('Payment successful & booking confirmed!')
        }, 2000)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  if (!car) return <Loader />

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Isolation Technique: Hide standard navbar, show secure checkout header */}
      <div className='w-full bg-white shadow-sm py-4 px-6 md:px-16 flex justify-between items-center z-10'>
        <div onClick={() => navigate(-1)} className='cursor-pointer flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors'>
           <img src={assets.arrow_icon} alt="Back" className='rotate-180 opacity-60 w-4'/>
           <span>Back</span>
        </div>
        <div className='flex items-center gap-2'>
           <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
           <span className='font-semibold text-gray-800'>Secure Checkout</span>
        </div>
      </div>

      <div className='flex-grow px-4 md:px-16 lg:px-24 xl:px-32 py-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10'>
          
          {/* Left Column: Checkout Flow */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='lg:col-span-2 space-y-8'
          >
            {/* Express Checkout */}
            <div className='bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
               <h2 className='text-lg font-medium text-gray-800 mb-4 flex items-center gap-2'>
                  Express Checkout
               </h2>
               <div className='flex flex-col gap-4'>
                  <button onClick={(e) => handlePayment(e)} disabled={loading || success} className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform shadow-sm ${success ? 'bg-green-500 text-white' : 'bg-[#000] hover:bg-gray-800 text-white cursor-pointer hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100'}`}>
                    {loading ? (
                       <span className='flex items-center gap-2'>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                       </span>
                    ) : success ? (
                       <span className='flex items-center gap-2'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Payment Successful
                       </span>
                    ) : (
                       <>
                          <svg className="w-6 h-6" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                          Pay
                       </>
                    )}
                  </button>
               </div>
            </div>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-sm text-gray-400 font-medium">Or pay with card</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handlePayment} className='bg-white/70 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6'>
               
               {/* 1. Guest Information */}
               <div>
                 <h2 className='text-xl font-semibold text-gray-800 mb-4'>1. Contact Information</h2>
                 <div className='relative'>
                   <input type="email" id="email" name="email" required
                     value={formData.email} onChange={handleInputChange}
                     onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                     className='w-full px-4 pt-6 pb-2 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors peer' placeholder=" "/>
                   <label htmlFor="email" className={`absolute left-4 transition-all duration-200 text-gray-500 pointer-events-none 
                      ${(focusedField === 'email' || formData.email) ? 'top-2 text-xs text-primary' : 'top-4 text-base'}`}>Email Address</label>
                 </div>
               </div>

               <hr className='border-gray-100'/>

               {/* 2. Billing details (Unified fields with floating labels) */}
               <div>
                 <h2 className='text-xl font-semibold text-gray-800 mb-4'>2. Billing Address</h2>
                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='relative md:col-span-2'>
                       <input type="text" id="name" name="name" required
                         value={formData.name} onChange={handleInputChange}
                         onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                         className='w-full px-4 pt-6 pb-2 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors peer' placeholder=" "/>
                       <label htmlFor="name" className={`absolute left-4 transition-all duration-200 text-gray-500 pointer-events-none 
                          ${(focusedField === 'name' || formData.name) ? 'top-2 text-xs text-primary' : 'top-4 text-base'}`}>Full Name on Card</label>
                    </div>
                    <div className='relative md:col-span-2'>
                       <input type="text" id="address" name="address" required
                         value={formData.address} onChange={handleInputChange}
                         onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)}
                         className='w-full px-4 pt-6 pb-2 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors peer' placeholder=" "/>
                       <label htmlFor="address" className={`absolute left-4 transition-all duration-200 text-gray-500 pointer-events-none 
                          ${(focusedField === 'address' || formData.address) ? 'top-2 text-xs text-primary' : 'top-4 text-base'}`}>Street Address</label>
                    </div>
                    <div className='relative'>
                       <input type="text" id="city" name="city" required
                         value={formData.city} onChange={handleInputChange}
                         onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)}
                         className='w-full px-4 pt-6 pb-2 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors peer' placeholder=" "/>
                       <label htmlFor="city" className={`absolute left-4 transition-all duration-200 text-gray-500 pointer-events-none 
                          ${(focusedField === 'city' || formData.city) ? 'top-2 text-xs text-primary' : 'top-4 text-base'}`}>City</label>
                    </div>
                    <div className='relative'>
                       <input type="text" id="zip" name="zip" required inputMode="numeric"
                         value={formData.zip} onChange={handleInputChange}
                         onFocus={() => setFocusedField('zip')} onBlur={() => setFocusedField(null)}
                         className='w-full px-4 pt-6 pb-2 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors peer' placeholder=" "/>
                       <label htmlFor="zip" className={`absolute left-4 transition-all duration-200 text-gray-500 pointer-events-none 
                          ${(focusedField === 'zip' || formData.zip) ? 'top-2 text-xs text-primary' : 'top-4 text-base'}`}>ZIP / Postal Code</label>
                    </div>
                 </div>
               </div>

               <hr className='border-gray-100'/>

               {/* 3. Payment Details (Unified Line Concept) */}
               <div>
                 <h2 className='text-xl font-semibold text-gray-800 mb-4'>3. Payment Information</h2>
                 <div className='flex flex-col gap-0 rounded-xl border border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden'>
                    <div className='relative border-b border-gray-300'>
                       <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                       </div>
                       <input type="tel" name="cardNumber" required placeholder="Card Number"
                         value={formData.cardNumber} onChange={handleInputChange}
                         className='w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none placeholder-gray-400' />
                    </div>
                    <div className='flex'>
                       <input type="tel" name="expiry" required placeholder="MM / YY"
                         value={formData.expiry} onChange={handleInputChange}
                         className='w-1/2 px-4 py-4 bg-transparent border-r border-gray-300 focus:outline-none placeholder-gray-400' />
                       <input type="tel" name="cvc" required placeholder="CVC"
                         value={formData.cvc} onChange={handleInputChange}
                         className='w-1/2 px-4 py-4 bg-transparent focus:outline-none placeholder-gray-400' />
                    </div>
                 </div>
                 
                 <div className='flex items-center gap-2 mt-3 text-xs text-gray-500'>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Payments are secure and encrypted.
                 </div>
               </div>

               {/* Submit CTA */}
               <div className='pt-4'>
                 <button type="submit" disabled={loading || success} 
                    className={`w-full py-4 rounded-xl font-semibold text-lg text-white transition-all relative overflow-hidden
                       ${success ? 'bg-green-500' : 'bg-primary hover:bg-primary-dull cursor-pointer shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-lg'}`}>
                    
                    {loading ? (
                       <span className='flex items-center justify-center gap-2'>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                       </span>
                    ) : success ? (
                       <span className='flex items-center justify-center gap-2'>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Payment Successful
                       </span>
                    ) : (
                       `Pay ${grandTotal.toLocaleString()} EGP`
                    )}
                 </button>
               </div>
            </form>
          </motion.div>

          {/* Right Column: Order Summary (Sticky) */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className='lg:col-span-1'
          >
             <div className='bg-white rounded-3xl p-6 shadow-sm sticky top-8 border border-gray-100'>
                <h3 className='text-lg font-semibold text-gray-800 mb-6'>Order Summary</h3>
                
                <div className='flex gap-4 mb-6'>
                   <img src={car.image} alt={car.model} className='w-24 h-16 object-cover rounded-lg'/>
                   <div>
                      <h4 className='font-medium text-gray-800'>{car.brand} {car.model}</h4>
                      <p className='text-sm text-gray-500'>{car.year} • {car.category}</p>
                   </div>
                </div>

                <hr className='border-gray-100 mb-4'/>

                <div className='space-y-3 mb-6 text-sm'>
                   <div className='flex justify-between text-gray-600'>
                      <span>Dates</span>
                      <span className='text-gray-800 font-medium'>
                         {new Date(pickupDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})} - {new Date(returnDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})}
                      </span>
                   </div>
                   <div className='flex justify-between text-gray-600'>
                      <span>Duration</span>
                      <span className='text-gray-800 font-medium'>{days} {days === 1 ? 'Day' : 'Days'}</span>
                   </div>
                   <div className='flex justify-between text-gray-600'>
                      <span>Daily Rate</span>
                      <span className='text-gray-800 font-medium'>{car.pricePerDay} EGP</span>
                   </div>
                </div>

                <hr className='border-gray-100 mb-4'/>

                <div className='space-y-3 mb-6'>
                   <div className='flex justify-between text-gray-600'>
                      <span>Subtotal</span>
                      <span className='text-gray-800 font-medium'>{total.toLocaleString()} EGP</span>
                   </div>
                   <div className='flex justify-between text-gray-600'>
                      <span>Taxes & Fees</span>
                      <span className='text-gray-800 font-medium'>{taxes.toLocaleString()} EGP</span>
                   </div>
                </div>

                <hr className='border-gray-100 mb-4'/>

                <div className='flex justify-between items-center mt-2'>
                   <span className='text-lg font-semibold text-gray-800'>Total Due</span>
                   <span className='text-2xl font-bold text-gray-900'>{grandTotal.toLocaleString()} <span className='text-sm font-normal text-gray-500'>EGP</span></span>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default Checkout
