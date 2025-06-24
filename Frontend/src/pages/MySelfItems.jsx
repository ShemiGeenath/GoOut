import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiDollarSign, FiTrendingUp, FiPackage } from 'react-icons/fi';

const MySelfItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const backendUrl = 'http://localhost:5000';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/api/items/user/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        setItems(data.items || data);
      } catch (err) {
        console.error('❌ Failed to fetch items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchItems();
    }
  }, [userId]);

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.rentalType === activeTab);

  const calculateStats = () => {
    const totalItems = items.length;
    const forSale = items.filter(item => item.rentalType === 'sell').length;
    const forRent = items.filter(item => item.rentalType === 'rent').length;
    const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
    
    return { totalItems, forSale, forRent, totalValue };
  };

  const { totalItems, forSale, forRent, totalValue } = calculateStats();

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`${backendUrl}/api/items/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete item');
      
      setItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('❌ Failed to delete item:', err);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
            My Adventure Listings
          </h1>
          <p className="text-gray-600">Manage your shared adventure gear and services</p>
        </div>

        {!userId ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Please log in to view your listings</h3>
            <p className="mt-2 text-gray-500">Your shared items will appear here once you're logged in</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">You haven't shared any items yet</h3>
            <p className="mt-2 text-gray-500 mb-6">Start by adding your adventure gear or services</p>
            <a 
              href="/add-item" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600"
            >
              <FiPlus className="mr-2" />
              Add New Listing
            </a>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiPackage size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiDollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">For Sale</p>
                    <p className="text-2xl font-bold text-gray-800">{forSale}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FiTrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">For Rent</p>
                    <p className="text-2xl font-bold text-gray-800">{forRent}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                    <FiDollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-800">Rs. {totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All Listings
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'sell' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                For Sale
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'rent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                For Rent
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.images?.length > 0 ? (
                      <img
                        src={`${backendUrl}/${item.images[0].replace(/\\/g, '/')}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <FiPackage size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-xs font-medium px-2 py-1 rounded">
                      {item.category}
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {item.rentalType === 'rent' ? 'For Rent' : 'For Sale'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                      <span className="text-lg font-bold text-blue-600 whitespace-nowrap ml-2">
                        Rs. {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 p-1">
                          <FiEdit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteItem(item._id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add New Button */}
            <div className="mt-8 text-center">
              <a 
                href="/add-item" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 shadow-md"
              >
                <FiPlus className="mr-2" />
                Add New Listing
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MySelfItems;