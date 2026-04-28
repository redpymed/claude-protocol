# normasArquitectura.md — Arquitectura y Datos

> **Cargar este archivo cuando** la tarea toque: schema de BD, migraciones, modelado de datos, relaciones, API design, endpoints, REST/GraphQL/RPC, multi-tenancy, eventos, colas, integraciones, IDs, timestamps, tipos de datos, estructura de carpetas, capas, módulos.
>
> **Subordinado a** `CLAUDE.md` §2.

---

## Principios

- **Lo barato hoy y carísimo retrofit, va dentro desde el día 1.** Multi-tenancy, soft delete, auditoría, versionado de API, decimales para dinero.
- **Schema como fuente única de verdad**. Zod / Valibot definen el contrato; los tipos TypeScript se derivan del schema.
- **Eventos de dominio**: cambios significativos emiten eventos. Permite añadir webhooks, auditoría, side effects, integraciones, sin refactorizar el core.
- **Validación en frontera**: schema check en la entrada del endpoint antes de tocar lógica de negocio.

## Reglas accionables

### Modelado de datos

- **Multi-tenancy desde el día 1.** Toda tabla con datos de usuario tiene `tenant_id` (o `org_id`) indexado, aunque inicialmente solo haya un tenant. Migrar después es traumático.
- **Soft delete por defecto.** `deleted_at TIMESTAMPTZ NULL` en lugar de `DELETE` físico. Excepción documentada: derecho de supresión RGPD (ver `normasSeguridad.md`).
- **Auditoría inmutable.** Tabla `audit_log` append-only para: cambios de rol, accesos a PII, transacciones financieras, configuración crítica. Replicada a almacenamiento separado donde un atacante con acceso a la BD principal no pueda borrarla.
- **IDs**: UUID v7 (ordenable por tiempo). Nunca enteros autoincrementales en URLs públicas — facilitan enumeración.
- **Timestamps en UTC, siempre** (`TIMESTAMPTZ` en Postgres). Conversión a zona horaria de usuario solo en presentación.
- **Dinero en decimal, nunca float.** `numeric(precision, scale)` en BD, `decimal.js` o equivalente en código. 4 decimales mínimo para tipos de cambio.
- **Booleanos sin nullable**: `is_active BOOLEAN NOT NULL DEFAULT true`. NULL en booleano = bug latente.
- **Enums versionables**: prefiere tablas de catálogo a `ENUM` nativos de la BD (más fáciles de migrar).

### Migraciones

- **Reversibles**: cada migración tiene `up` y `down`. Si no es reversible, documentar por qué en la propia migración.
- **Idempotentes** cuando sea posible (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).
- **Pequeñas y atómicas**: una migración = un cambio lógico.
- **Sin cambios de datos en migraciones de schema**: separar DDL de DML cuando sea posible.
- **Cambios destructivos** (drop column, drop table) en migraciones separadas y solo después de verificar que ningún código los usa.
- **Backfills** de columnas nuevas en migraciones separadas, ejecutables en lotes para no bloquear producción.
- **Zero-downtime**: añadir → escribir en ambos sitios → migrar lecturas → eliminar viejo. Nunca un cambio que rompa la versión anterior del código.

### API design

- **Versionado desde la v1.** `/api/v1/...`. Una API sin versión es deuda técnica activa.
- **Schema-first**: define el contrato antes de implementar. OpenAPI / GraphQL SDL / tRPC schemas según stack.
- **Validación de entrada en frontera** con Zod / Valibot. Si falla, error 400 con mensaje útil.
- **Validación de salida** en endpoints públicos (asegurar que no devuelves más de lo prometido — leak prevention).
- **Errores estructurados**: `{ code: 'VALIDATION_ERROR', message: '...', details: [...] }`, no strings sueltos.
- **Códigos HTTP correctos**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests, 500 Server Error.
- **Paginación cursor-based** en colecciones grandes, no offset (offset escala mal y produce duplicados con inserts concurrentes).
- **Idempotency keys** en POST que crean recursos críticos (pagos, transacciones).
- **Rate limiting** documentado en headers (`X-RateLimit-*`).

### Eventos y mensajería

- **Domain events** para cambios significativos: `UserRegistered`, `InvoiceIssued`, `ReportGenerated`. No solo persistencia directa.
- **Event sourcing no es obligatorio**, pero sí emitir eventos como side effect de la persistencia.
- **Outbox pattern** para garantizar consistencia entre BD y bus de eventos.
- **Schema de eventos versionado**: cambios breaking → nuevo evento, no modificar el viejo.
- **Idempotencia en consumidores**: procesar el mismo evento dos veces no debe causar daño.
- **Dead letter queue** para mensajes que fallan repetidamente.

