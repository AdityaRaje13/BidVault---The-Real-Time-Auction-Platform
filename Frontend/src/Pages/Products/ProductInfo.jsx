import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CustomerNavbar from '../../Components/CustomerNavbar'; 
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../../ProductContext';


const ProductInfo = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { productName } = location.state; 
  
  const {product, setProduct} = useProduct();

  const {seller, setSeller} = useProduct();

  const getAuctionData = async() =>{

      try {

        const response = await fetch("http://localhost:3000/bidvault/auctionData", {
          method : "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({productName })
        })
    
        if(response.ok){
          const data = await response.json();
          setProduct(data.auctionData);
          console.log("Success");
        }
        else{
          console.log("Error");
        }
        
      } catch (error) {
        console.log(error);
      }
  }


  const fetchSellerData =  async() => {

    try {

      const response = await fetch("http://localhost:3000/bidvault/sellerData", {
        method : "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({sellerId : product.created_By})
      })

      if(response.ok){
        const data = await response.json();
        setSeller(data.sellerData);
        console.log("Success");
      }
      else{
        console.log("Something went wrong");
      }
      
    } catch (error) {
      console.log(error);
    }
  }




  useEffect(() => {
    getAuctionData();
  }, [])

  useEffect(() => {
    if (product.created_By) {
      fetchSellerData();
    }
    
  }, [product.created_By]);
  

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <CustomerNavbar />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 md:px-12 lg:px-20 flex-grow">
        {/* Product Name */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-gray-800 text-center mb-8"
        >
          {product.title}
        </motion.h1>

        {/* Product Information Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white px-6 py-8 rounded-xl shadow-md flex flex-col lg:flex-row gap-6"
        >
          {/* Product Image */}
          <div className="lg:min-w-2xl">
            <img
              src={product.product_image}
              alt={product.title}
              className="w-full h-auto max-h-80 object-contain rounded-lg"
            />
          </div>

          {/* Product Info and Bid Button */}
          <div className="lg:w-2/3 flex flex-col ">
            <div className="flex-grow min-h-60 overflow-scroll hide-scrollbar">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Name : {product.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="text-sm text-gray-500 space-y-2">
                <p>
                  <span className="font-medium text-gray-700">Start Time:</span>{" "}
                  {new Date(product.start_time).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p>
                  <span className="font-medium text-gray-700">End Time:</span>{" "}
                  {new Date(product.end_time).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Condition : </span>{" "}
                  <span className="text-indigo-600 font-semibold">{product.condition}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Starting Bid:</span>{" "}
                  <span className="text-indigo-600 font-semibold">{product.starting_bid}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Minimum Increment:</span>{" "}
                  <span className="text-indigo-600 font-semibold">{product.min_increment}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Current Bid:</span>{" "}
                  <span className="text-indigo-600 font-semibold">{product.current_bid}</span>
                </p>

                <h5 className="font-medium text-gray-700 mt-4 mb-2 text-lg">Seller Info :</h5>
                
                <p>
                  <span className="font-medium text-gray-700">Seller Name :</span>{" "}
                  <span className="text-indigo-600 font-semibold">{seller.username}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Company Name :</span>{" "}
                  <span className=" font-semibold">{seller.company_name}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Contact No :</span>{" "}
                  <span className=" font-semibold">{seller.contact}</span>
                </p>
                
              </div>
            </div>
            {/* Bid Now Button */}
            <Link to="/auction" state={{productName: productName, productId: product._id}} >
              <button
                className={`mt-6 w-full py-3 rounded-lg text-white font-medium transition-colors duration-300 ${
                  product.isLive
                    ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!product.isLive}
              >
                {product.isEnded ? "Auction Ended" : product.isLive ? 'Bid Now' : 'Coming Soon'}
              </button>
            </Link>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-600">
        <p>© 2025 BidVault. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProductInfo;