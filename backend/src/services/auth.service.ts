import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { generateToken } from "../utils/jwt";



export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
};
