## Requisitos

- **Node.js 18+** (recomendado 20 LTS)
- El **backend corriendo** en `http://localhost:8080` (ver README de `farmacia-backend`)

## Ejecución

```bash
npm install
npm start
```

Abre **http://localhost:4200**. Si el backend corre en otra URL/puerto, cámbiala en
`src/environments/environment.ts` y `environment.development.ts` (`apiUrl`).

## Inicio de sesión

Al abrir la app se muestra la pantalla de **login**. Usuario inicial creado por el backend:

| Correo               | Contraseña  | Rol   |
| -------------------- | ----------- | ----- |
| `admin@farmacia.com` | `Admin123*` | ADMIN |

Desde **Administración → Usuarios** (solo ADMIN) puedes crear más usuarios; su contraseña se
envía al backend, que la guarda **cifrada con BCrypt**.

## Roles

- **ADMIN**: acceso completo, incluida la gestión de Usuarios y Roles.
- **VENDEDOR**: opera catálogos, ingresos, ventas y cajas; no ve Usuarios ni Roles (el backend además lo bloquea con 403).
