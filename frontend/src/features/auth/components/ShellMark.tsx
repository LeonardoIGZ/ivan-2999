interface ShellMarkProps {
    className?: string;
}

// Logotipo: caracol con concha en espiral. El cuerpo usa currentColor
// para adaptarse al color de texto del contenedor.
export function ShellMark({ className }: ShellMarkProps) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
            <path d="M4 40c2-5 6-7 11-7h22c4 0 7 2 7 5v2H4Z" fill="currentColor" />
            <path
                d="M40 33l2-7M43.5 34l3-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="24" cy="22" r="13" fill="var(--color-shell)" />
            <path
                d="M24 22a2.5 2.5 0 1 1 2.5 2.5 6 6 0 1 1-6-6 9.5 9.5 0 1 1 9.5 9.5"
                stroke="var(--color-ink)"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
        </svg>
    );
}