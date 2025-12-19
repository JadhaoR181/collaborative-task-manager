import { Request, Response } from "express";
import { loginDto, registerDto } from "../dtos/auth.dto";
import { loginUser, registerUser } from "../services/auth.service";
import { authCookieOptions } from "../config/cookies";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerDto.parse(req.body);

    const { user, token } = await registerUser(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    res.cookie("token", token, authCookieOptions);


    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginDto.parse(req.body);

    const { user, token } = await loginUser(
      validatedData.email,
      validatedData.password
    );
    res.cookie("token", token, authCookieOptions);
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
 res.clearCookie("token", {
  ...authCookieOptions,
  maxAge: 0
});

  res.status(200).json({ message: "Logged out successfully" });
};
