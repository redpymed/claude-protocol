# stack.md — Stack Tecnológico del Proyecto

> **Archivo semi-estático**. Cambia con decisiones arquitectónicas (nueva BD, cambio de hosting, etc.), no en cada tarea.
> **Lectura obligatoria al inicio de cada sesión** (CLAUDE.md §1).
> Cualquier cambio aquí requiere PR + ADR en `/docs/adr/`.

---

## §1. Lenguajes y runtimes

| Componente | Lenguaje | Versión | Notas |
|---|---|---|---|
| Frontend | <ej: TypeScript> | <5.x> | <strict mode> |
| Backend | <ej: TypeScript / Python / Go> | <versión> | |
| Scripts internos | | | |

---

## §2. Frontend

- **Framework**: <Next.js 15 / Remix / SvelteKit / Vue 3…>
- **Renderizado**: <SSR / SSG / SPA / mezcla>
- **Gestor de estado**: <Zustand / Jotai / React Query / Redux…>
- **UI / componentes**: <shadcn/ui / Radix / Material / Tailwind UI…>
- **Estilos**: <Tailwind 4 / CSS modules / styled-components…>
- **i18n**: <next-intl / react-i18next / lingui…>
- **Testing**: <Vitest + Testing Library / Playwright para e2e…>
- **Build**: <Vite / Turbopack / Webpack>

---

## §3. Backend

- **Framework / runtime**: <Next.js API routes / NestJS / Fastify / FastAPI / Hono…>
- **API style**: <REST / GraphQL / tRPC / gRPC>
- **Validación**: <Zod / Valibot / Pydantic / Joi>
- **ORM / cliente BD**: <Drizzle / Prisma / SQLAlchemy / Kysely / Supabase JS>
- **Auth / sesiones**: <Auth.js / Clerk / Supabase Auth / Firebase Auth / propio>
- **Background jobs / colas**: <BullMQ / Trigger.dev / Inngest / Cloud Tasks…>

---

## §4. Base de datos

- **Motor principal**: <PostgreSQL 16 / MySQL 8 / Firestore / DynamoDB…>
- **Hosting**: <Supabase / Neon / RDS / Cloud SQL / autoalojado…>
- **RLS**: <activado en todas las tablas / no aplica>
- **Migraciones**: <Drizzle Kit / Prisma Migrate / Atlas / Supabase migrations>
- **BD secundarias**:
  - **Cache**: <Redis / Upstash / KV>
  - **Vectorial** (si aplica): <pgvector / Pinecone / Qdrant>
  - **Búsqueda** (si aplica): <Meilisearch / Typesense / Elasticsearch>

---

## §5. IA y LLM

- **Proveedor(es)**: <Anthropic / OpenAI / Google / autohospedado>
- **Modelos permitidos**:
  - Tareas críticas: <ej: claude-opus-4-7>
  - Tareas estándar: <ej: claude-sonnet-4-6>
  - Clasificación / barata: <ej: claude-haiku-4-5>
- **Cost cap por tenant / día**: <€ máximo>
- **Cost cap por usuario / día**: <€ máximo>
- **Embeddings**: <modelo + proveedor>
- **Eval suite**: <ubicación de prompts versionados>

---

## §6. Infraestructura

- **Hosting principal**: <Vercel / AWS / GCP / Cloudflare / Fly.io…>
- **CDN**: <Cloudflare / Vercel Edge / CloudFront>
- **Storage**: <S3 / R2 / Supabase Storage / Firebase Storage>
- **DNS**: <Cloudflare / Route53>
- **Email transaccional**: <Resend / Postmark / SES>
- **Pagos**: <Stripe / Redsys / propio>

---

## §7. Observabilidad

- **Logs**: <Better Stack / Logtail / Datadog / GCP Logging>
- **Trazas**: <OpenTelemetry → exportador <X>>
- **Métricas**: <Prometheus / Grafana Cloud / Datadog>
- **Error tracking**: <Sentry / Bugsnag / Highlight>
- **RUM**: <Vercel Speed Insights / Datadog RUM / Sentry>
- **Uptime**: <Better Stack / Pingdom / UptimeRobot>

