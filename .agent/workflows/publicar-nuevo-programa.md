---
description: Guía paso a paso para publicar una nueva página de programa (Diseño Personalizado + CMS).
---

# Cómo Publicar un Nuevo Programa (Workflow)

Este proceso permite tener diseños personalizados (HTML/React puro) conectados automáticamente a los precios del CMS.

## Paso 1: Crear los Datos (CMS)
*Quien: Administrador*

1. Entra al **Dashboard > CMS**.
2. Crea un nuevo programa o edita uno existente.
3. Define el precio, moneda y planes de pago.
4. **IMPORTANTE:** Copia el **ID del Programa** (Ej. `90-JAP2026`). Este es el código secreto que conectará todo.
5. Guarda los cambios.

## Paso 2 y 3: Crear la Página (Método 100% Nube)
*Quien: Equipo de Desarrollo / Diseño*

**No necesitas instalar nada en tu computadora.** Todo se hace desde el navegador en GitHub:

1.  Entra al repositorio del proyecto en **GitHub.com**.
2.  Navega a la carpeta: `src/app/[locale]/(main)/programs/`.
3.  Arriba de la lista de archivos, haz clic en **"Add file" > "Create new file"**.
4.  **Nombre del archivo:** Escribe el nombre de tu URL + `/page.tsx`.
    *   *Truco:* Si escribes `japon-2026/page.tsx`, GitHub creará la carpeta automáticamente.
5.  **Contenido:** Pega tu código HTML/React (con el widget `<LivePricing />` incluido).
6.  Baja al final de la página y haz clic en el botón verde **"Commit changes..."**.

## Paso 4: Publicación Automática
*Quien: Vercel (Automático)*

1.  Al darle clic a "Commit" en GitHub, **Vercel** detecta el cambio.
2.  En unos 2 minutos, tu nueva página estará visible en `tusitio.com/programs/japon-2026`.
3.  ¡Listo! Todo desde el navegador.

---
**Nota:** Si en el futuro necesitas cambiar el precio, solo repites el **Paso 1 (CMS)**. No necesitas tocar el código ni volver a GitHub.
