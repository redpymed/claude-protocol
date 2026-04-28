#!/usr/bin/env node
/**
 * bootstrap.mjs — Bootstrap del Protocolo Claude Code
 *
 * Modos:
 *   new        Crea la estructura completa en un proyecto vacío.
 *   adapt      Adapta un proyecto activo: backup + añade lo que falta + prompt
 *              de migración para Claude Code.
 *   update     Actualiza solo archivos universales preservando los específicos.
 *   check      Diagnóstico sin tocar nada.
 *   new-module Crea un bounded context nuevo en src/modules/<nombre>/.
 *   validate   Verifica la modularidad estricta (§7.5): imports cruzados.
 *   version    Muestra la versión del protocolo.
 *
 * Uso:
 *   node bootstrap.mjs <modo> [args]
 *   node bootstrap.mjs --help
 *
 * Requiere Node ≥ 18. Sin dependencias npm.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// ============================================================================
// Configuración
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const MODULE_TEMPLATE_DIR = path.join(__dirname, 'templates', 'module-template');

/** Archivos universales: idénticos entre proyectos. Se sobrescriben con `update`. */
const UNIVERSAL_FILES = [
  'CLAUDE.md',
  'docs/normas/normasUX.md',
  'docs/normas/normasArquitectura.md',
  'docs/normas/normasSeguridad.md',
  'docs/normas/normasIA.md',
  'docs/normas/normasCalidad.md',
  'docs/normas/normasObservabilidad.md',
  'docs/normas/normasOperaciones.md',
  'docs/normas/normasClaudeCode.md',
];

/** Archivos específicos del proyecto. NO se sobrescriben si existen. */
const PROJECT_SPECIFIC_FILES = [
  'descripcion.md',
  'stack.md',
  'proyecto.md',
  'errores.md',
  'aciertos.md',
  'funciones.md',
];

/** Plantillas auxiliares: se crean si faltan, NUNCA se sobrescriben. */
const AUXILIARY_TEMPLATES = [
  '.claude/settings.json',
  'docs/adr/0000-template.md',
  'docs/retencion.md',
  'docs/slo.md',
  'docs/dr.md',
  'docs/runbooks/_template.md',
  'docs/postmortems/_template.md',
];

const ALL_TEMPLATES = [...UNIVERSAL_FILES, ...PROJECT_SPECIFIC_FILES, ...AUXILIARY_TEMPLATES];

const LEGACY_PATTERNS = [
  'CLAUDE.md',
  'CLAUDE-mini.md',
  'docs/CLAUDE.md',
  'docs/conventions.md',
  'CONVENTIONS.md',
  'GUIDELINES.md',
  '.cursorrules',
];

// ============================================================================
// Utilidades de salida
// ============================================================================

const c = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', magenta: '\x1b[35m', bold: '\x1b[1m', dim: '\x1b[2m',
};

const log = {
  info: (m) => console.log(`${c.blue}ℹ${c.reset} ${m}`),
  ok: (m) => console.log(`${c.green}✓${c.reset} ${m}`),
  warn: (m) => console.log(`${c.yellow}⚠${c.reset} ${m}`),
  err: (m) => console.log(`${c.red}✗${c.reset} ${m}`),
  step: (m) => console.log(`\n${c.cyan}▶${c.reset} ${c.bold}${m}${c.reset}`),
  dim: (m) => console.log(`  ${c.dim}${m}${c.reset}`),
  title: (m) => console.log(`\n${c.bold}${c.magenta}${m}${c.reset}\n`),
};

// ============================================================================
// FS helpers
// ============================================================================

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}
async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function prompt(q) {
  const rl = readline.createInterface({ input, output });
  const a = await rl.question(q);
  rl.close();
  return a.trim();
}

async function confirm(q, defaultYes = false) {
  const suffix = defaultYes ? '[Y/n]' : '[y/N]';
  const a = (await prompt(`${q} ${suffix}: `)).toLowerCase();
  if (!a) return defaultYes;
  return a === 'y' || a === 'yes' || a === 's' || a === 'si';
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

async function copyTemplate(rel, targetDir) {
  const src = path.join(TEMPLATES_DIR, rel);
  const dst = path.join(targetDir, rel);
  if (!(await exists(src))) {
    throw new Error(`Plantilla no encontrada: ${src}`);
  }
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
  return dst;
}

async function readFileSafe(p) {
  try { return await fs.readFile(p, 'utf8'); } catch { return null; }
}

async function fileSize(p) {
  try { const s = await fs.stat(p); return s.size; } catch { return 0; }
}

async function filesEqual(a, b) {
  const [ca, cb] = await Promise.all([readFileSafe(a), readFileSafe(b)]);
  if (ca === null || cb === null) return false;
  return ca === cb;
}

async function walkFiles(dir, baseDir = dir, results = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      await walkFiles(full, baseDir, results);
    } else {
      results.push(path.relative(baseDir, full));
    }
  }
  return results;
}

