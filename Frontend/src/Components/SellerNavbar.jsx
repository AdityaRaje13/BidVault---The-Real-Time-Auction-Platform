import React from 'react';
import { Link } from 'react-router-dom';

const SellerNavbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">BidVault</div>
        <div className="flex space-x-4">
          <Link to="/seller/profile" className="hover:text-gray-200 transition duration-300">
            Profile
          </Link>
          <Link to="/seller/statistics" className="hover:text-gray-200 transition duration-300">
            Statistics
          </Link>
          <Link to="/seller/your-auctions" className="hover:text-gray-200 transition duration-300">
            Your Auctions
          </Link>
          <Link to="/seller/create-auction" className="hover:text-gray-200 transition duration-300">
            Create Auction
          </Link>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300">
            Edit Profile
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;