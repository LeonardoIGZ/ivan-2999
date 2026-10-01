import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { STORAGE_KEYS, getItem, removeItem, setItem } from "./storage";

const testSchema = z.object({ name: z.string(), age: z.number() });
const KEY = STORAGE_KEYS.session;

describe("storage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => vi.restoreAllMocks());

    it("guarda y lee un objeto válido", () => {
        const data = { name: "Jeremy Spoken", age: 3 };
        setItem(KEY, data);
        expect(getItem(KEY, testSchema)).toEqual(data);
    });

    it("devuelve null si el JSON está corrupto", () => {
        localStorage.setItem(KEY, "{roto");  // escribe directo, saltándose el wrapper
        expect(getItem(KEY, testSchema)).toBeNull();
    });

    it("llave inexistente devuelve null", () => {
        expect(getItem(KEY, testSchema)).toBeNull();
    });

    it("no cumple con el esquema", () => {
        const invalidData = { name: "Julian Quiñones", age: "no es un número" };
        setItem(KEY, invalidData);
        expect(getItem(KEY, testSchema)).toBeNull();
    });

    it("elimina un elemento y regresa null", () => {
        const data = { name: "Jeremy Spoken", age: 3 };
        setItem(KEY, data);
        removeItem(KEY);
        expect(getItem(KEY, testSchema)).toBeNull();
    });

    it("setItem devuelve false si no se puede guardar", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("quota");
        });
        expect(setItem(KEY, { name: "Jeremy Spoken", age: 3 })).toBe(false);
    });
});