// ============================================================================
// Verificación de plantillas e integridad
// ============================================================================

async function verifyTemplates() {
  if (!(await exists(TEMPLATES_DIR))) {
    log.err(`No se encontró la carpeta de plantillas: ${TEMPLATES_DIR}`);
    process.exit(1);
  }
  const missing = [];
  for (const f of ALL_TEMPLATES) {
    if (!(await exists(path.join(TEMPLATES_DIR, f)))) missing.push(f);
  }
  if (missing.length) {
    log.err(`Faltan plantillas en ${TEMPLATES_DIR}:`);
    missing.forEach((f) => log.dim(`  - ${f}`));
    process.exit(1);
  }
}

async function checkTemplateIntegrity() {
  // Detecta archivos en templates/ que NO están en ninguna lista (huérfanos)
  const allFiles = await walkFiles(TEMPLATES_DIR);
  const expected = new Set(ALL_TEMPLATES);
  const orphans = allFiles.filter(
    (f) => !expected.has(f) && !f.startsWith('module-template/')
  );
  if (orphans.length) {
    log.warn('Archivos en templates/ no listados en ninguna categoría:');
    orphans.forEach((f) => log.dim(`  - ${f}`));
    log.dim('Añádelos a UNIVERSAL_FILES, PROJECT_SPECIFIC_FILES o AUXILIARY_TEMPLATES.');
  }
}

async function getProtocolVersion() {
  const pkgPath = path.join(__dirname, 'package.json');
  const pkgRaw = await readFileSafe(pkgPath);
  if (!pkgRaw) return 'unknown';
  try { return JSON.parse(pkgRaw).version ?? 'unknown'; } catch { return 'unknown'; }
}

// ============================================================================
// MODO: version
// ============================================================================

async function runVersion() {
  const v = await getProtocolVersion();
  console.log(`claude-protocol v${v}`);
}

// ============================================================================
// MODO: check
// ============================================================================

async function runCheck(targetDir) {
  log.title(`📋 Diagnóstico de "${targetDir}"`);

  const status = { universal: [], specific: [], auxiliary: [], legacy: [] };

  for (const f of UNIVERSAL_FILES) {
    const p = path.join(targetDir, f);
    if (!(await exists(p))) status.universal.push({ f, state: 'missing' });
    else {
      const same = await filesEqual(p, path.join(TEMPLATES_DIR, f));
      status.universal.push({ f, state: same ? 'ok' : 'modified' });
    }
  }
  for (const f of PROJECT_SPECIFIC_FILES) {
    const p = path.join(targetDir, f);
    if (!(await exists(p))) status.specific.push({ f, state: 'missing' });
    else {
      const size = await fileSize(p);
      status.specific.push({ f, state: size > 200 ? 'filled' : 'template' });
    }
  }
  for (const f of AUXILIARY_TEMPLATES) {
    const p = path.join(targetDir, f);
    status.auxiliary.push({ f, state: (await exists(p)) ? 'present' : 'missing' });
  }
  for (const pattern of LEGACY_PATTERNS) {
    if (pattern.includes('*')) continue;
    const p = path.join(targetDir, pattern);
    if (await exists(p) && !UNIVERSAL_FILES.includes(pattern)) status.legacy.push(pattern);
  }

  log.step('Universales');
  status.universal.forEach(({ f, state }) => {
    if (state === 'ok') log.ok(f);
    else if (state === 'modified') log.warn(`${f} (modificado vs canónico)`);
    else log.err(`${f} (falta)`);
  });

  log.step('Específicos del proyecto');
  status.specific.forEach(({ f, state }) => {
    if (state === 'filled') log.ok(`${f} (con contenido)`);
    else if (state === 'template') log.warn(`${f} (sin rellenar)`);
    else log.err(`${f} (falta)`);
  });

  log.step('Auxiliares');
  status.auxiliary.forEach(({ f, state }) => {
    if (state === 'present') log.ok(f);
    else log.dim(`${f} (no presente; se creará si ejecutas new/adapt)`);
  });

  if (status.legacy.length) {
    log.step('Archivos legacy detectados (candidatos a migración)');
    status.legacy.forEach((f) => log.warn(f));
  }

  log.step('Recomendación');
  const missingUniversal = status.universal.filter((x) => x.state === 'missing').length;
  const missingSpecific = status.specific.filter((x) => x.state === 'missing').length;

  if (missingUniversal === UNIVERSAL_FILES.length && missingSpecific === PROJECT_SPECIFIC_FILES.length) {
    log.info('Proyecto sin protocolo. Ejecuta: claude-protocol new');
  } else if (status.legacy.length > 0) {
    log.info('Proyecto con archivos legacy. Ejecuta: claude-protocol adapt');
  } else if (missingUniversal > 0 || missingSpecific > 0) {
    log.info('Proyecto parcialmente bootstrapeado. Ejecuta: claude-protocol adapt');
  } else if (status.universal.some((x) => x.state === 'modified')) {
    log.info('Universales desactualizados. Ejecuta: claude-protocol update');
  } else {
    log.ok('Proyecto en orden. Nada que hacer.');
  }
}

