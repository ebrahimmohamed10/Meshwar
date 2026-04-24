import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const MyAccount = () => {

    const { user, axios, fetchUser } = useAppContext()
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [idCardFront, setIdCardFront] = useState(false)
    const [idCardBack, setIdCardBack] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        gender: '',
        dob: '',
        nationality: '',
        idNumber: '',
        emergencyContact: '',
        job: '',
        licenseNumber: '',
        licenseExpiry: '',
        city: '',
        zipCode: '',
        country: ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                gender: user.gender || 'Not Selected',
                dob: user.dob || '',
                nationality: user.nationality || '',
                idNumber: user.idNumber || '',
                emergencyContact: user.emergencyContact || '',
                job: user.job || '',
                licenseNumber: user.licenseNumber || '',
                licenseExpiry: user.licenseExpiry || '',
                city: user.city || '',
                zipCode: user.zipCode || '',
                country: user.country || ''
            })
        }
    }, [user])

    const updateProfileData = async () => {
        try {
            const formDataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSubmit.append(key, formData[key]);
            });

            if (image) formDataToSubmit.append('image', image);
            if (idCardFront) formDataToSubmit.append('idCardFront', idCardFront);
            if (idCardBack) formDataToSubmit.append('idCardBack', idCardBack);

            const { data } = await axios.put('/api/user/update-profile', formDataToSubmit);

            if (data.success) {
                toast.success(data.message);
                await fetchUser();
                setIsEdit(false);
                setImage(false);
                setIdCardFront(false);
                setIdCardBack(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (!user) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center'>
                <p className='text-gray-400'>Loading your profile...</p>
            </div>
        )
    }

    return (
        <div className='max-w-5xl mx-auto px-6 py-12 md:py-16'>
            
            {/* Page Header */}
            <div className='mb-12 text-center md:text-left'>
                <h1 className='text-3xl font-bold text-gray-900'>My Account</h1>
                <p className='text-gray-500 mt-1 font-medium'>View and manage your personal identity details.</p>
            </div>

            {/* Profile Hero Card */}
            <div className='bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden mb-10'>
                <div className='p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-12'>
                    
                    {/* Artistic Profile Image Container */}
                    <div className='relative'>
                        <div className='w-40 h-40 rounded-full p-1 border-2 border-primary/20 bg-white shadow-xl relative overflow-hidden'>
                            <img src={image ? URL.createObjectURL(image) : user.image || assets.user_profile} alt="" className='w-full h-full object-cover rounded-full' />
                        </div>
                        {isEdit && (
                            <label htmlFor='image' className='absolute bottom-1 right-1 p-3 bg-gray-900 text-white rounded-full cursor-pointer shadow-2xl border-4 border-white hover:bg-primary transition-all scale-95 hover:scale-100 z-10'>
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
                            </label>
                        )}
                    </div>

                    {/* Profile Details Area */}
                    <div className='flex-1 text-center md:text-left flex flex-col justify-center h-40 space-y-4'>
                        <div className='space-y-1'>
                            <h2 className='text-4xl font-black text-gray-900 tracking-tight'>{user.name}</h2>
                            <p className='text-gray-400 font-bold text-xl'>{user.email}</p>
                        </div>
                        
                        <div className='flex flex-wrap justify-center md:justify-start items-center gap-4 pt-2'>
                            <div className='flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest'>
                                <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                                {user.role}
                            </div>
                            <div className='h-4 w-[1px] bg-gray-200 hidden md:block' />
                            <div className='text-[11px] font-black text-primary uppercase tracking-[0.2em]'>
                                Wallet Balance: {user.wallet?.toLocaleString()} EGP
                            </div>
                        </div>
                    </div>
                </div>

                <div className='px-10 md:px-14 pb-14 pt-2'>
                    
                    {/* Information Sections */}
                    <div className='space-y-14'>
                        
                        {/* Information Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
                            <CleanField label="Full Name" value={user.name} name="name" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="Email Address" value={user.email} name="email" isEdit={false} formData={formData} setFormData={setFormData} />
                            <CleanField label="Phone Number" value={user.phone} name="phone" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="National ID / Passport" value={user.idNumber} name="idNumber" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="Driving License" value={user.licenseNumber} name="licenseNumber" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="Job Title" value={user.job} name="job" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="Nationality" value={user.nationality} name="nationality" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="Gender" value={user.gender} name="gender" isEdit={isEdit} formData={formData} setFormData={setFormData} options={['Not Selected', 'Male', 'Female']} />
                            <CleanField label="Date of Birth" value={user.dob} name="dob" isEdit={isEdit} formData={formData} setFormData={setFormData} type="date" />
                            <CleanField label="License Expiry" value={user.licenseExpiry} name="licenseExpiry" isEdit={isEdit} formData={formData} setFormData={setFormData} type="date" />
                            <CleanField label="Emergency Contact" value={user.emergencyContact} name="emergencyContact" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <CleanField label="Country" value={user.country} name="country" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            <div className='grid grid-cols-2 gap-4'>
                                <CleanField label="City" value={user.city} name="city" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                                <CleanField label="Zip Code" value={user.zipCode} name="zipCode" isEdit={isEdit} formData={formData} setFormData={setFormData} />
                            </div>
                            <div className='md:col-span-2'>
                                <CleanField label="Residential Address" value={user.address} name="address" isEdit={isEdit} formData={formData} setFormData={setFormData} type="textarea" />
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className='pt-12 border-t border-gray-100'>
                            <h3 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10'>Verification Assets</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                <CleanDoc label="ID Front Side" id="idFront" image={idCardFront} setImage={setIdCardFront} current={user.idCardFront} isEdit={isEdit} />
                                <CleanDoc label="ID Back Side" id="idBack" image={idCardBack} setImage={setIdCardBack} current={user.idCardBack} isEdit={isEdit} />
                            </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className='pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-end items-center gap-4'>
                            {isEdit ? (
                                <>
                                    <button onClick={() => setIsEdit(false)} className='text-sm font-semibold text-gray-500 hover:text-gray-800 px-6 py-2 transition-all'>
                                        Cancel
                                    </button>
                                    <button onClick={updateProfileData} className='w-full md:w-auto px-12 py-3.5 bg-primary text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 shadow-lg transition-all'>
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEdit(true)} className='w-full md:w-auto px-12 py-3.5 bg-gray-900 text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black shadow-md transition-all'>
                                    Edit Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const CleanField = ({ label, value, name, isEdit, formData, setFormData, type = "text", options = null }) => (
    <div className='space-y-2'>
        <label className='text-xs font-bold text-gray-400 uppercase tracking-wide ml-1'>{label}</label>
        <div className={`transition-all duration-200 ${isEdit ? 'bg-gray-50 border border-gray-300 rounded-xl' : 'bg-transparent border-transparent'}`}>
            {isEdit ? (
                options ? (
                    <select value={formData[name]} onChange={e => setFormData(p => ({...p, [name]: e.target.value}))} className='w-full px-4 py-3 bg-transparent text-[15px] font-medium text-gray-800 outline-none cursor-pointer'>{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                ) : type === "textarea" ? (
                    <textarea value={formData[name]} onChange={e => setFormData(p => ({...p, [name]: e.target.value}))} rows={2} className='w-full px-4 py-3 bg-transparent text-[15px] font-medium text-gray-800 outline-none resize-none' />
                ) : (
                    <input type={type} value={formData[name]} onChange={e => setFormData(p => ({...p, [name]: e.target.value}))} className='w-full px-4 py-3 bg-transparent text-[15px] font-medium text-gray-800 outline-none' />
                )
            ) : (
                <div className='px-4 py-1'>
                    <p className='text-[15px] font-semibold text-gray-900 tracking-tight'>{value || <span className='text-gray-300 font-normal italic'>Not provided</span>}</p>
                </div>
            )}
        </div>
    </div>
)

const CleanDoc = ({ label, id, image, setImage, current, isEdit }) => (
    <div className='space-y-4'>
        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>{label}</label>
        <div className='relative h-64 rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center transition-all group'>
            {image ? (
                <img src={URL.createObjectURL(image)} alt="" className='w-full h-full object-cover' />
            ) : current ? (
                <img src={current} alt="" className='w-full h-full object-cover' />
            ) : (
                <div className='text-center text-gray-300 opacity-50'>
                    <svg className='mx-auto mb-2' width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p className='text-[9px] font-black uppercase tracking-widest'>Source Required</p>
                </div>
            )}
            {isEdit && (
                <label htmlFor={id} className='absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center justify-center backdrop-blur-sm'>
                    <div className='bg-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl'>Update Asset</div>
                    <input onChange={e => setImage(e.target.files[0])} type="file" id={id} hidden />
                </label>
            )}
        </div>
    </div>
)

export default MyAccount
