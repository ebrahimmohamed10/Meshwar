import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'motion/react'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

const Wallet = () => {
    const { user, currency, axios } = useAppContext()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('history') // 'history' or 'upcoming'
    const [selectedBooking, setSelectedBooking] = useState(null)

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user')
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchBookings()
        }
    }, [user])

    if (!user) return <Loader />
    if (loading) return <Loader />

    // 1. Transaction History: All bookings that were rejected or cancelled (Refunds)
    const historyBookings = bookings.filter(b => ['rejected', 'cancelled'].includes(b.status))
    
    // 2. Wallet Bookings: All bookings paid using the wallet funds
    const walletPaidBookings = bookings.filter(b => b.paymentMethod === 'Wallet')

    return (
        <div className='min-h-screen bg-gray-50 py-12 md:py-20 relative'>
            <div className='max-w-5xl mx-auto px-6'>
                
                {/* Page Title */}
                <div className='mb-10 text-center md:text-left'>
                    <h1 className='text-3xl font-bold text-gray-900'>My Wallet</h1>
                    <p className='text-gray-500 mt-1 font-medium'>Manage your funds and track transaction history.</p>
                </div>

                {/* Professional Wallet Hero Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm mb-12 relative overflow-hidden'
                >
                    <div className='flex flex-col md:flex-row justify-between items-center gap-10'>
                        <div className='space-y-3 text-center md:text-left z-10'>
                            <div className='flex items-center justify-center md:justify-start gap-2 text-primary font-bold'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
                                <span className='text-[10px] uppercase tracking-widest'>Current Balance</span>
                            </div>
                            <h2 className='text-5xl font-bold text-gray-900 tracking-tight'>
                                {user.wallet?.toLocaleString()} <span className='text-xl text-gray-400 font-medium'>{currency}</span>
                            </h2>
                        </div>

                        {/* Decorative Professional Element */}
                        <div className='hidden md:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-[0.03] overflow-hidden'>
                            <svg className='w-full h-full' viewBox="0 0 400 200" preserveAspectRatio="none">
                                <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,20" fill="none" stroke="#000" strokeWidth="40" strokeLinecap="round" />
                                <path d="M0,180 Q60,170 120,130 T240,110 T360,150 T400,50" fill="none" stroke="#000" strokeWidth="20" strokeLinecap="round" />
                            </svg>
                        </div>
                        
                        <div className='hidden md:flex flex-col items-end gap-2 text-right z-10'>
                             <div className='flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100'>
                                <span className='w-1 h-1 rounded-full bg-green-500 animate-pulse' />
                                <span className='text-[9px] font-bold uppercase tracking-widest'>Secure Assets</span>
                             </div>
                             <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Real-time Syncing</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className='flex items-center gap-10 mb-10 border-b border-gray-200'>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Transaction History
                        {activeTab === 'history' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'upcoming' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Wallet Bookings
                        {activeTab === 'upcoming' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />}
                    </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode='wait'>
                    {activeTab === 'history' ? (
                        <motion.div 
                            key="history"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='space-y-3'
                        >
                            {historyBookings.length === 0 ? (
                                <EmptyState icon={<svg className='text-gray-200' width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>} message="No transaction history found" />
                            ) : (
                                historyBookings.map((booking, index) => (
                                    <WalletCard key={index} booking={booking} type="refund" currency={currency} onClick={() => setSelectedBooking(booking)} />
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="upcoming"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='space-y-3'
                        >
                            {walletPaidBookings.length === 0 ? (
                                <EmptyState icon={<svg className='text-gray-200' width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>} message="No bookings paid with wallet found" />
                            ) : (
                                walletPaidBookings.map((booking, index) => (
                                    <WalletCard key={index} booking={booking} type="expense" currency={currency} onClick={() => setSelectedBooking(booking)} />
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <BookingDetailModal 
                        booking={selectedBooking} 
                        currency={currency} 
                        onClose={() => setSelectedBooking(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

const EmptyState = ({ icon, message }) => (
    <div className='py-20 text-center space-y-4 bg-white rounded-3xl border border-gray-100'>
        <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto'>
            {icon}
        </div>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>{message}</p>
    </div>
)

const WalletCard = ({ booking, type, currency, onClick }) => (
    <motion.div 
        whileHover={{ x: 5 }}
        onClick={onClick}
        className='bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between gap-6 hover:border-gray-300 transition-all shadow-sm cursor-pointer group'
    >
        <div className='flex items-center gap-5'>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'refund' ? 'bg-green-50 text-green-600' : 'bg-primary/5 text-primary'}`}>
                {type === 'refund' ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 19V5m-7 7l7-7 7 7"/></svg>
                ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14m7-7l-7 7-7-7"/></svg>
                )}
            </div>
            <div>
                <h4 className='font-bold text-gray-900 text-sm'>
                    {type === 'refund' ? `Refund: ${booking.status === 'rejected' ? 'Rejected Booking' : 'Cancelled Booking'}` : `${booking.car?.brand} ${booking.car?.model}`}
                </h4>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5'>
                    {new Date(booking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {booking._id.slice(-6).toUpperCase()}
                </p>
            </div>
        </div>
        <div className='text-right'>
            <span className={`text-base font-bold ${type === 'refund' ? 'text-green-600' : 'text-gray-900'}`}>
                {type === 'refund' ? '+' : '-'}{booking.price?.toLocaleString()} <span className='text-[10px] font-medium'>{currency}</span>
            </span>
            <div className='flex items-center justify-end gap-1.5 mt-0.5'>
                <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className='text-[8px] font-bold text-gray-400 uppercase tracking-widest'>{booking.status}</span>
            </div>
        </div>
    </motion.div>
)

const BookingDetailModal = ({ booking, currency, onClose }) => {
    
    const calculateDays = (start, end) => {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
        return diff || 1;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] flex items-center justify-center px-6'
        >
            <div onClick={onClose} className='absolute inset-0 bg-gray-900/40 backdrop-blur-sm' />
            
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className='bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative z-10'
            >
                {/* Modal Header */}
                <div className='p-8 pb-4 flex justify-between items-start'>
                    <div>
                        <h3 className='text-xl font-bold text-gray-900'>Booking Details</h3>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1'>ID: {booking._id.toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400'>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className='p-8 space-y-8'>
                    {/* Car Preview */}
                    <div className='flex items-center gap-6 p-4 bg-gray-50 rounded-2xl'>
                        <img src={booking.car?.image} alt="" className='w-24 h-16 object-cover rounded-lg' />
                        <div>
                            <h4 className='font-bold text-gray-900'>{booking.car?.brand} {booking.car?.model}</h4>
                            <p className='text-xs text-gray-500 font-medium'>{booking.car?.year} • {booking.car?.category}</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className='grid grid-cols-2 gap-y-6'>
                        <DetailItem label="Pickup Date" value={new Date(booking.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
                        <DetailItem label="Return Date" value={new Date(booking.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
                        <DetailItem label="Duration" value={`${calculateDays(booking.pickupDate, booking.returnDate)} Days`} />
                        <DetailItem label="Payment Method" value={booking.paymentMethod} />
                    </div>

                    {/* Summary */}
                    <div className='pt-8 border-t border-gray-100 flex justify-between items-end'>
                        <div>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>Total Amount</p>
                            <h4 className='text-2xl font-black text-gray-900'>{booking.price?.toLocaleString()} <span className='text-sm font-medium text-gray-400'>{currency}</span></h4>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                            {booking.status}
                        </div>
                    </div>
                </div>

                <div className='p-8 pt-0'>
                    <button onClick={onClose} className='w-full py-4 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all'>
                        Close Details
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const DetailItem = ({ label, value }) => (
    <div className='space-y-1'>
        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>{label}</p>
        <p className='text-sm font-bold text-gray-900'>{value}</p>
    </div>
)

export default Wallet
