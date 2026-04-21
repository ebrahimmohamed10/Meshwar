import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const {isOwner, axios, currency, fetchCars} = useAppContext()

  const [cars, setCars] = useState([])
  
  // Edit State
  const [editingCar, setEditingCar] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOwnerCars = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId)=>{
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()   // refresh dashboard table
        fetchCars()        // refresh global public cars list
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId)=>{
    try {

      const confirm = window.confirm('Are you sure you want to delete this car?')

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()   // refresh dashboard table
        fetchCars()        // refresh global public cars list
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openEditModal = (car) => {
    setEditingCar(car);
    setEditForm({
      _id: car._id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      pricePerDay: car.pricePerDay,
      category: car.category,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      seating_capacity: car.seating_capacity,
      location: car.location,
      description: car.description,
    });
    setImageFile(null);
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      formData.append('carData', JSON.stringify(editForm));

      const { data } = await axios.post('/api/owner/update-car', formData);
      if (data.success) {
        toast.success(data.message);
        setEditingCar(null);
        fetchOwnerCars();
        fetchCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(()=>{
    isOwner && fetchOwnerCars()
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full relative'>
      
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform."/>

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500 bg-gray-50 border-b border-borderColor'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index)=>(
              <tr key={index} className='border-b border-borderColor hover:bg-gray-50/50 transition-colors'>

                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt="" className="h-12 w-12 aspect-square rounded-md object-cover"/>
                  <div className='max-md:hidden'>
                    <p className='font-medium text-gray-900'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-500'>{car.seating_capacity} Seats • {car.transmission}</p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3 font-medium'>{car.pricePerDay} EGP/day</td>
                <td className='p-3 max-md:hidden'>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${car.isAvaliable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {car.isAvaliable ? "Available" : "Unavailable" }
                  </span>
                </td>

                <td className='flex items-center gap-4 p-3'>
                  <img 
                    onClick={()=> toggleAvailability(car._id)} 
                    src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} 
                    alt="Toggle" 
                    className='cursor-pointer hover:scale-110 transition-transform'
                    title={car.isAvaliable ? "Make Unavailable" : "Make Available"}
                  />
                  
                  <img 
                    onClick={()=> openEditModal(car)} 
                    src={assets.edit_icon} 
                    alt="Edit" 
                    className='cursor-pointer hover:scale-110 transition-transform brightness-0'
                    title="Edit Car"
                  />

                  <img 
                    onClick={()=> deleteCar(car._id)} 
                    src={assets.delete_icon} 
                    alt="Delete" 
                    className='cursor-pointer hover:scale-110 transition-transform'
                    title="Delete Car"
                  />
                </td>

              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No cars found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">Edit {editingCar.brand} {editingCar.model}</h2>
              <button onClick={() => setEditingCar(null)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-5 text-sm text-gray-600">
              
              {/* Image */}
              <div className='flex items-center gap-4 w-full'>
                <label htmlFor="edit-car-image" className="relative cursor-pointer group">
                  <img src={imageFile ? URL.createObjectURL(imageFile) : editingCar.image} alt="" className='h-20 w-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-80 transition-opacity'/>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span className="text-white text-xs font-semibold">Change</span>
                  </div>
                  <input type="file" id="edit-car-image" accept="image/*" hidden onChange={e=> setImageFile(e.target.files[0])}/>
                </label>
                <div className="text-xs text-gray-400">
                  <p className="font-medium text-gray-600">Update car image</p>
                  <p>Leave empty to keep existing image</p>
                </div>
              </div>

              {/* Brand & Model */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Brand</label>
                  <input type="text" required className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all' value={editForm.brand} onChange={e=> setEditForm({...editForm, brand: e.target.value})}/>
                </div>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Model</label>
                  <input type="text" required className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all' value={editForm.model} onChange={e=> setEditForm({...editForm, model: e.target.value})}/>
                </div>
              </div>

              {/* Year, Price, Category */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Year</label>
                  <input type="number" required className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all' value={editForm.year} onChange={e=> setEditForm({...editForm, year: e.target.value})}/>
                </div>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Price ({currency}/day)</label>
                  <input type="number" required className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all' value={editForm.pricePerDay} onChange={e=> setEditForm({...editForm, pricePerDay: e.target.value})}/>
                </div>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Category</label>
                  <select value={editForm.category} onChange={e=> setEditForm({...editForm, category: e.target.value})} className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
              </div>

              {/* Trans, Fuel, Seats */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Transmission</label>
                  <select value={editForm.transmission} onChange={e=> setEditForm({...editForm, transmission: e.target.value})} className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Fuel Type</label>
                  <select value={editForm.fuel_type} onChange={e=> setEditForm({...editForm, fuel_type: e.target.value})} className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'>
                    <option value="Gas">Gas</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className='flex flex-col'>
                  <label className="font-medium mb-1">Seats</label>
                  <input type="number" required className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all' value={editForm.seating_capacity} onChange={e=> setEditForm({...editForm, seating_capacity: e.target.value})}/>
                </div>
              </div>

              {/* Location */}
              <div className='flex flex-col'>
                <label className="font-medium mb-1">Location</label>
                <select value={editForm.location} onChange={e=> setEditForm({...editForm, location: e.target.value})} className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'>
                  <option value="Mansoura">Mansoura</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Hurghada">Hurghada</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Sharm El-sheikh">Sharm El-sheikh</option>
                </select>
              </div>

              {/* Description */}
              <div className='flex flex-col'>
                <label className="font-medium mb-1">Description</label>
                <textarea rows={3} required className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none' value={editForm.description} onChange={e=> setEditForm({...editForm, description: e.target.value})}></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingCar(null)} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className={`px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageCars
