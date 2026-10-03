import { describe, expect, it } from "vitest";
import { LoginSchema, RegisterSchema } from "./schemas.js";
import { z } from "zod";

const validSchema = {
    fullName: "Hall Jordan  ",
    email: "hall.jordan@example.com",
    password: "Password123",
    confirmPassword: "Password123",
}

describe("registro para auth", () => {
    it("esquema de registro válido", () => {
        const result = RegisterSchema.safeParse({ ...validSchema, email: "  Hall.Jordan@Example.com " });
        expect(result.data?.email).toBe("hall.jordan@example.com");
        expect(result.data?.fullName).toBe("Hall Jordan");
    });

    it("contraseña sin mayuscula", () => {
        const invalidSchema = { ...validSchema, password: "password123", confirmPassword: "password123" };
        expect(RegisterSchema.safeParse(invalidSchema).success).toBe(false);
    });

    it("registro contraseñas distintas", () => {
        const result = RegisterSchema.safeParse({ ...validSchema, confirmPassword: "Otra123" });
        const errors = z.flattenError(result.error!).fieldErrors;
        expect(errors.confirmPassword).toContain("Las contraseñas no coinciden");
    });

    it("registro contraseña sin número", () => {
        const invalidSchema = { ...validSchema, password: "Password" };
        expect(RegisterSchema.safeParse(invalidSchema).success).toBe(false);
    });

    it("registro contraseña no se modifica", () => {
        const result = RegisterSchema.safeParse({ ...validSchema, password: " Password123 ", confirmPassword: " Password123 " });
        expect(result.data?.password).toBe(" Password123 ");
    })

    it("nombre invalido", () => {
        const invalidSchema = { ...validSchema, fullName: "Al" };
        expect(RegisterSchema.safeParse(invalidSchema).success).toBe(false);
    });

});


describe("login para auth", () => {
    it("login con email inválido", () => {
        const invalidSchema = { email: "invalid-email", password: validSchema.password };
        expect(LoginSchema.safeParse(invalidSchema).success).toBe(false);
    });

    it("login sin password", () => {
        const invalidSchema = { email: validSchema.email, password: "" };
        expect(LoginSchema.safeParse(invalidSchema).success).toBe(false);
    });

    it("login con password sin modificar", () => {
        const invalidSchema = { email: validSchema.email, password: " Password123 " };
        const result = LoginSchema.safeParse(invalidSchema);

        expect(result.data?.password).toBe(" Password123 ");
    });
});