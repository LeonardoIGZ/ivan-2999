import type { z } from "zod";

// Mapeo de las claves de almacenamiento local a sus nombres en localStorage
export const STORAGE_KEYS = {
    users: "snailbet:users",
    credentials: "snailbet:credentials",
    session: "snailbet:session",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Obtener un item del almacenamiento local y validarlo con un schema de zod
// los tipos se infieren a partir de los schemas definidos en schema.ts con zod
// Devuelve null si la llave no existe, el JSON está corrupto o no cumple el schema. No borra datos inválidos»
export function getItem<T>(key: StorageKey, schema: z.ZodType<T>): T | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
        const parsed = schema.safeParse(JSON.parse(item));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

// Asignar un item al almacenamiento local, serializandolo a JSON
export function setItem<T>(key: StorageKey, value: T): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

// Eliminar un item del almacenamiento local
export function removeItem(key: StorageKey): void {
    localStorage.removeItem(key);
}
