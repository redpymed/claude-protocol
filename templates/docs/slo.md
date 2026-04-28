# Service Level Objectives (SLOs)

> Define qué nivel de servicio se compromete a entregar el proyecto y cómo se mide.
> Referenciado por `normasObservabilidad.md` y `normasOperaciones.md`.
>
> **Revisión obligatoria** cada 6 meses o cuando cambien las expectativas del producto.

---

## Última revisión

- **Fecha**: YYYY-MM-DD
- **Owner técnico**: <nombre>
- **Owner de producto**: <nombre>

---

## SLOs declarados

### SLO-1: Disponibilidad del servicio

- **Métrica**: % de requests HTTP 2xx/3xx sobre total (excluyendo 4xx que son errores de cliente legítimos).
- **Objetivo**: 99.9% mensual (≈ 43 minutos de downtime al mes).
- **Ventana**: 30 días naturales.
- **Fuente**: <prometheus / cloudwatch / etc.>
- **Alerta**: si error budget mensual cae por debajo del 25% restante.

### SLO-2: Latencia de respuesta

- **Métrica**: p95 de latencia de endpoints críticos.
- **Objetivo**: < 500ms.
- **Endpoints incluidos**: <lista>
- **Endpoints excluidos**: <lista> (con motivo: ej. exports masivos, generación de informes pesados).
- **Ventana**: 7 días.
- **Fuente**: <prometheus / datadog / etc.>

### SLO-3: Latencia de la primera paginación (frontend)

- **Métrica**: LCP p75 (Largest Contentful Paint, percentil 75 de usuarios reales).
- **Objetivo**: < 2.5 segundos.
- **Ventana**: 28 días.
- **Fuente**: RUM (Real User Monitoring).

### SLO-4: Tasa de errores

- **Métrica**: % de errores 5xx sobre total de requests.
- **Objetivo**: < 0.1%.
- **Ventana**: 7 días.

### SLO-5: <añadir según producto>
- Métricas específicas del dominio: tasa de procesamiento de jobs, freshness de datos, etc.

---

## Error Budget

### Cálculo
Si el SLO es 99.9%, el error budget mensual es 0.1% × 30 días = **43.2 minutos** de downtime "permitido".

### Política

| Estado del budget | Acciones |
|---|---|
| > 50% restante | Operación normal. Releases y features según roadmap. |
| 25-50% restante | Aumentar prudencia. Review más estricta de cambios. |
| < 25% restante | **Feature freeze**. Solo bug fixes y mejoras de fiabilidad. |
| Agotado | Postmortem obligatorio. Plan de recuperación antes de retomar features. |

### Reset
El budget se resetea al inicio de cada ventana mensual.

---

## Alertas asociadas

> Toda alerta apunta a un runbook en `docs/runbooks/`.

| Alerta | Disparador | Severidad | Runbook |
|---|---|---|---|
| Disponibilidad bajando | Tasa de éxito < 99.5% en ventana de 5 min | P1 | `runbooks/availability-drop.md` |
| Latencia p95 alta | p95 > 1s durante 10 min | P2 | `runbooks/high-latency.md` |
| Error rate alto | 5xx > 1% durante 5 min | P1 | `runbooks/error-rate-spike.md` |
| Error budget casi agotado | < 25% restante en mes vigente | P3 | `runbooks/budget-near-empty.md` |

---

## Histórico de cumplimiento

> Tabla mensual. Añade una fila al final de cada mes.

| Mes | SLO-1 | SLO-2 | SLO-3 | SLO-4 | Notas |
|---|---|---|---|---|---|
| YYYY-MM | __% | __ms | __s | __% | |

---

## Cambios al SLO

Modificar un SLO requiere ADR. Endurecerlo (subir el target) puede hacerse en cualquier momento; relajarlo requiere justificación explícita y aprobación de producto + tech lead.
