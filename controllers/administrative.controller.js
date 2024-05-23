import userModel from "../models/user.model.js";

const userController = {
  createUser: async (req, res) => {
    try {
      const { fullName, email, role: newRole } = req.body;
      const password = Math.random().toString(36).slice(-8);
      
      const newUser = await userModel.create({ fullName, email, password, role: newRole });
      console.log(newUser);
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  },
  allUsers: async (req, res) => { 
    try {
      const listUsers = await userModel.find();
      res.status(200).json({
        message: 'List of all users',
        users: listUsers
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Server error" });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedUser = await userModel.findByIdAndDelete(id);
      res.status(200).json({
        message: 'User deleted',
        user: deletedUser
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default userController;
