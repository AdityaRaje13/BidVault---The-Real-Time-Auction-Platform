import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomerNavbar from '../../Components/CustomerNavbar';
import { motion } from 'framer-motion';

const ProductDisplay = () => {
  const location = useLocation();
  const [categoryWiseAuctions, setCategoryWiseAuctions] = useState([]);
  const { category } = location.state;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // New state for sorting

  const categoryProduct = async () => {
    try {
      const response = await fetch("http://localhost:3000/bidvault/category", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productCategory: category }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategoryWiseAuctions(data.categoryWiseAuctions);
        toast.success(`${category} auctions are here...`);
      } else {
        console.log("Error while getting the data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (category) {
      categoryProduct();
    }
  }, [category]);

  // Filter and sort auctions based on search and sort order
  const filteredAuctions = categoryWiseAuctions
    .filter((auction) =>
      auction.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'startAsc') {
        return new Date(a.start_time) - new Date(b.start_time);
      } else if (sortOrder === 'startDesc') {
        return new Date(b.start_time) - new Date(a.start_time);
      }
      return 0; // Default: no sorting
    });

  return (
    <div className="bg-gray-100 h-screen flex flex-col min-h-screen font-sans overflow-scroll">
      <CustomerNavbar />

      {/* Main Container */}
      <div className="container mx-auto px-4 md:px-12 lg:px-20 flex-grow flex flex-col">
        {/* Header with Search and Sort */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-6 pt-6"
        >
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
            {category} Auctions
          </h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="default">Sort By</option>
              <option value="startAsc">Start Time (Earliest)</option>
              <option value="startDesc">Start Time (Latest)</option>
            </select>
          </div>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
          {/* Sidebar: Product Names */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-xl shadow-md h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 sticky top-0 bg-white z-10 py-2">Product Names</h2>
              {filteredAuctions.length > 0 ? (
                <ul className="space-y-3">
                  {filteredAuctions.map((auction, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-gray-50 p-3 rounded-lg shadow-sm text-gray-700 font-medium cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
                      onClick={ () => navigate('/product-info', { state: { productName: auction.title } }) } 
                    >
                      {auction.title}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No auctions match your criteria.</p>
              )}
            </div>
          </motion.section>

          {/* Auction Cards */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white p-6 rounded-xl shadow-md h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredAuctions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAuctions.map((auction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col cursor-pointer"
                      onClick={() => navigate('/product-info', { state: { productName: auction.title } })}
                    >
                      <div className="relative">
                        <img
                          src={auction.product_image}
                          alt={`Auction ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {auction.isLive ? "Live" : "Upcoming"}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-800 mt-3 truncate">{auction.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{auction.description}</p>
                      <div className="mt-3 text-xs text-gray-500 flex-grow">
                        <p>
                          <span className="font-medium text-gray-700">Start:</span>{" "}
                          {new Date(auction.start_time).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          })}
                        </p>
                        <p className="mt-1">
                          <span className="font-medium text-gray-700">End:</span>{" "}
                          {new Date(auction.end_time).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          })}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {auction.isLive === false ? (
                          <button
                            className="w-full bg-gray-200 text-gray-600 py-1.5 text-sm rounded-md cursor-not-allowed"
                            disabled
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button className="cursor-pointer w-full bg-indigo-600 text-white py-1.5 text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300">
                            Bid Now
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No auctions match your criteria.</p>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-600">
        <p>© 2025 BidVault. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProductDisplay;