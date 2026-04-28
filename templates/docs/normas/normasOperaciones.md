# normasOperaciones.md — Operaciones y Resiliencia

> **Cargar este archivo cuando** la tarea toque: deploy, CI/CD, backups, restore, incidentes, runbooks, resiliencia, fallback, feature flags, canary, blue-green, circuit breakers, retry policies, DR (disaster recovery), infraestructura como código.
>
> **Subordinado a** `CLAUDE.md` §2.

---

## Principios

- **Todo cae.** Diseña asumiéndolo. La pregunta no es "si", es "cuándo".
- **Backups que no se han probado restaurando, no son backups.**
- **Reversibilidad antes que perfección**: prefiere un cambio que puedas deshacer rápido a uno "perfecto" que no.
- **Automatiza lo repetible**: cualquier paso manual repetido > 2 veces es candidato a script.

---

## CI/CD

### Pipeline mínimo

Cada PR debe pasar:

1. **Install** (cacheado).
2. **Lint** (ESLint, Prettier check).
3. **Type check** (tsc --noEmit).
4. **Tests unitarios e integración**.
5. **Build** (asegurar que compila para producción).
6. **Security scan** (SAST + SCA).
7. **Tests E2E** en flujos críticos (puede ser job separado).

Si algo falla, no se mergea. Sin "skip CI" en `main`.

### Reglas

- **Branch protection en `main`**: PR review obligatoria, todos los checks en verde, no fuerza-push.
- **CI determinista y rápido**: < 10 min idealmente para feedback útil. > 30 min = optimizar.
- **Cache agresivo**: dependencias, builds intermedios, capas Docker.
- **Tests en paralelo** cuando sea posible.
- **Artefactos versionados**: cada build produce artefacto con SHA del commit.

---

## Deploy

### Estrategias permitidas

- **Rolling update** para servicios stateless con health checks bien definidos.
- **Blue-green** para releases mayores con riesgo de regresión.
- **Canary** para cambios con incertidumbre: 1% → 5% → 25% → 100% con métricas en cada paso.
- **Feature flags** para releases riesgosos: deploy desactivado, activación gradual.

### Reglas

- **Inmutable infrastructure**: cada deploy crea artefacto nuevo, no modifica el existente.
- **Rollback < 5 min**: el procedimiento de rollback es conocido, automatizado y probado regularmente.
- **No deploy a producción los viernes por la tarde** (excepto hotfix). Norma cultural, no técnica.
- **Cambios de schema antes que código**: si la migración es retro-compatible, va antes. Si no, secuencia documentada (expand → migrate → contract).
- **Anuncio de deploy**: notificación automática al canal del equipo con cambios incluidos.

---

## Feature flags

- **Para releases riesgosos**: nuevas features se mergean a `main` con flag desactivado, se activan gradualmente.
- **Para kill switches**: features críticas pueden desactivarse en producción sin redeploy.
- **Para A/B testing**: variantes con métricas asociadas.
- **Limpieza obligatoria**: flags con > 90 días deben eliminarse o convertirse en permanentes (kill switch).
- **Documentados**: cada flag tiene owner, fecha de creación, propósito, fecha de eliminación prevista.

---

## Resiliencia

### Patrones obligatorios

- **Circuit breakers** para dependencias externas críticas (APIs de terceros, LLM, pasarelas de pago, organismos oficiales si aplica). Estado abierto = fallback definido.
- **Retry con exponential backoff + jitter**. Sin jitter, todo el cluster reintenta a la vez y multiplicas la caída.
- **Timeouts en TODA llamada externa.** Default 30s suele ser demasiado; afina por endpoint.
- **Idempotency keys** en operaciones financieras o irreversibles. Reintentar nunca duplica.
- **Bulkheads**: aísla pools de recursos para que un endpoint que se atasca no consuma todo el thread pool.
- **Graceful degradation**:
  - Si el LLM cae → la app sigue, feature deshabilitado con mensaje claro.
  - Si la réplica de lectura cae → lee del primario.
  - Si el CDN cae → sirve desde origen.
  - Si la cache cae → va a BD, asume mayor latencia.

### Anti-patrones

- Reintentar sin límite → cascada de fallos.
- Reintentar sin backoff → stampede.
- Reintentar operaciones no idempotentes → datos corruptos.
- Timeout = ∞ → recursos colgados.
- Mismo pool de threads para todo → un endpoint lento mata el servicio.

---

## Backups y recuperación

### Reglas

