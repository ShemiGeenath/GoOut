import { useState } from 'react';

const CategoryCard = () => {
  const categories = [
    {
      name: 'Camping Gear',
      icon: '⛺',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      name: 'Vehicles',
      icon: '🚗',
      color: 'from-blue-500 to-sky-600',
      hoverColor: 'hover:from-blue-600 hover:to-sky-700'
    },
    {
      name: 'Accessories',
      icon: '🎒',
      color: 'from-purple-500 to-violet-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700'
    },
    {
      name: 'Adventure Services',
      icon: '🧭',
      color: 'from-amber-500 to-orange-600',
      hoverColor: 'hover:from-amber-600 hover:to-orange-700'
    },
    {
      name: 'Campsite Rentals',
      icon: '🏕️',
      color: 'from-teal-500 to-cyan-600',
      hoverColor: 'hover:from-teal-600 hover:to-cyan-700'
    },
    {
      name: 'Photography Gear',
      icon: '📷',
      color: 'from-pink-500 to-rose-600',
      hoverColor: 'hover:from-pink-600 hover:to-rose-700'
    },
    {
      name: 'Local Guides',
      icon: '🧑‍🌾',
      color: 'from-indigo-500 to-blue-600',
      hoverColor: 'hover:from-indigo-600 hover:to-blue-700'
    },
    {
      name: 'Water Adventures',
      icon: '🚤',
      color: 'from-cyan-500 to-blue-500',
      hoverColor: 'hover:from-cyan-600 hover:to-blue-600'
    },
    {
      name: 'Eco Essentials',
      icon: '🌱',
      color: 'from-lime-500 to-green-600',
      hoverColor: 'hover:from-lime-600 hover:to-green-700'
    }
  ];

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="max-w-7xl max-h-0.5 mx-auto px-4 py-12">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} ${category.hoverColor} transition-all duration-300`}></div>
            
            <div className="relative z-10 p-6 h-40 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <span 
                  className={`text-4xl transition-all duration-500 ${hoveredCard === index ? 'scale-125 rotate-6' : 'scale-100 rotate-0'}`}
                >
                  {category.icon}
                </span>
              </div>
              
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-sm font-medium text-white bg-black bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full backdrop-blur-sm transition-all">
                  Explore Now
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white bg-opacity-10 group-hover:w-20 group-hover:h-20 transition-all duration-300"></div>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white bg-opacity-10 group-hover:w-16 group-hover:h-16 transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;