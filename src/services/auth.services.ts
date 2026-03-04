import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { verifyGoogleToken } from "./googleAuth.service";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id.toString()),
  };
};

export const logiUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id.toString()),
  };
};

export const googleLogin = async (idToken: string) => {
  const googleUser = await verifyGoogleToken(idToken);

  let user = await User.findOne({ email: googleUser.email });

  if (!user) {
    user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      googleId: "google",
    });
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id.toString()),
  };
};
