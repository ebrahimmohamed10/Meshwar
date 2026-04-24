import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const AddCar = () => {

  const {axios, currency, fetchCars} = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
    features: [''],
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...car.features];
    newFeatures[index] = value;
    setCar({ ...car, features: newFeatures });
  };

  const addFeature = () => {
    setCar({ ...car, features: [...car.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = [...car.features];
    newFeatures.splice(index, 1);
    setCar({ ...car, features: newFeatures });
  };

  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        fetchCars()
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: '',
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          description: '',
          features: [''],
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1 min-h-screen bg-[#F9FAFB] pb-12 relative'>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Car</h1>
        <p className="text-sm text-gray-500 mt-1">List a new car in your collection by providing the details below.</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={onSubmitHandler} 
        className='max-w-4xl flex flex-col gap-8'
      >

        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Car Image</h2>
          <div className='w-full'>
            <label htmlFor="car-image" className="relative cursor-pointer group block">
              {image ? (
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(image)} alt="Preview" className='w-full h-full object-cover'/>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Change Photo
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-300 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-gray-400 group-hover:text-indigo-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
              <input type="file" id="car-image" accept="image/*" required hidden onChange={e=> setImage(e.target.files[0])}/>
            </label>
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
              <input type="text" placeholder="e.g. Mercedes-Benz" required className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900' value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
              <input type="text" placeholder="e.g. E-Class AMG" required className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900' value={car.model} onChange={e=> setCar({...car, model: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <div className="relative">
                <select required onChange={e=> setCar({...car, category: e.target.value})} value={car.category} className='appearance-none w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900'>
                  <option value="" disabled>Select category</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Manufacturing Year</label>
              <input type="number" placeholder="2024" required className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900' value={car.year} onChange={e=> setCar({...car, year: e.target.value})}/>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Specifications</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Transmission</label>
              <div className="relative">
                <select required onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission} className='appearance-none w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900'>
                  <option value="" disabled>Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fuel Type</label>
              <div className="relative">
                <select required onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='appearance-none w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900'>
                  <option value="" disabled>Select fuel</option>
                  <option value="Gas">Gas</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Seats</label>
              <input type="number" placeholder="e.g. 5" required className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
            </div>
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Pricing & Location</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Daily Rate ({currency})</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">{currency}</span>
                </div>
                <input type="number" placeholder="0.00" required className='w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-gray-900 font-medium' value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <select required onChange={e=> setCar({...car, location: e.target.value})} value={car.location} className='appearance-none w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900'>
                  <option value="" disabled>Select city</option>
                  <option value="Mansoura">Mansoura</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Hurghada">Hurghada</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Sharm El-sheikh">Sharm El-sheikh</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Description & Features</h2>
          <div className='flex flex-col gap-6'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea rows={4} placeholder="Describe the car's condition, unique selling points, and any special terms..." required className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 resize-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Key Features</label>
              <div className="space-y-3">
                {car.features.map((feature, index) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={index} className='flex items-center gap-3'>
                    <input 
                      type="text" 
                      required
                      placeholder={`e.g. Apple CarPlay, Panoramic Sunroof...`} 
                      className='flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900' 
                      value={feature} 
                      onChange={e => handleFeatureChange(index, e.target.value)} 
                    />
                    {car.features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(index)} className='p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100' title="Remove feature">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              <button type="button" onClick={addFeature} className='mt-4 flex items-center gap-1.5 text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition-colors w-max bg-indigo-50 px-4 py-2 rounded-lg'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add another feature
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <button type="submit" disabled={isLoading} className={`px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-3 text-lg cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? (
              <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Listing Car...</>
            ) : (
              <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> List Car</>
            )}
          </button>
        </div>

      </motion.form>

    </div>
  )
}

export default AddCar
