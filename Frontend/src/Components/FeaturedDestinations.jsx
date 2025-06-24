import React from 'react';

const FeaturedDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Tropical paradise with beautiful beaches and rich culture"
    },
    {
      id: 2,
      name: "Swiss Alps",
      image: "https://images.unsplash.com/photo-1518632613717-0a1e5159b5b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Majestic mountains perfect for hiking and skiing"
    },
    {
      id: 3,
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Iconic white-washed buildings with stunning sunsets"
    },
    {
      id: 4,
      name: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Traditional temples and beautiful cherry blossoms"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Destinations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular travel destinations loved by adventurers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                <p className="text-gray-600 mb-4">{destination.description}</p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-300">
                  Explore More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;