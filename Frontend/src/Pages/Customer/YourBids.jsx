import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../../Components/CustomerNavbar';
import BidCard from '../../Components/BidCard';

const YourBids = () => {

    const [yourBids, setYourBids] = useState([]);

    const fetchYourBids = async() => {

        try {

            const customer = JSON.parse(localStorage.getItem('customer'));

            const response = await fetch('http://localhost:3000/bidvault/userbids', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({customerId: customer._id})
            })

            if(response.ok){
                const data = await response.json();
                setYourBids(data.userBids);
                console.log("Success");
            }
            else{
                console.log("failed");
            }
            
        } 
        catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
      fetchYourBids();
    }, [])

  return (
    <div className="bg-gray-100 min-h-screen">

        <CustomerNavbar/>

      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Your Bids
        </h1>

        {/* Bids List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {yourBids.map((bid, idx) => (
            <BidCard index={idx} bidAmount={bid.bidAmount} bidTime={bid.bidTime} productId={bid.productId}/>
          ))}
        </div>

        {/* Empty State */}
        {yourBids.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No Bids Yet</h2>
            <p className="text-gray-500 mt-2">Start bidding on auctions to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourBids;