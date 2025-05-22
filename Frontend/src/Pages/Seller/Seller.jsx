import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Package, Settings, LogOut, Menu } from 'lucide-react';

const Seller = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 bg-blue-500 text-white rounded-lg shadow-lg z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 bg-white shadow-xl p-5 flex flex-col transition-transform transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}
      >
        <div className="flex items-center mb-4">
          <img
            src="../../public/images/Logo.jpg"
            alt="Logo"
            className="h-10 w-10 mr-3 rounded-full object-cover"
          />
          <Link to="/customer"><h1 className="text-3xl font-extrabold text-gray-800 cursor-pointer">BidVault</h1></Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Seller Panel</h1>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/seller/statistics"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <Home className="w-5 h-5" /> Dashboard
          </NavLink>

          <NavLink
            to="/seller/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <i className="fa-solid fa-address-card"></i> Profile
          </NavLink>

          <NavLink
            to="/seller/create-auction"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <Package className="w-5 h-5" /> Create Auction
          </NavLink>

          <NavLink
            to="/seller/your-auctions"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <Settings className="w-5 h-5" /> Your Auctions
          </NavLink>
        </nav>
        <div className="mt-72">
          <NavLink
            to="/login-seller"
            className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-100"
          >
            <LogOut className="w-5 h-5" /> Logout
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Seller;