// ============================================================================
// MODO: new
// ============================================================================

async function runNew(targetDir) {
  log.title(`🚀 Bootstrap nuevo proyecto en "${targetDir}"`);

  if (!(await exists(targetDir))) {
    if (!(await confirm('El directorio no existe. ¿Crearlo?', true))) process.exit(0);
    await ensureDir(targetDir);
  }

  const conflicts = [];
  for (const f of [...UNIVERSAL_FILES, ...PROJECT_SPECIFIC_FILES]) {
    if (await exists(path.join(targetDir, f))) conflicts.push(f);
  }
  if (conflicts.length > 0) {
    log.warn(`Ya existen ${conflicts.length} archivos del protocolo:`);
    conflicts.forEach((f) => log.dim(`  - ${f}`));
    log.info('Para proyectos activos usa "adapt" en lugar de "new".');
    if (!(await confirm('¿Continuar y sobrescribir?'))) process.exit(0);
  }

  log.step('Copiando archivos universales');
  for (const f of UNIVERSAL_FILES) { await copyTemplate(f, targetDir); log.ok(f); }

  log.step('Copiando plantillas específicas del proyecto');
  for (const f of PROJECT_SPECIFIC_FILES) { await copyTemplate(f, targetDir); log.ok(f); }

  log.step('Copiando plantillas auxiliares');
  for (const f of AUXILIARY_TEMPLATES) {
    if (!(await exists(path.join(targetDir, f)))) {
      await copyTemplate(f, targetDir); log.ok(f);
    } else log.dim(`${f} ya existe — preservado`);
  }

  log.step('Creando carpetas auxiliares');
  for (const dir of ['docs/runbooks', 'docs/postmortems', 'src/shared', 'src/modules']) {
    await ensureDir(path.join(targetDir, dir));
    const keep = path.join(targetDir, dir, '.gitkeep');
    if (!(await exists(keep))) await fs.writeFile(keep, '');
    log.ok(dir);
  }

  log.title('✅ Bootstrap completado');
  log.info('Próximos pasos:');
  log.dim('  1. Rellenar descripcion.md (qué es el proyecto, para quién, contexto)');
  log.dim('  2. Rellenar stack.md (tecnologías, MCPs, comandos)');
  log.dim('  3. Crear primer módulo: claude-protocol new-module <nombre>');
  log.dim('  4. Sesión de inauguración con Claude Code');
}

// ============================================================================
// MODO: adapt
// ============================================================================

