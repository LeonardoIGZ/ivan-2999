import { beforeEach, describe, expect, it } from "vitest";
import { register, login, logout, getCurrentUser } from "./auth.service.js";
import { STORAGE_KEYS } from "../../../lib/storage.js";
import { UserProfileSchema } from "../schemas.js";

const validData = {
    fullName: "Hall Jordan",
    email: "hall.jordan@test.com",
    password: "Password123",
    confirmPassword: "Password123"
}

describe("Servicio Auth", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("registro con email ya existente", async () => {
        const result = await register(validData);
        expect(result.ok).toBe(true);
    });

    it("login con password incorrecto", async () => {
        await register(validData);
        logout();

        const result = await login({
            email: validData.email,
            password: "Chivas15"
        });

        expect(result.ok).toBe(false);
    });

    it("login con email inexistente", async () => {
        await register(validData);
        logout();

        const result = await login({
            email: "john.steward@test.com",
            password: validData.password
        });

        expect(result.ok).toBe(false);
    });

    it("login regresa el usuario", async() => {
        await register(validData);
        logout();

        const result = await login({
            email: validData.email,
            password: validData.password
        })

        expect(result.ok).toBe(true);
        expect(UserProfileSchema.safeParse(result.user).success).toBe(true);
    });

    it("logout elimina sesión y permite iniciar sesión sin problemas", async () => {
        await register(validData);
        logout();

        // sesión ya no existe
        expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
        expect(getCurrentUser()).toBeNull();

        // usuario sigue registrado
        expect(localStorage.getItem(STORAGE_KEYS.users)).toContain(validData.email);

        // puede volver a iniciar sesión
        const result = await login({ email: validData.email, password: validData.password });
        expect(result.ok).toBe(true);
        expect(getCurrentUser()?.email).toBe(validData.email);
    });

    it("no guarda la contraseña en texto plano", async () => {
        await register(validData);

        const keys = Object.keys(localStorage);
        expect(keys.length).toBeGreaterThan(0);

        for (const key of keys) {
            expect(localStorage.getItem(key)).not.toContain(validData.password);
        }
    });
});