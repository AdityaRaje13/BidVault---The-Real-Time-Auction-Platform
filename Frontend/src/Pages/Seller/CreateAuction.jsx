import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateAuction = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startBid, setStartBid] = useState('');
  const [increment, setIncrement] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState("");

  const [buttonDisable, setButtonDisable] = useState(true);


  const uploadImage = async(e) => {
      const file = e.target.files[0];
      console.log(file);
      
      if(!file){
        console.log("File required");
      }

      const data = new FormData();

      data.append("file", file);
      data.append("upload_preset", "BidVault");
      data.append("cloud_name", "ddrkt0kgy");

      const response = await fetch("https://api.cloudinary.com/v1_1/ddrkt0kgy/image/upload", {
        method : "POST", 
        body : data
      })
  
      if(response.ok){
        const imgData = await response.json();
        setUrl(imgData.url);
        console.log("File uploaded");
        setButtonDisable(false);
      }
      else{
        alert("There is error in file upload");
      }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/bidvault/create-auction', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          condition,
          product_image: url,
          starting_bid: startBid,
          min_increment: increment,
          start_time: start,
          end_time: end,
        }),
      });

      if (response.ok) {
        toast.success('Auction Created Successfully');
        navigate('/seller/your-auctions');
        setButtonDisable(true);
      } else {
        const msg = await response.json();
        toast.error(msg.error);
        toast.error('Failed to create auction. Please try again.');
      }
    } 
    catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create auction. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-3 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full h-[90vh] overflow-scroll hide-scrollbar max-w-4xl p-8 transform transition-all hover:shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Auction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                placeholder="e.g., Vintage Watch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="datetime-local"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="datetime-local"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Starting Bid</label>
              <input
                type="number"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                placeholder="Rs.100"
                value={startBid}
                onChange={(e) => setStartBid(e.target.value)}
                required
                min={0}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Minimum Increment</label>
              <input
                type="number"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                placeholder="Rs.100"
                value={increment}
                onChange={(e) => setIncrement(e.target.value)}
                required
                min={1}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all appearance-none"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select Condition</option>
                <option>New</option>
                <option>Second Hand</option>
                <option>Refurbished</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all resize-none"
                rows="5"
                placeholder="Describe your item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                required
                onChange={uploadImage}
              />
            </div>
          </div>

          {buttonDisable ? 
            <button
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-gray-600 to-gray-300 text-white py-4 rounded-xl font-semibold  transform hover:scale-[1.02] transition-all duration-300 shadow-md"
            disabled
            >
            Create Auction
            </button>

            :

            <button
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Create Auction
            </button>
        
          }
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;