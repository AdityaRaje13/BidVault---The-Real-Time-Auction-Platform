import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../../Components/CustomerNavbar';
import { toast } from 'react-toastify';

const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const customerData = JSON.parse(localStorage.getItem('customer'));

  // States for editable fields
  const [username, setUsername] = useState(customerData.username);
  const [email, setEmail] = useState(customerData.email);
  const [contact, setContact] = useState(customerData.contact);
  const [fullname, setFullname] = useState(customerData.fullname);
  const [Gender, setGender] = useState(customerData.Gender);
  const [address, setAddress] = useState(customerData.address);
  const [nearbyLocation, setNearbyLocation] = useState(customerData.nearby_location);

  const handleEditSubmit = async(e) => {
      e.preventDefault();
      const customer = JSON.parse(localStorage.getItem('customer'));
      const formData = {
          username,
          email,
          contact, 
          fullname,
          Gender,
          address,
          nearby_location: nearbyLocation
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
        } 
        else {
          toast.error('Failed to update Customer');
        }
      } 
      catch (error) {
        toast.error('Error updating customer');
        console.log(error);
      }
  }
  

  const mockCustomer = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    contact: '1234567890',
    fullname: 'John Doe',
    Gender: 'Male',
    address: '123 Main St, City',
    nearby_location: 'Downtown',
    auctions_won: 5,
    totalMoney_spent: 2500,
    createdAt: new Date().toISOString(),
  };

  const displayCustomer = customerData || mockCustomer;

  return (
    <>
      <CustomerNavbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {displayCustomer.username[0].toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{displayCustomer.fullname || displayCustomer.username}</h1>
                <p className="text-gray-600 mt-1">@{displayCustomer.username}</p>
                <p className="text-gray-500 mt-1">Joined: {new Date(displayCustomer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="text-gray-800 font-medium">{displayCustomer.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Contact:</span>
                  <p className="text-gray-800 font-medium">{displayCustomer.contact}</p>
                </div>
                <div>
                  <span className="text-gray-500">Gender:</span>
                  <p className="text-gray-800 font-medium">{displayCustomer.Gender || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Address:</span>
                  <p className="text-gray-800 font-medium">{displayCustomer.address || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nearby Location:</span>
                  <p className="text-gray-800 font-medium">{displayCustomer.nearby_location || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Auction Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Auction Statistics</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Auctions Won</span>
                  <span className="text-2xl font-bold text-blue-600">{displayCustomer.auctions_won}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Total Money Spent</span>
                  <span className="text-2xl font-bold text-green-600">${displayCustomer.totalMoney_spent.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6 text-center">
            <button  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>


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
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
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

    </>
  );
};

export default CustomerProfile;