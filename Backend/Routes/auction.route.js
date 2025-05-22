import express from 'express';
import auctionController from '../controller/auction.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'


const router = express.Router();


// Create new Auction
router.post('/create-auction', authMiddleware.authSeller, auctionController.createAuction);


// Fetch All auctions
router.post('/all', auctionController.allAuctions);


// Fetch Live auctions
router.get('/live', auctionController.liveAuction);


// Fetch ended auctions
router.get('/end', auctionController.endedAuctions);


// Fetch category wise auctions
router.post('/category', auctionController.categoryAuction);


// Fetch auction details
router.post('/auctioninfo', auctionController.auctionInfo);


// Fetch auction and its bids
router.post('/auctionData', auctionController.fetchauctionBid);

// Fetch seller data
router.post('/sellerData', auctionController.fetchSellerInfo);

// Fetch customer data
router.post('/customerData', auctionController.fetchCustomerInfo);

// Add bidder
router.post('/add-bidder', auctionController.addBidder);


// Update the auction
router.post('/update-auction', auctionController.updateAuction);


// Update the seller
router.post('/update-seller', auctionController.updateSeller);

// Update the customer
router.post('/update-customer', auctionController.updateCustomer);

// Get all bidders
router.get('/allbidders', auctionController.allBidders);


// Get all User bids 
router.post('/userbids', auctionController.fetchUserBids);


// Set winner to DB
router.post('/setwinner', auctionController.setWinnner);

// Delete auction
router.post('/delete', auctionController.deleteAuction);


// Send email to winner
router.post('/sendmail', auctionController.sendEmail);

// Send email to winner
router.post('/logout_customer', auctionController.logoutCustomer);


export default router;
