import type { ReactNode } from "react";

interface SubmitButtonProps {
    isSubmitting: boolean;
    idleLabel: string;
    submittingLabel: string;
}

export function SubmitButton({ isSubmitting, idleLabel, submittingLabel }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-leaf px-4 py-2.5 font-semibold text-lettuce transition-colors hover:bg-leaf-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-lettuce disabled:cursor-not-allowed disabled:opacity-70"
        >
            {isSubmitting ? submittingLabel : idleLabel}
        </button>
    );
}

export function FormError({ children }: { children: ReactNode }) {
    return (
        <p
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger"
        >
            {children}
        </p>
    );
}