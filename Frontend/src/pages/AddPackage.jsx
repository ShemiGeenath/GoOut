import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGlobe, 
  FiMap, 
  FiCalendar, 
  FiDollarSign, 
  FiUsers,
  FiHome,
  FiCoffee,
  FiCamera,
  FiSun,
  FiUmbrella,
  FiPlus,
  FiX,
  FiUpload,
  FiCheck,
  FiStar,
  FiCompass
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const packageTypes = [
  { value: 'adventure', label: 'Adventure', icon: <FiCompass />, color: 'from-green-500 to-emerald-500' },
  { value: 'beach', label: 'Beach Vacation', icon: <FiSun />, color: 'from-amber-500 to-orange-500' },
  { value: 'cultural', label: 'Cultural Tour', icon: <FiHome />, color: 'from-purple-500 to-pink-500' },
  { value: 'honeymoon', label: 'Honeymoon', icon: <FiStar />, color: 'from-rose-500 to-red-500' },
  { value: 'family', label: 'Family Package', icon: <FiUsers />, color: 'from-blue-500 to-cyan-500' },
  { value: 'luxury', label: 'Luxury Escape', icon: <FiStar />, color: 'from-yellow-500 to-amber-500' },
  { value: 'cruise', label: 'Cruise', icon: <FiUmbrella />, color: 'from-indigo-500 to-violet-500' },
  { value: 'photography', label: 'Photography Tour', icon: <FiCamera />, color: 'from-fuchsia-500 to-purple-500' },
];

const activities = [
  'Hiking', 'Scuba Diving', 'Safari', 'City Tour', 'Cooking Class',
  'Yoga Retreat', 'Wine Tasting', 'Wildlife Watching', 'Historical Sites',
  'Shopping Tour', 'Cycling', 'Surfing', 'Skiing', 'Hot Air Balloon'
];

const includedOptions = [
  'Accommodation', 'Flights', 'Transfers', 'Meals', 'Guide',
  'Entrance Fees', 'Travel Insurance', 'Visa Assistance', 'Sightseeing',
  'Activities', 'Airport Taxes', 'Local Transportation'
];

export default function AddPackage() {
  const [formData, setFormData] = useState({
    packageName: '',
    packageType: '',
    destination: '',
    duration: '',
    price: '',
    groupSize: '',
    overview: '',
    itinerary: '',
    departureDates: [],
    included: [],
    activities: [],
    highlights: '',
    terms: ''
  });

  const [currentDepartureDate, setCurrentDepartureDate] = useState('');
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

  const addDepartureDate = () => {
    if (currentDepartureDate) {
      setFormData(prev => ({
        ...prev,
        departureDates: [...prev.departureDates, currentDepartureDate]
      }));
      setCurrentDepartureDate('');
    }
  };

  const removeDepartureDate = (index) => {
    setFormData(prev => ({
      ...prev,
      departureDates: prev.departureDates.filter((_, i) => i !== index)
    }));
  };

  const toggleIncluded = (item) => {
    setFormData(prev => {
      if (prev.included.includes(item)) {
        return { ...prev, included: prev.included.filter(i => i !== item) };
      } else {
        return { ...prev, included: [...prev.included, item] };
      }
    });
  };

  const toggleActivity = (activity) => {
    setFormData(prev => {
      if (prev.activities.includes(activity)) {
        return { ...prev, activities: prev.activities.filter(a => a !== activity) };
      } else {
        return { ...prev, activities: [...prev.activities, activity] };
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
        if (Array.isArray(value)) {
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
        navigate('/admin/packages');
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
          <h1 className="text-3xl font-bold">Create Travel Package</h1>
          <p className="opacity-90">Design amazing travel experiences for your customers</p>
          
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
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Media'}
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
              <h2 className="text-3xl font-bold text-white mb-2">Package Created!</h2>
              <p className="text-white text-lg">Your new travel package is now live</p>
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
                <h2 className="text-xl font-semibold text-gray-800">Package Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Package Name*</label>
                    <input
                      type="text"
                      name="packageName"
                      value={formData.packageName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Bali Adventure Getaway"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Package Type*</label>
                    <div className="grid grid-cols-2 gap-2">
                      {packageTypes.map((type) => (
                        <motion.label 
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r ${type.color} text-white cursor-pointer shadow-md`}
                        >
                          <input
                            type="radio"
                            name="packageType"
                            value={type.value}
                            checked={formData.packageType === type.value}
                            onChange={handleChange}
                            className="sr-only"
                            required
                          />
                          <span className="text-white">{type.icon}</span>
                          <span className="text-sm">{type.label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Destination*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMap className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Country/City/Region"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Duration (Days/Nights)*</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 7 Days / 6 Nights"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Price (per person)*</label>
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
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Group Size*</label>
                    <input
                      type="text"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 2-12 people"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Package Overview*</label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the package highlights"
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
                    Next: Package Details
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
                <h2 className="text-xl font-semibold text-gray-800">Package Details</h2>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Departure Dates</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={currentDepartureDate}
                      onChange={(e) => setCurrentDepartureDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <motion.button
                      type="button"
                      onClick={addDepartureDate}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-1"
                    >
                      <FiPlus /> Add Date
                    </motion.button>
                  </div>
                  {formData.departureDates.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.departureDates.map((date, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {new Date(date).toLocaleDateString()}
                          <motion.button
                            type="button"
                            onClick={() => removeDepartureDate(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500"
                          >
                            <FiX size={14} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">What's Included</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {includedOptions.map(item => (
                      <motion.label
                        key={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                          formData.included.includes(item)
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.included.includes(item)}
                          onChange={() => toggleIncluded(item)}
                          className="sr-only"
                        />
                        <span className="text-sm">{item}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Activities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {activities.map(activity => (
                      <motion.label
                        key={activity}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                          formData.activities.includes(activity)
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.activities.includes(activity)}
                          onChange={() => toggleActivity(activity)}
                          className="sr-only"
                        />
                        <span className="text-sm">{activity}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Detailed Itinerary*</label>
                  <textarea
                    name="itinerary"
                    value={formData.itinerary}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Day-by-day breakdown of activities, meals, accommodations..."
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Package Highlights</label>
                  <textarea
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Key selling points of this package (bullet points work well)"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
                  <textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cancellation policy, requirements, restrictions..."
                  />
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
                    Next: Photos & Media
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
                <h2 className="text-xl font-semibold text-gray-800">Package Media</h2>
                <p className="text-gray-600">Upload high-quality photos to showcase your package (max 10)</p>
                
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
                            Featured Image
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
                        Creating Package...
                      </>
                    ) : (
                      <>
                        <FiCheck /> Publish Package
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
          <FiStar className="text-amber-400" /> Tips for Creating Great Packages
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Use high-quality images that showcase the destination and activities
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Be detailed in your itinerary - travelers want to know exactly what to expect
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Highlight unique experiences that set your package apart
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Be clear about what's included and any additional costs
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span> Offer multiple departure dates if possible
          </li>
        </ul>
      </motion.div>
    </div>
  );
}