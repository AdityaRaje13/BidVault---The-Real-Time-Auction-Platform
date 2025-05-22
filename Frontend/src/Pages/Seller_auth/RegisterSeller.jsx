import React, { useState } from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'


function RegisterSeller() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [company, setCompany] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async(e) => {

      e.preventDefault();

      const seller = {
        username : username,
        email : email,
        password : password,
        contact: contact,
        company_name : company
      }

      try {

        const response = await fetch("http://localhost:3000/bidvault/register_seller", {
          method : "POST",
          headers : {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify(seller)
        })
        
        if(response.ok){
          toast.success("Seller Registerd Successfully");
          navigate('/login-seller');
        }
        else{
            const result = await response.json();
            toast.error(result.error);
            result.errors.map((err) => (toast.error(err.msg)));
        }
      
      } 
      catch (error) {
         toast.error(error);   
      }

  }

  return (
    <>
    
        <div className="flex h-screen w-screen bg-gray-100">
          
          {/* Left Half - Title */}
          <div className="w-1/2 bg-blue-600 flex items-center justify-center text-white text-4xl font-bold p-10 relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('../../public/Images/Logo.jpg')" }}></div>
          </div>
          
          {/* Right Half - Form */}
          <div className="w-1/2 flex items-center justify-center p-10 bg-white shadow-lg ">
            <form onSubmit={handleSubmit} className="w-3/4 max-w-md bg-gray-50 p-6 rounded-xl shadow-2xl shadow-black">
              <h2 className="text-2xl font-semibold text-center mb-4">Create Your Account as a<br />  Seller</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input onChange={(e) => {setUsername(e.target.value)}} type="text" name='username' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter username" required/>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input onChange={(e) => {setEmail(e.target.value)}} type="email" name='email' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter email" required/>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input onChange={(e) => {setPassword(e.target.value)}} type="password" name='password' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter password" required/>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Contact</label>
                <input onChange={(e) => {setContact(e.target.value)}} type="text" name='contact' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter contact number" required/>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Company Name</label>
                <input onChange={(e) => {setCompany(e.target.value)}} type="text" name='company' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter company name" required/>
              </div>
              
              <button type='submit' className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">Register</button>

              <p align="center">Already Have an account <Link to="/login-seller" className='text-blue-700'>Login here</Link></p>

            </form>
          </div>
        </div>

    </>
  )
}

export default RegisterSeller