import { useMemo } from "react";
import { ShellMark } from "../features/auth/components/ShellMark";
import { useAuth } from "../features/auth/context/useAuth";
import { BetsDonutChart } from "../features/dashboard/components/BetsDonutChart";
import { RaceWinsBarChart } from "../features/dashboard/components/RaceWinsBarChart";
import {
    RACES_PER_DAY,
    countWins,
    simulateRaceDay,
    summarizedBets,
} from "../features/dashboard/simulation";

// Si guardas el saldo en centavos, divide entre 100 antes de formatear.
const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export function DashboardPage() {
    const { user, logout } = useAuth();

    // Se simula un día de carreras una vez por montaje del componente.
    const { wins, bets } = useMemo(() => {
        const results = simulateRaceDay();
        return { wins: countWins(results), bets: summarizedBets(results) };
    }, []);

    // ProtectedRoute garantiza que hay sesión; esto solo satisface al tipado.
    if (!user) return null;

    const firstName = user.fullName.split(" ")[0];

    return (
        <div className="min-h-dvh">
            <header className="border-b border-line bg-white/60">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
                    <div className="flex items-center gap-2.5 text-leaf">
                        <ShellMark className="size-8" />
                        <span className="font-display text-lg font-semibold tracking-tight text-ink">
                            SnailBet
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-ink/70 sm:inline">{user.fullName}</span>
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium transition-colors hover:border-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-lettuce"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-10">
                <h1 className="font-display text-3xl font-semibold tracking-tight">Hola, {firstName}</h1>

                <section aria-labelledby="balance-heading" className="mt-8">
                    <h2 id="balance-heading" className="text-sm font-medium text-ink/70">
                        Saldo disponible
                    </h2>
                    <p className="mt-1 font-display text-5xl font-semibold tabular-nums">
                        {currency.format(user.balance)}
                    </p>
                </section>

                <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_3fr]">
                    <section
                        aria-labelledby="bets-heading"
                        className="rounded-xl border border-line bg-white/60 p-6"
                    >
                        <h2 id="bets-heading" className="font-display text-lg font-semibold">
                            Tus apuestas de hoy
                        </h2>
                        <p className="mt-1 text-sm text-ink/60">Una apuesta por carrera.</p>
                        <div className="mt-4">
                            <BetsDonutChart data={bets} />
                        </div>
                    </section>

                    <section
                        aria-labelledby="wins-heading"
                        className="rounded-xl border border-line bg-white/60 p-6"
                    >
                        <h2 id="wins-heading" className="font-display text-lg font-semibold">
                            Victorias por caracol
                        </h2>
                        <p className="mt-1 text-sm text-ink/60">
                            Resultados de las {RACES_PER_DAY} carreras del día.
                        </p>
                        <div className="mt-4">
                            <RaceWinsBarChart data={wins} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}