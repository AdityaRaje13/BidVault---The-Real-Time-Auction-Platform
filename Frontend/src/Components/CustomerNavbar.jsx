import React, { useState } from 'react';
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


const CustomerNavbar = () => {

  const customer = JSON.parse(localStorage.getItem("customer"));
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const logoutCustomer = async() => {
    
    try {

      const response = await fetch('http://localhost:3000/bidvault/logout_customer', {
        method: "POST",
        headers: {
          "Authorization" : `bearer ${token}`,
        },
      })

      if(response.ok){
        localStorage.removeItem("token");
        localStorage.removeItem("customer");
        navigate('/login-customer');
        toast.success("Customer Logout successfully");
      }
      else{
        toast.error("Error while logout")
      }
      
    } 
    catch (error) {
      console.log(error);
    }

  }

  return (
    <nav className="bg-white shadow-md py-4 md:px-12 lg:px-20 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and Title */}
      <div className="flex items-center">
        <img
          src="../../public/images/Logo.jpg"
          alt="Logo"
          className="h-10 w-10 mr-3 rounded-full object-cover"
        />
        <Link to="/customer"><h1 className="text-2xl font-extrabold text-gray-800 cursor-pointer">BidVault</h1></Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">

        <Link to={'/customer'}>
          <button className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
            <i className="fa-solid fa-home"></i> Home
          </button>
        </Link>
        <Link to={'/leaderboard'}>
          <button className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
            <i className="fa-solid fa-trophy"></i> Leaderboard
          </button>
        </Link>
        <Link to={'/profile'}>
          <button className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
            <i className="fa-solid fa-address-card"></i> Profile
          </button>
        </Link>
        <Link to={'/yourbids'}>
          <button className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
            <i className="fa-solid fa-wallet"></i> Your Bids
          </button>
        </Link>

      </div>

      <div className='flex gap-5'>
          <button onClick={() => {logoutCustomer()}} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            Log Out
          </button>
          <div className="flex items-center gap-2 text-gray-700">
            <i className="fa-solid fa-user"></i>
            <span className="font-medium">{customer?.username || 'Guest'}</span>
          </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-700 focus:outline-none"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col items-center space-y-4 text-gray-700">
          <Link to={'/customer'}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
              <i className="fa-solid fa-home"></i> Home
            </button>
          </Link>
          <Link to={'/leaderboard'}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
              <i className="fa-solid fa-trophy"></i> Leaderboard
            </button>
          </Link>
          <Link to={'/profile'}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
              <i className="fa-solid fa-address-card"></i> Profile
            </button>
          </Link>
          <Link to={'/yourbids'}>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2">
              <i className="fa-solid fa-wallet"></i> Your Bids
            </button>          
          </Link>
          <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            Log Out
          </button>
          <div className="w-full flex items-center gap-2 px-4 py-2 text-gray-700">
            <i className="fa-solid fa-user"></i>
            <span className="font-medium">{customer?.username || 'Guest'}</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;