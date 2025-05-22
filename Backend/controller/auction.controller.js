import auctionModel from "../models/auction.model.js";
import biddersModel from "../models/bidders.model.js";
import customerModel from "../models/customer.model.js";
import sellerModel from "../models/seller.model.js"
import cron from 'node-cron';
import nodemailer from "nodemailer";

cron.schedule('* * * * *', async () => {

    const newTime = new Date(); 

    // Get IST Time
    const offsetIST = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
    const currentTime = new Date(newTime.getTime() + offsetIST).toISOString().slice(0, 19);

    // Set isLive true
    await auctionModel.updateMany(
        { start_time: { $lte: currentTime }, end_time: { $gt: currentTime } },
        { $set: { isLive: true} }
    );

    // Set isLive false
    await auctionModel.updateMany(
        { $or: [{ start_time: { $gt: currentTime } }, { end_time: { $lte: currentTime } }] },
        { $set: { isLive: false } }
    );

    // Set isEnded true 
    await auctionModel.updateMany(
        { end_time: { $lte: currentTime } },
        { $set: { isEnded: true, } }
    );

    console.log("Current Time : ", currentTime);
    console.log('Auction statuses updated.');
});


// Create a new auction
const createAuction = async(req, res) => {

    try {

        const { title, description, category, condition, product_image, starting_bid, min_increment, start_time, end_time } = req.body;

        const newTime = new Date(); 

        // Get IST Time
        const offsetIST = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
        const currentTime = new Date(newTime.getTime() + offsetIST).toISOString().slice(0, 19);
        
        if (start_time <= currentTime ) {
            return res.status(400).json({ error: "You cannot set the past start time" });
        }

        if (start_time >= end_time) {
            return res.status(400).json({ error: "Start time must be smaller than end time" });
        }
        

        // const minGap = 15 * 60 * 1000; // 15 minutes in milliseconds
        // const startTime = new Date(start_time);
        // const endTime = new Date(end_time);

        // if (endTime - startTime < minGap) {
        //     return res.status(400).json({ error: "End time must be at least 15 minutes after start time" });
        // }


        const createdAuction = await auctionModel.create({
            title,
            description,
            category,
            condition,
            product_image,
            starting_bid,
            min_increment,
            start_time,
            end_time,
            created_By : req.user._id,
        })

        return res.status(200).json({
            msg : "Auction created successfully",
            createdAuction
        })
        
    } 
    catch (error) {
        return res.status(400).json({error : "Something error occured", error});    
    }

}



// Fetch all auctions
const allAuctions = async(req, res) => {

    try {

        const {sellerId} = req.body;

        if(sellerId){

            const auctions = await auctionModel.find({created_By: sellerId});

            return res.status(200).json({auctions});
        }
        else{

            const auctions = await auctionModel.find({isEnded : false});
            
            return res.status(200).json({auctions});
        }
        
    } 
    catch (error) {
        return res.status(400).json({Error : error});    
    }

}




// Fetch only Live Auctions
const liveAuction = async(req, res) => {

    try {

        const liveAuctions = await auctionModel.find({isLive : true});

        return res.status(200).json({liveAuctions});
        
    } 
    catch (error) {
        return res.status(400).json({Eroor : "There is an error while fetching the live auctions"});  
    }

}


// Fetch ended auctions
const endedAuctions = async(req, res) => {

    try {

        const endedAuctions = await auctionModel.find({isEnded : true});

        return res.status(200).json({endedAuctions});
        
    } 
    catch (error) {
        return res.status(400).json({Eroor : "There is an error while fetching the ended auctions"});    
    }

}


// Fetch auctions as per the Category
const categoryAuction = async(req, res) => {

    try {

        const { productCategory } = req.body;

        const categoryWiseAuctions = await auctionModel.find({category : productCategory, isEnded: false});

        if(!categoryWiseAuctions){

            const otherAuctions = await auctionModel.find({category : "Other", isEnded: false});

            return res.json({
                otherAuctions
            });
        }

        return res.status(200).json({categoryWiseAuctions});
        
    }
    catch (error) {
        return res.status(400).json({Eroor : "There is an error while fetching the category wise auctions"});       
    }
    
}


// Fetch auction Info

const auctionInfo = async(req, res) => {

    try {

        const {productId} = req.body;

        const auctionData = await auctionModel.findOne({_id: productId});
        
        if(!auctionData){
            return res.status(400).json({msg : "Something went wrong"})
        }
        return res.status(200).json({auctionData});
        
    } catch (error) {
        return res.status(400).json({error})
    }
}



// Fetch auction data

const fetchauctionBid = async(req, res) => {

    try {

        const {productName, productId} = req.body;

        if (!productName) {
            return res.status(400).json({ msg: "Product name is required" });
        }

        const auctionData = await auctionModel.findOne({title: productName});
        if(!auctionData){
            return res.status(400).json({msg : "Something went wrong"})
        }

        const allBids = await biddersModel.find({productId: productId});
        if(!allBids){
            return res.status(400).json({msg : "Bids not found"})
        }

        return res.status(200).json({auctionData, allBids});
        
    } catch (error) {
        return res.status(400).json({error})
    }
}


// Fetch seller info from Id 

const fetchSellerInfo = async(req, res) => {

    try {

        const { sellerId } = req.body;

        if(!sellerId){
            return res.status(404).json({error : "Seller Id required"})
        }

        const sellerData = await sellerModel.findById({_id : sellerId})

        if(!sellerData){
            return res.status(404).json({error : "Seller not found"})
        }  
        
        return res.status(200).json({sellerData})
        
    } catch (error) {

        return res.status(404).json({error})
        
    }

}

