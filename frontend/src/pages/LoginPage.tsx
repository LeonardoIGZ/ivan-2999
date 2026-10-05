import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../features/auth/components/AuthLayout";
import { FormError, SubmitButton } from "../features/auth/components/FormControls";
import { FormField } from "../features/auth/components/FormField";
import { useAuth } from "../features/auth/context/useAuth";
import { AUTH_ERROR_MESSAGES, UNEXPECTED_ERROR_MESSAGE } from "../features/auth/errorMessages";
import { LoginSchema } from "../features/auth/schemas";

type LoginField = "email" | "password";
type FieldErrors = Partial<Record<LoginField, string>>;

export function LoginPage() {
    const { login } = useAuth();
    const [values, setValues] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(field: LoginField, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError(null);

        const parsed = LoginSchema.safeParse(values);
        if (!parsed.success) {
            const errors = z.flattenError(parsed.error).fieldErrors;
            setFieldErrors({ email: errors.email?.[0], password: errors.password?.[0] });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await login(parsed.data);
            // Si result.ok, PublicOnlyRoute redirige a /dashboard al actualizarse el usuario.
            if (!result.ok) setFormError(AUTH_ERROR_MESSAGES[result.error]);
        } catch {
            setFormError(UNEXPECTED_ERROR_MESSAGE);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Inicia sesión" description="Usa el correo con el que creaste tu cuenta.">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {formError && <FormError>{formError}</FormError>}

                <FormField
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    error={fieldErrors.email}
                />
                <FormField
                    id="password"
                    label="Contraseña"
                    type="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    error={fieldErrors.password}
                />

                <SubmitButton
                    isSubmitting={isSubmitting}
                    idleLabel="Iniciar sesión"
                    submittingLabel="Verificando…"
                />
            </form>

            <p className="mt-6 text-sm text-ink/70">
                ¿Aún no tienes cuenta?{" "}
                <Link to="/register" className="font-semibold text-leaf underline-offset-4 hover:underline">
                    Crear cuenta
                </Link>
            </p>
        </AuthLayout>
    );
}