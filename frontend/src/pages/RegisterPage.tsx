import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../features/auth/components/AuthLayout";
import { FormError, SubmitButton } from "../features/auth/components/FormControls";
import { FormField } from "../features/auth/components/FormField";
import { useAuth } from "../features/auth/context/useAuth";
import { AUTH_ERROR_MESSAGES, UNEXPECTED_ERROR_MESSAGE } from "../features/auth/errorMessages";
import { RegisterSchema } from "../features/auth/schemas";

type RegisterField = "fullName" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<RegisterField, string>>;

const INITIAL_VALUES: Record<RegisterField, string> = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export function RegisterPage() {
    const { register } = useAuth();
    const [values, setValues] = useState(INITIAL_VALUES);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(field: RegisterField, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError(null);

        const parsed = RegisterSchema.safeParse(values);
        if (!parsed.success) {
            const errors = z.flattenError(parsed.error).fieldErrors;
            setFieldErrors({
                fullName: errors.fullName?.[0],
                email: errors.email?.[0],
                password: errors.password?.[0],
                confirmPassword: errors.confirmPassword?.[0],
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await register(parsed.data);
            // Si result.ok, PublicOnlyRoute redirige a /dashboard al actualizarse el usuario.
            if (!result.ok) {
                if (result.error === "EMAIL_TAKEN") {
                    setFieldErrors({ email: AUTH_ERROR_MESSAGES.EMAIL_TAKEN });
                } else {
                    setFormError(AUTH_ERROR_MESSAGES[result.error]);
                }
            }
        } catch {
            setFormError(UNEXPECTED_ERROR_MESSAGE);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Crea tu cuenta" description="Tu cuenta empieza con un saldo de $0.">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {formError && <FormError>{formError}</FormError>}

                <FormField
                    id="fullName"
                    label="Nombre completo"
                    autoComplete="name"
                    value={values.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    error={fieldErrors.fullName}
                />
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
                    autoComplete="new-password"
                    value={values.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    error={fieldErrors.password}
                    hint="Mínimo 8 caracteres, con al menos una mayúscula y un número."
                />
                <FormField
                    id="confirmPassword"
                    label="Confirma tu contraseña"
                    type="password"
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    error={fieldErrors.confirmPassword}
                />

                <SubmitButton
                    isSubmitting={isSubmitting}
                    idleLabel="Crear cuenta"
                    submittingLabel="Creando cuenta…"
                />
            </form>

            <p className="mt-6 text-sm text-ink/70">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="font-semibold text-leaf underline-offset-4 hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </AuthLayout>
    );
}