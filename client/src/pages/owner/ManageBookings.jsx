import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { assets } from '../../assets/assets'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings || []) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full min-h-screen bg-[#F9FAFB] pb-10'>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage your car reservations and customer payments.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700">
                <span className="text-gray-400 mr-2">Total Bookings:</span> 
                {bookings.length}
            </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
           <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
           <h3 className="text-sm font-medium text-gray-900">No bookings found</h3>
           <p className="text-sm text-gray-500 mt-1">You don't have any active reservations yet.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings && bookings.length > 0 && bookings.map((booking, index) => {
                  if (!booking) return null;
                  
                  const pickupDate = booking.pickupDate ? new Date(booking.pickupDate) : null;
                  const returnDate = booking.returnDate ? new Date(booking.returnDate) : null;
                  const isValidDates = pickupDate && returnDate && !isNaN(pickupDate) && !isNaN(returnDate);

                  return (
                    <tr key={booking._id || index} className="hover:bg-gray-50/50 transition-colors group">
                      
                      {/* Car Info */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={booking.car?.image || assets.car_icon} 
                            alt="" 
                            className="h-10 w-14 object-cover rounded shadow-sm border border-gray-100 mr-3"
                            onError={(e) => { e.target.src = assets.car_icon }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.car?.brand || 'Deleted Car'}</div>
                            <div className="text-xs text-gray-500">{booking.car?.model || 'Unknown Model'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs mr-3">
                            {booking.user?.name ? String(booking.user.name).charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.user?.name || 'Unknown User'}</div>
                            <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Period */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                           {isValidDates ? pickupDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short'}) : 'N/A'}
                           <span className="text-gray-400 mx-1">-</span>
                           {isValidDates ? returnDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short'}) : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {isValidDates ? Math.max(0, Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24))) : 0} Days
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {typeof booking.price === 'number' ? booking.price.toLocaleString() : '0'} <span className="text-xs text-gray-500 font-normal">{currency}</span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase
                          ${booking.paymentMethod === 'Credit Card' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10' : 
                            (booking.paymentMethod === 'Apple Pay' || booking.paymentMethod === 'Express Checkout') ? 'bg-gray-50 text-gray-800 ring-1 ring-inset ring-gray-800/10' : 
                            'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/10'}`}>
                          {booking.paymentMethod === 'Credit Card' && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>}
                          {(booking.paymentMethod === 'Apple Pay' || booking.paymentMethod === 'Express Checkout') && <svg className="w-3 h-3 mr-1" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>}
                          {booking.paymentMethod === 'Express Checkout' ? 'Apple Pay' : (booking.paymentMethod || 'Offline')}
                        </span>
                      </td>

                      {/* Status & Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right flex justify-end">
                        {booking.status === 'pending' ? (
                          <div className="relative">
                            <select 
                              onChange={e=> changeBookingStatus(booking._id, e.target.value)} 
                              value={booking.status} 
                              className="appearance-none bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 font-medium text-xs rounded-md pl-3 pr-7 py-1.5 outline-none cursor-pointer hover:bg-amber-100 transition-colors focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="rejected">Reject</option>
                              <option value="confirmed">Confirm</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold
                            ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 
                            'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10'}`}>
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                          </span>
                        )}
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ManageBookings
