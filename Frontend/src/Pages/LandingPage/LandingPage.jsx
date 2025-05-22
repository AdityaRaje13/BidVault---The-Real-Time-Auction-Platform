import React from 'react'
import './LandingPage.css'

import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <>
    
      <div className="hero h-screen rounded-4xl">

          <div className="navbar px-10 py-7">

            <div className="flex items-center">
              <img src="../../public/images/Logo.jpg" alt="Logo" className="h-14 w-15 mr-3 rounded-xl" />
              <h1 className="text-3xl font-bold font-poppins">Bidvault</h1>
            </div>

            <div className="btns flex gap-10 text-xl font-semibold ">
              <a href="#register"><button>Sign in/Sign up</button></a>
              <a href="#working"><button>How it works</button></a>
              <a href="#features"><button>Features</button></a>
            </div>

          </div>

          <div className="content flex items-center content-center gap-30 px-30">

              <div className="info">
                  <h1>Get The Best Deal On <br /> Bid-Vault</h1>
                  <p align='justify'>
                    <h2 className='text-xl'>Welcome to BidVault - The Ultimate Auction Platform !!!</h2> 
                    BidVault offers a thrilling auction experience where you can bid on a wide range of products, including electronics, clothing, vehicles, antiques, and much more all in real time! BidVault ensures you get the best deals....
                    <h2 className='font-semibold'>Join now and start bidding! 🛍️🚗📱</h2>
                  </p>
                  <a href="#register"><button className='px-12 py-2 bg-cyan-700 text-white rounded-2xl mt-4 text-xl transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl active:scale-95'>Let's Start</button></a>
              </div>

              <div className="image">
                  <img src="../../public/images/3565809.jpg" alt="" className='heroImage'/>
              </div>

          </div>

      </div>

      <div className="Register my-5 " id='register'>

          <h1 align= "center" className='text-6xl p-5'> Register Yourself !</h1>

          <div className="cards mt-8">

            <div className="card w-80 flex flex-col items-center content-center rounded-2xl py-9">
              <img src="../../public/images/profile.jpg" className="h-48 w-48 rounded-full" alt="..."/>
              <div className="card-body">
                <h5 className="text-3xl my-3" align="center">I am a Buyer</h5>
                <Link to="/register-customer">
                  <button className="px-20 py-3 border rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl active:scale-95">Register as Buyer</button>
                </Link>
              </div>
            </div>

            <div className="card w-80 flex flex-col items-center content-center rounded-2xl py-9">
              <img src="../../public/images/profile.jpg" className="h-48 w-48 rounded-full" alt="..."/>
              <div className="card-body">
                <h5 className="text-3xl my-3" align="center">I am a Seller</h5>
                <Link to="/register-seller">
                  <button className="px-20 py-3 border rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl active:scale-95">Register as Seller</button>
                </Link>
              </div>
            </div> 

          </div>

      </div>


      <div className="working mx-10 mb-5 text-center" id='working'>

        <h2 className="working-title text-6xl p-7">How It Works!</h2>
        
        <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10">
          
          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">1️⃣ Register as Buyer or Seller</h3>
            <p className="text-gray-600">Sign up and choose your role – **Buyer** or **Seller**.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">2️⃣ Sellers List Products</h3>
            <p className="text-gray-600">Sellers create auctions with product details, starting price, and end time.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">3️⃣ Buyers Place Bids</h3>
            <p className="text-gray-600">Buyers compete by placing bids in real-time.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">4️⃣ Highest Bid Wins</h3>
            <p className="text-gray-600">At auction end, the highest bid is declared the **winner**.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">5️⃣ Winner Receives Email</h3>
            <p className="text-gray-600">The winner gets a **confirmation email** with payment instructions.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">6️⃣ Payment Completion</h3>
            <p className="text-gray-600">The winner completes the **secure payment** to finalize the purchase.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">7️⃣ Seller Ships Product</h3>
            <p className="text-gray-600">Once payment is received, the seller ships the product to the winner.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">8️⃣ Buyer Receives Item</h3>
            <p className="text-gray-600">The buyer receives the item and confirms delivery.</p>
          </div>

          <div className="step-box p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">9️⃣ Start Again!</h3>
            <p className="text-gray-600">Enjoy seamless auctions and continue bidding for great deals.</p>
          </div>

        </div>
      </div>


      <div className="Features mx-10" id='features'>

          <div className="feature-card flex h-[400px] w-full rounded-4xl overflow-hidden bg-gradient-to-r from-[#9AD1D4] to-[#007EA7] my-5">
      
            {/* Left Side - Content */}
            <div className="w-1/2 flex items-center justify-center text-white">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Get the wide range of Products</h2>
                <p className="text-xl mt-2">Join BidVault and get the variety of products options to buy.</p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-1/2">
              <img src="../../public/images/9305092.jpg" alt="Auction" className="w-full h-full object-cover" />
            </div>

          </div>


          <div className=" feature-card flex h-[400px] w-full rounded-4xl overflow-hidden bg-gradient-to-r from-[#9AD1D4] to-[#007EA7] my-10">
      
            {/* Left Side - Content */}

            <div className="w-1/2">
              <img src="../../public/images/auction.jpg" alt="Auction" className="w-full h-full object-cover" />
            </div>

            {/* Right Side - Image */}
            <div className="w-1/2 flex items-center justify-center text-white">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Experience Seamless Bidding</h2>
                <p className="text-xl mt-2">Join BidVault and get the best deals in real-time auctions.</p>
              </div>
            </div>
            

          </div>


          <div className="feature-card flex h-[400px] w-full rounded-4xl overflow-hidden bg-gradient-to-r from-[#9AD1D4] to-[#007EA7] my-5">
      
            {/* Left Side - Content */}
            <div className="w-1/2 flex items-center justify-center text-white">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Get unbelievable deals on the items</h2>
                <p className="text-xl mt-2">BidVault provides you the unbelievable deals on various products which blow your mind !!!</p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-1/2">
              <img src="../../public/images/3565809.jpg" alt="Auction" className="w-full h-full object-cover" />
            </div>

          </div>

      </div>

      <div className="footer">

        <div className="w-full h-[250px] bg-gray-900 text-white flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">BidVault</h2>
          <p className="text-sm text-gray-400 mt-2">Your Trusted Real-Time Auction Platform</p>
          
          <div className="flex gap-6 mt-4">
            <a href="#" className="hover:text-gray-300">About Us</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          </div>

          <p className="text-xs text-gray-500 mt-4">&copy; 2024 BidVault. All rights reserved.</p>
        </div>

      </div>
    
    </>
  )
}

export default LandingPage