async function runAdapt(targetDir) {
  log.title(`🔧 Adaptando proyecto activo en "${targetDir}"`);

  if (!(await exists(targetDir))) {
    log.err(`El directorio no existe: ${targetDir}`); process.exit(1);
  }

  const existing = { universal: [], specific: [], auxiliary: [], legacy: [] };
  for (const f of UNIVERSAL_FILES) {
    if (await exists(path.join(targetDir, f))) existing.universal.push(f);
  }
  for (const f of PROJECT_SPECIFIC_FILES) {
    if (await exists(path.join(targetDir, f))) existing.specific.push(f);
  }
  for (const f of AUXILIARY_TEMPLATES) {
    if (await exists(path.join(targetDir, f))) existing.auxiliary.push(f);
  }
  for (const pattern of LEGACY_PATTERNS) {
    if (pattern.includes('*')) continue;
    const p = path.join(targetDir, pattern);
    if (await exists(p) && !UNIVERSAL_FILES.includes(pattern)) existing.legacy.push(pattern);
  }

  log.step('Resumen de lo encontrado');
  log.info(`Universales presentes: ${existing.universal.length}/${UNIVERSAL_FILES.length}`);
  log.info(`Específicos presentes: ${existing.specific.length}/${PROJECT_SPECIFIC_FILES.length}`);
  log.info(`Auxiliares presentes: ${existing.auxiliary.length}/${AUXILIARY_TEMPLATES.length}`);
  log.info(`Legacy detectados: ${existing.legacy.length}`);
  if (existing.legacy.length) existing.legacy.forEach((f) => log.dim(`  - ${f}`));

  if (!(await confirm('\n¿Proceder con la adaptación?', true))) process.exit(0);

  const backupDir = path.join(targetDir, `.claude-backup-${timestamp()}`);
  log.step(`Creando backup en ${backupDir}`);
  await ensureDir(backupDir);
  for (const f of [...existing.universal, ...existing.legacy]) {
    const src = path.join(targetDir, f);
    const dst = path.join(backupDir, f);
    await ensureDir(path.dirname(dst));
    await fs.copyFile(src, dst);
    log.ok(`Backup: ${f}`);
  }

  log.step('Actualizando archivos universales');
  const replacedUniversals = [];
  for (const f of UNIVERSAL_FILES) {
    const wasPresent = existing.universal.includes(f);
    await copyTemplate(f, targetDir);
    log.ok(`${f}${wasPresent ? ' (reemplazado)' : ' (nuevo)'}`);
    if (wasPresent) replacedUniversals.push(f);
  }
  existing.legacy.push(...replacedUniversals);

  log.step('Creando plantillas específicas faltantes');
  for (const f of PROJECT_SPECIFIC_FILES) {
    if (existing.specific.includes(f)) log.dim(`${f} ya existe — preservado`);
    else { await copyTemplate(f, targetDir); log.ok(`${f} (nuevo)`); }
  }

  log.step('Creando plantillas auxiliares faltantes');
  for (const f of AUXILIARY_TEMPLATES) {
    if (existing.auxiliary.includes(f)) log.dim(`${f} ya existe — preservado`);
    else { await copyTemplate(f, targetDir); log.ok(`${f} (nuevo)`); }
  }

  log.step('Asegurando carpetas auxiliares');
  for (const dir of ['docs/runbooks', 'docs/postmortems', 'src/shared', 'src/modules']) {
    const fullDir = path.join(targetDir, dir);
    if (!(await exists(fullDir))) {
      await ensureDir(fullDir);
      const keep = path.join(fullDir, '.gitkeep');
      if (!(await exists(keep))) await fs.writeFile(keep, '');
      log.ok(`${dir} (creada)`);
    } else log.dim(`${dir} ya existe`);
  }

  log.step('Generando prompt de migración para Claude Code');
  const migrationFile = path.join(targetDir, 'MIGRATION-INSTRUCTIONS.md');
  const migrationContent = generateMigrationPrompt({
    backupDir: path.relative(targetDir, backupDir),
    legacyFiles: existing.legacy,
    preservedSpecific: existing.specific,
    addedSpecific: PROJECT_SPECIFIC_FILES.filter((f) => !existing.specific.includes(f)),
  });
  await fs.writeFile(migrationFile, migrationContent);
  log.ok('MIGRATION-INSTRUCTIONS.md generado');

  log.title('✅ Adaptación completada');
  log.info('Próximos pasos:');
  log.dim('  1. Lee MIGRATION-INSTRUCTIONS.md');
  log.dim('  2. Abre Claude Code en este proyecto');
  log.dim('  3. Pega el prompt de migración');
  log.dim('  4. Tras la migración, borra el backup y MIGRATION-INSTRUCTIONS.md');
}

