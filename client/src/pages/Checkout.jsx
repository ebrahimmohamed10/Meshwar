import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'

const Checkout = () => {
  const { id } = useParams()
  const { cars, axios, pickupDate, returnDate, currency, user, fetchUser, token } = useAppContext()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [selectedPlan, setSelectedPlan] = useState('standard')

  const [formData, setFormData] = useState({
    email: '', name: '', address: '', city: '', zip: '', cardNumber: '', expiry: '', cvc: '', phone: '' 
  })

  const isPremiumCheckout = id === 'premium'

  const plans = {
    standard: {
        name: 'Standard',
        price: billingCycle === 'monthly' ? 99 : 990,
        features: ['Owner Dashboard', 'Basic Analytics', '10 Car Listings', 'Email Support'],
        description: 'Perfect for individual owners starting out.',
        color: 'gray'
    },
    professional: {
        name: 'Professional',
        price: billingCycle === 'monthly' ? 199 : 1990,
        features: ['Owner Dashboard', 'Real-time Analytics', 'Unlimited Listings', 'Priority 24/7 Support', 'Insurance Assistance', 'Performance Reports'],
        description: 'Advanced tools for professional fleet managers.',
        color: 'primary'
    }
  }

  useEffect(() => {
    if (isPremiumCheckout) {
      const plan = plans[selectedPlan]
      setCar({
        brand: 'Meshwar', model: `${plan.name} Plan`, pricePerDay: plan.price,
        image: selectedPlan === 'standard' ? 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80',
        category: 'Membership'
      })
    } else {
      if (!pickupDate || !returnDate) {
        toast.error('Please select pickup and return dates first.')
        navigate(`/car-details/${id}`)
        return;
      }
      const selectedCar = cars.find(c => c._id === id)
      if (selectedCar) setCar(selectedCar)
    }
  }, [cars, id, pickupDate, returnDate, navigate, isPremiumCheckout, billingCycle, selectedPlan])

  const days = isPremiumCheckout ? 1 : (() => {
    if (!pickupDate || !returnDate) return 0
    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24))
    return diff === 0 ? 1 : diff
  })()

  const total = car ? (isPremiumCheckout ? car.pricePerDay : car.pricePerDay * days) : 0
  const taxes = isPremiumCheckout ? 0 : Math.round(total * 0.1)
  const grandTotal = total + taxes

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') value = value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || value.replace(/\D/g, '');
    if (name === 'expiry') value = value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').slice(0, 5);
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 3);
    setFormData({ ...formData, [name]: value })
  }

  const handlePayment = async (e, method = 'Credit Card') => {
    if (e) e.preventDefault();
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    try {
      const endpoint = isPremiumCheckout ? '/api/user/upgrade-premium' : '/api/bookings/create'
      const payload = isPremiumCheckout ? { paymentMethod: method, billingCycle, plan: selectedPlan } : { car: id, pickupDate, returnDate, paymentMethod: method }
      const { data } = await axios.post(endpoint, payload, { headers: { Authorization: token } })
      if (data.success) {
        setSuccess(true)
        await fetchUser()
        setTimeout(() => { navigate(isPremiumCheckout ? '/owner' : '/my-bookings'); toast.success(data.message || 'Payment Successful!') }, 2000)
      } else { toast.error(data.message); setLoading(false) }
    } catch (e) { toast.error(e.message); setLoading(false) }
  }

  if (!car) return <Loader />

  return (
    <div className='min-h-screen bg-white text-[#1A1A1A]'>
      {/* Precision Header */}
      <nav className='sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/5 px-6 md:px-16 py-3 flex justify-between items-center'>
        <button onClick={() => navigate(-1)} className='group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all'>
           <svg className='w-3.5 h-3.5 transition-transform group-hover:-translate-x-1' fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
           Back
        </button>
        <div className='flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 shadow-sm'>
            <div className='w-1 h-1 rounded-full bg-primary animate-pulse' />
            <span className='text-[9px] font-black uppercase tracking-[0.2em] text-primary'>Secure Checkout</span>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto px-6 md:px-16 py-8 md:py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          
          <div className='lg:col-span-7 space-y-12'>
            
            {isPremiumCheckout && (
                <section className='space-y-10'>
                    <div className='space-y-3'>
                        <h1 className='text-4xl font-black tracking-tighter leading-[0.9] text-gray-900'>Premium<br/><span className='text-primary'>Membership.</span></h1>
                        <p className='text-gray-400 text-xs font-medium max-w-sm leading-relaxed'>Select your edition to unlock the dashboard.</p>
                    </div>

                    <div className='flex items-center gap-1 p-1 bg-gray-50 w-fit rounded-xl border border-gray-100'>
                        <button onClick={() => setBillingCycle('monthly')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-gray-400 hover:text-primary'}`}>Monthly</button>
                        <button onClick={() => setBillingCycle('annual')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'annual' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-gray-400 hover:text-primary'}`}>
                            Annual
                            {billingCycle !== 'annual' && <span className='absolute -top-3 -right-1 bg-primary text-white text-[6px] px-1.5 py-0.5 rounded-full shadow-lg shadow-primary/20'>Save 17%</span>}
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {Object.entries(plans).map(([key, plan]) => (
                            <PricingCard key={key} plan={plan} active={selectedPlan === key} onClick={() => setSelectedPlan(key)} currency={currency}/>
                        ))}
                    </div>
                </section>
            )}

            <section className='space-y-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[9px] font-black'>{isPremiumCheckout ? '2' : '1'}</div>
                    <h2 className='text-lg font-black uppercase tracking-widest text-gray-800'>Payment Method</h2>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                    <MethodTab icon="card" label="Card" active={paymentMethod === 'Credit Card'} onClick={() => setPaymentMethod('Credit Card')} />
                    <MethodTab icon="apple" label="Apple" active={paymentMethod === 'Apple Pay'} onClick={() => setPaymentMethod('Apple Pay')} />
                    <MethodTab icon="instapay" label="InstaPay" active={paymentMethod === 'InstaPay'} onClick={() => setPaymentMethod('InstaPay')} />
                    <MethodTab icon="vodafone" label="Vodafone" active={paymentMethod === 'Vodafone Cash'} onClick={() => setPaymentMethod('Vodafone Cash')} />
                    <MethodTab icon="wallet" label="Wallet" active={paymentMethod === 'Wallet'} onClick={() => setPaymentMethod('Wallet')} />
                </div>

                <AnimatePresence mode='wait'>
                    {paymentMethod === 'Credit Card' && (
                        <motion.form key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={(e) => handlePayment(e)} className='bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} focused={focusedField === 'name'} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
                                <FloatingInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} focused={focusedField === 'email'} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                            </div>
                            <div className='space-y-4'>
                                <div className='relative'>
                                    <input type="tel" name="cardNumber" required placeholder="Card Number" value={formData.cardNumber} onChange={handleInputChange} className='w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-sm font-black tracking-widest' />
                                </div>
                                <div className='flex gap-4'>
                                    <input type="tel" name="expiry" required placeholder="MM / YY" value={formData.expiry} onChange={handleInputChange} className='w-1/2 px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-sm font-black text-center' />
                                    <input type="tel" name="cvc" required placeholder="CVC" value={formData.cvc} onChange={handleInputChange} className='w-1/2 px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-sm font-black text-center' />
                                </div>
                            </div>
                            <SubmitBtn loading={loading} success={success} total={grandTotal} currency={currency} />
                        </motion.form>
                    )}

                    {(paymentMethod === 'InstaPay' || paymentMethod === 'Vodafone Cash') && (
                        <motion.div key="mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className='bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm text-center space-y-8'>
                            <div className='relative w-20 h-20 mx-auto'>
                                <div className={`relative w-full h-full rounded-2xl flex items-center justify-center text-xl font-black text-white ${paymentMethod === 'Vodafone Cash' ? 'bg-red-500' : 'bg-purple-500'}`}>
                                    {paymentMethod === 'Vodafone Cash' ? 'VF' : 'IP'}
                                </div>
                            </div>
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className='w-full max-w-xs px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none text-center font-black text-2xl tracking-widest' placeholder='01X XXXX XXXX'/>
                            <SubmitBtn onClick={() => handlePayment(null, paymentMethod)} loading={loading} success={success} total={grandTotal} currency={currency} />
                        </motion.div>
                    )}

                    {paymentMethod === 'Apple Pay' && (
                        <motion.div key="apple" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className='bg-black rounded-[1.5rem] p-6 text-center cursor-pointer hover:scale-[0.98] transition-all shadow-xl shadow-black/10' onClick={() => handlePayment(null, 'Apple Pay')}>
                            <div className='flex items-center justify-center gap-2 text-white'>
                                <svg className="w-7 h-7" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                                <span className='text-xl font-bold tracking-tight'>Pay</span>
                            </div>
                        </motion.div>
                    )}

                    {paymentMethod === 'Wallet' && (
                        <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className='bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm text-center space-y-8'>
                            <div className='space-y-2'>
                                <div className='w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary'>
                                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v.5M4 6v12c0 1.1.9 2 2 2h14v-4M16 16h4M20 12v4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <h3 className='text-xl font-black text-gray-900'>Pay with Wallet</h3>
                                <p className='text-xs font-medium text-gray-400'>Quick & Secure internal payment</p>
                            </div>
                            
                            <div className='bg-gray-50 rounded-2xl p-6 border border-gray-100'>
                                <span className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Available Balance</span>
                                <div className='text-3xl font-black text-primary mt-1'>{(user?.wallet || 0).toLocaleString()} <span className='text-xs text-gray-400'>{currency}</span></div>
                            </div>

                            {user?.wallet < grandTotal ? (
                                <div className='p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-left'>
                                    <svg className='w-5 h-5 text-red-500 shrink-0' fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    <p className='text-[10px] font-black uppercase tracking-tight text-red-600'>Insufficient Balance. Please top up your wallet to use this method.</p>
                                </div>
                            ) : (
                                <SubmitBtn onClick={() => handlePayment(null, 'Wallet')} loading={loading} success={success} total={grandTotal} currency={currency} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-5'>
            <div className='sticky top-24 space-y-6'>
                <div className='relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-300'>Summary</h3>
                        <div className='px-2 py-0.5 bg-primary/5 rounded-full'><span className='text-[8px] font-black text-primary'>VERIFIED</span></div>
                    </div>
                    <div className='flex gap-6 items-center'>
                        <img src={car.image} alt="" className='w-20 h-20 object-cover rounded-2xl shadow-lg'/>
                        <div className='space-y-1'>
                            <h4 className='font-black text-xl leading-tight text-gray-900'>{car.brand} {car.model}</h4>
                            <p className='text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full w-fit'>{car.category}</p>
                        </div>
                    </div>
                    <div className='space-y-4 pt-4 border-t border-gray-50'>
                        <SummaryRow label="Duration" value={isPremiumCheckout ? (billingCycle === 'monthly' ? '1 Month' : '1 Year') : `${days} Days`} />
                        <SummaryRow label="Rate" value={`${(car.pricePerDay || 0).toLocaleString()} ${currency}`} />
                        {taxes > 0 && <SummaryRow label="Fees" value={`${taxes.toLocaleString()} ${currency}`} />}
                    </div>
                    <div className='pt-8 border-t border-gray-50'>
                        <div className='space-y-1'>
                            <span className='text-[8px] font-black uppercase tracking-[0.2em] text-gray-400'>Grand Total</span>
                            <div className='text-5xl font-black tracking-tighter text-gray-900 flex items-baseline gap-2'>
                                {grandTotal.toLocaleString()}
                                <span className='text-xs font-black text-gray-300'>{currency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-primary rounded-2xl p-6 text-white flex items-center gap-4 shadow-lg shadow-primary/10'>
                    <svg className='w-6 h-6' fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    <div className='space-y-0.5'>
                        <p className='text-[10px] font-black uppercase tracking-widest'>Secure Transaction</p>
                        <p className='text-[8px] text-white/70'>256-bit SSL Protected</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PricingCard = ({ plan, active, onClick, currency }) => (
    <motion.div whileHover={{ y: -5 }} onClick={onClick} className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer relative group ${active ? 'bg-white border-primary shadow-xl shadow-primary/10' : 'bg-white border-gray-100 hover:border-primary/20'}`}>
        <h3 className={`text-xl font-black tracking-tight ${active ? 'text-primary' : 'text-gray-900'}`}>{plan.name}</h3>
        <p className='text-[10px] font-medium mt-2 text-gray-400 leading-relaxed'>{plan.description}</p>
        <div className='mt-6 flex items-baseline gap-1'>
            <span className={`text-3xl font-black tracking-tighter ${active ? 'text-primary' : 'text-gray-900'}`}>{plan.price.toLocaleString()}</span>
            <span className='text-[10px] font-black text-gray-300'>{currency}</span>
        </div>
        <ul className='mt-8 space-y-4'>
            {plan.features.map((f, i) => (
                <li key={i} className='flex items-center gap-3'>
                    <div className={`w-1 h-1 rounded-full ${active ? 'bg-primary' : 'bg-gray-200'}`} />
                    <span className='text-[9px] font-black uppercase tracking-widest text-gray-400'>{f}</span>
                </li>
            ))}
        </ul>
    </motion.div>
)

const MethodTab = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${active ? 'bg-white border-primary shadow-lg shadow-primary/10 scale-105' : 'bg-white border-gray-50 text-gray-300 hover:text-primary hover:border-primary/20'}`}>
        <div className='h-6 flex items-center justify-center'>
            {icon === 'card' && <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>}
            {icon === 'apple' && <svg width="22" height="22" fill="currentColor" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>}
            {icon === 'instapay' && <div className='text-[10px] font-black'>IP</div>}
            {icon === 'vodafone' && <div className='text-[10px] font-black'>VF</div>}
            {icon === 'wallet' && <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v.5M4 6v12c0 1.1.9 2 2 2h14v-4M16 16h4M20 12v4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-primary' : 'text-gray-300'}`}>{label}</span>
    </button>
)

const FloatingInput = ({ label, name, type="text", value, onChange, focused, onFocus, onBlur }) => (
    <div className='relative'>
        <input type={type} name={name} required value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} className='w-full px-6 pt-7 pb-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-sm font-black transition-all peer' placeholder=' '/>
        <label className={`absolute left-6 transition-all pointer-events-none ${(focused || value) ? 'top-3 text-[8px] text-primary font-black uppercase tracking-widest' : 'top-5 text-sm font-black text-gray-300'}`}>{label}</label>
    </div>
)

const SummaryRow = ({ label, value }) => (
    <div className='flex justify-between items-center'>
        <span className='text-[9px] font-black uppercase tracking-[0.2em] text-gray-300'>{label}</span>
        <span className='text-xs font-black text-gray-900'>{value}</span>
    </div>
)

const SubmitBtn = ({ loading, success, total, currency, onClick }) => (
    <button 
        type={onClick ? 'button' : 'submit'} 
        onClick={onClick} 
        disabled={loading || success} 
        className={`w-full py-4 rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.3em] text-white transition-all relative overflow-hidden group
            ${success 
                ? 'bg-gradient-to-r from-primary to-[#15803d]' 
                : 'bg-gradient-to-r from-primary via-[#16A34A] to-primary bg-[length:200%_auto] hover:bg-right shadow-xl shadow-primary/10 hover:shadow-primary/30 active:scale-[0.98]'
            }
            ${loading || success ? 'cursor-default' : 'cursor-pointer'}
        `}
    >
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[30deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
        
        <div className='flex items-center justify-center gap-3 relative z-10'>
            {!loading && !success && (
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
            <span>
                {loading ? 'Processing Transaction...' : success ? 'Booking Confirmed' : total ? `Pay Now: ${total.toLocaleString()} ${currency}` : 'Confirm Payment'}
            </span>
        </div>
    </button>
)

export default Checkout
