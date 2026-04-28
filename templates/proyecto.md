# proyecto.md — Estado Vivo del Proyecto

> **Archivo dinámico**. Claude Code lo actualiza al cierre de cada tarea (CLAUDE.md §6.1).
> La identidad del proyecto, su contexto y su stack viven en `descripcion.md` y `stack.md` respectivamente — aquí solo va lo que cambia con frecuencia.

---

## §1. Snapshot actual

- **Versión actual**: 0.1.0
- **Estado global**: 🚧 En desarrollo inicial / 🟢 Producción / 🔵 Mantenimiento
- **Última actualización de este archivo**: YYYY-MM-DD por <Claude Code | humano>
- **Build en `main`**: ✅ / ❌
- **Cobertura global**: __%
- **SLO disponibilidad último mes**: __% (si aplica)

---

## §2. Estado por módulos

> Un bloque por módulo de negocio (bounded context). Marca claramente qué hay donde.

### Módulo: `<nombre>` (ej: `billing`)
- **Estado**: 🟢 Producción / 🟡 Staging / 🔵 Desarrollo / ⚪ Planificado
- **Versión**: 0.1.0
- **Cobertura de tests**: __%
- **Última feature añadida**: <descripción + fecha>

### Módulo: `<nombre>`
- ...

---

## §3. Última tarea completada

- **Fecha**: YYYY-MM-DD
- **Tarea**: <título>
- **Módulos afectados**: <lista>
- **Archivos clave modificados**: <rutas>
- **Commits**: <hashes o link a PR>
- **Notas**: <cualquier consideración relevante para retomar contexto>

---

## §4. En curso

- [ ] <tarea actual con responsable y % estimado>
- [ ] <tarea paralela si la hay>

---

## §5. Cola de próximas tareas (priorizadas)

> Tareas concretas, no roadmap (el roadmap a alto plazo está en `descripcion.md` §7).

1. <tarea 1 — descripción breve + módulo>
2. <tarea 2 — descripción breve + módulo>
3. <tarea 3 — descripción breve + módulo>
4. ...

---

## §6. Decisiones recientes (últimas 5)

> Decisiones técnicas o de producto que afectan al rumbo. Para decisiones formales con consecuencias, usar ADRs en `/docs/adr/`.

- **YYYY-MM-DD** — <decisión> (motivo: <razón breve>)
- **YYYY-MM-DD** — <decisión>
- **YYYY-MM-DD** — <decisión>
- **YYYY-MM-DD** — <decisión>
- **YYYY-MM-DD** — <decisión>

---

## §7. Bloqueos abiertos

> Cosas que impiden avanzar y requieren decisión humana o externa. Si está aquí, alguien tiene que desatascarlo.

- **<bloqueo>**: <descripción + qué se espera + desde cuándo + responsable>

---

## §8. Métricas vivas (opcional)

> Solo si se monitorizan activamente. Si no, eliminar la sección.

- **Tests pasando**: ✅ / ❌
- **Bundle size frontend**: __KB (presupuesto: __KB)
- **Latencia p95 producción**: __ms
- **Error rate último día**: __%
- **Coste LLM último mes**: __€

---

## §9. Historial de versiones

> Append-only. La versión más reciente arriba.

### v0.1.0 — YYYY-MM-DD
- **Hito**: <qué se cerró en esta versión>
- **Cambios principales**:
  - <cambio 1>
  - <cambio 2>
- **Migraciones BD**: <sí/no, referencia>
- **Breaking changes**: <ninguno / lista>

---

*Última verificación de coherencia (proyecto.md vs. descripcion.md vs. stack.md): YYYY-MM-DD.*
