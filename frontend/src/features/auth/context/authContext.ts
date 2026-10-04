import { createContext } from "react";
import type { AuthResult, Login, Register, UserProfile } from "../types.js";

export interface AuthContextValue {
    user: UserProfile | null,
    register: (input: Register) => Promise<AuthResult>,
    login: (input: Login) => Promise<AuthResult>,
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)