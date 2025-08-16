import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const generatedRefreshToken = async (userId) => {
  try {
    if (!process.env.SECRET_KEY_REFRESH_TOKEN) {
      throw new Error('SECRET_KEY_REFRESH_TOKEN is not defined in .env');
    }

    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: '7d' }
    );

    const update = await UserModel.updateOne(
      { _id: userId },
      { refresh_token: token }
    );

    if (!update.modifiedCount) {
      throw new Error("Failed to update refresh token in database");
    }

    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error(error.message || "Could not generate refresh token");
  }
};

export default generatedRefreshToken;