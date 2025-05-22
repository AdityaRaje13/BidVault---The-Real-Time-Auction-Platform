import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
  const seller = JSON.parse(localStorage.getItem('seller'));

  const [isEditing, setIsEditing] = useState(false);
  const [sellerdata, setSellerdata] = useState({});
  const [username, setUsername] = useState(seller.username);
  const [email, setEmail] = useState(seller.email);
  const [contact, setContact] = useState(seller.contact);
  const [companyName, setCompanyName] = useState(seller.company_name);
  const [address, setAddress] = useState(seller.address);
  const [companyEmail, setCompanyEmail] = useState(seller.company_email);
  const [companyAddress, setCompanyAddress] = useState(seller.company_address);
  const [country, setCountry] = useState(seller.country);
  const [state, setstate] = useState(seller.state);
  const [gstin, setGstin] = useState(seller.GSTIN_No);

  const fetchSellerData = async () => {
    const seller = JSON.parse(localStorage.getItem('seller'));
    try {
      const response = await fetch("http://localhost:3000/bidvault/sellerData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sellerId: seller._id })
      });

      if (response.ok) {
        const data = await response.json();
        setSellerdata(data.sellerData);
        console.log("Success");
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const seller = JSON.parse(localStorage.getItem('seller'));
    const formData = {
      username,
      email,
      contact,
      company_name: companyName,
      address,
      company_email: companyEmail,
      company_address: companyAddress,
      country,
      state,
      GSTIN_No: gstin
    };

    try {
      const response = await fetch('http://localhost:3000/bidvault/update-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId: seller._id, formData }),
      });

      if (response.ok) {
        toast.success('Seller updated successfully');
        setIsEditing(false);
        fetchSellerData();
      } else {
        toast.error('Failed to update seller');
      }
    } catch (error) {
      toast.error('Error updating seller');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 px-10">
          <h1 className="text-3xl font-bold text-white">{sellerdata.username}</h1>
          <p className="text-blue-100 mt-2">{sellerdata.email}</p>
        </div>

        {/* Seller Data Section */}
        <div className="p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Contact', value: sellerdata.contact },
              { label: 'Company Name', value: sellerdata.company_name },
              { label: 'Address', value: sellerdata.address },
              { label: 'Company Email', value: sellerdata.company_email },
              { label: 'Company Address', value: sellerdata.company_address },
              { label: 'Country', value: sellerdata.country },
              { label: 'State', value: sellerdata.state },
              { label: 'GSTIN No', value: sellerdata.GSTIN_No },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <p className="text-sm font-semibold text-gray-500 uppercase">{item.label}</p>
                <p className="text-lg text-gray-900 mt-1">{item.value || 'N/A'}</p>
              </div>
            ))}
          </div>

          {/* Edit Button */}
          <div className="mt-10 text-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="text"
                    value={contact}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={address}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Company Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Email</label>
                  <input
                    type="email"
                    value={companyEmail}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Company Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Address</label>
                  <input
                    type="text"
                    value={companyAddress}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={country}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={state}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setstate(e.target.value)}
                    required
                  />
                </div>

                {/* GSTIN No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">GSTIN No</label>
                  <input
                    type="text"
                    value={gstin}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setGstin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
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

export default Profile;