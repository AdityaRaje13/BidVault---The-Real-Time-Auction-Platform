import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const YourAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null); 

  const [winner, setWinner] = useState({});

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [startBid, setStartBid] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');


  const deleteAuction = async(auctionId) => {
      try {
        const response = await fetch('http://localhost:3000/bidvault/delete', {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({auctionId})
        })

        if(response.ok){
          toast.success("Auction deleted successfully");
          getAuctions();
        }
        else{
          toast.error("Something went wrong");
        }
        
      } 
      catch (error) {
        console.log(error);
      }
  }


  const getAuctions = async () => {
    const seller = JSON.parse(localStorage.getItem('seller'));
    try {
      const response = await fetch('http://localhost:3000/bidvault/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId: seller._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions);
        console.log('Success');
      } else {
        const msg = await response.json();
        toast.error(msg.msg || msg.Error || 'Failed to fetch auctions');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error! Please try again.');
    }
  };

  const openEditModal = (auction) => {
    setSelectedAuction(auction); 
    setId(auction._id);
    setTitle(auction.title);
    setStartBid(auction.starting_bid || 0); 
    setIncrement(auction.min_increment || 0); 
    setCategory(auction.category || '');
    setCondition(auction.condition || '');
    setDescription(auction.description || '');
    setIsEditModalOpen(true);
  };

  const openResultModal = (auction) => {
    setSelectedAuction(auction); 
    setIsResultModalOpen(true);
    getWinnerDetails(auction.highest_bidder);
  };


  const getWinnerDetails = async(winnerId) => {

    try {
      const response = await fetch("http://localhost:3000/bidvault/customerData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({customerId: winnerId})
      });

      if (response.ok) {
        const data = await response.json();
        setWinner(data.customerData);
        console.log("success");
      } 
      else {
        console.log("Error while fetching the Customer info");
      }
    } catch (error) {
      console.log(error);
    }

  }


  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      starting_bid: startBid,
      min_increment: increment, 
      category,
      condition,
      description,
    };

    try {
      const response = await fetch('http://localhost:3000/bidvault/update-auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auctionId: id, formData }),
      });

      if (response.ok) {
        toast.success('Auction updated successfully');
        setIsEditModalOpen(false);
        getAuctions();
      } else {
        toast.error('Failed to update auction');
      }
    } catch (error) {
      toast.error('Error updating auction');
      console.log(error);
    }
  };

  useEffect(() => {
    getAuctions();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-2xl max-w-5xl mx-auto mt-8 max-h-[90vh] overflow-scroll hide-scrollbar">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Your Auctions</h1>

      <div className="space-y-6">
        {auctions.length === 0 ? (
          <p className="text-gray-500 text-lg">No auctions found.</p>
        ) : (
          auctions.map((auction, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{auction.title}</h2>
                <p className="text-gray-600 mt-1">
                  Current Bid: <span className="font-medium text-indigo-600">{auction.current_bid || 'N/A'}</span>
                </p>
              </div>

              <div className="flex items-center space-x-4">

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    auction.isEnded === true
                      ? 'bg-gray-200 text-gray-800'
                      : auction.isLive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {auction.isEnded === true ? 'Ended' : auction.isLive ? 'Live' : 'Upcoming'}
                </span>

                {auction.isEnded ? (
                  <button
                    onClick={() => openResultModal(auction)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium"
                  >
                    Check Results
                  </button>
                ) : (
                  <button
                    onClick={() => openEditModal(auction)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium"
                  >
                    View Details
                  </button>
                )}
                
                <button className='cursor-pointer hover:text-red-500 p-2 text-2xl' onClick={() => {deleteAuction(auction._id)}}>
                  <i class="fa-sharp-duotone fa-solid fa-trash"></i>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Auction</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  type="text"
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Starting Bid</label>
                  <input
                    value={startBid}
                    type="number"
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setStartBid(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Increment</label>
                  <input
                    value={increment}
                    type="number"
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setIncrement(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={category}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option>Antiques</option>
                    <option>Electronics</option>
                    <option>Watches</option>
                    <option>Vehicals</option>
                    <option>Fashion</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition</label>
                  <select
                    value={condition}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="">Select Condition</option>
                    <option>New</option>
                    <option>Second Hand</option>
                    <option>Refurbished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isResultModalOpen && selectedAuction && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Auction Results</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium">Auction Title:</span> {selectedAuction.title}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Winner:</span>{' '}
                {winner.fullname || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Contact:</span>{' '}
                {winner.contact || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{' '}
                {winner.email || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Address:</span>{' '}
                {winner.address || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Final Bid:</span> {selectedAuction.current_bid || 'N/A'}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsResultModalOpen(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourAuctions;