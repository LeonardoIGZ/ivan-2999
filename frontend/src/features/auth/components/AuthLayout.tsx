import type { ReactNode } from "react";
import { ShellMark } from "./ShellMark";

interface AuthLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

// Posición de cada caracol en su carril (6 carriles = 6 caracoles).
const SNAIL_POSITIONS = [212, 148, 262, 118, 186, 238];

function RaceTrack({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 320 196" className={className} aria-hidden="true">
            {SNAIL_POSITIONS.map((x, lane) => {
                const y = 16 + lane * 32;
                return (
                    <g key={lane}>
                        <line
                            x1="0"
                            x2="300"
                            y1={y}
                            y2={y}
                            stroke="var(--color-lettuce)"
                            strokeOpacity="0.3"
                            strokeDasharray="4 6"
                        />
                        <circle cx={x} cy={y} r="7" fill="var(--color-shell)" />
                    </g>
                );
            })}
            <line x1="300" x2="300" y1="0" y2="196" stroke="var(--color-shell)" strokeWidth="3" />
        </svg>
    );
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <div className="min-h-dvh lg:grid lg:grid-cols-[5fr_6fr]">
            <aside className="flex flex-col justify-between gap-10 bg-leaf px-6 py-8 text-lettuce sm:px-10 lg:py-12">
                <div className="flex items-center gap-3">
                    <ShellMark className="size-10" />
                    <span className="font-display text-xl font-semibold tracking-tight">SnailBet</span>
                </div>

                <RaceTrack className="hidden w-full max-w-md lg:block" />

                <p className="max-w-xs text-lettuce/85">
                    Carga saldo y sigue los resultados de las seis carreras del día.
                </p>
            </aside>

            <main className="flex items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">
                    <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
                    <p className="mt-2 text-ink/70">{description}</p>
                    <div className="mt-8">{children}</div>
                </div>
            </main>
        </div>
    );
}