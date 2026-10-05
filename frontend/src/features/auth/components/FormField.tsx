import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
    hint?: string;
}

export function FormField({ id, label, error, hint, className, ...inputProps }: FormFieldProps) {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    const borderClass = error ? "border-danger" : "border-line hover:border-ink/40";

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-ink transition-colors placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-lettuce ${borderClass} ${className ?? ""}`}
                {...inputProps}
            />
            {error ? (
                <p id={errorId} className="text-sm text-danger">
                    {error}
                </p>
            ) : hint ? (
                <p id={hintId} className="text-sm text-ink/60">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}