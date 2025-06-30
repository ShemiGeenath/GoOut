import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  FiHome, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiStar, 
  FiWifi, 
  FiCoffee, 
  FiDroplet, 
  FiTv, 
  
  FiWind,
  FiPlus,
  FiX,
  FiUpload,
  
  FiCheck
} from 'react-icons/fi';
import { FaParking } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const propertyTypes = [
  { value: 'hotel', label: 'Hotel', icon: <FiHome /> },
  { value: 'apartment', label: 'Apartment', icon: <FiHome /> },
  { value: 'resort', label: 'Resort', icon: <FiHome /> },
  { value: 'villa', label: 'Villa', icon: <FiHome /> },
  { value: 'hostel', label: 'Hostel', icon: <FiHome /> },
  { value: 'guesthouse', label: 'Guest House', icon: <FiHome /> },
  { value: 'restaurant', label: 'Restaurant', icon: <FiCoffee /> },
  { value: 'cafe', label: 'Café', icon: <FiCoffee /> },
];

const amenities = [
  { id: 'wifi', label: 'Free WiFi', icon: <FiWifi /> },
  { id: 'breakfast', label: 'Breakfast', icon: <FiCoffee /> },
  { id: 'pool', label: 'Swimming Pool', icon: <FiDroplet /> },
  { id: 'tv', label: 'TV', icon: <FiTv /> },
  { id: 'parking', label: 'Parking', icon: <FaParking  /> },
  { id: 'ac', label: 'Air Conditioning', icon: <FiWind /> },
  { id: 'restaurant', label: 'Restaurant', icon: <FiCoffee /> },
  { id: 'bar', label: 'Bar', icon: <FiCoffee /> },
  { id: 'gym', label: 'Gym', icon: <FiHome /> },
  { id: 'spa', label: 'Spa', icon: <FiHome /> },
  { id: 'pets', label: 'Pets Allowed', icon: <FiHome /> },
];

const roomTypes = [
  'Standard Room',
  'Deluxe Room',
  'Suite',
  'Family Room',
  'Executive Room',
  'Presidential Suite',
  'Dormitory Bed',
  'Private Room'
];

