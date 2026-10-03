# Auth
1. Record por email en lugar de un solo usuario para evitar reescribir usuarios.
2. Guardar iterations y algorithm para facilitar el cambio de algoritmo en el futuro sin romper lo existente.
3. Credenciales separadas del perfil para no tener tiempre cargando la contraseña.
4. Llaves centralizadas para dejar referenciadas las llaves con las que se guardan los datos en el localStorage


# Notas para el PDF

## 1. Proceso
- Planeación inicial: priorizar el auth (requisito mínimo de validez) y después SnailPay, dashboard y documentación.
- Trabajo en sesiones cortas con commit al final de cada una.
- Primer día perdido en problemas de entorno (Node 22.6 incompatible con Vite 8/Rolldown; build scripts bloqueados por pnpm). Reinicié el setup desde cero.

## 2. Decisiones principales
- **Monorepo con pnpm workspaces** (frontend/backend): un solo lockfile y un solo comando para instalar y probar.
- **pnpm en lugar de npm:** no ejecuta scripts de instalación de dependencias sin aprobación (vector de ataques de supply chain) y usa `minimumReleaseAge`.
- **Estructura por feature** (features/auth, payments, dashboard). Los componentes nunca tocan localStorage directamente: componente → contexto → servicio → storage.
- **Wrapper de localStorage con validación zod al leer:** localStorage se trata como entrada externa. Devuelve null si los datos faltan, están corruptos o no cumplen el schema. No borra datos inválidos para no perder información (por ejemplo, el saldo).
- **Llaves centralizadas con prefijo** (`snailbet:`) para evitar typos y choques con otras apps en localhost.
- **Tipos derivados de schemas** (`z.infer`): una sola fuente de verdad.
- **Perfil y credenciales en llaves separadas;** usuarios en un Record por email para que un segundo registro no sobrescriba al primero.
- **Contraseñas con PBKDF2-SHA256, 600,000 iteraciones (OWASP) y salt aleatorio de 16 bytes,** con Web Crypto nativa. En servidor usaría argon2id o bcrypt. Limitación: al vivir en el navegador, es vulnerable a fuerza bruta offline con acceso al equipo.
- **Iteraciones y algoritmo guardados en el record** para poder cambiarlos sin romper cuentas existentes.

## 3. Herramientas y librerías
- React + Vite, Express, TypeScript, pnpm
- zod (validación), react-router-dom
- Vitest, Testing Library, Supertest
- ESLint (plantilla de Vite)

## 4. Uso de IA
- Claude: planeación, explicación de conceptos nuevos para mí (zod vs. tipos, Web Crypto API, Vitest), diagnóstico de errores de entorno y revisión de código.
- El código de storage y password lo escribí yo; la IA lo revisó y señaló bugs que corregí.
- La estructura de los tests se basó en ejemplos dados por la IA; el test contra pbkdf2Sync fue sugerencia de la IA.
- Validación: tests automatizados y verificar que los tests fallan ante el bug que protegen.

## 5. Pruebas y por qué
- storage: datos corruptos, schema inválido y fallo al guardar (la app no debe romperse por localStorage).
- password: salt único, verificación correcta e incorrecta, formato válido según el schema, y comparación contra la implementación de Node (cumple el estándar, no solo es consistente consigo misma).
- Bugs detectados por tests: regex hex mal escrita (habría bloqueado todos los inicios de sesión).

## 6. Funcionalidades terminadas
-

## 7. Pendientes / problemas conocidos
-

## 8. Tiempo invertido
| Día | Horas | Qué |
|---|---|---|
| Martes | | Setup (fallido por entorno) |
| Miércoles | | Setup limpio, storage, password |
| Jueves | | |