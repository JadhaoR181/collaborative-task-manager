import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
