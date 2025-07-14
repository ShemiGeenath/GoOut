import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hotels');
        setHotels(res.data);
      } catch (err) {
        console.error('[❌ Fetch Hotels]', err);
        setError('Failed to load hotels.');
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🏨 Hotel Listings</h1>
      {error && <p className="text-red-500">{error}</p>}

      {hotels.length === 0 ? (
        <p>No hotels found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-2xl shadow-md p-4">
              <div className="w-full h-52 overflow-hidden rounded-xl mb-3">
                {hotel.images?.length > 0 && (
                  <img
                    src={`http://localhost:5000/${hotel.images[0]}`}
                    alt={hotel.propertyName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h2 className="text-xl font-semibold">{hotel.propertyName}</h2>
              <p className="text-sm text-gray-600">{hotel.propertyType} · ⭐ {hotel.stars}</p>
              <p className="mt-2 text-gray-800">{hotel.description?.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-1">📍 {hotel.location}</p>

              {hotel.amenities?.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Amenities:</span> {hotel.amenities.join(', ')}
                </div>
              )}

              {hotel.rooms?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold text-sm">🛏 Rooms:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {hotel.rooms.map((room, index) => (
                      <li key={index}>
                        {room.type} - ${room.price}/night - Capacity: {room.capacity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3">
                <a
                  href={`tel:${hotel.contactPhone}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  📞 {hotel.contactPhone}
                </a>
                <br />
                <a
                  href={`mailto:${hotel.contactEmail}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  📧 {hotel.contactEmail}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;
