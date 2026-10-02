// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";
import { PasswordRecordSchema } from "../schemas.js";
import { pbkdf2Sync } from "node:crypto";

const FAST = 1_000;

describe("Password", () => {
    it("devuelve un record válido según el schema", async () => {
        const record = await hashPassword("Secreta123", FAST);
        expect(record.hash).not.toBe("Secreta123");
        expect(PasswordRecordSchema.safeParse(record).success).toBe(true);
    });

    it("misma contraseña genera distinto hash y salt", async () => {
        const hashedPassword1 = await hashPassword("password123", FAST);
        const hashedPassword2 = await hashPassword("password123", FAST);

        expect(hashedPassword1.hash).not.toEqual(hashedPassword2.hash);
        expect(hashedPassword1.salt).not.toEqual(hashedPassword2.salt);
    });

    it("el password se verifica correctamente", async () => {
        const password = "password123";
        const hashedPassword = await hashPassword("password123", FAST);
        const isValid = await verifyPassword(password, hashedPassword);
        expect(isValid).toBe(true);
    });

    it("el password no se verifica correctamente", async () => {
        const password = "password456";
        const hashedPassword = await hashPassword("password123", FAST);
        const isValid = await verifyPassword(password, hashedPassword);
        expect(isValid).toBe(false);
    });

    it("produce el mismo hash que la implementación de Node", async () => {
        const record = await hashPassword("Secreta123", FAST);
        const expected = pbkdf2Sync(
            "Secreta123", Buffer.from(record.salt, "hex"), FAST, 32, "sha256"
        ).toString("hex");
        expect(record.hash).toBe(expected);
    });
});