import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiX, FiStar, FiCalendar, FiUsers, FiGlobe } from 'react-icons/fi';

const TravelGuides = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    specialty: '',
    language: '',
    minRate: '',
    maxRate: ''
  });

  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/api/guides`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setGuides(data.guides || data);
        setFilteredGuides(data.guides || data);
      } catch (err) {
        console.error('❌ Failed to fetch guides:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuides();
  }, []);

  useEffect(() => {
    let results = guides;
    
    if (filters.search) {
      results = results.filter(guide => 
        guide.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        guide.bio.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.specialty) {
      results = results.filter(guide => guide.specialties.includes(filters.specialty));
    }
    
    if (filters.language) {
      results = results.filter(guide => guide.languages.includes(filters.language));
    }
    
    if (filters.minRate) {
      results = results.filter(guide => guide.rate >= parseFloat(filters.minRate));
    }
    
    if (filters.maxRate) {
      results = results.filter(guide => guide.rate <= parseFloat(filters.maxRate));
    }
    
    setFilteredGuides(results);
  }, [filters, guides]);

  const specialties = Array.from(new Set(guides.flatMap(guide => guide.specialties)));
  const languages = Array.from(new Set(guides.flatMap(guide => guide.languages)));

  const openGuideModal = (guide) => {
    setSelectedGuide(guide);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeGuideModal = () => {
    setSelectedGuide(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev < selectedGuide.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : selectedGuide.images.length - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-3">
            Local Travel Guides
          </h1>
          <p className="text-lg text-gray-600">
            Connect with experienced guides for your Sri Lankan adventures
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Find a guide..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Range: Rs. {filters.minRate || '0'} - Rs. {filters.maxRate || '∞'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minRate}
                  onChange={(e) => setFilters({...filters, minRate: e.target.value})}
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxRate}
                  onChange={(e) => setFilters({...filters, maxRate: e.target.value})}
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredGuides.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No guides found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Guides Grid */}
        {!isLoading && filteredGuides.length > 0 && (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGuides.map((guide) => (
              <motion.div
                key={guide._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => openGuideModal(guide)}
              >
                <div className="relative h-48 overflow-hidden">
                  {guide.images && guide.images.length > 0 ? (
                    <img
                      src={`${backendUrl}/${guide.images[0].replace(/\\/g, '/')}`}
                      alt={guide.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                      <FiUsers className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                    Rs. {guide.rate}/hour
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{guide.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {guide.specialties.slice(0, 3).map(specialty => (
                      <span key={specialty} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                    {guide.specialties.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{guide.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{guide.bio}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiGlobe className="mr-1" />
                    <span className="truncate">{guide.languages.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Guide Detail Modal */}
        <AnimatePresence>
          {selectedGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={closeGuideModal}>
                  <div className="absolute inset-0 bg-black opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-1">
                              {selectedGuide.name}
                            </h3>
                            <div className="flex items-center text-yellow-500 mb-3">
                              <FiStar className="fill-current" />
                              <FiStar className="fill-current" />
                              <FiStar className="fill-current" />
                              <FiStar className="fill-current" />
                              <FiStar className="fill-current text-gray-300" />
                              <span className="ml-2 text-gray-600 text-sm">4.8 (24 reviews)</span>
                            </div>
                          </div>
                          <button
                            onClick={closeGuideModal}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            <FiX size={24} />
                          </button>
                        </div>

                        {/* Image Gallery */}
                        <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-100" style={{ height: '350px' }}>
                          {selectedGuide.images && selectedGuide.images.length > 0 ? (
                            <>
                              <img
                                src={`${backendUrl}/${selectedGuide.images[currentImageIndex].replace(/\\/g, '/')}`}
                                alt={selectedGuide.name}
                                className="w-full h-full object-cover"
                              />
                              {selectedGuide.images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      prevImage();
                                    }}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      nextImage();
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                    {selectedGuide.images.map((_, index) => (
                                      <button
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentImageIndex(index);
                                        }}
                                        className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-blue-600' : 'bg-white bg-opacity-60'}`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FiUsers className="h-16 w-16" />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <h4 className="font-bold text-lg text-gray-800 mb-3">About {selectedGuide.name.split(' ')[0]}</h4>
                            <p className="text-gray-600 whitespace-pre-line mb-6">
                              {selectedGuide.bio}
                            </p>

                            <div className="mb-6">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Specialties</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedGuide.specialties.map(specialty => (
                                  <span key={specialty} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mb-6">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Experience</h4>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                                    <FiCalendar className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{selectedGuide.experience} years of guiding experience</p>
                                    <p className="text-sm text-gray-600">Professional local guide</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="mb-4">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Booking Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                  <FiDollarSign className="mr-2 text-blue-600" />
                                  <span className="font-medium">Rs. {selectedGuide.rate} per hour</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <FiGlobe className="mr-2 text-blue-600" />
                                  <span>Speaks: {selectedGuide.languages.join(', ')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <FiPhone className="mr-2 text-blue-600" />
                                  <span>{selectedGuide.contactPhone}</span>
                                </div>
                                {selectedGuide.contactEmail && (
                                  <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2 text-blue-600" />
                                    <span>{selectedGuide.contactEmail}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Available Destinations</h4>
                              <div className="space-y-2">
                                {selectedGuide.destinations.map((dest, index) => (
                                  <div key={index} className="flex items-center text-gray-600">
                                    <FiMapPin className="mr-2 text-blue-600" />
                                    <div>
                                      <p className="font-medium">{dest.name}</p>
                                      <p className="text-xs text-gray-500">{dest.type}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 px-4 rounded-lg font-medium shadow-md">
                              Book This Guide
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TravelGuides;