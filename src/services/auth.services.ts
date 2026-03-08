import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../models/user.model';
import { createDefaultCategoriesForUser } from './category.services';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (data: Partial<IUser>) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('USER_EXISTS');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password as string, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: 'local',
  });

  await createDefaultCategoriesForUser(user.id);

  const token = generateToken(user.id);
  return { user, token };
};

export const loginUser = async (data: Partial<IUser>) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password');
  if (!user || user.provider !== 'local') {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isMatch = await bcrypt.compare(password as string, user.password as string);
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = generateToken(user.id);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const googleLogin = async (idToken: string) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID not defined');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('INVALID_GOOGLE_TOKEN');
  }

  const { email, name = 'Google User' } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      provider: 'google',
      isVerified: true,
    });

    await createDefaultCategoriesForUser(user.id);
  } else if (user.provider !== 'google') {
    // User exists with local provider, but tries to login with google
  }

  const token = generateToken(user.id);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};
