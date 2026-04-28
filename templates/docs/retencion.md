# Política de Retención de Datos

> Documenta los plazos y criterios de retención y borrado de cada categoría de datos personales tratada por el proyecto. Referenciada por `normasSeguridad.md` y por el RAT (Registro de Actividades de Tratamiento, Art. 30 RGPD).
>
> **Revisión obligatoria** cada 12 meses o cuando cambie el tratamiento de datos.

---

## Última revisión

- **Fecha**: YYYY-MM-DD
- **Revisor**: <nombre>
- **Cambios desde la versión anterior**: <breve resumen>

---

## Tabla maestra de retención

| Categoría de datos | Plazo de conservación | Base legal | Sistema(s) donde reside | Procedimiento de borrado |
|---|---|---|---|---|
| Datos de cuenta de usuario activo | Hasta cancelación + N días | Contrato (Art. 6.1.b) | <BD principal, BD réplica> | Soft delete + purga a los N días |
| Datos de facturación | <plazo legal según jurisdicción> | Obligación legal | <BD principal, archivo> | Anonimización tras plazo legal |
| Logs de seguridad | 1-2 años | Interés legítimo (Art. 6.1.f) | <sistema de logs> | Borrado automático |
| Logs de aplicación general | 30-90 días | Interés legítimo | <sistema de logs> | Borrado automático |
| Backups completos | 30 días | Operativa / continuidad | <storage de backups> | Rotación con purga |
| Comunicaciones marketing | Hasta revocación | Consentimiento (Art. 6.1.a) | <CRM, email provider> | Borrado inmediato al opt-out |
| Embeddings derivados de PII | Mientras dure el origen | Mismo del dato origen | <BD vectorial> | Borrado al borrar el dato origen |
| Cookies y tracking | Según declarado en banner | Consentimiento | <navegador del usuario> | Expiración técnica |

---

## Política de derechos del interesado

### Derecho de acceso (Art. 15 RGPD)
- **Plazo de respuesta**: 30 días naturales desde solicitud (prorrogable a 60 con aviso justificado).
- **Formato de entrega**: <JSON / CSV / PDF estructurado>.
- **Procedimiento interno**: <link a runbook>.

### Derecho de rectificación (Art. 16)
- **Cuándo**: cualquier momento.
- **Auto-servicio**: <qué campos puede editar el propio usuario>.
- **Asistido**: <cómo solicita el resto>.

### Derecho de supresión (Art. 17)
- **Plazo**: 30 días naturales.
- **Alcance**: BD principal, réplicas, BD vectorial, caches, logs aplicativos.
- **Excepciones documentadas**:
  - Datos sometidos a obligación legal de conservación (ver tabla maestra).
  - Backups: purga en el siguiente ciclo de rotación (máximo N días).
- **Procedimiento**: <link a runbook>.

### Derecho de portabilidad (Art. 20)
- **Formato**: <JSON estructurado>.
- **Plazo**: 30 días naturales.

### Derecho de oposición y limitación (Arts. 21 y 18)
- **Marketing**: opt-out efectivo en <link / configuración>.
- **Perfilado**: <descripción del mecanismo>.

---

## Procedimientos asociados

### Borrado en backups
1. Las solicitudes de supresión se atienden de inmediato en BD productiva.
2. Los backups con el dato se purgan automáticamente al cumplir su rotación normal.
3. Si el usuario exige borrado inmediato del backup, se ejecuta el procedimiento documentado en `docs/runbooks/<runbook>.md`, con coste y plazo comunicados.

### Anonimización vs. borrado
- **Anonimización**: para datos sometidos a obligación legal de conservación (facturación). Se sustituyen identificadores por hashes o constantes, manteniendo agregables analíticos.
- **Borrado**: para el resto. Eliminación física tras periodo de soft delete.

### Notificación de brechas (Art. 33-34)
- **Plazo a la autoridad**: 72 horas desde detección, si hay riesgo para derechos y libertades.
- **Plazo al interesado**: sin demora indebida, si el riesgo es alto.
- **Procedimiento**: ver `docs/runbooks/breach-response.md`.

---

## Sub-encargados del tratamiento

| Proveedor | Categoría de datos | DPA firmado | Transferencias internacionales | Base legal |
|---|---|---|---|---|
| <ej: Supabase> | <Datos de cuenta, logs> | ✅ YYYY-MM-DD | <UE / SCCs> | Encargado del tratamiento |
| <ej: Cloudflare> | <Tráfico, IPs> | ✅ YYYY-MM-DD | <UE / Adequacy / SCCs> | Encargado del tratamiento |
| ... | ... | ... | ... | ... |

Toda alta o cambio de subencargado se comunica al responsable del tratamiento.

---

## Controles automatizados

- **Borrado automatizado**: cron / job que elimina datos vencidos según tabla maestra.
- **Auditoría de retención**: revisión trimestral de coherencia entre lo declarado aquí y la realidad operativa.
- **Alertas**: si un dato supera su plazo, alerta al equipo.

---

## Histórico de cambios

| Fecha | Versión | Cambio | Autor |
|---|---|---|---|
| YYYY-MM-DD | 1.0 | Versión inicial | <nombre> |