export default function AddHotel() {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    description: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    stars: 3,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    priceRange: '$$',
    hasRestaurant: false,
    hasPool: false,
    amenities: [],
    rooms: []
  });

  const [currentRoom, setCurrentRoom] = useState({
    type: '',
    price: '',
    capacity: 2,
    quantity: 1,
    description: ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom(prev => ({ ...prev, [name]: value }));
  };

  const addRoom = () => {
    if (currentRoom.type && currentRoom.price) {
      setFormData(prev => ({
        ...prev,
        rooms: [...prev.rooms, currentRoom]
      }));
      setCurrentRoom({
        type: '',
        price: '',
        capacity: 2,
        quantity: 1,
        description: ''
      });
    }
  };

  const removeRoom = (index) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenityId)) {
        return { ...prev, amenities: prev.amenities.filter(id => id !== amenityId) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenityId] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'rooms') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'amenities') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
      images.forEach(img => formDataToSend.append('images', img));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/listings');
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-10 px-4">
      {/* Main Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <h1 className="text-3xl font-bold">List Your Property</h1>
          <p className="opacity-90">Reach travelers looking for unique stays and dining</p>
          
          {/* Progress Steps */}
          <div className="flex justify-between mt-6 relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-white bg-opacity-30 z-0">
              <motion.div 
                className="h-full bg-white bg-opacity-90"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep-1)*25}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-white text-blue-600' : 'bg-white bg-opacity-30'} font-bold`}>
                  {currentStep > step ? <FiCheck /> : step}
                </div>
                <span className="text-xs mt-2 opacity-90">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : step === 3 ? 'Rooms' : 'Photos'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Success Animation */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-500 bg-opacity-90 flex flex-col items-center justify-center z-50 rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="bg-white rounded-full p-6 mb-4"
              >
                <FiCheck className="text-6xl text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
              <p className="text-white text-lg">Your property has been listed</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Property Name*</label>
                    <input
                      type="text"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Sunset Beach Resort"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Property Type*</label>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyTypes.map((type) => (
                        <motion.label 
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                            formData.propertyType === type.value 
                              ? 'bg-blue-100 border-blue-500 text-blue-700' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="propertyType"
                            value={type.value}
                            checked={formData.propertyType === type.value}
                            onChange={handleChange}
                            className="sr-only"
                            required
                          />
                          <span className="text-blue-500">{type.icon}</span>
                          <span className="text-sm">{type.label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Location*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="City or exact address"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Star Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFormData(prev => ({ ...prev, stars: star }))}
                          className={`text-2xl ${star <= formData.stars ? 'text-amber-400' : 'text-gray-300'}`}
                        >
                          <FiStar />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your property (facilities, unique features, atmosphere...)"
                  />
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    Next: Property Details
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Check-in Time</label>
                    <input
                      type="time"
                      name="checkInTime"
                      value={formData.checkInTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Check-out Time</label>
                    <input
                      type="time"
                      name="checkOutTime"
                      value={formData.checkOutTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Price Range</label>
                    <select
                      name="priceRange"
                      value={formData.priceRange}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="$">$ Budget</option>
                      <option value="$$">$$ Mid-range</option>
                      <option value="$$$">$$$ Luxury</option>
                      <option value="$$$$">$$$$ Premium</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {amenities.map(amenity => (
                      <motion.label
                        key={amenity.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                          formData.amenities.includes(amenity.id)
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={() => toggleAmenity(amenity.id)}
                          className="sr-only"
                        />
                        <span className="text-blue-500">{amenity.icon}</span>
                        <span className="text-sm">{amenity.label}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    Next: Rooms & Rates
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800">Rooms & Rates</h2>
                <p className="text-gray-600">Add the different room types available at your property</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Room Type*</label>
                    <select
                      name="type"
                      value={currentRoom.type}
                      onChange={handleRoomChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select room type</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Price Per Night*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={currentRoom.price}
                        onChange={handleRoomChange}
                        className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Capacity (Adults)*</label>
                    <input
                      type="number"
                      name="capacity"
                      value={currentRoom.capacity}
                      onChange={handleRoomChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Quantity Available*</label>
                    <input
                      type="number"
                      name="quantity"
                      value={currentRoom.quantity}
                      onChange={handleRoomChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Room Description</label>
                  <textarea
                    name="description"
                    value={currentRoom.description}
                    onChange={handleRoomChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe this room type (size, bed configuration, view...)"
                  />
                </div>
                
                <motion.button
                  type="button"
                  onClick={addRoom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!currentRoom.type || !currentRoom.price}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <FiPlus /> Add Room Type
                </motion.button>
                
                {formData.rooms.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Added Room Types</h3>
                    <div className="space-y-2">
                      {formData.rooms.map((room, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div>
                            <h4 className="font-medium">{room.type}</h4>
                            <p className="text-sm text-gray-600">${room.price} per night · {room.capacity} adults · {room.quantity} available</p>
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => removeRoom(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 p-1"
                          >
                            <FiX />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
                    disabled={formData.rooms.length === 0}
                  >
                    Next: Photos
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800">Property Photos</h2>
                <p className="text-gray-600">Upload high-quality photos to showcase your property (max 10)</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                >
                  <FiUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                  <p className="text-gray-600">Click to upload photos or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">JPEG, PNG (max 5MB each)</p>
                </div>
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewImages.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group h-40"
                      >
                        <img 
                          src={img} 
                          alt={`Preview ${index}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <motion.button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          whileHover={{ scale: 1.1 }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                        >
                          <FiX className="text-sm" />
                        </motion.button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main Photo
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
                    disabled={isSubmitting || previewImages.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck /> Complete Listing
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
      
      {/* Tips Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-5xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiStar className="text-amber-400" /> Tips for a Great Listing
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Use high-quality, well-lit photos that showcase your property's best features
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Include photos of all important areas (rooms, amenities, exterior)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Be accurate with room descriptions and pricing
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Highlight unique amenities or services you offer
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Set competitive prices - research similar listings in your area
          </li>
        </ul>
      </motion.div>
    </div>
  );
}