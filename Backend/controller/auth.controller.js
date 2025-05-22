import customerModel from "../models/customer.model.js";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import sellerModel from "../models/seller.model.js";

// Register the customer
const customerRegister = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {username, email, password, contact} = req.body;

        const userExist = await customerModel.findOne({email});

        if(userExist){
            return res.status(400).json({
                error : "User already Exists",
            })
        }

        const hash_pass = await bcrypt.hash(password, 10);

        const create_customer = await customerModel.create({
            username : username,
            email : email,
            password : hash_pass,
            contact : contact,
        })

        return res.status(200).json({Customer : create_customer})  
    } 
    catch (error) {
        res.status(400).json({error});
    }

}


// Login the User
const customerLogin = async(req, res) => {

    try {

        const { email , password } = req.body;

        // Check Email
        const validEmail = await customerModel.findOne({email});
        if(!validEmail){
            return res.status(400).json({
                error : "Invalid Credentials",
            })
        }

        // Check password
        const validPassword = await bcrypt.compare(password, validEmail.password);

        if(!validPassword){
            return res.status(400).json({
                error : "Invalid Credentials",
            })
        }

        // Generate JWT
        const token =  jwt.sign({id: validEmail._id, email : validEmail.email}, process.env.JWT_SECRET, {expiresIn : '1d'});
        
        return res.status(200).json({
            msg : "Login successful",
            customer : validEmail,
            token
        })
    }
     catch (error) {
        res.json({error});
    }
}


// Register Seller
const sellerRegister = async(req, res) => {

    const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    try {

        const {username, email, password, contact, company_name} = req.body;

        const userExist = await sellerModel.findOne({email});

        if(userExist){
            return res.status(400).json({error : "User already exists"});
        }

        const hash_pass = await bcrypt.hash(password, 10);

        const sellerCreated = await sellerModel.create({
            username: username,
            email: email,
            password: hash_pass,
            contact: contact,
            company_name: company_name,
        })

        return res.status(200).json({msg : "New Seller registered successfully", Seller : sellerCreated});
        
    } 
    catch (error) {
        res.json({error});   
    }
}


// Login Seller
const loginSeller = async(req, res) => {

    try {

        const {email, password} = req.body;

        // Check email exist or not
        const validEmail = await sellerModel.findOne({email});

        if(!validEmail){
            return res.status(400).json({error : "Invalid Crendentials"});
        }

        //Check password is correct or not
        const correctPass = await bcrypt.compare(password, validEmail.password);
        if(!correctPass){
            return res.status(400).json({error : "Invalid Crendentials"});
        }

        // Generate JWT

        const token = jwt.sign({id: validEmail._id, email: validEmail.email}, process.env.JWT_SECRET, {expiresIn: '1d'});

        return res.status(200).json({
            msg: "Login Successful", 
            seller: validEmail, 
            token
        })

    } 
    catch (error) {
        res.json({error});    
    }
}


export default {customerRegister, customerLogin, sellerRegister, loginSeller } 