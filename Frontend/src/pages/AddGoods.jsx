import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiMapPin, FiPhone, FiMail, FiCompass, FiUser, FiPlus, FiX, FiCheck, FiDollarSign } from 'react-icons/fi';
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

const rentalOptions = [
  { value: 'sell', label: 'Sell Item' },
  { value: 'rent-hourly', label: 'Rent Hourly' },
  { value: 'rent-daily', label: 'Rent Daily' },
  { value: 'rent-weekly', label: 'Rent Weekly' }
];

export default function AddGoods() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    rentalType: 'sell'
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
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
     
      
      {/* Main Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <h1 className="text-3xl font-bold">List Your Adventure Gear</h1>
          <p className="opacity-90">Share your items with fellow adventurers</p>
          
          {/* Progress Steps */}
          <div className="flex justify-between mt-6 relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-white bg-opacity-30 z-0">
              <motion.div 
                className="h-full bg-white bg-opacity-90"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep-1)*33}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-white text-blue-600' : 'bg-white bg-opacity-30'} font-bold`}>
                  {currentStep > step ? <FiCheck /> : step}
                </div>
                <span className="text-xs mt-2 opacity-90">
                  {step === 1 ? 'Item Details' : step === 2 ? 'Images' : 'Contact Info'}
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
              <p className="text-white text-lg">Your item has been listed</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white opacity-80 mt-4"
              >
                Redirecting in 3 seconds...
              </motion.p>
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
                <h2 className="text-xl font-semibold text-gray-800">Tell us about your item</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Item Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Premium Camping Tent"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Category*</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Transaction Type*</label>
                    <div className="grid grid-cols-2 gap-2">
                      {rentalOptions.map(option => (
                        <motion.label 
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-colors ${
                            formData.rentalType === option.value 
                              ? 'bg-blue-100 border-blue-500 text-blue-700' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="rentalType"
                            value={option.value}
                            checked={formData.rentalType === option.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-sm">{option.label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Price*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-500" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
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
                    placeholder="Describe your item in detail (features, condition, specifications...)"
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
                    Next: Add Photos
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
                <h2 className="text-xl font-semibold text-gray-800">Add Photos (Max 5)</h2>
                <p className="text-gray-600">High-quality photos help your item stand out</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                
                <div 
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                >
                  <FiUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                  <p className="text-gray-600">Drag & drop photos here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">JPEG, PNG (max 5MB each)</p>
                </div>
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {previewImages.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img 
                          src={img} 
                          alt={`Preview ${index}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <motion.button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          whileHover={{ scale: 1.1 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                        >
                          <FiX className="text-sm" />
                        </motion.button>
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
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
                    disabled={previewImages.length === 0}
                  >
                    Next: Contact Info
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
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                <p className="text-gray-600">How should interested adventurers reach you?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiMapPin /> Location*
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City or specific location"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional but recommended"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiMail /> Email Address*
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your email for inquiries"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
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
                    disabled={isSubmitting}
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
                        <FiCheck /> List My Item
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
        className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for a Great Listing</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Use clear, well-lit photos from multiple angles
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Be honest about the condition of your item
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Include specific details (brand, size, model, etc.)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Set a competitive price - check similar listings
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Respond quickly to inquiries for better results
          </li>
        </ul>
      </motion.div>
    </div>
  );
}