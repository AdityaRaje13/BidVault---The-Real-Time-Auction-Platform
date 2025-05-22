import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BidCard = ({ index, bidAmount, bidTime, productId }) => {
  
    const [product, setProduct] = useState({});
  
    const navigate = useNavigate();

  const getAuctionData = async () => {
    try {
      const response = await fetch('http://localhost:3000/bidvault/auctioninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data.auctionData);
        console.log('Success');
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAuctionData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[400px] w-[350px] mx-auto transform hover:scale-105 transition-transform duration-300" onClick={() => navigate('/product-info', {state: {productName: product.title}})}>

      {/* Image with Gradient Overlay */}
      <div className="relative h-50">
        <img
          src={
            product.image || 'http://res.cloudinary.com/ddrkt0kgy/image/upload/v1740841403/sihz0ccophclwxr56ict.jpg'
          }
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        <h2 className="absolute bottom-2 left-2 text-lg font-bold text-white z-10 truncate">
          {product.title || 'Loading...'}
        </h2>
      </div>

      {/* Bid Details */}
      <div className="p-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.title || 'Loading...'}</h2>

        <div className="space-y-1 text-[15px]">
          <div className="flex justify-between">
            <span className="text-gray-600">Your Bid:</span>
            <span className="font-medium text-blue-600">Rs.{bidAmount?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            {product.isEnded ? (
              <span className="text-gray-400">Ended</span>
            ) : product.isLive ? (
              <span className="text-green-500">Live</span>
            ) : (
              <span className="text-red-500">Upcoming</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bid Placed:</span>
            <span className="font-medium text-gray-700">
              {new Date(bidTime).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ends:</span>
            <span className="font-medium text-gray-700">
              {product.end_time ? new Date(product.end_time).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* View Action Button */}
        {product.isEnded ? (
          <button
            className="mt-2 w-full py-2 rounded-full font-semibold text-white transition-all duration-200 bg-gray-500 cursor-pointer text-[15px]"
            disabled
          >
            Ended
          </button>
        ) : (
          <button className="mt-2 w-full py-2 rounded-full font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-700 cursor-pointer text-[15px]">
            View Auction
          </button>
        )}
      </div>
    </div>
  );
};

export default BidCard;