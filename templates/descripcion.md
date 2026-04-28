# descripcion.md — Descripción del Proyecto

> **Archivo estático**. Se rellena al inicio del proyecto y cambia raramente (cuando el negocio o el alcance cambian).
> **Lectura obligatoria al inicio de cada sesión** (CLAUDE.md §1).
> Si lees esto y está sin rellenar, eres la primera sesión: pide al usuario los datos antes de continuar.

---

## §1. Identidad

- **Nombre del proyecto**: <nombre>
- **Repositorio**: <url>
- **Owner técnico / responsable**: <nombre + email>
- **Owner de producto / negocio**: <nombre + email>
- **Estado del proyecto**: 🚧 En desarrollo inicial / 🟢 En producción / 🔵 Mantenimiento
- **Fecha de inicio**: YYYY-MM
- **Fecha objetivo de primera release**: YYYY-MM (o "ya en producción")

---

## §2. Propósito

### ¿Qué resuelve este proyecto?

<2-4 frases describiendo el problema que el proyecto soluciona, en lenguaje de negocio, no técnico.>

### ¿Para quién?

- **Usuario primario**: <perfil>
- **Usuario secundario** (si aplica): <perfil>
- **Decisor de compra** (si distinto del usuario): <perfil>

### ¿Cuál es el "éxito" del proyecto?

<Cómo se mide si el proyecto va bien. Métricas de negocio, no técnicas. Ej: "X clientes activos a 12 meses", "reducción del Y% en tiempo de tramitación", etc.>

---

## §3. Contexto de negocio

### Sector / industria

<Sector concreto. Ej: SaaS B2B, e-commerce, marketplace, herramienta interna empresarial, fintech, healthtech, edtech, etc.>

### Modelo de negocio

<Cómo gana dinero el proyecto. SaaS B2B, comisión por transacción, licencia perpetua, freemium, etc.>

### Restricciones particulares del sector

> Aquí van las cosas que un programador externo no podría adivinar y que afectan a todas las decisiones técnicas.

- **Regulatorias**: <ej: protección de datos (AEPD/RGPD), sectoriales específicas si aplica>
- **Plazos legales de conservación**: <ej: 4-6 años según LGT si hay facturación; otros plazos según sector>
- **Sensibilidad de los datos**: <ej: PII general, datos de pago, datos de salud, etc.>
- **Sectores con normativa adicional**: <si aplica>
- **Competencia / referencias**: <productos similares conocidos>

### Idioma y localización

- **Idioma principal del producto**: <es-ES, en-US, multi-idioma…>
- **Mercados objetivo**: <España, UE, LatAm, global>
- **Moneda(s)**: <EUR, USD…>
- **Zona(s) horaria(s) operacional(es)**: <Europe/Madrid, UTC…>

---

## §4. Alcance

### Dentro del alcance (qué SÍ resuelve)

- <funcionalidad 1>
- <funcionalidad 2>
- <funcionalidad 3>

### Fuera del alcance (qué NO resuelve, deliberadamente)

> Tan importante como lo que sí hace. Evita scope creep.

- <límite 1>
- <límite 2>

### Integraciones críticas

> Sistemas externos sin los que el proyecto no funciona.

- **<sistema>**: <para qué + criticidad>
- **<sistema>**: <para qué + criticidad>

---

## §5. Equipo y stakeholders

| Rol | Persona | Contacto |
|---|---|---|
| Producto / negocio | <nombre> | <email> |
| Tech lead | <nombre> | <email> |
| Diseño / UX | <nombre> | <email> |
| Cliente principal / sponsor | <nombre> | <email> |
| Soporte legal / cumplimiento | <nombre> | <email> |

---

## §6. Glosario de dominio

> **Crítico**: lista las palabras propias del negocio que aparecen en el código y su definición precisa. Ahorra horas de confusión.

| Término | Definición | Notas |
|---|---|---|
| `<Término>` | <definición clara, sin jerga adicional> | <ej: "no confundir con X"> |
| `<Término>` | <definición> | |

---

## §7. Roadmap a alto nivel

> **No es la lista de tareas** (eso vive en `proyecto.md`). Es el horizonte de 6-12 meses para que cualquier decisión técnica se evalúe contra el rumbo.

### Hito 1 — <título> (objetivo: YYYY-Q_)
<descripción breve>

### Hito 2 — <título> (objetivo: YYYY-Q_)
<descripción breve>

### Hito 3 — <título> (objetivo: YYYY-Q_)
<descripción breve>

---

## §8. Decisiones de producto inmutables

> Cosas decididas por negocio que NO se cuestionan en cada PR. Si Claude Code tiene una idea brillante que contradice esto, primero se discute aquí.

- <decisión + motivo>
- <decisión + motivo>

---

*Última actualización: YYYY-MM-DD por <quién>.*
