import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.string(),
    fullName: z.string().trim(),
    email: z.email().trim(),
    balance: z.number().min(0),
    createdAt: z.iso.datetime()
});

export const PasswordRecordSchema = z.object({
    salt: z.string().regex(/^[0-9a-f]{32}$/), // 16 bytes  = 32 carcateres hexadecimales
    hash: z.string().regex(/^[0-9a-f]{64}$/), // 32 bytes = 64 caracteres hexadecimales
    iterations: z.number().int().positive().min(1),
    algorithm: z.literal('PBKDF2-SHA256')
});

export const SessionSchema = z.object({
    userId: z.string(),
    email: z.email().trim(),
    createdAt: z.iso.datetime()
});
