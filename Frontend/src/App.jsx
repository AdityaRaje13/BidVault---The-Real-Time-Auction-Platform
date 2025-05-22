// App.jsx
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import './index.css';
import RegisterSeller from './Pages/Seller_auth/RegisterSeller';
import LoginSeller from './Pages/Seller_auth/LoginSeller';
import RegisterCustomer from './Pages/Customer_auth/RegisterCustomer';
import LoginCustomer from './Pages/Customer_auth/LoginCustomer';
import LandingPage from './Pages/LandingPage/LandingPage';
import Customer from './Pages/Customer/Customer';
import Seller from './Pages/Seller/Seller';
import ProductDisplay from './Pages/Products/ProductDisplay';
import ProductInfo from './Pages/Products/ProductInfo';
import Auction from './Pages/Auction/Auction';

// Import the new seller pages
import Profile from './Pages/Seller/Profile';
import Statistics from './Pages/Seller/Statistics';
import YourAuctions from './Pages/Seller/YourAuctions';
import CreateAuction from './Pages/Seller/CreateAuction';
import LeaderBoard from './Pages/Customer/LeaderBoard';
import CustomerProfile from './Pages/Customer/CustomerProfile';
import YourBids from './Pages/Customer/YourBids';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register-seller" element={<RegisterSeller />} />
        <Route path="/login-seller" element={<LoginSeller />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/login-customer" element={<LoginCustomer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/leaderboard" element={<LeaderBoard/>} />
        <Route path="/profile" element={<CustomerProfile/>} />
        <Route path="/yourbids" element={<YourBids/>} />

        {/* Seller route with nested routes for the new pages */}
        <Route path="/seller" element={<Seller />}>
          <Route path="profile" element={<Profile />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="your-auctions" element={<YourAuctions />} />
          <Route path="create-auction" element={<CreateAuction />} />
          <Route index element={<Statistics />} /> {/* Default route for /seller */}
        </Route>

        <Route path="/product-display" element={<ProductDisplay />} />
        <Route path="/product-info" element={<ProductInfo />} />
        <Route path="/auction" element={<Auction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;