# Postmortem: <Título descriptivo del incidente>

> **Plantilla de postmortem blameless**. Copia este archivo a `docs/postmortems/YYYY-MM-DD-titulo.md`.
>
> El objetivo es aprender, no buscar culpables. Se asume que las personas tomaron las mejores decisiones posibles con la información que tenían.

---

## Resumen ejecutivo

- **Fecha del incidente**: YYYY-MM-DD HH:MM (UTC)
- **Duración**: <ej: 1h 23min>
- **Severidad**: SEV-1 / SEV-2 / SEV-3
- **Impacto a usuarios**: <ej: ~500 usuarios afectados, no pudieron iniciar sesión>
- **Servicios afectados**: <lista>
- **Causa raíz** (una frase): <…>
- **Trigger inmediato**: <qué disparó concretamente el incidente>
- **Resolución**: <qué acción restauró el servicio>

---

## Timeline

> Todo en zona horaria UTC. Cuanto más detallado mejor.

| Hora (UTC) | Evento |
|---|---|
| HH:MM | Deploy de versión X.Y.Z a producción. |
| HH:MM | Primer error 5xx detectado en métricas. |
| HH:MM | Alerta dispara. Acknowledged por <persona>. |
| HH:MM | Se identifica que el deploy es la causa probable. |
| HH:MM | Rollback iniciado. |
| HH:MM | Servicio restablecido. Tasa de error vuelve a baseline. |
| HH:MM | Incidente cerrado oficialmente. |
| HH:MM | Status page actualizada con resolución. |

---

## Impacto

### Usuarios afectados
- **Cuántos**: <número o %>
- **Cómo**: <qué experimentaron>
- **Geografía**: <regiones afectadas>

### Datos
- **Pérdida**: <ninguna / qué se perdió>
- **Corrupción**: <sí / no, alcance>
- **Privacidad**: <hubo exposición de PII?>

### Negocio
- **Pérdida estimada**: <€ / transacciones / etc.>
- **SLA violado**: <sí / no, qué cláusula>
- **Comunicación a clientes**: <hecha / pendiente>

---

## Análisis de la causa raíz

### Qué pasó técnicamente

<Descripción detallada y honesta del fallo. Sin culpas, sin ambigüedad.>

### Por qué pasó

> Aplica el "5 whys" o equivalente. No te pares en el primer "por qué".

1. **¿Por qué se rompió X?** Porque Y.
2. **¿Por qué Y?** Porque Z.
3. **¿Por qué Z?** Porque…
4. **¿Por qué…?** …
5. **¿Por qué…?** …

### Factores contribuyentes

Cosas que no causaron el incidente directamente, pero lo facilitaron o agravaron:

- <…>
- <…>

---

## Qué funcionó bien

> Sé generoso aquí. Reconocer lo que funcionó refuerza buenos hábitos.

- <ej: la alerta se disparó en X segundos, dentro del SLO>.
- <ej: el rollback automatizado funcionó perfectamente>.
- <ej: la comunicación interna fue clara y rápida>.

## Qué no funcionó bien

> Sé honesto pero blameless. Foco en sistemas, no personas.

- <ej: no había runbook para este escenario>.
- <ej: el dashboard no permitió ver la métrica clave>.
- <ej: el rollback tardó X min más de lo previsto por una dependencia>.

## Suerte vs. diseño

> ¿Qué cosas salieron bien por casualidad y deberíamos haber asegurado por diseño?

- <…>

---

## Action items

> Cada uno con owner, fecha y prioridad. Si no lo escribes así, no se hará.

| ID | Acción | Owner | Prioridad | Fecha objetivo | Estado |
|---|---|---|---|---|---|
| AI-1 | <Acción concreta y testeable> | @<persona> | P0 / P1 / P2 | YYYY-MM-DD | TODO |
| AI-2 | … | @<persona> | … | … | TODO |
| AI-3 | … | @<persona> | … | … | TODO |

### Categorías típicas de action items

- [ ] Test que cubre este caso (si era cubrible con tests).
- [ ] Mejora de alerta (detección más temprana o más precisa).
- [ ] Mejora de runbook (existía o crear si no existía).
- [ ] Cambio de código (fix, validación adicional, defensa en profundidad).
- [ ] Cambio de infraestructura.
- [ ] Cambio de proceso.
- [ ] Documentación.

---

## Lecciones aprendidas

Lecciones generales, transferibles a otros contextos:

- <…>
- <…>

---

## Comunicación post-incidente

### Interna
- [ ] Postmortem compartido en `#engineering`.
- [ ] Discusión en weekly del equipo.

### Externa (si procede)
- [ ] Comunicación a usuarios afectados (email / status page final).
- [ ] Si hubo exposición de PII: notificación a autoridad de protección de datos.

---

## Anexos

- Logs relevantes: <link al sistema de logs filtrado por la ventana>
- Gráficos: <screenshots embebidos o links>
- PRs relacionados: <links>
- ADRs afectados: <links>

---

*Este postmortem es propiedad del equipo. Cualquiera puede sugerir cambios mediante PR. Se considera cerrado cuando todos los action items P0/P1 están completados o reasignados.*
