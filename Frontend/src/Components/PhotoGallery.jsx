import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CategoryCard from "./CategoryCard";

const TravelPhotoGallery = () => {
  const travelImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      alt: "Mountain Adventure",
      title: "Explore the World's Wonders",
      subtitle: "Discover breathtaking destinations with our expert guides",
      cta: "Find Adventures"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      alt: "Camping Gear",
      title: "Premium Travel Equipment",
      subtitle: "Rent top-quality gear for your next outdoor adventure",
      cta: "Browse Gear"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      alt: "Travel Vehicle",
      title: "Your Perfect Travel Companion",
      subtitle: "Choose from our fleet of adventure-ready vehicles",
      cta: "View Vehicles"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      alt: "Local Experiences",
      title: "Authentic Local Experiences",
      subtitle: "Book unique activities hosted by locals",
      cta: "Explore Activities"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrev = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev <= 0 ? travelImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % travelImages.length);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 700);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <>
    <section className="pt-50">
    <div className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {travelImages.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={item.url}
              alt={item.alt}
              className={`w-full h-full object-cover ${
                isTransitioning ? "scale-105" : "scale-100"
              } transition-transform duration-700 ease-in-out`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/1920x1080?text=Travel+Image+Not+Available";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6 max-w-8xl mx-auto text-white min-h-150">
               <div className="flex justify-center items-center min-h-1">
                    <CategoryCard />
                  </div>

                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-emerald-600 text-white hover:text-white p-3 rounded-full shadow-lg z-20 transition-all duration-300"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-emerald-600 text-white hover:text-white p-3 rounded-full shadow-lg z-20 transition-all duration-300"
        aria-label="Next slide"
      >
        <FiChevronRight className="h-6 w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {travelImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              activeIndex === index ? "bg-emerald-600" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
    </section>
    </>
  );
};

export default TravelPhotoGallery;