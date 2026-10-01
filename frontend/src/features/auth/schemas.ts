import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.string(),
    fullName: z.string().trim().minLength(3).maxLength(100),
    email: z.email().trim(),
    balance: z.number().min(0),
    createdAt: z.iso.datetime()
});

export const SessionSchema = z.object({
    userId: z.string(),
    email: z.email().trim(),
    createdAt: z.iso.datetime()
});

export const PasswordRecordSchema = z.object({
    salt: z.string(),
    hash: z.string(),
    iterations: z.number().min(1),
    algorithm: z.literal('PBKDF2-SHA256')
});