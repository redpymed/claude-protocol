# errores.md — Bitácora de Errores y Lecciones Aprendidas

> **Archivo append-only**. Claude Code añade entradas tras cada tarea donde haya cometido un error (CLAUDE.md §6.2).
> **Lectura obligatoria al inicio de cada sesión**: los errores aquí registrados son lecciones que NO deben repetirse.
> Las entradas más recientes van arriba.

---

## Cómo leer este archivo

Antes de empezar una tarea, busca con `grep` o lectura rápida si hay entradas relacionadas con:
- El módulo que vas a tocar.
- La tecnología o librería implicada.
- El tipo de operación (migración, integración, etc.).

Si encuentras una entrada relevante, **aplica la "Regla aprendida"** sin necesidad de que el usuario te la recuerde.

---

## Cómo añadir entradas

Plantilla obligatoria:

```markdown
## YYYY-MM-DD · <título corto y específico>

- **Contexto**: qué tarea estaba haciendo (1-2 frases).
- **Error cometido**: qué hice mal exactamente (sé específico, no genérico).
- **Causa raíz**: por qué falló (no el síntoma, la raíz).
- **Solución aplicada**: cómo lo arreglé.
- **Regla aprendida**: qué hacer (o no hacer) la próxima vez. Frase imperativa corta.
- **Módulo / archivos afectados**: rutas concretas.
- **Tags**: `#tipo` `#tecnología` `#módulo`
```

---

## Ejemplo (borrar cuando haya entradas reales)

```markdown
## 2026-04-28 · Migración Supabase rompió RLS en tabla `invoices`

- **Contexto**: Añadir columna `currency` a la tabla `invoices` en Supabase.
- **Error cometido**: Ejecuté la migración con `ALTER TABLE` directamente sin verificar que las políticas RLS existentes referenciaban columnas afectadas. Tras el cambio, los usuarios no podían leer sus propias facturas.
- **Causa raíz**: La política RLS usaba un `USING` con un join que se rompió silenciosamente al reescribirse el plan de la query.
- **Solución aplicada**: Rollback de la migración, revisar políticas RLS, añadir tests específicos de RLS para la tabla, reaplicar migración.
- **Regla aprendida**: Antes de migrar tablas con RLS activo, listar políticas afectadas y ejecutar tests de RLS en staging. Nunca migrar sin pasar por staging primero.
- **Módulos / archivos afectados**: `src/modules/billing/infrastructure/migrations/2026_04_28_add_currency.sql`, `src/modules/billing/__tests__/rls.test.ts`.
- **Tags**: `#migracion` `#supabase` `#rls` `#billing`
```

---

## Entradas

> Añade aquí las entradas reales. Más recientes arriba.

<!-- AÑADIR ENTRADAS DEBAJO DE ESTA LÍNEA -->