---

## §8. CI/CD

- **Plataforma**: <GitHub Actions / GitLab CI / CircleCI>
- **Pipeline mínimo**: install → lint → typecheck → test → build → security scan → deploy
- **Despliegue**: <auto a staging desde `main`, manual a prod / canary / blue-green>
- **Feature flags**: <PostHog / Statsig / LaunchDarkly / propio>

---

## §9. Seguridad y secretos

- **Gestor de secretos**: <Doppler / Infisical / Vault / AWS Secrets Manager / GCP Secret Manager>
- **Detección de secretos en código**: <gitleaks / trufflehog>
- **SCA**: <Dependabot / Snyk / Renovate>
- **SAST**: <Semgrep / CodeQL>
- **WAF**: <Cloudflare / AWS WAF>

---

## §10. MCPs y herramientas conectadas a Claude Code

> **Crítico**: estos son los MCPs que Claude Code DEBE preferir antes que reimplementar funcionalidad. Ver `aciertos.md` para ejemplos concretos de cuándo invocar cada uno.

| MCP | Para qué | Disponible en este proyecto |
|---|---|---|
| Filesystem | Lectura/escritura de archivos del repo | ✅ / ❌ |
| GitHub | Issues, PRs, releases | ✅ / ❌ |
| Supabase | Schema, queries, RLS, tipos | ✅ / ❌ |
| Postgres | Queries directas a BD | ✅ / ❌ |
| Linear / Jira | Tickets y proyectos | ✅ / ❌ |
| <otro> | <para qué> | ✅ / ❌ |

---

## §11. Comandos clave del proyecto

> Comandos que Claude Code debe conocer y preferir sobre invocaciones manuales. Ver `funciones.md` para detalle.

```bash
# Desarrollo
pnpm dev                  # arrancar entorno de desarrollo
pnpm build                # build de producción
pnpm start                # arrancar producción local

# Calidad
pnpm lint                 # ESLint
pnpm format               # Prettier
pnpm typecheck            # tsc --noEmit
pnpm test                 # tests unitarios
pnpm test:e2e             # tests end-to-end

# Base de datos
pnpm db:migrate           # ejecutar migraciones pendientes
pnpm db:types             # regenerar tipos TS desde schema
pnpm db:seed              # poblar BD de desarrollo

# Otros
pnpm new:module <nombre>  # crear módulo nuevo con scaffolding correcto
```

---

## §12. Estructura de carpetas

```
src/
├── shared/               ← utilidades técnicas puras (CLAUDE.md §7.2)
│   ├── formatting/
│   ├── validation/
│   ├── types/
│   └── infra/
├── modules/              ← bounded contexts (CLAUDE.md §7)
│   ├── <modulo-1>/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── api/
│   └── <modulo-2>/
└── app/                  ← capa de presentación (Next.js / SvelteKit / etc.)
docs/
├── adr/                  ← Architectural Decision Records
├── normas/               ← normas*.md (cargadas según CLAUDE.md §3)
├── runbooks/             ← guías de incidentes
├── slo.md                ← objetivos de servicio
├── dr.md                 ← plan de recuperación
└── retencion.md          ← política de retención RGPD/fiscal
```

---

## §13. Entornos

| Entorno | URL | Branch | Auto-deploy | Notas |
|---|---|---|---|---|
| Desarrollo | local | feature/* | n/a | |
| Staging | <url> | `main` | sí | datos sintéticos |
| Producción | <url> | `release/*` o tag | manual | datos reales, MFA exigido |

---

## §14. Versiones críticas pinneadas

> Versiones que el equipo NO actualiza sin revisión explícita (por compatibilidad con APIs externas, regulación, certificaciones, etc.).

| Paquete / componente | Versión | Motivo del pin |
|---|---|---|
| <ej: node> | <22.x> | <ej: imagen base certificada> |
| <ej: postgres-client> | <16.x> | <ej: dependencia externa exige esta versión> |

---

*Última actualización: YYYY-MM-DD por <quién>. Cualquier cambio aquí requiere ADR.*
