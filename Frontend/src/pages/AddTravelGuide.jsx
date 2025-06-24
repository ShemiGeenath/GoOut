import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiMapPin, FiPhone, FiMail, FiCalendar, FiUsers, FiGlobe } from 'react-icons/fi';

const destinations = [
  { name: 'Sigiriya Rock Fortress', type: 'Climbing' },
  { name: 'Adam\'s Peak', type: 'Hiking' },
  { name: 'Arugam Bay', type: 'Surfing' },
  { name: 'Sinharaja Forest', type: 'Camping' },
  { name: 'Ella Rock', type: 'Hiking' },
  { name: 'Mirissa', type: 'Surfing' },
  { name: 'Knuckles Range', type: 'Trekking' },
  { name: 'Wilpattu National Park', type: 'Safari' },
  { name: 'Unawatuna Beach', type: 'Diving' },
  { name: 'Horton Plains', type: 'Hiking' }
];

const activities = [
  'Hiking', 'Climbing', 'Surfing', 'Camping', 
  'Safari', 'Diving', 'Trekking', 'Kayaking',
  'Whale Watching', 'Bird Watching', 'Cycling'
];

export default function AddTravelGuide() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialties: [],
    languages: [],
    experience: '',
    rate: '',
    contactPhone: '',
    contactEmail: '',
    availableDates: []
  });
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);

  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (activity) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(activity)
        ? prev.specialties.filter(a => a !== activity)
        : [...prev.specialties, activity]
    }));
  };

  const handleLanguageChange = (e) => {
    const { value } = e.target;
    if (value && !formData.languages.includes(value)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, value]
      }));
      e.target.value = '';
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestinations(prev =>
      prev.some(d => d.name === destination.name)
        ? prev.filter(d => d.name !== destination.name)
        : [...prev, destination]
    );
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
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append('userId', userId);
      formDataToSend.append('destinations', JSON.stringify(selectedDestinations));
      images.forEach(img => formDataToSend.append('images', img));

      const res = await fetch('http://localhost:5000/api/guides', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Failed to submit guide');

      const data = await res.json();
      
      // Show success animation
      document.getElementById('success-animation').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('success-animation').classList.add('hidden');
        // Reset form
        setFormData({
          name: '',
          bio: '',
          specialties: [],
          languages: [],
          experience: '',
          rate: '',
          contactPhone: '',
          contactEmail: '',
          availableDates: []
        });
        setSelectedDestinations([]);
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Become a Travel Guide
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {currentStep === 1 ? 'Personal Information' : 
             currentStep === 2 ? 'Guide Specialties' : 
             'Availability & Contact'}
          </p>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio*</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell travelers about yourself and your guiding experience"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience*</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How many years have you been guiding?"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  disabled={!formData.name || !formData.bio || !formData.experience}
                >
                  Next: Specialties
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Guide Specialties */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Specialties*</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {activities.map(activity => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => handleSpecialtyChange(activity)}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.specialties.includes(activity)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages You Speak*</label>
                <div className="flex">
                  <input
                    type="text"
                    onKeyDown={(e) => e.key === 'Enter' && handleLanguageChange(e)}
                    placeholder="Add a language and press Enter"
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleLanguageChange({ target: { value: e.target.previousElementSibling.value } })}
                    className="bg-blue-600 text-white px-4 rounded-r-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.languages.map(language => (
                    <div key={language} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinations You Guide*</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {destinations.map(destination => (
                    <button
                      key={destination.name}
                      type="button"
                      onClick={() => handleDestinationSelect(destination)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedDestinations.some(d => d.name === destination.name)
                          ? 'bg-teal-100 border-teal-500 text-teal-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-medium">{destination.name}</div>
                      <div className="text-xs text-gray-500">{destination.type}</div>
                    </button>
                  ))}
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
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  disabled={formData.specialties.length === 0 || formData.languages.length === 0 || selectedDestinations.length === 0}
                >
                  Next: Availability
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Availability & Contact */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (Rs.)*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your hourly rate"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo Previews</label>
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
                    placeholder="Phone number for bookings"
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
                    placeholder="Email for bookings (optional)"
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
                  disabled={isSubmitting || !formData.rate || !formData.contactPhone}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Complete Profile'
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">Guide Profile Created!</h3>
          <p className="text-gray-600 mb-4">
            Travelers can now discover and book your guiding services.
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