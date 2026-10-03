import { z } from 'zod';
import type { UserProfileSchema, PasswordRecordSchema, SessionSchema, RegisterSchema, LoginSchema } from './schemas.js';

// los tipos se infieren a partir de los schemas definidos en schema.ts con zod
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type PasswordRecord = z.infer<typeof PasswordRecordSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
