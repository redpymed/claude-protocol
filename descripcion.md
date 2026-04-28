# descripcion.md — claude-protocol

## §1. Identidad

- **Nombre**: `claude-protocol`
- **Repositorio**: https://github.com/redpymed/claude-protocol
- **Owner técnico**: <nombre + email>
- **Estado**: 🟢 Producción
- **Fecha de inicio**: 2026-04
- **Distribución**: npm + GitHub + curl installer + GitHub Template

## §2. Propósito

### ¿Qué resuelve?

`claude-protocol` resuelve tres problemas crónicos de equipos que usan Claude Code:

1. Empezar sin estructura y acabar con `CLAUDE.md` monolíticos inmantenibles.
2. Repetir errores entre proyectos por falta de continuidad operativa.
3. Mezclar reglas universales con específicas del proyecto en el mismo archivo.

### ¿Para quién?

- **Usuario primario**: tech leads y desarrolladores que usan Claude Code en proyectos serios.
- **Usuario secundario**: equipos que buscan estandarizar la calidad de su código asistido por IA.
- **No-usuario**: prototipos efímeros y scripts de un solo uso (ahí es overkill).

### ¿Cuál es el éxito?

- N proyectos usando el protocolo (medido por descargas npm).
- Adopción interna del bootstrap por al menos un equipo externo.
- 0 archivos vinculados a casos concretos en `templates/`.

## §3. Contexto

### Sector
Herramientas para developers (devtools).

### Modelo de distribución
Open source MIT. No comercializa nada directamente.

### Restricciones particulares
- **Multi-plataforma**: Linux, macOS, Windows, WSL.
- **Cero dependencias npm**: el script funciona con Node estándar ≥ 18.
- **Idioma del contenido**: español. Inglés es deuda futura.

## §4. Alcance

### Dentro

- Plantillas de protocolo (CLAUDE.md + 8 normas + 6 archivos vivos + auxiliares).
- Bootstrap script (modos: new/adapt/update/check/new-module/validate/version).
- Instaladores: npm, curl, PowerShell.
- GitHub Template repo.
- CI/CD para auto-publicación.

### Fuera

- Plugins, skills custom o subagents pre-empaquetados.
- Integración directa con un sistema de gestión concreto.
- Versión SaaS ni dashboard.
- Versión "enterprise" con features distintas.

### Dependencias

- **Node ≥ 18** (sin paquetes npm).
- **Git** (para clone manual y para que el bootstrap pueda inspeccionar repos).

## §5. Equipo

| Rol | Persona | Contacto |
|---|---|---|
| Maintainer | <nombre> | <email> |

## §6. Glosario

| Término | Definición |
|---|---|
| Universal | Archivo idéntico entre todos los proyectos. Se sobrescribe con `update`. |
| Específico | Archivo del proyecto, no se sobrescribe. |
| Auxiliar | Plantilla que se crea si falta pero no se actualiza. |
| Bounded context | Módulo de negocio aislado. Ver CLAUDE.md §7. |
| Modularidad estricta | Prohibición de imports cruzados entre módulos. |

## §7. Roadmap a alto nivel

### v2.x — Estabilización
- Asentar el protocolo actual.
- Recolectar feedback de adopción.

### v3.0 — Internacionalización (futuro)
- Versión inglesa de templates.
- Selector de idioma en el bootstrap.

### Sin fecha — Plugins
- Sistema opcional de plugins comunitarios para extender normas.

## §8. Decisiones de producto inmutables

- **No habrá versión de pago**. Open source MIT, siempre.
- **No se romperá compatibilidad** entre versiones MINOR.
- **No se aceptarán normas vinculadas a sectores específicos** (asesoría, fintech, etc.).
