import { describe, expect, it } from "vitest";
import { RACES_PER_DAY, SNAILS, countWins, simulateRaceDay, summarizedBets } from "./simulation";

// Número de simulaciones para los tests que usan el azar real.
const RUNS = 50;

// "Random" predecible: siempre elige el primer caracol.
const alwaysFirst = () => 0;

// "Random" que alterna entre los valores dados, en orden y en ciclo.
function sequenceRandom(values: number[]): () => number {
    let index = 0;
    return () => values[index++ % values.length];
}

describe("simulateRaceDay", () => {
    it("genera una carrera por cada carrera del día, con caracoles válidos", () => {
        const results = simulateRaceDay();

        expect(results).toHaveLength(RACES_PER_DAY);
        for (const result of results) {
            expect(SNAILS).toContain(result.winner);
            expect(SNAILS).toContain(result.userPick);
        }
    });
});

describe("countWins", () => {
    it("incluye a los seis caracoles en orden, aunque no tengan victorias", () => {
        const wins = countWins(simulateRaceDay(alwaysFirst));

        expect(wins.map((entry) => entry.snail)).toEqual([...SNAILS]);
    });

    it("las victorias siempre suman el número de carreras del día", () => {
        for (let run = 0; run < RUNS; run++) {
            const total = countWins(simulateRaceDay()).reduce((sum, entry) => sum + entry.wins, 0);
            expect(total).toBe(RACES_PER_DAY);
        }
    });
});

describe("summarizeBets", () => {
    it("ganadas más perdidas siempre suman el número de carreras del día", () => {
        for (let run = 0; run < RUNS; run++) {
            const { won, lost } = summarizedBets(simulateRaceDay());
            expect(won + lost).toBe(RACES_PER_DAY);
        }
    });

    it("cuenta como perdidas las carreras donde la apuesta no coincide", () => {
        // Por carrera se piden dos valores: primero el ganador (primer caracol)
        // y después la apuesta (último caracol), así que todas se pierden.
        const results = simulateRaceDay(sequenceRandom([0, 0.99]));

        expect(summarizedBets(results)).toEqual({ won: 0, lost: RACES_PER_DAY });
    });
});

describe("con un random fijo", () => {
    it("produce resultados predecibles y congruentes entre ambas gráficas", () => {
        const results = simulateRaceDay(alwaysFirst);
        const wins = countWins(results);

        expect(wins[0]).toEqual({ snail: SNAILS[0], wins: RACES_PER_DAY });
        expect(wins.slice(1).every((entry) => entry.wins === 0)).toBe(true);
        expect(summarizedBets(results)).toEqual({ won: RACES_PER_DAY, lost: 0 });
    });
});