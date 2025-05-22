import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import CustomerNavbar from "../../Components/CustomerNavbar";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Customer = () => {
  const navigate = useNavigate();
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [isEditing, setIsEditing] = useState(false);

  const customer = JSON.parse(localStorage.getItem('customer'));

  const [customerData, setCustomerData] = useState({});
  const [username, setUsername] = useState(customer.username);
  const [email, setEmail] = useState(customer.email);
  const [contact, setContact] = useState(customer.contact);
  const [fullname, setFullname] = useState('');
  const [Gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyLocation, setNearbyLocation] = useState('');

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:3000/bidvault/customerData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: customer._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerData(data.customerData);
        localStorage.setItem('customer', JSON.stringify(data.customerData));
      } else {
        console.log("Error while fetching the Customer info");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLiveAuctions = async () => {
    try {
      const response = await fetch("http://localhost:3000/bidvault/live", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLiveAuctions(data.liveAuctions);
      } else {
        console.log("Error while fetching the live auctions");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username,
      email,
      contact,
      fullname,
      Gender,
      address,
      nearby_location: nearbyLocation,
    };
    try {
      const response = await fetch('http://localhost:3000/bidvault/update-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer._id, formData }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('customer', JSON.stringify(data.customer));
        toast.success('Customer updated successfully');
        setIsEditing(false);
        fetchUserInfo();
      } else {
        toast.error('Failed to update Customer');
      }
    } catch (error) {
      toast.error('Error updating customer');
      console.log(error);
    }
  };

  useEffect(() => {

    if (customer.fullname === "") {
      setIsEditing(true);
    }
  }, []);

  useEffect(() => {
    const checkMinuteChange = () => {
      const now = new Date();
      const secondsUntilNextMinute = (60 - now.getSeconds()) * 1000;

      setTimeout(() => {
        fetchLiveAuctions();
        checkMinuteChange();
      }, secondsUntilNextMinute + 3000);
    };

    const customer = localStorage.getItem('customer');
    if(!customer){
      navigate('/login-customer');
      toast.error("Unauthorized User")
    }

    fetchUserInfo();
    fetchLiveAuctions();
    checkMinuteChange();

    return () => {};
  }, []);

  const filteredAuctions = liveAuctions
    .filter((auction) =>
      auction.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'startAsc') {
        return new Date(a.start_time) - new Date(b.start_time);
      } else if (sortOrder === 'startDesc') {
        return new Date(b.start_time) - new Date(a.start_time);
      }
      return 0;
    });

  const carouselImages = [
    { url: "../../../public/images/antique-corosuel.avif", text: "1. Timeless Antiques" },
    { url: "../../../public/images/electronics-corosuel.avif", text: "2. Vintage Electronics" },
    { url: "../../../public/images/watch-corosuel.avif", text: "3. Classic Timepieces" },
    { url: "../../../public/images/vehicle-corosuel.jpg", text: "4. Heritage Vehicles" },
    { url: "../../../public/images/fashion-corosuel.jpg", text: "5. Retro Fashion" },
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Prepare data for Bar Chart
  const categories = ['Antiques', 'Electronics', 'Watches', 'Vehicals', 'Fashion', 'Other'];
  const categoryCounts = categories.map(category =>
    liveAuctions.filter(auction => auction.category === category).length
  );

  const barData = {
    labels: categories,
    datasets: [{
      label: 'Live Auctions',
      data: categoryCounts,
      backgroundColor: '#4F46E5',
      borderColor: '#4338CA',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        bodyFont: { size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Auctions' },
        ticks: { stepSize: 1 },
      },
      x: {
        title: { display: true, text: 'Categories' },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-5 md:px-12 lg:px-20 flex-grow">
        {/* Header with Stats and Search/Filter */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-800">BidVault Dashboard</h1>
              <p className="text-gray-600 mt-2">Discover, bid, and win exclusive items!</p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="bg-white py-2 px-5 rounded-lg shadow-md text-center flex gap-5">
                <p className="text-lg text-gray-600 mt-1">Active Bids :</p>
                <p className="text-3xl font-bold text-indigo-600">{liveAuctions.length}</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Categories */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Browse Categories</h2>
            <div className="space-y-4">
              {[
                { name: "Timeless Antiques", img: "antique.jpg", category: "Antiques" },
                { name: "Vintage Electronics", img: "electronic.avif", category: "Electronics" },
                { name: "Classic Timepieces", img: "watch.jpg", category: "Watches" },
                { name: "Heritage Vehicles", img: "vehical.jpg", category: "Vehicals" },
                { name: "Retro Fashion", img: "fashion.jpg", category: "Fashion" },
                { name: "Other", img: "other.jpg!w700wp", category: "Other" },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center gap-3"
                  onClick={() => navigate('/product-display', { state: { category: category.category } })}
                >
                  <div
                    className="w-12 h-12 bg-cover bg-center rounded-full border border-gray-200"
                    style={{ backgroundImage: `url('../../../public/images/${category.img}')` }}
                  ></div>
                  <span className="text-base font-medium text-gray-700">{category.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Graphs Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Auction Insights</h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Live Auctions by Category</h3>
                {liveAuctions.length > 0 ? (
                  <div className="h-64">
                    <Bar
                      data={barData}
                      options={barOptions}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">No live auctions available</span>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Right Column: Live Auctions */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* Carousel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 relative"
            >
              <div className="w-full h-60 overflow-hidden rounded-xl shadow-md relative">
                <motion.img
                  key={currentImage}
                  src={carouselImages[currentImage].url}
                  alt={`Carousel ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute text-md bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md font-semibold">
                  {carouselImages[currentImage].text}
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Options */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center md:justify-end gap-4"
            >
              <input
                type="text"
                placeholder="Search live auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 w-full sm:w-64"
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
              >
                <option value="default">Sort By</option>
                <option value="startAsc">Start Time (Earliest)</option>
                <option value="startDesc">Start Time (Latest)</option>
              </select>
            </motion.div>

            {/* Live Auctions */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Live Auctions</h2>
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
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {auction.description}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      <p>
                        <span className="font-medium text-gray-700">Ends:</span>{" "}
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
                    {auction.isLive === false ? (
                      <button className="mt-3 w-full bg-gray-200 text-gray-600 py-1.5 text-sm rounded-md cursor-not-allowed">
                        Coming Soon
                      </button>
                    ) : (
                      <button className="cursor-pointer mt-3 w-full bg-indigo-600 text-white py-1.5 text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300">
                        Bid Now
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No live auctions match your criteria.</p>
            )}
          </motion.section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-600">
        <p>© 2025 BidVault. All Rights Reserved.</p>
      </footer>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs transition-all duration-300">
          <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Edit Profile
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  value={contact}
                  placeholder="Contact"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <input
                  type="text"
                  value={fullname}
                  placeholder="Full Name"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setFullname(e.target.value)}
                />
                <input
                  type="text"
                  value={Gender}
                  placeholder="Gender"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setGender(e.target.value)}
                />
                <input
                  type="text"
                  value={address}
                  placeholder="Address"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  value={nearbyLocation}
                  placeholder="Nearby Location"
                  className="p-4 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  onChange={(e) => setNearbyLocation(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;