import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true,
        minLength : [3, "Username must contain atleast 3 characters"], 
        maxLength : [15, "Username cannot exceed 50 characters"],
    },

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        minLength : [12, "Email must contain atleast 12 characters"], 
        maxLength : [50, "Email cannot exceed 50 characters"],
    },

    password : {
        type : String,
        required : true,
        minLength : [8, "Password must contain atleast 8 characters"],
        selected : false,
    },

    contact : {
        type : String,
        required : true,
        unique : true,
        minLength : [10, "Contact must contain 10 characters"], 
        maxLength : [10, "Contact must contain only 10 characters"],
    },

    fullname : {
        type: String,
        default : "",
    },

    Gender : {
        type : String,
        default : ''
    },

    address : {
        type : String,
        default : ''
    },

    nearby_location : {
        type : String,
        default : ''
    },

    auctions_won : {
        type : Number,
        default : 0,
    },

    totalMoney_spent : {
        type : Number,
        default : 0,
    },

    createdAt : {
        type : Date,
        default : Date.now(),
    }
})


const customerModel = mongoose.model('Customer',customerSchema);

export default customerModel;