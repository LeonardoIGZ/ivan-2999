import type { AuthError } from "./types";

// Record<AuthError, string> obliga a definir un mensaje para cada código:
// si agregas un código nuevo a AuthError, TypeScript marcará error aquí.
export const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
    EMAIL_TAKEN: "Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.",
    INVALID_CREDENTIALS: "Correo o contraseña incorrectos.",
    STORAGE_ERROR:
        "No se pudo guardar la información en este navegador. Revisa que el almacenamiento no esté bloqueado e intenta de nuevo.",
};

export const UNEXPECTED_ERROR_MESSAGE = "Ocurrió un error inesperado. Intenta de nuevo.";