function generateMigrationPrompt({ backupDir, legacyFiles, preservedSpecific, addedSpecific }) {
  const legacyList = legacyFiles.length
    ? legacyFiles.map((f) => `- \`${backupDir}/${f}\``).join('\n')
    : '- (ninguno)';
  const preservedList = preservedSpecific.length
    ? preservedSpecific.map((f) => `- \`${f}\``).join('\n')
    : '- (ninguno)';
  const addedList = addedSpecific.length
    ? addedSpecific.map((f) => `- \`${f}\``).join('\n')
    : '- (ninguno)';

  return `# MIGRATION-INSTRUCTIONS.md

> Generado por \`bootstrap.mjs adapt\`. Bórralo cuando termines la migración.

## Hecho automáticamente

- Backup completo en \`${backupDir}/\`.
- Universales reemplazados por la versión canónica.
- Plantillas específicas creadas si faltaban; preservadas si ya existían.
- Plantillas auxiliares creadas si faltaban.

## Archivos legacy con contenido a migrar

${legacyList}

## Plantillas específicas con contenido del proyecto (preservadas)

${preservedList}

## Plantillas específicas nuevas (vacías, listas para rellenar)

${addedList}

---

## Prompt para Claude Code

Pega esto en Claude Code:

\`\`\`
Estoy migrando este proyecto al protocolo modular Claude.
El script bootstrap.mjs ya hizo la parte mecánica. Tu trabajo es la semántica.

Pasos:
1. Lee CLAUDE.md (canónico, ya en su sitio).
2. Lee los archivos legacy en ${backupDir}/:
${legacyFiles.map((f) => `   - ${backupDir}/${f}`).join('\n') || '   (no hay archivos legacy)'}
3. Lee los específicos preservados:
${preservedSpecific.map((f) => `   - ${f}`).join('\n') || '   (ninguno)'}
4. Identifica en el contenido legacy:
   - Identidad y contexto → descripcion.md.
   - Tecnologías, MCPs, comandos → stack.md.
   - Estado, versión, tareas → proyecto.md.
   - Errores documentados → errores.md.
   - Atajos y MCPs útiles → aciertos.md.
   - Funciones/scripts repetidos → funciones.md.
   - Lo que no encaje → propónmelo.
5. NO modifiques CLAUDE.md ni docs/normas/*.
6. Antes de escribir cada archivo, muéstrame el contenido y espera mi confirmación.
7. Al terminar, ejecuta el Protocolo de Cierre (CLAUDE.md §6) y resume.

Empieza confirmando qué archivos has leído (CLAUDE.md §4).
\`\`\`

## Limpieza tras la migración

\`\`\`bash
rm -rf ${backupDir}
rm MIGRATION-INSTRUCTIONS.md
git add -A && git commit -m "chore(claude): adoptar protocolo modular"
\`\`\`
`;
}

// ============================================================================
// MODO: update
// ============================================================================

async function runUpdate(targetDir) {
  log.title(`🔄 Actualizando universales en "${targetDir}"`);

  if (!(await exists(targetDir))) {
    log.err(`El directorio no existe: ${targetDir}`); process.exit(1);
  }

  const changes = [];
  for (const f of UNIVERSAL_FILES) {
    const dst = path.join(targetDir, f);
    if (!(await exists(dst))) changes.push({ f, type: 'new' });
    else if (!(await filesEqual(dst, path.join(TEMPLATES_DIR, f)))) {
      changes.push({ f, type: 'update' });
    }
  }

  if (changes.length === 0) {
    log.ok('Todos los universales están al día. Nada que hacer.');
    return;
  }

  log.step('Cambios detectados');
  changes.forEach(({ f, type }) => {
    if (type === 'new') log.warn(`${f} (nuevo, se creará)`);
    else log.warn(`${f} (cambiará)`);
  });

  if (!(await confirm('\n¿Aplicar?', true))) return;

  const backupDir = path.join(targetDir, `.claude-backup-update-${timestamp()}`);
  await ensureDir(backupDir);
  for (const { f, type } of changes) {
    if (type === 'update') {
      const dst = path.join(backupDir, f);
      await ensureDir(path.dirname(dst));
      await fs.copyFile(path.join(targetDir, f), dst);
    }
  }

  for (const { f } of changes) { await copyTemplate(f, targetDir); log.ok(f); }

  log.title('✅ Universales actualizados');
  log.info(`Backup: ${path.relative(targetDir, backupDir)}`);
  log.dim('Los archivos específicos NO se han tocado.');
}

