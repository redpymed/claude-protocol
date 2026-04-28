# normasSeguridad.md — Seguridad y Privacidad

> **Cargar este archivo cuando** la tarea toque: autenticación, login, sesiones, permisos, roles, autorización, datos personales, PII, RGPD/LOPDGDD, cifrado, secretos, CORS, rate limiting, headers HTTP, logs de auditoría, cumplimiento legal, cookies, MFA, OAuth/SAML/SSO.
>
> **Subordinado a** `CLAUDE.md` §2.

---

## Principios

- **Defense in depth**: cada capa asume que la anterior puede fallar. RLS no se salta porque "el backend ya filtra".
- **Privacy by Design (Art. 25 RGPD)**: la privacidad se diseña, no se parchea.
- **Mínima información**: solo recoger lo necesario, conservar el menor tiempo posible, exponer al mínimo personal.
- **Asumir compromiso**: diseña como si el atacante ya estuviera dentro. ¿Cuánto daño podría hacer?

---

## Capa perimetral

- **CORS con lista blanca explícita.** `Access-Control-Allow-Origin: *` está prohibido salvo en endpoints públicos sin estado.
- **Rate limiting** por IP **y** por user_id. Token bucket o leaky bucket. Ventana corta (login, password reset, endpoints sensibles) y larga (uso general).
- **WAF** activo en producción.
- **Cabeceras HTTP obligatorias**:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `Content-Security-Policy` sin `unsafe-inline`/`unsafe-eval` en producción (usar nonce o hash).
  - `X-Frame-Options: DENY` (o `frame-ancestors 'none'` en CSP).
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` minimizada (solo permisos que la app realmente usa).
  - `X-Content-Type-Options: nosniff`

---

## Identidad y acceso

- **Row Level Security obligatorio** en toda tabla con datos de usuario, también si el backend ya filtra. Es la red de seguridad cuando el backend tiene un bug.
- **JWT con expiración corta** (≤ 15 min) + refresh tokens rotantes con detección de reuso (revoca toda la familia si se detecta token reusado).
- **MFA obligatorio** para roles administrativos y acciones críticas (cambio de permisos, borrado masivo, exportación de datos, transacciones financieras).
- **TOTP o WebAuthn**, no SMS para MFA crítico (SIM swapping).
- **Session fixation prevention**: regenerar session ID tras login.
- **Logout efectivo**: revocar tokens del lado servidor, no solo borrar cookie.
- **Password policy**: mínimo 12 caracteres, comprobación contra haveibeenpwned o equivalente, sin reglas absurdas (mayúscula+número+símbolo es contraproducente).
- **Lockout progresivo** tras intentos fallidos de login (no permanente para no facilitar DoS de cuentas).
- **Rotación automática de secretos** vía Vault, AWS Secrets Manager, GCP Secret Manager o equivalente. Nunca rotación manual.
- **Principio de mínimo privilegio** en service accounts y roles de BD. Cada servicio usa credenciales propias con permisos acotados.

---

## Autorización

- **Modelo explícito**: RBAC, ABAC o ReBAC documentado. No "el frontend oculta el botón".
- **Verificación en cada endpoint**, no solo en el router. Defense in depth.
- **Recursos: ownership check obligatorio**. ¿Este user puede acceder a este recurso de este tenant?
- **No filtrar existencia**: 403 si existe pero no autorizado, 404 si no existe — pero **mismo mensaje** al cliente para no revelar existencia.

---

## Datos

- **Cifrado en reposo** (AES-256) para PII y datos sensibles.
- **TLS 1.3** en tránsito. TLS 1.2 solo si compatibilidad lo exige y documentado.
- **Sanitización de output** (XSS): escapado por defecto en el motor de plantillas. `dangerouslySetInnerHTML` y equivalentes requieren justificación documentada y revisión humana.
- **Validación de input** en frontera con schema (Zod/Valibot). No confiar en validación cliente.
- **Logs de seguridad inmutables**: intentos fallidos de login, cambios de permisos, accesos a PII, exportaciones de datos. Replicados a almacenamiento externo, retención mínima 1 año.
- **Hash de passwords**: Argon2id (preferido) o bcrypt cost ≥ 12. Nunca MD5, SHA-1, SHA-256 directo.
- **Hash de identificadores en logs**: si necesitas trazar a un user en logs, usa un hash (HMAC con secret rotativo), no el ID real.

---

## Cumplimiento RGPD / LOPDGDD (UE / España)

### Bases legales

- **Base de licitud documentada** para cada tratamiento (consentimiento, contrato, obligación legal, interés legítimo, interés vital, misión pública).
- **Consentimiento granular y revocable.** Un check único "acepto todo" no es consentimiento válido. Cada finalidad, su check.
- **Registro del consentimiento**: timestamp, versión del texto aceptado, IP, user agent. Inmutable.

### Derechos del interesado

- **Derecho de acceso (Art. 15)**: el usuario puede exportar todos sus datos. Endpoint o flujo manual documentado, plazo máximo 30 días.
- **Derecho de rectificación (Art. 16)**: editable por el usuario directamente cuando posible.
- **Derecho de supresión (Art. 17)**: el borrado debe alcanzar BD principal, réplicas, backups (con plan de purga documentado), embeddings vectoriales, caches, logs aplicativos. Excepciones: obligaciones legales (LGT, conservación fiscal 4-6 años) documentadas y separadas.
- **Derecho de portabilidad (Art. 20)**: export en formato estructurado (JSON, CSV).
- **Derecho de oposición (Art. 21)**: opt-out efectivo de marketing, perfilado, etc.

### Política de retención escalonada

Documentar en `docs/retencion.md`:

| Categoría | Plazo | Base legal |
|---|---|---|
| Datos de usuario activo | Hasta cancelación + X días | Contrato |
| Facturación | 4-6 años (LGT) | Obligación legal |
| Logs de seguridad | 1-2 años | Interés legítimo |
| Logs de aplicación | 30-90 días | Interés legítimo |
| Backups | 30 días con purga automática | Operativa |
| Comunicaciones marketing | Hasta revocación | Consentimiento |

### Proveedores y transferencias

- **DPA firmado** con todo proveedor cloud que procese datos personales (Art. 28 RGPD).
- **Registro de Actividades de Tratamiento (RAT)** mantenido y actualizado (Art. 30).
- **Transferencias internacionales** documentadas con base legal: cláusulas contractuales tipo (SCCs), decisión de adecuación, BCRs. Para EE.UU.: Data Privacy Framework verificado.
- **Subencargados** comunicados al responsable del tratamiento.

### Notificación de brechas

- **Plan de respuesta a brechas** documentado: detección, contención, evaluación, notificación.
- **Plazo AEPD: 72 horas** desde conocimiento de brecha con riesgo para derechos y libertades.
- **Comunicación al interesado**: cuando el riesgo es alto.

---

## Supply chain

- **SCA bloqueante en CI**: Snyk, Dependabot, `npm audit`, `pip-audit`. CVE crítico = build rojo.
- **SAST en cada PR**: Semgrep o equivalente.
- **Lockfiles versionados.** Reproducibilidad obligatoria (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`).
- **Sandboxing**: tareas que procesan archivos de usuario corren en contenedores con recursos y red limitados.
- **Pinning de versiones** en producción (no `^` ni `~`).
- **SBOM** (Software Bill of Materials) generado en cada release.

---

## Definition of Done (específica de Seguridad)

Además de la DoD universal:

- [ ] RLS habilitado y testeado en cualquier tabla nueva con datos de usuario.
- [ ] Authentication & authorization verificadas en endpoint nuevo.
- [ ] PII redactada en logs (búsqueda de patrones DNI/IBAN/email no debe encontrar nada en claro).
- [ ] Schema Zod valida toda entrada externa.
- [ ] Headers de seguridad presentes en respuesta (verificable con `securityheaders.com`).
- [ ] Si toca PII nueva: base legal documentada, consentimiento implementado si aplica, RAT actualizado.
- [ ] Si toca proveedor cloud nuevo: DPA verificado, transferencias internacionales documentadas.
- [ ] Si toca borrado: política de retención coherente con RGPD y obligaciones fiscales.
- [ ] Sin secretos en código, verificado con `gitleaks`.
- [ ] Dependencias añadidas: SCA en verde.

---

*Fin de normasSeguridad.md*
