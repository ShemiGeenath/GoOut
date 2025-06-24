import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    rentalType: ''
  });

  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/api/items`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setItems(data.items || data);
        setFilteredItems(data.items || data);
      } catch (err) {
        console.error('❌ Failed to fetch items:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let results = items;
    
    if (filters.search) {
      results = results.filter(item => 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }
    
    if (filters.minPrice) {
      results = results.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      results = results.filter(item => item.price <= parseFloat(filters.maxPrice));
    }
    
    if (filters.rentalType) {
      results = results.filter(item => item.rentalType === filters.rentalType);
    }
    
    setFilteredItems(results);
  }, [filters, items]);

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

  const openItemModal = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev < selectedItem.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : selectedItem.images.length - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-3">
            Adventure Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Discover gear and services for your next adventure
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
              <select
                value={filters.rentalType}
                onChange={(e) => setFilters({...filters, rentalType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="sell">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
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
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                minPrice: '',
                maxPrice: '',
                rentalType: ''
              })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => openItemModal(item)}
              >
                <div className="relative h-48 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`${backendUrl}/${item.images[0].replace(/\\/g, '/')}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-xs font-medium px-2 py-1 rounded">
                    {item.rentalType === 'rent' ? 'For Rent' : 'For Sale'}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                    Rs. {item.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">{item.category}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <FiMapPin className="mr-1" size={14} />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={closeItemModal}>
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
                          <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2">
                            {selectedItem.title}
                          </h3>
                          <button
                            onClick={closeItemModal}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            <FiX size={24} />
                          </button>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                            {selectedItem.category}
                          </span>
                          <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {selectedItem.rentalType === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </div>

                        {/* Image Gallery */}
                        <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-100" style={{ height: '350px' }}>
                          {selectedItem.images && selectedItem.images.length > 0 ? (
                            <>
                              <img
                                src={`${backendUrl}/${selectedItem.images[currentImageIndex].replace(/\\/g, '/')}`}
                                alt={selectedItem.title}
                                className="w-full h-full object-cover"
                              />
                              {selectedItem.images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      prevImage();
                                    }}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md"
                                  >
                                    <FiArrowLeft size={20} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      nextImage();
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md"
                                  >
                                    <FiArrowRight size={20} />
                                  </button>
                                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                    {selectedItem.images.map((_, index) => (
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
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <h4 className="font-bold text-lg text-gray-800 mb-3">Description</h4>
                            <p className="text-gray-600 whitespace-pre-line">
                              {selectedItem.description || 'No description provided.'}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="mb-4">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Price</h4>
                              <p className="text-2xl font-bold text-blue-600">
                                Rs. {selectedItem.price}
                              </p>
                              {selectedItem.rentalType === 'rent' && (
                                <p className="text-sm text-gray-500">per day</p>
                              )}
                            </div>

                            <div className="mb-4">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Location</h4>
                              <div className="flex items-center text-gray-600">
                                <FiMapPin className="mr-2" />
                                <span>{selectedItem.location}</span>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-bold text-lg text-gray-800 mb-2">Contact</h4>
                              <div className="space-y-2">
                                <div className="flex items-center text-gray-600">
                                  <FiPhone className="mr-2" />
                                  <span>{selectedItem.contactPhone}</span>
                                </div>
                                {selectedItem.contactEmail && (
                                  <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2" />
                                    <span>{selectedItem.contactEmail}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-2 px-4 rounded-lg font-medium shadow-md">
                              {selectedItem.rentalType === 'rent' ? 'Rent Now' : 'Buy Now'}
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

export default Items;