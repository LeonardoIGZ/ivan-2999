import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.uuid(),
    fullName: z.string().min(3),
    email: z.email(),
    balance: z.number().min(0),
    createdAt: z.iso.datetime()
});

export const PasswordRecordSchema = z.object({
    salt: z.string().regex(/^[0-9a-f]{32}$/), // 16 bytes  = 32 carcateres hexadecimales
    hash: z.string().regex(/^[0-9a-f]{64}$/), // 32 bytes = 64 caracteres hexadecimales
    iterations: z.number().int().positive().min(1),
    algorithm: z.literal('PBKDF2-SHA256')
});

export const RegisterSchema = z.object({
    fullName: z.string().trim().min(3, "Ingresa tu nombre completo"),
    email: z.string().trim().toLowerCase().pipe(z.email("Ingresa un correo electrónico válido")),
    password: z.string()
        .min(8, { message: "Debe ser almenos de 8 caracteres" })
        .max(64, { message: "No puede ser mayor a 64 caracteres" })
        .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
        .regex(/[0-9]/, { message: "Debe incluir al menos un número" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export const LoginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email("Ingresa un correo electrónico válido")),
    password: z.string().min(1, { message: "La contraseña no puede estar vacía" })
});

export const SessionSchema = z.object({
    userId: z.uuid(),
    email: z.email(),
    createdAt: z.iso.datetime()
});

export const UserRecordsSchema = z.record(z.string(), UserProfileSchema);

export const PasswordRecordsSchema = z.record(z.string(), PasswordRecordSchema);