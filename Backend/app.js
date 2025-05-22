import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { Connection } from './Database/db.js';


// Importing Routes
import authRouter from './Routes/auth.route.js'
import auctionRouter from './Routes/auction.route.js'


const app = express();

Connection();

// Important Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));



// File upload
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",
}));


// cors policy
app.use(cors({
    origin : '*',
    methods : ['GET', 'POST', 'UPDATE', 'DELETE'],
    credentials : true,
}))


// Creating api's

app.use('/bidvault', authRouter, auctionRouter);


export default app;