# dk-frontend — Web Store DK (Stone Fungus)

Frontend de la tienda pública que habla con el **backend DK** (`/api/v1/store/*`): menú, cotización, pedidos y seguimiento. Pensado para **CI/CD** sobre este repo (build de Vite).

## Requisitos

- Node 20+
- Backend Nest + Prisma en marcha (por defecto `http://localhost:3010`)

## Configuración

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:3010
```

La app se sirve con **`base: /sf/`** (misma ruta que el hub del monorepo). En desarrollo: **http://127.0.0.1:5173/sf/** (no uses solo la raíz del puerto).

En la base de datos, la categoría del seed debe llamarse exactamente **Stone Fungus** (ver `dk-dark-kitchen/backend/prisma/seed.js`).

## Scripts

| Comando        | Descripción                |
| -------------- | -------------------------- |
| `npm run dev`  | Desarrollo                 |
| `npm run build`| Producción (`dist/`)       |
| `npm run preview` | Sirve `dist/` localmente |

**CI:** GitHub Actions (`.github/workflows/ci.yml`) ejecuta `npm ci` + `npm run build` en cada push/PR a `main` o `master`.

## Rutas

- `/` — Landing, historia, galería (menú desde API)
- `/producto/:id` — Ficha con **extras** (`GET .../store/products/:id/extras`)
- `/checkout` — Checkout en 3 pasos + validación de total (`POST /quote`)
- `/seguimiento` / `/seguimiento/:id` — Estado del pedido

En despliegue, todas quedan bajo el prefijo configurado (p. ej. `/sf/producto/5`).

Despliegue estático: los archivos en `dist/` deben publicarse bajo el path **`/sf/`** (p. ej. `https://tu-dominio/sf/`).

Los pedidos se envían con `storeBrand: "sf"`.

## Monorepo relacionado

Código backend y tienda **Fersot** (hub): [dk-dark-kitchen](https://github.com/CamiloIncba/dk-dark-kitchen) (ajustar org/repo si aplica).
