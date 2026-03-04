import { Request, Response } from "express";
import * as AuthService from "../services/auth.services";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.logiUser(email, password);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const user = await AuthService.googleLogin(idToken);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
