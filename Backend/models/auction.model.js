import mongoose from 'mongoose';


const auctionSchema = new mongoose.Schema({

    // ----------------- Product Information --------------------
    title : {
        type : String,
        minlength : [2, "Product title must have minimum 6 chracters"],
        maxlength : [80, "Product title should not exceed 80 chracters"],
        required: true,
        unique : true, 
    },

    description : {
        type : String,
        required: true 
    },

    category : {
        type : String,
        required: true 
    },

    condition : {
        type : String,
        required: true 
    },

    product_image : {
        type : String,
        default : "",
    },


    // ------------- Auction Pricing information ----------------
    starting_bid : {
        type : Number,
        default : 0
    },

    current_bid : {
        type : Number,
        default : 0
    },

    min_increment : {
        type : Number,
        default : 0
    },

    commission : {
        type : Number,
        default : 0
    },


    // -------------- Auction Timmings information ------------------
    start_time : {
        type : Date,
        required: true 
    },

    end_time : {
        type : Date,
        required: true 
    },

    isLive : {
        type : Boolean,
        default : false
    },

    isEnded : {
        type : Boolean,
        default : false
    },


    // -----------  Auction Owner Information --------------------
    created_By : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Seller",
        required : true,
    },

    highest_bidder : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', 
        default : null
    }

}) 


const auctionModel = mongoose.model("Auction", auctionSchema);

export default auctionModel;