### Estructura del proyecto

- **Por dominio, no por capa técnica**: `/users/`, `/invoices/`, `/reports/` en lugar de `/controllers/`, `/services/`, `/repositories/`.
- **Cada dominio expone una API pública mínima** (un `index.ts` que define qué se exporta). El resto es interno.
- **Sin import circular**. Si surgen, hay un problema de modelado.
- **Capa de dominio independiente del framework**: la lógica de negocio no debe importar Express/Next/Firebase directamente.
- **Tests cerca del código**: `feature.ts` + `feature.test.ts` en la misma carpeta. No carpeta `/tests/` separada.

### Performance de datos

- **Sin N+1**. Eager loading explícito o batch loading (DataLoader). Logs deben detectar N+1 en desarrollo.
- **Índices en columnas que se filtran o se usan en joins**, especialmente `tenant_id`, `user_id`, `deleted_at`, FKs.
- **Índices compuestos** ordenados por selectividad (la columna más selectiva primero).
- **Query plans revisados** para queries que tocan tablas grandes (`EXPLAIN ANALYZE`).
- **Caching explícito**, no implícito. Documentar TTL y estrategia de invalidación.

---

## §10. Enforcement automático de modularidad estricta

CLAUDE.md §7.5 exige que cualquier import cruzado entre módulos rompa el build. Hay dos formas complementarias de implementarlo:

### Opción A: Comando del protocolo (sin configuración)

```bash
claude-protocol validate
```

Escanea `src/modules/` y reporta violaciones. Útil en CI sin configurar nada del proyecto.

### Opción B: Regla ESLint (preferida en proyectos JS/TS)

Añade a tu `.eslintrc` o `eslint.config.js`:

```js
// eslint.config.js (flat config)
export default [
  {
    files: ['src/modules/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/modules/*', '@/modules/*', '../*/'],
              message:
                'Imports cruzados entre módulos están prohibidos (CLAUDE.md §7). ' +
                'Usa eventos, la API pública del otro módulo, o mueve la utilidad a /shared.',
            },
          ],
        },
      ],
    },
  },
  {
    // Excepción: src/shared puede importarse libremente
    files: ['src/shared/**/*'],
    rules: { 'no-restricted-imports': 'off' },
  },
];
```

Para `.eslintrc.json` clásico:

```json
{
  "overrides": [
    {
      "files": ["src/modules/**/*.{ts,tsx,js,jsx}"],
      "rules": {
        "no-restricted-imports": ["error", {
          "patterns": [{
            "group": ["**/modules/*", "@/modules/*", "../*/"],
            "message": "Imports cruzados entre módulos prohibidos (CLAUDE.md §7)."
          }]
        }]
      }
    }
  ]
}
```

### Opción C: TypeScript Project References

Para proyectos grandes, configurar cada módulo como un sub-proyecto TS. El propio `tsc` rechaza imports fuera de las referencias declaradas. Más overhead de configuración pero mayor garantía.

### CI pipeline mínimo

```yaml
- run: npm run lint
- run: npm run typecheck
- run: npx claude-protocol validate
```

Las tres comprobaciones son complementarias:
- ESLint detecta el caso común durante el desarrollo y en pre-commit.
- TS Project References (si configurado) detecta violaciones en build.
- `claude-protocol validate` es la red de seguridad sin dependencias del stack.

---

## Definition of Done (específica de Arquitectura)

Además de la DoD universal:

- [ ] Migraciones tienen `up` y `down` (o justificación de irreversibilidad).
- [ ] Migración probada en BD vacía y en BD con datos representativos.
- [ ] Schemas Zod/Valibot definidos para cualquier nuevo endpoint o evento.
- [ ] Tipos TS derivados del schema, no escritos a mano.
- [ ] `tenant_id` presente en cualquier nueva tabla con datos de usuario.
- [ ] Índices revisados con `EXPLAIN ANALYZE` si toca tabla con > 10k filas.
- [ ] Endpoint nuevo: contratos OpenAPI / SDL actualizados.
- [ ] Eventos nuevos: schema versionado y documentado.
- [ ] Ningún import circular detectado.
- [ ] **`claude-protocol validate` en verde** (modularidad estricta).

---

*Fin de normasArquitectura.md*
