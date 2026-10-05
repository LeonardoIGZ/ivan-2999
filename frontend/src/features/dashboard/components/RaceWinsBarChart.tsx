import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { SnailWins } from "../../auth/types";

interface RaceWinsBarChartProps {
    data: SnailWins[];
}

const AXIS_TICK = { fontSize: 12, fill: "var(--color-ink)" };

export function RaceWinsBarChart({ data }: RaceWinsBarChartProps) {
    return (
        <figure>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                        <CartesianGrid vertical={false} stroke="var(--color-line)" />
                        <XAxis
                            dataKey="snail"
                            interval={0}
                            tickLine={false}
                            axisLine={false}
                            tick={AXIS_TICK}
                        />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={AXIS_TICK} />
                        <Tooltip
                            cursor={{ fill: "var(--color-lettuce)" }}
                            formatter={(value) => [value, "Victorias"]}
                        />
                        <Bar
                            dataKey="wins"
                            fill="var(--color-shell)"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={false}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Resumen en texto para lectores de pantalla: el SVG de la gráfica no es legible. */}
            <figcaption className="sr-only">
                {data.map((entry) => `${entry.snail}: ${entry.wins} victorias`).join(". ")}
            </figcaption>
        </figure>
    );
}