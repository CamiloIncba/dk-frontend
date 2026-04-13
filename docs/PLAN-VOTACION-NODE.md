# Plan: votación/selección de imágenes (backend Node)

Este documento orienta a quien continúe el desarrollo (humano o agente) en otro equipo, por ejemplo desde un notebook.

## Contexto del producto

- **Sitio:** galería de branding Stone Fungus en `branding/_shared/preview.html` (y previews por carpeta bajo `branding/`).
- **Despliegue previsto del front:** **GitHub Pages** (solo estático). No hay servidor propio en Pages.
- **Uso:** **tres personas** deciden qué imágenes/enfoques les interesan; no es un “like” social masivo, sino **registrar qué eligió cada una** para comparar y decidir.
- **Acceso:** las selecciones se harán **desde Internet** (no solo LAN). Por tanto el backend debe estar en un host público con **HTTPS**.
- **Stack backend acordado:** **Node.js** (API REST o similar).

## Lo que NO debe asumir el agente

- No asumir que el notebook del desarrollador sirve la API a producción.
- No depender de `localhost` para los usuarios finales; solo para desarrollo local.

## Estado actual del repositorio (referencia)

- Galería principal: `branding/_shared/preview.html` + `branding/_shared/styles.css`.
- Enfoques anteriores: `branding/approach-01-monolito-bold/`, `branding/approach-02-carta/`, `branding/approach-07-fungi-minimal/` (IDs en HTML: `a01`, `a02`, `a03`).
- Enfoques nuevos: `branding/nuevo-01-*` … `branding/nuevo-15-*` (IDs: `n01` … `n15`).
- Cada miniatura enlaza a una ruta relativa de imagen (útil como **ID estable** del asset, p. ej. `../approach-02-carta/typography-v2.png`).
- Hay **lightbox** por sección; cualquier UI de “seleccionar” debe convivir con clics en imágenes (evitar conflictos de eventos).

## Objetivo técnico

1. **Persistir selecciones** atribuibles a una persona (sin login completo: selector fijo de 3 perfiles, código corto compartido, o similar — definir en implementación).
2. **Dos niveles de selección** (según acuerdo previo con el equipo):
   - por **imagen** (asset concreto), y/o
   - por **enfoque** (toda la sección `a01`, `n02`, etc.).
3. **Front en Pages** llama al API por `fetch`; configurar **CORS** para el origen de GitHub Pages (y `localhost` en desarrollo).

## Backend Node — directrices

- Crear un paquete Node dedicado, por ejemplo `server/` o `api/` en la raíz del repo (o repo aparte si el equipo prefiere; si es monorepo, documentar scripts en README).
- **Express** o **Fastify** es suficiente; mantener dependencias mínimas.
- **Persistencia:** SQLite en volumen (simple) o PostgreSQL en el PaaS (mejor para producción). Evitar solo memoria RAM si se quiere conservar datos tras reinicios.
- **HTTPS:** lo aporta el hosting (Render, Fly.io, Railway, etc.), no implementar certificados a mano salvo reverse proxy.
- Endpoints sugeridos (ajustar nombres al gusto):
  - `GET /health` — comprobación de despliegue.
  - `POST /selections` o `PUT /selections` — crear/actualizar selección (cuerpo: `voterId`, `targetType` `image|approach`, `targetId`, `selected` boolean).
  - `GET /selections?summary=1` o `GET /report` — agregado para ver qué eligió cada votante (proteger si hace falta con token en header o query acordado entre los 3).
- **Identidad del votante:** p. ej. `voterId` ∈ `{persona-1,persona-2,persona-3}` enviado por el cliente y validado en servidor; opcional: secreto compartido en variable de entorno (`VOTING_SHARED_SECRET`) en header para no exponer el API a crawlers casuales.

## Front — directrices

- Variable de entorno en build Vite, p. ej. `VITE_VOTING_API_URL`, o en HTML estático sustitución en CI; **no** hardcodear la URL de producción sin posibilidad de cambiarla.
- En `preview.html` (estático): añadir UI mínima (selector de persona + toggle por imagen/sección) y JS que llame al API; manejar errores de red y estado de carga.
- Si más adelante se migra la galería a la app React (`src/`), reutilizar el mismo contrato de API.

## Seguridad (alcance realista)

- Tres usuarios de confianza: no hace falta OAuth; sí conviene **limitar abuso** (rate limiting básico, secreto compartido, validación de `targetId` contra lista permitida generada desde el árbol de `branding/` si se desea ser estrictos).

## Orden de trabajo recomendado para el agente

1. Leer este plan y abrir `branding/_shared/preview.html` para entender IDs de sección y rutas de imágenes.
2. Crear esqueleto Node (`package.json`, entrada `src/index.js` o `server.ts`), script `dev` y `start`.
3. Definir esquema de BD y migraciones mínimas (o SQL inicial para SQLite).
4. Implementar endpoints y pruebas manuales con `curl`.
5. Configurar CORS para el origen de Pages.
6. Desplegar en un PaaS y fijar URL de producción.
7. Integrar UI + `fetch` en la galería; probar desde un dominio distinto a `localhost`.
8. Documentar en `README.md` o `docs/DESPLIEGUE-VOTACION.md`: variables de entorno, cómo levantar local, cómo desplegar.

## Commits y continuidad

- Quien continúe en el notebook debe hacer `git pull` del remoto antes de implementar.
- Mantener mensajes de commit en **español**, descriptivos del cambio real.

## Referencias cruzadas

- App principal Vite/React: raíz del repo (`package.json`, `src/`).
- Documentación de branding dispersa: `branding/README.md`, `BRANDING-PROMPT.md` (puede quedar desactualizado respecto a carpetas renombradas).
