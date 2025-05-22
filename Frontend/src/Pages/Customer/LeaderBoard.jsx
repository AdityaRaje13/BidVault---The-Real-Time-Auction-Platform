import React, { useEffect, useState } from 'react';
import CustomerNavbar from "../../Components/CustomerNavbar";

const LeaderBoard = () => {
  const [bidders, setBidders] = useState([]);

  const fetchBidders = async () => {
    try {
      const response = await fetch('http://localhost:3000/bidvault/allbidders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sortedBidders = data.allBids.sort((a, b) => b.bidAmount - a.bidAmount);
        setBidders(sortedBidders);
      } 
      else {
        console.log('Failed to fetch leaderboard data');
      }
    } 
    catch (error) {
      console.log('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchBidders();
  }, []);

  // Static data for demonstration
  const mockBidders = [
    { bidderId: '1', bidderName: 'John Doe', bidAmount: 5000 },
    { bidderId: '2', bidderName: 'Jane Smith', bidAmount: 4500 },
    { bidderId: '3', bidderName: 'Mike Johnson', bidAmount: 4200 },
    { bidderId: '4', bidderName: 'Emily Brown', bidAmount: 3800 },
    { bidderId: '5', bidderName: 'Chris Lee', bidAmount: 3500 },
  ];

  // Use mock data if bidders is empty
  const displayBidders = bidders.length > 0 ? bidders : mockBidders;

  return (
    <>
      <CustomerNavbar />
      <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Leaderboard</h1>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            {displayBidders[1] && (
              <>
                <div className="bg-green-200 p-6 rounded-xl shadow-md w-full text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold text-green-600 mb-2">2nd</div>
                  <h2 className="text-xl font-semibold text-green-800">{displayBidders[1].bidderName || displayBidders[1].username}</h2>
                  <p className="text-2xl font-bold text-green-600 mt-2">Rs.{displayBidders[1].bidAmount}</p>
                </div>
                <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center mt-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </>
            )}
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            {displayBidders[0] && (
              <>
                <div className="bg-yellow-100 p-6 rounded-xl shadow-md w-full text-center transform hover:scale-105 transition-transform duration-200 border-2 border-yellow-400">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">1st</div>
                  <h2 className="text-xl font-semibold text-gray-800">{displayBidders[0].bidderName || displayBidders[0].username}</h2>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">Rs.{displayBidders[0].bidAmount}</p>
                </div>
                <div className="w-28 h-28 bg-yellow-500 rounded-full flex items-center justify-center mt-4">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
              </>
            )}
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            {displayBidders[2] && (
              <>
                <div className="bg-orange-200 p-6 rounded-xl shadow-md w-full text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold text-orange-600 mb-2">3rd</div>
                  <h2 className="text-xl font-semibold text-gray-800">{displayBidders[2].bidderName || displayBidders[2].username}</h2>
                  <p className="text-2xl font-bold text-orange-600 mt-2">Rs.{displayBidders[2].bidAmount}</p>
                </div>
                <div className="w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center mt-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rest of the Leaderboard */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Bidders</h2>
          <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 font-semibold text-gray-700">
              <div className="col-span-2">Rank</div>
              <div className="col-span-6">Bidder Name</div>
              <div className="col-span-4 text-right">Bid Amount</div>
            </div>
            {displayBidders.map((bidder, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="col-span-2 font-bold text-gray-600">{index + 1}</div>
                <div className="col-span-6 text-gray-800">{bidder.bidderName || bidder.username}</div>
                <div className="col-span-4 text-right font-semibold text-gray-700">Rs.{bidder.bidAmount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;