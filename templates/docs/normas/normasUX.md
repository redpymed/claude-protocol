# normasUX.md — Diseño y Experiencia de Usuario

> **Cargar este archivo cuando** la tarea toque: UI, componentes, vistas, páginas, estilos, CSS, responsive, accesibilidad, WCAG, ARIA, estados de carga/error/vacío, i18n, formularios, animaciones, dark mode, performance frontend (LCP/INP/CLS), iconos, tipografía.
>
> **Subordinado a** `CLAUDE.md` §2 (Reglas Inviolables). En caso de conflicto, gana CLAUDE.md.

---

## Principios

- **Mobile-first real**: empieza maquetando en 375px de ancho. Si funciona ahí, funciona en todo lo demás.
- **Accesibilidad como requisito legal**, no como detalle. La EAA (European Accessibility Act) está vigente en UE desde junio de 2025.
- **Estados, no felices**: cada vista que dependa de datos tiene cinco estados diseñados — *loading, empty, error, partial, success*. Si solo has diseñado el feliz, no has terminado.
- **Localización desde el día 1**: aunque el producto solo soporte español, todo string visible pasa por la capa de traducción y todo formato (fecha, número, moneda) usa `Intl.*`.

## Reglas accionables

### Accesibilidad

- **WCAG 2.2 AA mínimo**, validado con `axe-core` en CI.
- **Contraste**: 4.5:1 texto normal, 3:1 texto grande (≥18.66px regular o ≥14px bold) y componentes de UI.
- **Touch targets ≥ 44×44 px** (recomendable 48×48). Espaciado mínimo entre targets adyacentes: 8px.
- **Focus visible siempre**. Prohibido `outline: none` sin sustituto equivalente (`focus-visible:ring-*`).
- **Navegación completa por teclado**. Cualquier acción posible con ratón debe ser posible con teclado.
- **Orden de tabulación lógico**. `tabindex` positivo está prohibido.
- **Etiquetas explícitas** en todo input. `aria-label` solo cuando no hay etiqueta visible.
- **Anuncios en cambios de estado**: `aria-live="polite"` para feedback no urgente, `assertive` para errores críticos.
- **Roles ARIA solo cuando HTML semántico no basta**. `<button>` antes que `<div role="button">`.
- **Imágenes**: `alt` obligatorio. `alt=""` solo para decorativas (y entonces preferir CSS `background-image`).
- **Formularios**: errores asociados al input vía `aria-describedby`, no solo color.

### Responsive y layout

- **Breakpoints**: empieza en 375px. Diseña para 375 / 768 / 1024 / 1440. Evita más breakpoints sin necesidad.
- **Container queries** (`@container`) sobre media queries cuando el componente debe adaptarse a su contenedor, no a la ventana.
- **CSS Grid o Flexbox**, nunca `position: absolute` para layout estructural.
- **Sin scroll horizontal** en ningún ancho de viewport ≥ 320px.
- **Sin contenido cortado** en zoom 200% (requisito WCAG 1.4.10).

### Estados obligatorios

Cada vista que dependa de datos asíncronos debe diseñar e implementar:

| Estado | Qué mostrar |
|---|---|
| **Loading** | Skeleton específico de la vista, no spinner genérico. |
| **Empty** | Mensaje + ilustración + CTA (cuando aplique). Nunca pantalla en blanco. |
| **Error** | Mensaje accionable (qué pasó, qué hacer) + opción de reintentar. Nunca solo "Error 500". |
| **Partial** | Datos parciales con indicador claro de que falta info, no fingir que está completo. |
| **Success** | El estado feliz. |

### Internacionalización (i18n)

- **Ningún string hardcodeado** en componentes. Todo pasa por `t('key')` o equivalente.
- **Estructura de claves jerárquica**: `dashboard.metrics.revenue.title`, no `revenueTitle`.
- **Plurales con ICU MessageFormat** o equivalente. Nunca `count + ' items'`.
- **Fechas, números, monedas** con `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`. Nunca strings hardcodeados.
- **Direccionalidad**: layout preparado para RTL aunque inicialmente sea LTR (usa `start`/`end` en lugar de `left`/`right` en CSS lógico).
- **Locale del usuario**: detectado del navegador, sobreescribible por preferencia de usuario, persistido.

### Performance frontend

- **Core Web Vitals como SLO** (medidos con RUM real, no solo Lighthouse):
  - LCP ≤ 2.5s (75% de visitas)
  - INP ≤ 200ms (75% de visitas)
  - CLS ≤ 0.1
- **Imágenes**: formatos modernos (AVIF/WebP), `width`/`height` siempre, `loading="lazy"` salvo above-the-fold, `srcset` para responsive.
- **Tipografía**: máximo 2 familias, `font-display: swap`, subsetting si carga > 50KB, `preload` para la fuente above-the-fold.
- **JavaScript bundle**: code splitting por ruta. Bundle inicial ≤ 170KB gzip.
- **No bloquear el render**: scripts no críticos con `defer` o `async`.
- **Critical CSS** inline en `<head>` para above-the-fold.

### Tema y motion

- **`prefers-color-scheme` respetado**: dark mode desde el día 1 mediante CSS variables, no clases hardcodeadas.
- **`prefers-reduced-motion` respetado** en toda animación. Si está activo: animación inmediata o nula, nunca >= 200ms.
- **`prefers-contrast` respetado** cuando aplique (alto contraste).
- **Transiciones útiles, no decorativas**: si quitar la animación no degrada la UX, no la pongas.

### Formularios

- **Validación en tiempo real solo después del primer blur** del campo. No molestar mientras el usuario escribe.
- **Errores al enviar**: foco automático al primer campo con error.
- **Submit deshabilitado solo si hay error visible**, no preventivamente.
- **Loading state al enviar**: botón deshabilitado + indicador. Prevenir doble submit.
- **Autocompletado**: atributos `autocomplete` correctos en todos los campos relevantes.
- **`inputmode`** apropiado en móvil (`numeric`, `email`, `tel`, etc.).

---

## Definition of Done (específica de UX)

Además de la DoD universal de `CLAUDE.md` §5:

- [ ] `axe-core` pasa sin violaciones en la nueva vista/componente.
- [ ] Probado en 375px (móvil), 768px (tablet) y 1280px (desktop) mínimo.
- [ ] Probado con teclado (Tab, Shift+Tab, Enter, Escape) sin ratón.
- [ ] Probado con `prefers-reduced-motion: reduce`.
- [ ] Probado en dark mode.
- [ ] Estados loading / empty / error implementados, no solo el feliz.
- [ ] Strings pasados por i18n.
- [ ] Imágenes con `width`/`height` y `alt` apropiado.
- [ ] LCP / INP / CLS medidos en staging y dentro de presupuesto.
- [ ] Capturas de pantalla (light + dark, móvil + desktop) adjuntas en la PR.

---

*Fin de normasUX.md — Cualquier cambio requiere PR + revisión.*
