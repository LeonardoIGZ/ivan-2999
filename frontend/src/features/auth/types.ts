import { z } from 'zod';
import type { UserProfileSchema, PasswordRecordSchema, SessionSchema, RegisterSchema, LoginSchema, UserRecordsSchema, PasswordRecordsSchema } from './schemas.js';

// los tipos se infieren a partir de los schemas definidos en schema.ts con zod
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type PasswordRecord = z.infer<typeof PasswordRecordSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type UserRecords = z.infer<typeof UserRecordsSchema>;
export type PasswordRecords = z.infer<typeof PasswordRecordsSchema>;

// tipos para el resultado de la autenticación
export type AuthError = "EMAIL_TAKEN" | "INVALID_CREDENTIALS" | "STORAGE_ERROR";
export type AuthResult =
    | { ok: true; user: UserProfile }
    | { ok: false; error: AuthError };