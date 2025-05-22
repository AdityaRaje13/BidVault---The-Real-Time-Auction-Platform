import mongoose, { Schema } from "mongoose";

const bidderSchema = new mongoose.Schema({

     // -------------- Bidders information ---------------------
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction', 
        default : null,
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', 
        default : null,
    },
    username:{
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    bidAmount: { 
        type: Number, 
        default : 0,
        required: true,
    },
    bidTime: {
        type: Date,
        default : Date.now(),
    }  

})


const biddersModel = mongoose.model("Bidders", bidderSchema);

export default biddersModel;