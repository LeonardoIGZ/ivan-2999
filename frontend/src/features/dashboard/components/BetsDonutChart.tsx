import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BetSummary } from "../../auth/types";

interface BetsDonutChartProps {
    data: BetSummary;
}

export function BetsDonutChart({ data }: BetsDonutChartProps) {
    const total = data.won + data.lost;

    if (total === 0) {
        return <p className="py-16 text-center text-ink/60">Aún no hay apuestas registradas hoy.</p>;
    }

    const winRate = Math.round((data.won / total) * 100);
    const slices = [
        { name: "Ganadas", value: data.won, color: "var(--color-leaf)" },
        { name: "Perdidas", value: data.lost, color: "var(--color-danger)" },
    ];

    return (
        <figure>
            <div className="relative h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={slices}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="62%"
                            outerRadius="90%"
                            paddingAngle={2}
                            stroke="none"
                            isAnimationActive={false}
                        >
                            {slices.map((slice) => (
                                <Cell key={slice.name} fill={slice.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} apuestas`, name]} />
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-3xl font-semibold tabular-nums">{winRate}%</span>
                    <span className="text-sm text-ink/60">de aciertos</span>
                </div>
            </div>

            <figcaption>
                <ul className="mt-4 flex justify-center gap-6 text-sm">
                    {slices.map((slice) => (
                        <li key={slice.name} className="flex items-center gap-2">
                            <span
                                className="size-3 rounded-full"
                                style={{ backgroundColor: slice.color }}
                                aria-hidden="true"
                            />
                            {slice.name}: <span className="font-semibold tabular-nums">{slice.value}</span>
                        </li>
                    ))}
                </ul>
            </figcaption>
        </figure>
    );
}