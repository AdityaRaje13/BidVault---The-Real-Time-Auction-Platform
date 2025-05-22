import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'

function LoginSeller() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async(e) => {

    e.preventDefault();

    const seller = {
      email : email,
      password : password,
    }

    try {

      const response = await fetch("http://localhost:3000/bidvault/login_seller", {
        method : "POST",
        headers :{
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(seller),
      })

      if(response.ok){
        const data = await response.json();
        toast.success("Login Successful");
        localStorage.setItem("seller", JSON.stringify(data.seller));
        localStorage.setItem("token", data.token);
        navigate('/seller');
      }
      else{
        const result = await response.json();
        toast.error(result.error);
      }
      
    } 
    catch (error) {
      toast.error(error);  
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      
    {/* Left Half - Form */}
    <div className="w-1/2 flex items-center justify-center p-10 bg-white shadow-lg">
      <form onSubmit={handleSubmit} className="w-3/4 max-w-md bg-gray-50 p-6 rounded-xl shadow-2xl shadow-black">
        <h2 className="text-2xl font-semibold text-center mb-4">Login to Your Account</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input onChange={(e) => {setEmail(e.target.value)}} type="email" name='email' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter email" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input onChange={(e) => {setPassword(e.target.value)}} type="password" name='password' className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter password" />
        </div>
        
        <button type='submit' className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">Login</button>

        <p align="center">Don't Have an account <Link to="/register-seller" className='text-blue-700'>Register here</Link></p>
      </form>
    </div>
    
    {/* Right Half - Image */}
    <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('../../public/Images/Logo.jpg')" }}>
    </div>
  </div>
  )
}

export default LoginSeller