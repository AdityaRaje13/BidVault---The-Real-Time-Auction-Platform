import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CustomerNavbar from '../../Components/CustomerNavbar';
import { toast } from 'react-toastify';
import { useProduct } from '../../ProductContext.jsx';
import { useLocation } from 'react-router-dom';

const Auction = () => {

  const [winner, setWinner] = useState(null);
  const [winnerDetails, setWinnerDetails] = useState({});

  const { seller } = useProduct();
  const location = useLocation();
  const {productName, productId} = location.state;

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  let coms = 0;

  const customer = JSON.parse(localStorage.getItem('customer'));

  const sendWinnerEmail = async(winnerData) => {

    try {

        const seller = JSON.parse(localStorage.getItem('seller'));

        const response = await fetch('http://localhost:3000/bidvault/sendmail', {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sellerEmail: seller.email, 
            winnerEmail: winnerData.email, 
            subject: `Congratulations you have own the auction for the product- "${product.title}" `, 
            message:
            `
            Dear ${winnerData.username},

            🎉 Congratulations! You have successfully **won the auction** for product - "${product.title}":

            🛍️ Product Details:
            - Product Name: ${product.title}
            - Description: ${product.description}
            - Final Bid: ₹${product.current_bid}

            📦 Your product will soon be prepared for delivery.

            💳 Payment Instructions:
            Please get in touch with the seller to discuss and finalize the payment or payment method.  
            Once the payment is confirmed, the product will be shipped and delivered to your address.

            👤 Seller Information:
            - Name: ${seller.username}
            - Email: ${seller.email}
            - Contact: ${seller.contact}
            - Address: ${seller.address}
            - Company Name: ${seller.company_name}
            - Company Address: ${seller.company_address}
            - Country: ${seller.country}
            - GSTIN Number: ${seller.GSTIN_No}

            📅 Date of Winning: ${new Date().toLocaleDateString()}
            🕒 Time: ${new Date().toLocaleTimeString()}

            Feel free to reach out to the seller for any queries or to initiate the transaction.

            Thank you for being a valued participant in our auction platform.

            We will contact you soon !

            Happy Shopping!  
            Team BidVault 🏷️
            `
          })
        })

        if(response.ok){
          console.log("Email sent to winner");
        }
        else{
          console.log("Email not sent Error !");
        }
      
    }
    catch (error) {
      console.log(error);
    }
  }


  const getAuctionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/bidvault/auctionData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productName, productId })
      });

      if (response.ok) {
        const data = await response.json();
        const auctionData = data.auctionData;
        const bidData = data.allBids;
        setBids(bidData);
        setProduct(auctionData);
        setBidAmount(auctionData.starting_bid);
        setCurrentBid(auctionData.current_bid || auctionData.starting_bid);
        console.log("Fetched successfully");  
      } 
      else {
        throw new Error("Failed to fetch auction data");
      }
    } 
    catch (err) {
      setError(err.message);
      toast.error(err.message);
      console.error(err);
    } 
    finally {
      setIsLoading(false);
    }
  };


  // Set Winner to database

  const setWinnerToDb = async (winnerData) => {
    try {
      coms = (winnerData.bidAmount * 0.02).toFixed(2);
  
      const response = await fetch('http://localhost:3000/bidvault/setwinner', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          winnerId: winnerData.customerId,
          commision: coms
        })
      });
  
      if (response.ok) {
        console.log("Successfully added the winner to DB");
      } else {
        console.log("Error while setting winner");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const hasWinnerBeenSet = useRef(false); 

  // Reverse Timer Logic
  const calculateTimeLeft = async() => {
    if (!product) return;
    const now = new Date().getTime();
    const endTime = new Date(product.end_time).getTime();
    const startTime = new Date(product.start_time).getTime();
  
    if (now < startTime) {
      setTimeLeft("Auction has not started yet");
      return;
    }
  
    const difference = endTime - now;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      // Auction has ended
      if (bids && bids.length > 0) {
        const sortedBids = bids.sort((a, b) => b.bidAmount - a.bidAmount);
        const topBid = sortedBids[0];
  
        if (!winner && !hasWinnerBeenSet.current) {
          setWinner(topBid);
          await setWinnerToDb(topBid);
          sendWinnerEmail(topBid);
          hasWinnerBeenSet.current = true; 
        }
      
        setTimeLeft(
          <>
            Auction has ended,
            <br />
            Winner: {topBid.username} (Rs.{topBid.bidAmount})
          </>
        );
      } else {
        setTimeLeft("Auction ended with no bids.");
      }
    }
  };  


  // Place the Bid

  const handlePlaceBid = async () => {
    if (bidAmount <= currentBid) {
      toast.error(`Bid must be greater than current bid of Rs.${currentBid}`);
      return;
    }

    if (bidAmount < product.starting_bid) {
      toast.error(`Bid must be at least Rs.${product.starting_bid}`);
      return;
    }

    const increment = bidAmount - currentBid;
    if (increment < product.min_increment) {
      toast.error(`Increment must be at least Rs.${product.min_increment} than Current Bid i.e ${currentBid + product.min_increment}`);
      return;
    }

    console.log(customer);

    const response = await fetch('http://localhost:3000/bidvault/add-bidder', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product._id,
        customerId: customer._id, 
        username: customer.username, 
        email: customer.email, 
        bidAmount: bidAmount, 
        bidTime: Date.now()
      })
    });

    if(response.ok){
      const data = await response.json();
      const auctionData = data.auctionData;
      const bidData = data.allBids;
      setBids(bidData);
      setProduct(auctionData);
      setBidAmount(auctionData.current_bid);
      setCurrentBid(auctionData.current_bid || auctionData.starting_bid);
      toast.success(`Bid of Rs.${bidAmount} placed successfully!`);
    }
    else{
      console.log(error);
    }
  };

  useEffect(() => {
    if (productName) {
      getAuctionData();
    }
  }, []);

  useEffect(() => {
    if (product) {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <CustomerNavbar />
        <div className="text-center">
          <p className="text-gray-600">Loading auction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <CustomerNavbar />
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={getAuctionData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8 md:px-12 lg:px-20 flex-grow">
        {/* Timer and Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm text-gray-500 mb-2">Starting Bid</p>
            <p className="text-xl font-bold text-indigo-600">₹{product.starting_bid}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm text-gray-500 mb-2">Current Bid</p>
            <p className="text-xl font-bold text-indigo-600">₹{currentBid}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm text-gray-500 mb-2">Total Bidders</p>
            <p className="text-xl font-bold text-indigo-600">{bids.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm text-gray-500 mb-2">Time Remaining</p>
            <p className={`text-xl font-bold ${product.isEnded ? 'text-red-600' : 'text-indigo-600'}`}>
              {product.isEnded ? timeLeft : timeLeft}
            </p>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-extrabold text-gray-800 text-center mb-8"
        >
          {product.title}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-4 rounded-xl">
          <div className="flex-grow min-h-60 overflow-scroll hide-scrollbar px-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Name: {product.title}</h2>
            <p align="justify" className="text-gray-600 text-sm mb-4">{product.description}</p>
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
                <span className="font-medium text-gray-700">Condition:</span>{" "}
                <span className="text-indigo-600 font-semibold">{product.condition}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Starting Bid:</span>{" "}
                <span className="text-indigo-600 font-semibold">Rs.{product.starting_bid}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Minimum Increment:</span>{" "}
                <span className="text-indigo-600 font-semibold">Rs.{product.min_increment}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Current Bid:</span>{" "}
                <span className="text-indigo-600 font-semibold">Rs.{currentBid}</span>
              </p>

              <h5 className="font-medium text-gray-700 mt-4 mb-2 text-lg">Seller Info:</h5>
              <p>
                <span className="font-medium text-gray-700">Seller Name:</span>{" "}
                <span className="text-indigo-600 font-semibold">{seller.username}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Company Name:</span>{" "}
                <span className="font-semibold">{seller.company_name}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Contact No:</span>{" "}
                <span className="font-semibold">{seller.contact}</span>
              </p>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Auction Leaderboard</h2>

            {bids.length > 0 ? (
              <div className="space-y-3 overflow-y-auto h-60 border-t border-gray-200 pt-3 mb-4">
                {bids.sort((a, b) => b.bidAmount - a.bidAmount).map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 
                        ? 'bg-indigo-50 border border-indigo-300 shadow-sm' 
                        : 'bg-gray-100 border border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold ${
                        index === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-gray-800 font-medium">{entry.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.bidTime).toLocaleString("en-IN", {
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
                    </div>
                    <p className={`font-semibold ${
                      index === 0 ? 'text-indigo-700' : 'text-indigo-600'
                    }`}>Rs.{entry.bidAmount}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-6 bg-gray-50 rounded-lg mb-4">
                No bids yet. Be the first to bid!
              </p>
            )}

            {/* Moved Input Box to Bottom */}
            <div className="w-full">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    onChange={(e) => setBidAmount(e.target.value)}
                    type="number"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    aria-label="Enter your bid amount"
                    placeholder="Enter your bid..."
                    id="userInput"
                    min="0"
                    step={product.min_increment}
                  />
                </div>
                
                <button
                  onClick={handlePlaceBid}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-white font-semibold transition-all duration-300 ${
                    product.isLive
                      ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!product.isLive}
                  aria-label="Place bid"
                >
                  Place Bid
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Minimum Increment: <span className="font-semibold text-indigo-600">Rs.{product.min_increment}</span>
              </p>
            </div>
          </motion.section>
        </div>
      </div>

      <footer className="bg-white shadow-inner py-4 text-center text-gray-600">
        <p>© 2025 BidVault. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Auction;