# normasObservabilidad.md — Observabilidad

> **Cargar este archivo cuando** la tarea toque: logs, trazas, métricas, monitoring, alertas, errores en producción, performance, latencia, SLOs, dashboards, error tracking (Sentry), OpenTelemetry, RUM, debugging.
>
> **Subordinado a** `CLAUDE.md` §2.

---

## Principios

- **Si no lo mides, no existe.** Si solo tienes logs, no tienes observabilidad.
- **Síntomas sobre causas**: alerta cuando el usuario sufre, no cuando una métrica interna se mueve.
- **Tres pilares unificados**: trazas + métricas + logs deben correlacionarse por `trace_id` / `request_id`.
- **Lo que no se observa, se rompe en silencio**: cualquier código nuevo merece al menos un log estructurado en su frontera.

---

## Logs

### Reglas

- **Logs estructurados (JSON)**, nunca prints sueltos. Un objeto por evento, parseable.
- **Niveles correctos**:
  - `error`: algo se rompió y requiere atención humana.
  - `warn`: algo inesperado pero recuperable.
  - `info`: hito significativo del flujo (login, transacción completada, job ejecutado).
  - `debug`: detalle útil en desarrollo, desactivado en producción.
  - `trace`: muy verboso, solo on-demand para incidentes.
- **Campos mínimos en cada log**:
  ```json
  {
    "timestamp": "ISO-8601 UTC",
    "level": "info|warn|error",
    "service": "nombre-del-servicio",
    "request_id": "uuid",
    "trace_id": "otel-trace-id",
    "user_id": "hash",
    "tenant_id": "hash o id según política",
    "message": "qué pasó",
    "context": { ... }
  }
  ```
- **`request_id` propagado** desde frontend → backend → BD → servicios externos. Permite reconstruir cualquier incidente.
- **PII redactada**: ver `normasSeguridad.md`. Ningún DNI, IBAN, email, teléfono en claro.
- **Errores con stack trace completo** en `error.stack`, parseable por la plataforma.
- **No loguees el éxito repetitivo**: 200 OK en cada request es ruido. Loguea anomalías y hitos.

### Anti-patrones

- `console.log()` en producción → prohibido (regla §2 de calidad).
- `logger.info(JSON.stringify(huge_object))` → loguea solo lo necesario, no objetos enteros.
- Loguear secretos, tokens, passwords → bug crítico, alerta de seguridad.
- Loguear el mismo evento desde varias capas → duplicación, ruido.

---

## Trazas distribuidas

- **OpenTelemetry desde el día 1.** Vendor-neutral, exportable a Jaeger, Tempo, Datadog, Honeycomb, etc.
- **Una traza por request de usuario**, propagada a través de servicios.
- **Spans por operación significativa**: llamada HTTP saliente, query a BD, cache hit/miss, llamada al LLM.
- **Atributos en spans**: `tenant_id`, `user_id` (hash), `feature`, `model` (en LLMs), `query_type` (en BD).
- **Propagación de contexto**: cabeceras W3C Trace Context (`traceparent`).
- **Sampling**: 100% en errores, sampling adaptativo en éxito (típicamente 1-10% en producción).

---

## Métricas

### RED method (para servicios)

- **Rate**: requests por segundo.
- **Errors**: errores por segundo, ratio de errores.
- **Duration**: latencia (p50, p95, p99).

### USE method (para recursos)

- **Utilization**: % de uso (CPU, memoria, conexiones BD).
- **Saturation**: cola de trabajo pendiente.
- **Errors**: errores del recurso.

### Métricas de negocio (no solo técnicas)

- Usuarios activos, transacciones completadas, conversion rate, coste por feature, etc.
- Una caída en transacciones puede ser visible en negocio antes que en técnica.

### Reglas

- **Cardinalidad controlada**: `tenant_id` está bien como label; `request_id` no (cardinalidad infinita rompe Prometheus).
- **Histogramas para latencia**, no medias. La media oculta colas.
- **Counters monotónicos**: solo crecen. Para "cosas instantáneas" usa gauges.

