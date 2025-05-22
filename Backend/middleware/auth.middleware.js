import jwt from 'jsonwebtoken';
import customerModel from '../models/customer.model.js';
import sellerModel from '../models/seller.model.js';


const authCustomer = async(req, res, next) => {

    try {

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(400).json({msg : "User not aunthenticated"}); 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const customer = await customerModel.findById(decoded.id);

        if(!customer){
            return res.status(401).json({ msg: "Customer not found" });
        }

        req.user = customer;
        next();
        
    } 
    catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
  
}


const authSeller = async(req, res, next) => {

    try {

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(400).json({msg : "User not aunthenticated"}); 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const seller = await sellerModel.findById(decoded.id);

        if(!seller){
            return res.status(401).json({ msg: "Seller not found" });
        }

        req.user = seller;
        next();
        
    } 
    catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
  
}


export default {authCustomer, authSeller, };



