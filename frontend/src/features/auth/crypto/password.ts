import type { PasswordRecord } from "../types.js";

export const DEFAULT_ITERATIONS = 600000;

// Convertir Uint8Array a string y que pueda ser almacenado en localStorage
async function toHex(bytes: Uint8Array): Promise<string> {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Convertir string a Uint8Array para poder usarlo en la derivacion de hash
async function fromHex(hex: string): Promise<Uint8Array> {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// Permite generar un hash a partir de una contraseña, una sal y un numero de iteraciones usando PBKDF2
async function deriveHash(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
    const passwordBytes = new TextEncoder().encode(password);

    const baseKey = await crypto.subtle.importKey(
        "raw", passwordBytes, "PBKDF2", false, ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" }, baseKey, 256
    );

    return new Uint8Array(bits);
}

export async function hashPassword(password: string, iterations: number = DEFAULT_ITERATIONS): Promise<PasswordRecord> {
    // genero una sal aleatoria de 16 bytes y genero el hash de la contraseña usando PBKDF2
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await deriveHash(password, salt, iterations);

    // creo el registro de contraseña con el hash derivado y la sal generada
    return {
        salt: await toHex(salt),
        hash: await toHex(hash),
        iterations,
        algorithm: "PBKDF2-SHA256"
    };
}

export async function verifyPassword(password: string, record: PasswordRecord): Promise<boolean> {
    // preparo el hash del registro para compararlo con el hash derivado de la contraseña ingresada
    const salt = await fromHex(record.salt);
    const hash = await deriveHash(password, salt, record.iterations);
    const recordHash = await fromHex(record.hash);

    // comparacion entre ambos hashes
    return hash.length === recordHash.length && hash.every((byte, index) => byte === recordHash[index]);
}