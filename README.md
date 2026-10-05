# SnailBet

Aplicación web de apuestas en carreras de caracoles: registro e inicio de sesión simulados en el navegador, dashboard con saldo y estadísticas simuladas, y una pasarela de pagos ficticia (SnailPay) para cargar saldo.

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS
- **Backend:** Express + TypeScript
- **Persistencia:** localStorage (usuario, sesión y saldo)

## Requisitos

- **Node.js 22.12 o superior** (recomendado 24 LTS). Vite 8 no funciona con versiones anteriores de Node 22. Si usas nvm o fnm, el repositorio incluye un `.nvmrc`.
- **pnpm 10 o superior.**

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install --frozen-lockfile
```

El proyecto es un workspace de pnpm con dos paquetes (`frontend` y `backend`) y un solo lockfile. El único paquete autorizado para ejecutar scripts de instalación es `esbuild`, que ya está aprobado en `pnpm-workspace.yaml`.

## Ejecución

En dos terminales, desde la raíz:

```bash
pnpm --filter backend dev
pnpm --filter frontend dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (verificación: `GET /health`)

**Uso:** no hay usuarios precargados. Crea una cuenta en la pantalla de registro; el saldo inicial es $0.

Para empezar desde cero, borra en las herramientas de desarrollador del navegador las llaves de localStorage con prefijo `snailbet:`.

## Pruebas

```bash
pnpm --filter frontend test
pnpm --filter backend test
```

| Módulo | Qué se prueba |
|---|---|
| `lib/storage` | Lectura y escritura tipadas; datos corruptos o con formato inválido devuelven `null` sin romper la app; fallo al guardar. |
| `auth/crypto/password` | Salt único por contraseña, verificación correcta e incorrecta, formato del registro y comparación contra la implementación de PBKDF2 de Node. |
| `auth/schemas` | Normalización de correo y nombre, reglas de contraseña, confirmación y que la contraseña nunca se recorte. |
| `auth/services/authService` | Correo duplicado, contraseña nunca guardada en texto plano, credenciales inválidas y cierre de sesión que conserva al usuario. |
| `dashboard/simulation` | Simulaciones de carreras, contabilización de victorias y perdidas, congruencia en el resumen de apuestas. |


## Estructura

```
frontend/src/
├── features/
│   ├── auth/          # schemas, tipos, hash de contraseñas, servicio, contexto y componentes
│   └── dashboard/     # simulación de carreras y gráficas
├── lib/storage.ts     # wrapper de localStorage con validación por schema
├── routes/            # guardias de ruta (protegida / solo pública)
└── pages/             # login, registro y dashboard
backend/src/           # SnailPay
```

## Seguridad de contraseñas

La contraseña nunca se guarda en texto plano. Se deriva con **PBKDF2-SHA256 (600,000 iteraciones, salt aleatorio de 16 bytes)** usando la Web Crypto API del navegador, y solo se almacenan el salt, el hash, las iteraciones y el algoritmo.

Al tratarse de una simulación local, el hash vive en el navegador. En un sistema real, el hash y la persistencia se harían en el servidor (por ejemplo, con argon2id).

## Estado del proyecto

**Terminado**
- Registro con validaciones (nombre, correo, contraseña y confirmación).
- Inicio y cierre de sesión, y nuevo inicio de sesión con los datos registrados.
- Persistencia de sesión y datos al recargar la página.
- Dashboard accesible solo con sesión activa: nombre del usuario, saldo y cierre de sesión.

- Gráficas del dashboard (apuestas ganadas/perdidas y victorias por caracol).

**Pendiente**

- Servicio SnailPay, formulario de recarga e integración con el frontend.

## Limitaciones conocidas

- La autenticación es una simulación local: cualquier persona con acceso al navegador puede leer o modificar localStorage.