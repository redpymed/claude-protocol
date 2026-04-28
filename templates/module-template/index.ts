/**
 * API pública del módulo __MODULE_NAME__.
 *
 * Este archivo es el ÚNICO punto de importación válido desde fuera del módulo.
 * Cualquier otro símbolo del módulo debe considerarse interno.
 *
 * Ver CLAUDE.md §7 (Modularidad Estricta).
 */

// ─── Tipos públicos ────────────────────────────────────────────────────────
// export type { ... } from './domain/...';

// ─── Casos de uso públicos ─────────────────────────────────────────────────
// export { ... } from './application/...';

// ─── Eventos del dominio que otros módulos pueden suscribir ────────────────
// export type { ... } from './domain/events';

// Si este archivo está vacío durante mucho tiempo, plantéate si el módulo
// realmente necesita existir o si se solapa con otro.
export {};
