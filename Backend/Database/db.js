import mongoose from "mongoose";

export const Connection = () => {

    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Bidvault",
    })
    .then(() => {
        console.log("Successfully Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
};