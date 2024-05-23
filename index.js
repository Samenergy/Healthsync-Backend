import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import mongoose from "mongoose";
import configurations from "./configs/index.js";
//import signupRouter from "./routes/signup.route.js";
import router from "./routes/login.route.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import { fileURLToPath } from "url";
import path from 'path'
const __filename=fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views))

const app = express();


app.use(cors());
app.use(express.json());
//app.use('/signup', signupRouter);
app.use( router);

mongoose.connect(configurations.MONGODB_CONNECTION_STRING)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(configurations.PORT, () => {
        console.log(`Server is running on port ${configurations.PORT}`);
    })
})
.catch(err => {
    console.log(err);
})



app.use(ErrorHandler);