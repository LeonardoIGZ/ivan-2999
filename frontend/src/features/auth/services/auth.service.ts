import type { AuthResult, Login, Register, Session, UserProfile, UserRecords, PasswordRecords, PasswordRecord } from "../types";
import { STORAGE_KEYS, getItem, removeItem, setItem } from "../../../lib/storage";
import { PasswordRecordsSchema, SessionSchema, UserRecordsSchema } from "../schemas";
import { hashPassword, verifyPassword } from "../crypto/password";

// Crea una sesión en el almacenamiento local para el usuario autenticado
function createSession(user: UserProfile): boolean {
    return setItem(STORAGE_KEYS.session, {
        userId: user.id,
        email: user.email,
        createdAt: new Date().toISOString()
    });
}

// Registra a un nuevo usuario, almacenando su perfil y credenciales en el almacenamiento local
export async function register(input: Register): Promise<AuthResult> {
    const availableUsers: UserRecords = getItem(STORAGE_KEYS.users, UserRecordsSchema) ?? {};
    const availableCredentials: PasswordRecords = getItem(STORAGE_KEYS.credentials, PasswordRecordsSchema) ?? {};

    // Verificar si el correo electrónico ya está registrado
    if (availableUsers[input.email])
        return { ok: false, error: "EMAIL_TAKEN" };

    // hash password
    const hashedPassword: PasswordRecord = await hashPassword(input.password);

    // crear el usuario
    const newUser: UserProfile = {
        id: crypto.randomUUID(),
        fullName: input.fullName,
        email: input.email,
        balance: 0,
        createdAt: new Date().toISOString()
    };

    // guardar el password generado
    availableCredentials[input.email] = hashedPassword;
    if (!setItem(STORAGE_KEYS.credentials, availableCredentials))
        return { ok: false, error: "STORAGE_ERROR" };

    // guardar el usuario
    availableUsers[input.email] = newUser;
    if (!setItem(STORAGE_KEYS.users, availableUsers))
        return { ok: false, error: "STORAGE_ERROR" };

    // guardar una sesion para el usuario registrado
    createSession(newUser);

    return { ok: true, user: newUser };
}

export async function login(input: Login): Promise<AuthResult> {
    const availableUsers: UserRecords = getItem(STORAGE_KEYS.users, UserRecordsSchema) ?? {};
    const availableCredentials: PasswordRecords = getItem(STORAGE_KEYS.credentials, PasswordRecordsSchema) ?? {};

    if (availableUsers[input.email] && availableCredentials[input.email]) {
        const user = availableUsers[input.email];
        const credentials = availableCredentials[input.email];

        // verificar la contraseña
        const isPasswordValid = await verifyPassword(input.password, credentials);

        if (isPasswordValid) {
            // guardar sesion
            createSession(user);

            return {
                ok: true,
                user: user
            };
        } else {
            return {
                ok: false,
                error: "INVALID_CREDENTIALS"
            };
        }
    } else {
        return {
            ok: false,
            error: "INVALID_CREDENTIALS"
        };
    }
}

// Eliminar la sesión actual del localStorage
export function logout(): void {
    removeItem(STORAGE_KEYS.session)
}

export function getCurrentUser(): UserProfile | null {
    const currentSession: Session | null = getItem(STORAGE_KEYS.session, SessionSchema);
    if (!currentSession) return null;

    const availableUsers: UserRecords = getItem(STORAGE_KEYS.users, UserRecordsSchema) ?? {};
    const currentUser: UserProfile = availableUsers[currentSession.email];
    if (!currentUser || currentUser.id !== currentSession.userId) return null;

    return currentUser;
}