---

## Error tracking

- **Sentry o equivalente** capturando excepciones no manejadas + manejadas críticas.
- **Contexto enriquecido**: user_id (hash), tenant_id, request_id, breadcrumbs, release version, environment.
- **Source maps subidos** en cada deploy frontend.
- **Releases marcados**: cada deploy crea una release en el tracker para correlacionar errores con cambios.
- **Triage activo**: errores nuevos se revisan en daily / weekly. No se dejan acumular.
- **Alertas en regression**: si un error resuelto reaparece, alerta inmediata.

---

## RUM (Real User Monitoring)

- **Core Web Vitals reales**: LCP, INP, CLS, FCP, TTFB de usuarios reales, no solo Lighthouse en lab.
- **Segmentación**: por dispositivo, navegador, geografía, conexión.
- **Errores de cliente**: JS errors, fetch failures, recursos rotos.
- **Custom events** para hitos de UX: tiempo hasta primera interacción significativa, abandono de formulario, etc.

---

## SLOs y error budgets

- **SLOs explícitos** declarados en `/docs/slo.md`. Ejemplo:
  - Disponibilidad: 99.9% (43 min/mes de downtime permitido).
  - Latencia p95: < 500ms.
  - Error rate: < 0.1%.
- **Error budget mensual**: si lo consumes, se congelan features y se prioriza estabilidad.
- **Revisión mensual** de SLOs y error budget en el equipo.
- **Pages solo cuando se viola SLO**, no cuando una métrica oscila.

---

## Alertas

- **Solo alertas accionables.** Si una alerta no requiere acción humana, es ruido y se elimina.
- **Si nadie la mira a las 3 AM, no debería existir.**
- **Síntomas, no causas**: alerta "los usuarios ven errores 500" antes que "CPU al 90%".
- **Severidades claras**:
  - **P1 (page)**: usuario no puede usar el sistema, despierta a alguien.
  - **P2 (notify)**: degradación notable, atención en horario laboral.
  - **P3 (info)**: anomalía a investigar, sin urgencia.
- **Runbook enlazado en cada alerta**: qué significa, cómo diagnosticar, cómo mitigar.
- **Auto-remediación cuando sea seguro** (restart de pod, rollback automático en canary fallido).

---

## Dashboards

- **Uno por dominio funcional** (auth, billing, reports, llm) — no un mega-dashboard ilegible.
- **Top 4 widgets**: rate, errors, duration, saturation. El resto, scroll.
- **Por capa**: edge (CDN, WAF) → app → BD → integraciones externas.
- **Comparativa con baseline**: la métrica de hoy vs. misma hora hace 7 días.
- **Anotaciones de deploy**: cada release marcada en los gráficos para correlacionar.

---

## Health checks

- **Liveness**: ¿el proceso está vivo? (típicamente: el servidor responde).
- **Readiness**: ¿está listo para tráfico? (BD conectada, caches calientes, dependencias OK).
- **Startup**: para cargas iniciales lentas, evita matar el pod por timeout falso.
- **Endpoints separados**: `/healthz/live`, `/healthz/ready`, `/healthz/startup`.

---

## Definition of Done (específica de Observabilidad)

Además de la DoD universal:

- [ ] Logs estructurados añadidos en frontera del código nuevo (entrada, salida, errores).
- [ ] `request_id` propagado correctamente.
- [ ] Spans OpenTelemetry en operaciones significativas.
- [ ] Métricas RED (o USE) expuestas para el nuevo servicio/endpoint.
- [ ] Errores capturados por Sentry (o equivalente) con contexto.
- [ ] Sin secretos / PII en logs (verificable con grep o regla automatizada).
- [ ] Si toca SLO: SLO actualizado en `/docs/slo.md`.
- [ ] Si requiere alerta: alerta creada con runbook enlazado.
- [ ] Dashboard relevante actualizado o creado.

---

*Fin de normasObservabilidad.md*