- **Automatizados**: nunca manual.
- **Frecuencia**: continua para BDs críticas (PITR), diaria mínimo para el resto.
- **Almacenamiento separado**: en otro proveedor o región. Un atacante con acceso a producción no debe poder borrar backups.
- **Cifrados** en reposo, claves separadas del entorno de producción.
- **Probados**: restauración completa testeada al menos mensualmente. Backup no probado = no existe.
- **Retención según política RGPD**: ver `normasSeguridad.md` y `docs/retencion.md`.
- **Plan de purga** documentado: cuando se ejerce derecho de supresión, los datos en backups se purgan en plazo razonable (típicamente 30 días) o se documenta el motivo de retención.

### Métricas

- **RPO (Recovery Point Objective)**: cuánto dato puedes perder. Define el target.
- **RTO (Recovery Time Objective)**: cuánto tiempo de downtime puedes asumir. Define el target.
- Ambos documentados en `/docs/dr.md` y revisados anualmente.

---

## Disaster Recovery

- **Plan documentado** en `/docs/dr.md`: qué se hace, en qué orden, quién contacta a quién.
- **Probado al menos 1 vez/año**: simulacro real, no solo lectura del documento.
- **Contactos actualizados**: proveedores, soporte premium, autoridad de protección de datos, asesoría legal.
- **Comunicación a usuarios**: plantillas pre-aprobadas para distintos escenarios (caída total, brecha de datos, mantenimiento prolongado).

---

## Incidentes

### Severidades

- **SEV-1**: caída total, impacto en todos los usuarios, dinero/datos en riesgo. Page inmediato.
- **SEV-2**: degradación significativa, subset de usuarios afectado, workaround posible. Page en horario laboral.
- **SEV-3**: bug visible pero no crítico. Issue normal.

### Procedimiento ante SEV-1/SEV-2

1. **Acknowledge** la alerta inmediatamente (incluso si no sabes qué pasa).
2. **Comunica** en el canal del equipo: "Investigando SEV-1 en X".
3. **Mitigar antes que entender**: si rollback resuelve, rollback. Análisis después.
4. **Status page actualizada** si afecta a usuarios externos.
5. **Time-box** la investigación: si no avanzas en 30 min, escalar.
6. **Postmortem obligatorio** para SEV-1. Blameless. Producir action items concretos.

### Postmortem

- **Plantilla en `/docs/postmortems/YYYY-MM-DD-titulo.md`**.
- **Secciones**: timeline, impacto, causa raíz, qué funcionó, qué no, action items.
- **Action items con owner y fecha**. Revisados en semanal hasta cerrarse.
- **Compartido en el equipo**, no archivado en silencio.

---

## Runbooks

- **Para incidentes comunes**: caída de BD, agotamiento de cuota LLM, certificado expirado, deploy roto, etc.
- **Ubicación**: `/docs/runbooks/<topic>.md`.
- **Estructura**:
  - Síntomas (cómo se manifiesta).
  - Diagnóstico (cómo confirmarlo).
  - Mitigación (qué hacer ahora).
  - Resolución (cómo arreglarlo definitivamente).
  - Prevención (qué cambiar para que no vuelva).
- **Cualquiera del equipo debe poder ejecutar el runbook a las 3 AM** sin contexto previo.
- **Probados periódicamente**: el día del simulacro de DR es buen momento.

---

## Infraestructura como código

- **Toda la infra en repo versionado**: Terraform, Pulumi, CloudFormation, Cloud Deployment Manager.
- **Cambios manuales en consola prohibidos** en producción salvo emergencia documentada.
- **Drift detection**: alertar cuando lo que está desplegado no coincide con el código.
- **Entornos paralelos**: dev / staging / prod definidos como variantes del mismo IaC, no como repos separados.
- **Secretos NO en IaC**: referencias a Vault / Secrets Manager, nunca valores en claro.

---

## Definition of Done (específica de Operaciones)

Además de la DoD universal:

- [ ] Cambio desplegado a staging y validado antes de producción.
- [ ] Procedimiento de rollback identificado y probado.
- [ ] Si toca dependencia externa: timeout, retry y circuit breaker definidos.
- [ ] Si toca operación irreversible: idempotency key implementada.
- [ ] Si añade infraestructura: cambio en IaC, no manual.
- [ ] Si afecta SLO: error budget revisado.
- [ ] Si requiere runbook nuevo o actualizado: creado y probado.
- [ ] Feature flag presente si el cambio es de riesgo.
- [ ] Si modifica backup/restore: prueba de restauración ejecutada.

---

*Fin de normasOperaciones.md*
