# Disaster Recovery Plan

> Documenta cómo recuperar el servicio ante incidentes mayores.
> Referenciado por `normasOperaciones.md` y `normasSeguridad.md`.
>
> **Revisión obligatoria** anual + tras cualquier incidente SEV-1 + tras cambio mayor de infraestructura.
> **Simulacro obligatorio** anual: probar el plan, no solo leerlo.

---

## Última revisión

- **Fecha**: YYYY-MM-DD
- **Próxima revisión programada**: YYYY-MM-DD
- **Último simulacro**: YYYY-MM-DD (ver `docs/postmortems/<fecha>-simulacro.md`)

---

## Objetivos cuantificados

### RPO — Recovery Point Objective
**Cuánto dato podemos perder en un escenario de catástrofe.**

| Sistema | RPO objetivo | Cómo se garantiza |
|---|---|---|
| BD principal | <ej: 5 minutos> | Replicación + Point In Time Recovery |
| Storage de archivos | <ej: 1 hora> | Sincronización a otra región |
| Logs | <ej: 1 día> | Acepta pérdida; no son críticos para reanudar |

### RTO — Recovery Time Objective
**Cuánto tiempo aceptamos estar caídos antes de restaurar el servicio.**

| Escenario | RTO objetivo | Procedimiento |
|---|---|---|
| Caída de zona (un AZ) | <ej: 5 min> | Failover automático a otra AZ |
| Caída de región completa | <ej: 4 horas> | Failover manual a región DR |
| Compromiso de seguridad | <ej: 24 horas> | Aislamiento + restore + auditoría |
| Pérdida de datos crítica | <ej: 12 horas> | Restore desde backup + reconciliación |

---

## Escenarios cubiertos

### Escenario 1: Caída de zona de disponibilidad

- **Probabilidad**: media
- **Impacto**: medio
- **Detección**: alertas de availability + páginas 502/503
- **Procedimiento**:
  1. Verificar que es zona y no región.
  2. Forzar failover si no se hizo automático.
  3. Confirmar que tráfico está sirviéndose desde la otra zona.
  4. Investigar la zona caída sin urgencia.
- **Runbook**: `docs/runbooks/az-failover.md`

### Escenario 2: Caída de región completa

- **Probabilidad**: baja
- **Impacto**: alto
- **Detección**: alertas múltiples + dashboard de la región DR.
- **Procedimiento**:
  1. Activar war room.
  2. Notificar a stakeholders y usuarios (status page).
  3. Promocionar región DR a primaria.
  4. Verificar integridad de datos.
  5. Comunicar restablecimiento.
- **Runbook**: `docs/runbooks/region-failover.md`

### Escenario 3: Compromiso de seguridad / brecha

- **Probabilidad**: baja
- **Impacto**: muy alto
- **Detección**: SIEM, anomalías, reporte externo.
- **Procedimiento**:
  1. Aislar componentes comprometidos.
  2. Revocar credenciales potencialmente expuestas.
  3. Preservar evidencia forense.
  4. Restaurar desde estado seguro conocido.
  5. Notificación a autoridad de protección de datos (72h, RGPD Art. 33).
  6. Comunicación a usuarios afectados si procede.
  7. Postmortem completo.
- **Runbook**: `docs/runbooks/breach-response.md`

### Escenario 4: Pérdida de datos / corrupción

- **Probabilidad**: baja
- **Impacto**: alto
- **Detección**: alertas de integridad, reportes de usuarios, checksums.
- **Procedimiento**:
  1. Detener escrituras.
  2. Identificar alcance de la corrupción/pérdida.
  3. Restore desde backup más reciente válido.
  4. Reconciliación de operaciones desde el último punto bueno.
- **Runbook**: `docs/runbooks/data-restore.md`

### Escenario 5: Caída prolongada de proveedor crítico

- **Probabilidad**: media
- **Impacto**: variable según proveedor
- **Detección**: alertas + status page del proveedor
- **Procedimiento**:
  1. Activar circuit breaker / fallback.
  2. Comunicar degradación al usuario.
  3. Esperar recuperación o activar plan B documentado.
- **Plan B por proveedor**:
  - <Proveedor crítico 1>: <plan de fallback>
  - <Proveedor crítico 2>: <plan de fallback>

---

## Backups

### Estrategia
- **Frecuencia**: <ej: continua para BD vía PITR; diaria para storage>
- **Retención**: <ej: 30 días rolling + snapshots mensuales por 1 año>
- **Almacenamiento**: separado del entorno productivo, en otra región / proveedor.
- **Cifrado**: AES-256 en reposo, claves gestionadas por <KMS / Vault>.

### Pruebas de restauración
- **Frecuencia mínima**: mensual en staging, anual completo end-to-end.
- **Última prueba completa**: YYYY-MM-DD (informe en `docs/postmortems/<fecha>-restore-test.md`).

---

## Contactos críticos

| Rol | Persona | Contacto primario | Contacto alternativo |
|---|---|---|---|
| Tech lead | <nombre> | <email/tel> | <email/tel> |
| Owner producto | <nombre> | <email/tel> | <email/tel> |
| Soporte premium proveedor cloud | — | <tel/portal> | — |
| Asesoría legal | <despacho> | <contacto> | — |
| Autoridad de protección de datos | — | <web oficial AEPD u otra> | — |
| Compañía de ciberseguros (si aplica) | — | <contacto> | — |

---

## Comunicación durante incidentes

### Canales
- **Interno**: <Slack / Teams> canal `#incidentes`.
- **Externo**: status page en <url>.
- **Email a usuarios**: plantillas pre-aprobadas en `docs/runbooks/templates/`.

### Plantillas
- **Inicio**: "Estamos investigando un problema que afecta a <X>. Próxima actualización en 30 min."
- **Actualización**: "Estado actual: <Y>. Acciones en curso: <Z>. Próxima en 30 min."
- **Resolución**: "Servicio restablecido. Causa: <breve>. Postmortem completo en N días."

---

## Histórico de simulacros

| Fecha | Tipo | Resultado | Acciones derivadas |
|---|---|---|---|
| YYYY-MM-DD | <restore / failover / breach> | <OK / parcial / falló> | <ver postmortem> |
