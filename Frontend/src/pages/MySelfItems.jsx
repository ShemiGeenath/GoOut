import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiEdit, FiTrash2, FiPlus, FiDollarSign, FiTrendingUp,
  FiPackage, FiMapPin, FiMail, FiUsers
} from 'react-icons/fi';

const MySelfItems = () => {
  const [items, setItems] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');
  const backendUrl = 'http://localhost:5000';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [itemsRes, guidesRes] = await Promise.all([
          fetch(`${backendUrl}/api/items/user/${userId}`),
          fetch(`${backendUrl}/api/guides/user/${userId}`)
        ]);

        if (!itemsRes.ok || !guidesRes.ok) throw new Error('Failed to fetch data');

        const itemsData = await itemsRes.json();
        const guidesData = await guidesRes.json();

        setItems(itemsData.items || []);
        setGuides(guidesData.guides || []);
      } catch (err) {
        console.error('❌ Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/items/${itemId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('❌ Failed to delete item:', err);
    }
  };

  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-6">
          My Adventure Listings
        </h1>

        {!userId ? (
          <p>Please log in to view your content.</p>
        ) : isLoading ? (
          <div className="text-center py-16">Loading...</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('items')}
                className={`px-4 py-2 font-medium ${activeTab === 'items' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                My Items
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`px-4 py-2 font-medium ${activeTab === 'guides' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                My Guide Profiles
              </button>
            </div>

            {/* ITEMS */}
            {activeTab === 'items' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.length === 0 ? (
                    <p className="col-span-full text-gray-500">No items listed yet.</p>
                  ) : items.map(item => (
                    <motion.div key={item._id} whileHover={{ y: -3 }} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="h-40 relative">
                        {item.images?.length ? (
                          <img src={`${backendUrl}/${item.images[0].replace(/\\/g, '/')}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <FiPackage size={28} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                          {item.rentalType}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold text-gray-800">{item.title}</h3>
                          <span className="text-blue-600 font-semibold">Rs. {item.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span><FiMapPin className="inline mr-1" />{item.location}</span>
                          <div className="flex gap-2">
                            <button><FiEdit size={18} /></button>
                            <button onClick={() => deleteItem(item._id)}><FiTrash2 size={18} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <a href="/add-item" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FiPlus className="mr-2" />
                    Add New Item
                  </a>
                </div>
              </>
            )}

            {/* GUIDES */}
            {activeTab === 'guides' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.length === 0 ? (
                    <p className="col-span-full text-gray-500">No guide profiles created yet.</p>
                  ) : guides.map(guide => (
                    <motion.div key={guide._id} whileHover={{ y: -3 }} className="bg-white rounded-xl shadow-md overflow-hidden p-4">
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{guide.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{guide.bio}</p>
                      <p className="text-sm text-gray-500 mb-1"><FiUsers className="inline mr-1" />Experience: {guide.experience} years</p>
                      <p className="text-sm text-gray-500 mb-1"><FiMail className="inline mr-1" />{guide.contactEmail || 'No email'}</p>
                      <p className="text-sm text-gray-500"><FiMapPin className="inline mr-1" />Specialties: {guide.specialties.join(', ')}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <a href="/add-guide" className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    <FiPlus className="mr-2" />
                    Add Guide Profile
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MySelfItems;