// ============================================================================
// MODO: new-module
// ============================================================================

async function runNewModule(targetDir, moduleName) {
  if (!moduleName) {
    log.err('Nombre del módulo requerido. Uso: claude-protocol new-module <nombre>');
    process.exit(1);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(moduleName)) {
    log.err('Nombre inválido. Usa kebab-case: minúsculas, números y guiones, empezando por letra.');
    process.exit(1);
  }

  log.title(`📦 Creando módulo "${moduleName}"`);

  if (!(await exists(MODULE_TEMPLATE_DIR))) {
    log.err(`No se encontró templates/module-template/ en ${MODULE_TEMPLATE_DIR}`);
    process.exit(1);
  }

  const moduleDir = path.join(targetDir, 'src', 'modules', moduleName);
  if (await exists(moduleDir)) {
    log.err(`Ya existe: ${moduleDir}`);
    process.exit(1);
  }

  log.step('Creando estructura de bounded context');
  for (const sub of ['domain', 'application', 'infrastructure', 'api']) {
    await ensureDir(path.join(moduleDir, sub));
    await fs.writeFile(path.join(moduleDir, sub, '.gitkeep'), '');
    log.ok(`src/modules/${moduleName}/${sub}/`);
  }

  log.step('Copiando archivos del template');
  const templateFiles = await walkFiles(MODULE_TEMPLATE_DIR);
  for (const rel of templateFiles) {
    if (rel.endsWith('.gitkeep')) continue;
    const src = path.join(MODULE_TEMPLATE_DIR, rel);
    const dst = path.join(moduleDir, rel);
    let content = await fs.readFile(src, 'utf8');
    content = content.replace(/__MODULE_NAME__/g, moduleName);
    await ensureDir(path.dirname(dst));
    await fs.writeFile(dst, content);
    log.ok(`${rel}`);
  }

  log.title('✅ Módulo creado');
  log.info(`Ubicación: src/modules/${moduleName}/`);
  log.dim('Recuerda: este módulo NO debe importar lógica de otros módulos (CLAUDE.md §7).');
  log.dim('Para utilidades técnicas comunes, usa src/shared/.');
}

// ============================================================================
// MODO: validate
// ============================================================================

async function runValidate(targetDir) {
  log.title(`🔍 Validando modularidad estricta en "${targetDir}"`);

  const modulesDir = path.join(targetDir, 'src', 'modules');
  if (!(await exists(modulesDir))) {
    log.warn('No existe src/modules/. Nada que validar.');
    return;
  }

  let modules;
  try {
    const entries = await fs.readdir(modulesDir, { withFileTypes: true });
    modules = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    log.err('No se pudo leer src/modules/'); process.exit(1);
  }

  if (modules.length === 0) {
    log.info('Sin módulos. Ejecuta: claude-protocol new-module <nombre>');
    return;
  }

  log.info(`Módulos detectados: ${modules.join(', ')}`);

  // Patrones de import a buscar
  // Cubre: import x from '...'; import x from "..."; require('...')
  const importPatterns = [
    /from\s+['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  const violations = [];
  let filesScanned = 0;
  const modulesDirAbs = path.resolve(modulesDir);

  for (const mod of modules) {
    const modDir = path.join(modulesDir, mod);
    const files = await walkFiles(modDir);
    for (const rel of files) {
      if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(rel)) continue;
      filesScanned++;
      const full = path.join(modDir, rel);
      const content = await readFileSafe(full);
      if (!content) continue;
      for (const pattern of importPatterns) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const imp = match[1];
          let otherModule = null;

          // 1) Imports relativos: resolvemos al path absoluto y verificamos
          if (imp.startsWith('.')) {
            const fileDir = path.dirname(full);
            const resolved = path.resolve(fileDir, imp);
            if (resolved.startsWith(modulesDirAbs + path.sep)) {
              const tail = resolved.slice(modulesDirAbs.length + 1);
              const otherMod = tail.split(path.sep)[0];
              if (otherMod && otherMod !== mod && modules.includes(otherMod)) {
                otherModule = otherMod;
              }
            }
          }
          // 2) Imports absolutos con prefijos típicos: @/modules/X, src/modules/X, modules/X
          else {
            const m = imp.match(/(?:^|[/@])modules[/\\]([a-z0-9-]+)/i);
            if (m && m[1] && m[1] !== mod && modules.includes(m[1])) {
              otherModule = m[1];
            }
          }

          if (otherModule) {
            violations.push({
              file: path.join('src/modules', mod, rel),
              import: imp,
              otherModule,
            });
          }
        }
      }
    }
  }

  log.step(`Escaneados ${filesScanned} archivos`);

  if (violations.length === 0) {
    log.ok('Modularidad estricta respetada. Ningún import cruzado detectado.');
    return;
  }

  log.err(`Detectadas ${violations.length} violaciones:`);
  violations.forEach(({ file, import: imp, otherModule }) => {
    log.warn(`${file}`);
    log.dim(`  importa "${imp}" del módulo "${otherModule}"`);
  });
  log.step('Cómo solucionar (CLAUDE.md §7)');
  log.dim('  - Si es lógica de negocio: usa eventos / API pública del otro módulo.');
  log.dim('  - Si es utilidad técnica pura: muévela a src/shared/.');
  log.dim('  - Si es "parecido pero distinto": crea función nueva en este módulo.');
  process.exit(1);
}

