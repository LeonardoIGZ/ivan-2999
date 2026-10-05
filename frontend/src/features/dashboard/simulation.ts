import type { BetSummary, RaceResult, SnailWins } from "../auth/types";

export const SNAILS: readonly string[] = [
    "FRANK",
    "CRISS",
    "SAMARA",
    "PETER",
    "DAFNE",
    "TIM"
];
export const RACES_PER_DAY = 6;

// simulo las carreras establecidas para un día, se inyecta random 
export function simulateRaceDay(random: () => number = Math.random): RaceResult[] {
    const results: RaceResult[] = [];
    for (let i = 0; i < RACES_PER_DAY; i++) {
        results.push({
            race: i + 1,
            winner: SNAILS[Math.floor(random() * SNAILS.length)],
            userPick: SNAILS[Math.floor(random() * SNAILS.length)],
        });
    }
    return results;
}

// se realiza el conteo de la victorias apartir de las simulaciones realizadas
export function countWins(results: RaceResult[]): SnailWins[] {
    return SNAILS.map((snail) => ({
        snail,
        wins: results.filter((result) => result.winner === snail).length,
    }));
}

// contabilizo el balance de victorias contra derrotas según la simulación
export function summarizedBets(results: RaceResult[]): BetSummary {
    const won = results.filter((result) => result.userPick === result.winner).length;
    return { won, lost: results.length - won };
}