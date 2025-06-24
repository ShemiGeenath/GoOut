import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiMapPin, FiPhone, FiMail, FiCompass, FiUser, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Camping Gear',
  'Vehicles',
  'Accessories',
  'Adventure Services',
  'Campsite Rentals',
  'Travel Packages',
  'Photography/Drones',
  'Local Guides & Drivers',
  'Water Adventures',
  'Second-Hand Items',
  'Eco-Friendly Essentials',
  'Travel Buddy Finder'
];

export default function AddItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    rentalType: 'sell' // 'sell' or 'rent'
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append('userId', userId);
      images.forEach(img => formDataToSend.append('images', img));

      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Failed to submit item');

      const data = await res.json();
      
      // Show success animation
      document.getElementById('success-animation').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('success-animation').classList.add('hidden');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          location: '',
          contactPhone: '',
          contactEmail: '',
          rentalType: 'sell'
        });
        setImages([]);
        setPreviewImages([]);
        setCurrentStep(1);
      }, 3000);

    } catch (err) {
      console.error('[❌ Submit Error]', err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-10 px-4">
      {/* Navigation Buttons for Other Add Pages */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/AddTravelGuide')}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
        >
          <FiUser className="text-lg" />
          Add Travel Guide
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/AddDestination')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
        >
          <FiCompass className="text-lg" />
          Add Destination
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                {formData.rentalType === 'sell' ? 'Sell Your Adventure Gear' : 'Rent Out Your Equipment'}
              </h1>
              <p className="text-gray-600">
                {currentStep === 1 ? 'Basic Information' : 
                 currentStep === 2 ? 'Details & Media' : 
                 'Contact & Location'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/AddItem')}
              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              <FiPlus size={16} />
              New Listing
            </button>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rentalType: 'sell' }))}
                    className={`flex-1 py-2 px-4 font-medium ${formData.rentalType === 'sell' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Sell Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rentalType: 'rent' }))}
                    className={`flex-1 py-2 px-4 font-medium ${formData.rentalType === 'rent' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Rent Out
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Premium Camping Tent, Jeep Rental, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell adventurers about your item (features, condition, special notes)"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  disabled={!formData.title || !formData.category || !formData.description}
                >
                  Next: Details
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details & Media */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.rentalType === 'sell' ? 'Price (Rs.)*' : 'Daily Rental Price (Rs.)*'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images*</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/*"
                />
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    previewImages.length > 0 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <FiUpload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop images here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Upload up to 5 photos (JPEG, PNG, WEBP). Max 5MB each.
                  </p>
                </div>
              </div>

              {previewImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Previews</label>
                  <div className="grid grid-cols-3 gap-3">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center rounded-b-lg">
                          {index === 0 && 'Main'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  disabled={!formData.price || previewImages.length === 0}
                >
                  Next: Contact
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact & Location */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Where is this item located? (City, Area)"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone number for inquiries"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email for inquiries (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-2 rounded-lg font-medium shadow-md"
                  disabled={isSubmitting || !formData.location || !formData.contactPhone}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    'Publish Listing'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* Success Animation */}
      <div
        id="success-animation"
        className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Listing Published!</h3>
          <p className="text-gray-600 mb-4">
            Your {formData.rentalType === 'sell' ? 'item is now for sale' : 'equipment is now available for rent'}.
          </p>
          <div className="animate-bounce mt-4">
            <svg className="w-8 h-8 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}