// ============================================================================
// Help
// ============================================================================

function printHelp() {
  console.log(`
${c.bold}claude-protocol${c.reset} — Bootstrap del Protocolo Claude Code

${c.bold}Uso:${c.reset}
  claude-protocol <modo> [args]

${c.bold}Modos:${c.reset}
  ${c.cyan}new${c.reset} [dir]              Bootstrap de proyecto nuevo (vacío).
  ${c.cyan}adapt${c.reset} [dir]            Adaptar proyecto activo al protocolo.
  ${c.cyan}update${c.reset} [dir]           Actualizar solo universales (CLAUDE.md, normas/*).
  ${c.cyan}check${c.reset} [dir]            Diagnóstico sin tocar nada.
  ${c.cyan}new-module${c.reset} <nombre>    Crear bounded context en src/modules/<nombre>.
  ${c.cyan}validate${c.reset} [dir]         Verificar modularidad estricta (CLAUDE.md §7.5).
  ${c.cyan}version${c.reset}                Mostrar la versión del protocolo.

${c.bold}Ejemplos:${c.reset}
  claude-protocol new ~/dev/mi-proyecto
  claude-protocol adapt .
  claude-protocol new-module billing
  claude-protocol validate .
  claude-protocol check .

${c.bold}Notas:${c.reset}
  - Si se omite [dir], usa el cwd actual.
  - Plantillas en ./templates relativa al script.
  - Requiere Node ≥ 18. Sin dependencias npm.
`);
}

// ============================================================================
// Dispatcher
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  if (args[0] === '--version' || args[0] === '-v' || args[0] === 'version') {
    await runVersion();
    process.exit(0);
  }

  const mode = args[0];
  const validModes = ['new', 'adapt', 'update', 'check', 'new-module', 'validate'];
  if (!validModes.includes(mode)) {
    log.err(`Modo desconocido: "${mode}"`);
    printHelp();
    process.exit(1);
  }

  await verifyTemplates();
  if (process.env.DEBUG) await checkTemplateIntegrity();

  try {
    if (mode === 'new-module') {
      const moduleName = args[1];
      const targetDir = path.resolve(args[2] || process.cwd());
      await runNewModule(targetDir, moduleName);
    } else {
      const targetDir = path.resolve(args[1] || process.cwd());
      switch (mode) {
        case 'new': await runNew(targetDir); break;
        case 'adapt': await runAdapt(targetDir); break;
        case 'update': await runUpdate(targetDir); break;
        case 'check': await runCheck(targetDir); break;
        case 'validate': await runValidate(targetDir); break;
      }
    }
  } catch (err) {
    log.err(`Error fatal: ${err.message}`);
    if (process.env.DEBUG) console.error(err);
    process.exit(1);
  }
}

main();