// Fetch customer info from Id 

const fetchCustomerInfo = async(req, res) => {

    try {

        const { customerId } = req.body;

        if(!customerId){
            return res.status(404).json({error : "Customer Id required"})
        }

        const customerData = await customerModel.findById({_id : customerId})

        if(!customerData){
            return res.status(404).json({error : "Customer not found"})
        }  
        
        return res.status(200).json({customerData})
        
    } catch (error) {

        return res.status(404).json({error})
        
    }

}



// Add Bidder 

const addBidder = async(req, res) => {

    try {

        const { productId, customerId, username, email, bidAmount, bidTime } = req.body

        // Add new Bid
        const newBids = await  biddersModel.create({productId, customerId, username, email, bidAmount, bidTime})
        if(!newBids){
            return res.status(404).json({Error : "New Bid is not added"})
        }

        // Update the current amount
        const auctionData = await auctionModel.findById(productId);
        if(!auctionData){
            return res.status(404).json({Error : "Auction not found"})
        }
        auctionData.current_bid = bidAmount;
        await auctionData.save();

        // Fetching all bids using productId
        const allBids = await biddersModel.find({productId : productId})

        return res.status(200).json({ message: "Bid added successfully", auctionData, allBids });
        
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


// Fetch all Bidders

const allBidders = async(req, res) => {

    try {

        const allBids = await biddersModel.find();

        if(!allBids.length){
            return res.status(404).json({ error: "No bidders found"});
        }

        return res.status(200).json({allBids});
        
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


// Update the auction

const updateAuction = async (req, res) => {
    try {
        const { formData, auctionId } = req.body;

        if (!auctionId) {
            return res.status(400).json({ error: "Auction ID is required" });
        }

        const updatedAuction = await auctionModel.findByIdAndUpdate(
            auctionId,
            { $set: { ...formData } }, 
            { new: true, runValidators: true } 
        );

        if (!updatedAuction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        return res.status(200).json({ msg: "Auction updated successfully", auction: updatedAuction });
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Update the Seller

const updateSeller = async (req, res) => {
    try {
        const { formData, sellerId } = req.body;

        if (!sellerId) {
            return res.status(400).json({ error: "Seller ID is required" });
        }

        const updatedSeller = await sellerModel.findByIdAndUpdate(
            sellerId,
            { $set: { ...formData } }, 
            { new: true, runValidators: true } 
        );

        if (!updatedSeller) {
            return res.status(404).json({ error: "Seller not found" });
        }

        return res.status(200).json({ msg: "Seller updated successfully", seller: updatedSeller });
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Update the customer

const updateCustomer = async (req, res) => {
    try {
        const { formData, customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ error: "Customer ID is required" });
        }

        const updatedCustomer = await customerModel.findByIdAndUpdate(
            customerId,
            { $set: { ...formData } }, 
            { new: true, runValidators: true } 
        );

        if (!updatedCustomer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        return res.status(200).json({ msg: "Customer updated successfully", customer: updatedCustomer });
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



// Fetch the users bids

const fetchUserBids = async(req, res) => {

    try {

        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ error: "Customer ID is required" });
        }

        const userBids = await biddersModel.find({customerId: customerId});

        if (!userBids) {
            return res.status(404).json({ error: "No bids found" });
        }

        return res.status(200).json({ userBids });
        
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


// Set winner in database
const setWinnner = async(req, res) => {

    try {

        const {productId, winnerId, commision} = req.body;

        const auction = await auctionModel.findById(productId);
        if (!auction) {
            return res.status(400).json({ error: "Auction is not found" });
        }
        
        auction.highest_bidder = winnerId;
        auction.commission = commision;

        auction.save();

        return res.status(200).json({ msg: "Winner Addded successfully" });
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });    
    }
}


// Delete Auction 

const deleteAuction = async (req, res) =>{

    try {

        const {auctionId} = req.body;
        if (!auctionId) {
            return res.status(400).json({ error: "Auction Id required " });
        }

        await auctionModel.findOneAndDelete({_id: auctionId});

        return res.status(200).json({ msg: "Auction Deleted successfully" });
        
    } 
    catch (error) {
        return res.status(500).json({ error: error.message }); 
    }
}


// Send email to winner

const sendEmail = async(req, res) => {

    const { sellerEmail, winnerEmail, subject, message } = req.body;

    try {

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'adityaraje1304@gmail.com',
            pass: process.env.GMAIL_PASS, 
        },
        });
    
        const mailOptions = {
        from: sellerEmail,
        to: winnerEmail,
        subject: subject,
        text: message,
        };
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent!' });
        
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' }); 
    }

}

// Logout User
const blacklist = new Set();
const logoutCustomer = (req, res) => {
   
    const token = req.headers.authorization?.split(" ")[1];
    if (token) blacklist.add(token);
    res.json({ message: "Logged out successfully" });
    
}


export default {createAuction, allAuctions, liveAuction, endedAuctions, categoryAuction, auctionInfo, fetchauctionBid, fetchSellerInfo, addBidder, updateAuction, updateSeller, allBidders, fetchCustomerInfo, updateCustomer, fetchUserBids, setWinnner, deleteAuction, sendEmail, logoutCustomer }