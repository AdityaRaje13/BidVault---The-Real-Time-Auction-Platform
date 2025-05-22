import express from 'express';
import authController from '../controller/auth.controller.js'
import { body } from 'express-validator';


const router = express.Router();


// Routes for Customer authentication

router.post('/register_customer',
    [
        body('username').isLength({min : 3}).withMessage("Username must contain 3 characters"),
        body('contact').isNumeric().isLength({max: 10, min: 10}).withMessage("Contact must contain numbers and 10 chracters long"),
        body('email').isEmail().withMessage("Email must be valid email address"),
        body('password').isLength({min : 8}).withMessage("Password must contain minimum 8 chracters"),
    ],    
    authController.customerRegister);

router.post('/login_customer',authController.customerLogin
);


// Routes for Seller authentication

router.post('/register_seller',
    [
        body('username').isLength({min : 3}).withMessage("Username must contain 3 characters"),
        body('contact').isNumeric().isLength({max: 10, min: 10}).withMessage("Contact must contain numbers and 10 chracters long"),
        body('email').isEmail().withMessage("Email must be valid email address"),
        body('password').isLength({min : 8}).withMessage("Password must contain 8 chracters"),
    ],
    authController.sellerRegister);

router.post('/login_seller', authController.loginSeller);

export default router;
