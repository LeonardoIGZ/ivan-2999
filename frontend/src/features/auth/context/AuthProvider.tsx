import { useState, type ReactNode } from "react";
import * as authService from "../services/auth.service";
import type { Login, Register } from "../types";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(() => authService.getCurrentUser());

    async function login(input: Login) {
        const result = await authService.login(input);
        if (result.ok) setUser(result.user);
        return result;
    }

    async function register(input: Register) {
        const result = await authService.register(input);
        if (result.ok) setUser(result.user);
        return result;
    }

    function logout() {
        authService.logout();
        setUser(null);
    }

return <AuthContext value={{ user, login, register, logout }}>{children}</AuthContext>;
}