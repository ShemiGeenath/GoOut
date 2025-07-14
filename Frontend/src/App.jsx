import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Nav from './Components/Nav';
import Signin from './pages/Signin';
import AddItem from './pages/Additem';
import Login from './pages/Login';
import MySelfItems from './pages/MySelfItems';
import Item from './pages/Items';
import AddTravelGuide from './pages/AddTravelGuide';
import AddDestination from './pages/AddDestination';
import TravelGuides from './pages/TravelGuides';
import Destinations from './pages/Destinations';
import AddGoods from './pages/AddGoods';
import AddHotel from './pages/AddHotel';
import AddPackage from './pages/AddPackage';
import HotelList from './pages/HotelList';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
      {/* Navbar stays on all pages */}
      

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/Signin" element={<Signin />} />
         <Route path="/AddItem" element={<AddItem />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/MySelfItems" element={<MySelfItems />} />
         <Route path="/Item" element={<Item />} />
         <Route path="/AddTravelGuide" element={<AddTravelGuide />} />
         <Route path="/AddDestination" element={<AddDestination />} />
         <Route path="/TravelGuides" element={<TravelGuides />} />
         <Route path="/Destinations" element={<Destinations />} />
         <Route path="/AddGoods" element={<AddGoods />} />
         <Route path="/AddHotel" element={<AddHotel />} />
         <Route path="/AddPackage" element={<AddPackage />} />
         <Route path="/HotelList" element={<HotelList />} />

      </Routes>


   </BrowserRouter>

       
    </>
  )
}

export default App
