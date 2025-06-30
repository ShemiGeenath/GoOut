import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCompass, 
  FiUser, 
  FiShoppingBag, 
  FiHome, 
  FiPackage,
  FiPlus,
  FiMap,
  FiCamera,
  FiTruck,
  FiUmbrella,
  FiWatch,
  FiAnchor
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AddItem() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Travel Guide",
      icon: <FiUser className="text-3xl" />,
      color: "from-purple-500 to-pink-500",
      route: "/AddTravelGuide"
    },
    {
      title: "Destination",
      icon: <FiCompass className="text-3xl" />,
      color: "from-amber-500 to-orange-500",
      route: "/AddDestination"
    },
    {
      title: "Goods/Items",
      icon: <FiShoppingBag className="text-3xl" />,
      color: "from-blue-500 to-cyan-500",
      route: "/AddGoods"
    },
    {
      title: "Hotels",
      icon: <FiHome className="text-3xl" />,
      color: "from-emerald-500 to-teal-500",
      route: "/AddHotel"
    },
    {
      title: "Packages",
      icon: <FiPackage className="text-3xl" />,
      color: "from-violet-500 to-indigo-500",
      route: "/AddPackage"
    },
    {
      title: "Tour Services",
      icon: <FiMap className="text-3xl" />,
      color: "from-rose-500 to-red-500",
      route: "/AddTourService"
    },
    {
      title: "Photography",
      icon: <FiCamera className="text-3xl" />,
      color: "from-fuchsia-500 to-purple-500",
      route: "/AddPhotography"
    },
    {
      title: "Transport",
      icon: <FiTruck className="text-3xl" />,
      color: "from-lime-500 to-green-500",
      route: "/AddTransport"
    }
  ];

  const popularCategories = [
    { name: "Camping Gear", icon: <FiUmbrella /> },
    { name: "Vehicles", icon: <FiTruck /> },
    { name: "Accessories", icon: <FiWatch /> },
    { name: "Water Sports", icon: <FiAnchor /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Adventure</span> Essentials
        </h1>
        <p className="text-xl text-gray-600">
          Select what you'd like to add to our adventure community
        </p>
      </motion.div>

      {/* Main Options Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.title}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            onClick={() => navigate(option.route)}
            className={`bg-gradient-to-r ${option.color} rounded-2xl p-6 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex flex-col items-center text-center h-full">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4">
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
              <div className="mt-auto flex items-center text-sm opacity-90">
                <FiPlus className="mr-1" /> Add New
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Popular Categories Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FiShoppingBag className="mr-2 text-blue-500" />
          Popular Goods Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularCategories.map((category, index) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
              onClick={() => navigate('/AddGoods')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="text-blue-500 mb-2">{category.icon}</div>
              <span className="text-gray-700 font-medium">{category.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="max-w-2xl mx-auto mt-16 text-center"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Not sure what to add?
        </h3>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/AddGoods')}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg"
        >
          Start with General Goods
        </motion.button>
      </motion.div>
    </div>
  );
}