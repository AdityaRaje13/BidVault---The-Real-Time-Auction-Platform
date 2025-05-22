import mongoose from "mongoose";


const sellerSchema = new mongoose.Schema({

    username: {
        type : String,
        required: true,
        unique: true,
        maxlength: [50, "Username cannot exceed 50 chracters"],
        minlength: [5, "Username must contain 5 chracters"],
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        selected: false,
        minLength : [8, "Password must contain atleast 8 characters"],
    },

    contact: {
        type: String,
        required: true,
        unique: true,
        minLength : [10, "Contact must contain 10 characters"], 
        maxLength : [10, "Contact must contain only 10 characters"],
    },

    company_name: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        default: "",
    },

    total_auctions: {
        type : Number,
        default: 0,
    },

    company_email: {
        type: String,
        default: "",
    },

    company_address: {
        type: String,
        default: "",
    },

    country: {
        type: String,
        default: "",
    },

    state: {
        type: String,
        default: "",
    },

    GSTIN_No: {
        type: String,
        default: "",
    },
})

const sellerModel = mongoose.model("Seller", sellerSchema);

export default sellerModel;