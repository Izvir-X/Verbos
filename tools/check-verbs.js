#!/usr/bin/env node
// Vérifie les données de conjugaison de index.html.
// Usage : node tools/check-verbs.js
// - chaque verbe a 6 formes espagnoles et 6 traductions pour chacun des 6 temps ;
// - pas de doublon ;
// - les verbes réguliers (-ar/-er/-ir sans champ `ch`) suivent exactement les terminaisons régulières.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('const VERBS=[');
const end = html.indexOf('\n];', start);
if (start < 0 || end < 0) { console.error('Tableau VERBS introuvable'); process.exit(1); }
const VERBS = Function('return ' + html.slice(start + 'const VERBS='.length, end + 3).replace(/;$/, ''))();

const TENSES = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'subjuntivo'];
const FUT = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
const COND = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
const END = {
  ar: { presente: ['o', 'as', 'a', 'amos', 'áis', 'an'], preterito: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
        imperfecto: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], subjuntivo: ['e', 'es', 'e', 'emos', 'éis', 'en'] },
  er: { presente: ['o', 'es', 'e', 'emos', 'éis', 'en'], preterito: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        imperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], subjuntivo: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
  ir: { presente: ['o', 'es', 'e', 'imos', 'ís', 'en'], preterito: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
        imperfecto: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], subjuntivo: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
};

const errors = [];
const seen = new Set();
for (const v of VERBS) {
  if (seen.has(v.v)) errors.push(`${v.v} : doublon`);
  seen.add(v.v);
  if (!['ar', 'er', 'ir', 'irr'].includes(v.type)) errors.push(`${v.v} : type inconnu "${v.type}"`);
  for (const t of TENSES) for (const k of ['es', 'fr']) {
    const forms = v[k] && v[k][t];
    if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f.trim()))
      errors.push(`${v.v} : ${k}.${t} doit contenir 6 formes non vides`);
  }
  if (v.type === 'irr' || v.ch) continue;
  const stem = v.v.slice(0, -2);
  for (const t of TENSES) {
    const expected = t === 'futuro' ? FUT.map(e => v.v + e) : t === 'condicional' ? COND.map(e => v.v + e) : END[v.type][t].map(e => stem + e);
    (v.es[t] || []).forEach((f, i) => { if (f !== expected[i]) errors.push(`${v.v} : ${t}[${i}] = "${f}", attendu "${expected[i]}"`); });
  }
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} erreur(s).`); process.exit(1); }
console.log(`OK — ${VERBS.length} verbes vérifiés.`);
