import signupModel from "../models/signup.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const signupController = {
  signup: async (req, res) => {
    try {
      const {firstName,lastName, hospitalName, email, password } = req.body;

      // Check if hospitalName already exists
      const existingHospital = await signupModel.findOne({ hospitalName });

      if (!existingHospital) {
        // If hospitalName doesn't exist, assign the role of "Administrator"
        const newUser = await signupModel.create({firstName,lastName, hospitalName, email, password, role: 'Administrator' });
        return res.status(200).json({ message: "User signed up successfully", user: newUser });
      } else {
        return res.status(200).json({ message: "Hospital exist" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup error" });
    }
  }
};


export default signupController;
