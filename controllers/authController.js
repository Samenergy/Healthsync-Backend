import jwt from "jsonwebtoken";
import { models } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    let role;
    let roleId;

    // Check the Administrator model first
    const admin = await models.Administrator.findOne({
      where: { email },
      include: {
        model: models.Hospital,
        attributes: ["hospitalId", "hospitalName"],
      },
    });

    if (admin && admin.validPassword(password)) {
      const token = jwt.sign(
        { id: admin.adminId, email: admin.email, role: "administrator" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        token,
        user: {
          id: admin.adminId,
          email: admin.email,
          role: "administrator",
          hospitalId: admin.Hospital ? admin.Hospital.hospitalId : null,
          hospitalName: admin.Hospital ? admin.Hospital.hospitalName : null,
        },
      });
    }

    // Iterate through user models to find the user with the provided email
    for (const [modelName, Model] of Object.entries(models)) {
      if (["Hospital", "Administrator"].includes(modelName)) continue; // Skip non-user models and Administrator

      user = await Model.findOne({
        where: { email },
        include: {
          model: models.Hospital,
          attributes: ["hospitalId", "hospitalName"],
        },
      });

      if (user) {
        role = modelName.toLowerCase();
        roleId = `${role}Id`;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await user.validPassword(password);
    

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user[roleId], email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user[roleId],
        email: user.email,
        role,
        hospitalId: user.Hospital ? user.Hospital.hospitalId : null,
        hospitalName: user.Hospital ? user.Hospital.hospitalName : null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { login };
const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};

export { logout };
