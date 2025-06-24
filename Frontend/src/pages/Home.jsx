import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhotoGallery from '../Components/PhotoGallery';
import Nav from '../Components/Nav';
import CategoryCard from '../Components/CategoryCard';
import FeaturedDestinations from '../Components/FeaturedDestinations';

const Home = () => {
  

  return (
    <>
        <Nav/>

      <PhotoGallery />
      <FeaturedDestinations/>
     
    </>
  );
};

export default Home;