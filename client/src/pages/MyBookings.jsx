import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'motion/react'

/* ── tiny animated trash icon that wiggles on hover ── */
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4 flex-shrink-0 group-hover:animate-[wiggle_0.4s_ease-in-out]">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
)

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-3.5 h-3.5 flex-shrink-0">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [confirmCancelId, setConfirmCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleCancelBooking = async () => {
    if (!confirmCancelId) return
    setCancelling(true)
    try {
      const { data } = await axios.delete(`/api/bookings/cancel/${confirmCancelId}`)
      if (data.success) {
        toast.success('Booking cancelled successfully')
        setBookings(prev => prev.filter(b => b._id !== confirmCancelId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCancelling(false)
      setConfirmCancelId(null)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  return (
    <>
      {/* wiggle keyframe injected inline so no CSS file change needed */}
      <style>{`
        @keyframes wiggle {
          0%,100%{ transform: rotate(0deg); }
          25%    { transform: rotate(-12deg); }
          75%    { transform: rotate(12deg); }
        }
        @keyframes ping-slow {
          0%  { transform: scale(1);   opacity:.5; }
          70% { transform: scale(1.9); opacity:0;  }
          100%{ transform: scale(1.9); opacity:0;  }
        }
        .ping-slow { animation: ping-slow 1.8s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>

        <Title title='My Bookings'
          subTitle='View and manage your all car bookings'
          align="left" />

        <div>
          <AnimatePresence>
            {bookings.map((booking, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80, scale: 0.97, transition: { duration: 0.4 } }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                key={booking._id}
                className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>

                {/* Car Image + Info */}
                <div className='md:col-span-1'>
                  <div className='rounded-md overflow-hidden mb-3'>
                    <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover' />
                  </div>
                  <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
                </div>

                {/* Booking Info */}
                <div className='md:col-span-2'>
                  <div className='flex items-center gap-2'>
                    <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
                    <p className={`px-3 py-1 text-xs rounded-full font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-400/15 text-green-600'
                        : booking.status === 'cancelled'
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-orange-400/15 text-orange-600'
                    }`}>
                      {booking.status}
                    </p>
                  </div>

                  <div className='flex items-start gap-2 mt-3'>
                    <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                    <div>
                      <p className='text-gray-500'>Rental Period</p>
                      <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-2 mt-3'>
                    <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                    <div>
                      <p className='text-gray-500'>Pick-up Location</p>
                      <p>{booking.car.location}</p>
                    </div>
                  </div>
                </div>

                {/* Price + Cancel Button */}
                <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                  <div className='text-sm text-gray-500 text-right'>
                    <p>Total Price</p>
                    <h1 className='text-2xl font-semibold text-primary'>{Number(booking.price).toLocaleString()} {currency}</h1>
                    <p>Booked on {booking.createdAt.split('T')[0]}</p>
                  </div>

                  {/* ── Cancel / Locked button ── */}
                  {booking.status === 'pending' ? (

                    /* ── ACTIVE: pending booking ── */
                    <div className='relative'>
                      {/* pulsing ring behind button */}
                      <span className='ping-slow absolute inset-0 rounded-xl bg-red-400/25 pointer-events-none' />

                      <button
                        onClick={() => setConfirmCancelId(booking._id)}
                        className='group relative w-full overflow-hidden flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 active:translate-y-0'
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 15px rgba(239,68,68,0.35)' }}
                      >
                        {/* gloss overlay */}
                        <span className='absolute inset-0 rounded-xl' style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 60%)' }} />
                        {/* sweep shimmer */}
                        <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none rounded-xl' />

                        <TrashIcon />
                        <span className='relative'>Cancel Reservation</span>

                        {/* tiny arrow nudge on hover */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                  ) : (

                    /* ── DISABLED: confirmed / cancelled — same look, non-functional ── */
                    <div className='relative group/lock w-full'>
                      <button
                        disabled
                        className='w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-not-allowed select-none opacity-40 grayscale'
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                      >
                        <TrashIcon />
                        <span>Cancel Reservation</span>
                        <LockIcon />
                      </button>
                      {/* tooltip on hover */}
                      <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/lock:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-10'>
                        Cancellation not available after approval
                        <span className='absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800' />
                      </div>
                    </div>

                  )}
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </motion.div>

      {/* ══════════════════════════════════════════
          CONFIRMATION MODAL — creative redesign
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {confirmCancelId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center px-4'
            style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={() => !cancelling && setConfirmCancelId(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              className='relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden'
              onClick={e => e.stopPropagation()}
            >

              {/* ── coloured top band with icon ── */}
              <div className='relative h-32 flex items-center justify-center overflow-hidden'
                style={{ background: 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)' }}>

                {/* decorative circles */}
                <div className='absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10' />
                <div className='absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10' />

                {/* main icon */}
                <motion.div
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className='relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.div>
              </div>

              {/* ── body ── */}
              <div className='px-7 pt-6 pb-7'>
                <h2 className='text-xl font-bold text-gray-900 text-center mb-1'>Cancel Reservation?</h2>
                <p className='text-gray-500 text-sm text-center leading-relaxed mb-6'>
                  This booking will be permanently removed.<br/>
                  <span className='text-red-500 font-medium'>This action cannot be undone.</span>
                </p>

                {/* divider */}
                <div className='flex items-center gap-3 mb-5'>
                  <div className='flex-1 h-px bg-gray-100' />
                  <span className='text-[11px] text-gray-400 font-medium tracking-wider uppercase'>Confirm action</span>
                  <div className='flex-1 h-px bg-gray-100' />
                </div>

                <div className='flex gap-3'>
                  {/* Keep button */}
                  <button
                    onClick={() => setConfirmCancelId(null)}
                    disabled={cancelling}
                    className='flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm font-semibold disabled:opacity-50'
                  >
                    Keep It
                  </button>

                  {/* Confirm cancel button */}
                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                    className='group flex-1 relative overflow-hidden py-3 rounded-xl text-white text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2'
                    style={{ background: 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)', boxShadow: '0 4px 18px rgba(239,68,68,0.4)' }}
                  >
                    <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                    {cancelling ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Yes, Cancel
                      </>
                    )}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MyBookings
