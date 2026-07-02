// Regenerates js/elements.js from Bowserinator/Periodic-Table-JSON (CC BY-SA 3.0).
// Usage: node scripts/gen-elements.js
const fs = require('fs');
const path = require('path');

const SOURCE = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';
const OUT = path.join(__dirname, '..', 'js', 'elements.js');

const CATS = [
  { k: 'alkali',     label: 'Alkali metal' },
  { k: 'alkaline',   label: 'Alkaline earth' },
  { k: 'transition', label: 'Transition metal' },
  { k: 'posttrans',  label: 'Post-transition' },
  { k: 'metalloid',  label: 'Metalloid' },
  { k: 'nonmetal',   label: 'Nonmetal' },
  { k: 'noble',      label: 'Noble gas' },
  { k: 'lanthanide', label: 'Lanthanide' },
  { k: 'actinide',   label: 'Actinide' },
  { k: 'unknown',    label: 'Unknown' },
];

// the source splits nonmetals in two and hedges on the superheavies;
// fold both into the ten classroom categories above
function slug(cat) {
  if (cat.includes('unknown')) return 'unknown';
  if (cat === 'diatomic nonmetal' || cat === 'polyatomic nonmetal') return 'nonmetal';
  const map = {
    'alkali metal': 'alkali', 'alkaline earth metal': 'alkaline',
    'transition metal': 'transition', 'post-transition metal': 'posttrans',
    'metalloid': 'metalloid', 'noble gas': 'noble',
    'lanthanide': 'lanthanide', 'actinide': 'actinide',
  };
  if (!map[cat]) throw new Error('unmapped category: ' + cat);
  return map[cat];
}

const NAME_FIX = { Aluminium: 'Aluminum', Caesium: 'Cesium' };
const r = (v, p) => v == null ? undefined : Math.round(v * 10 ** p) / 10 ** p;

async function main() {
  const src = (await (await fetch(SOURCE)).json()).elements
    .filter(e => e.number <= 118);

  const rows = src.map(e => {
    const o = {
      n: e.number,
      s: e.symbol,
      name: NAME_FIX[e.name] || e.name,
      m: r(e.atomic_mass, 3),
      c: slug(e.category),
      g: e.group,
      p: e.period,
      x: e.xpos,
      y: e.ypos,
      ec: e.electron_configuration_semantic,
      sh: e.shells,
      en: e.electronegativity_pauling ?? undefined,
      ie: e.ionization_energies && e.ionization_energies.length ? r(e.ionization_energies[0], 1) : undefined,
      melt: r(e.melt, 2),
      boil: r(e.boil, 2),
      den: e.density ?? undefined,
      ph: e.phase,
      d: e.discovered_by || undefined,
    };
    Object.keys(o).forEach(k => o[k] === undefined && delete o[k]);
    return o;
  });

  if (rows.length !== 118) throw new Error('expected 118 elements, got ' + rows.length);
  rows.forEach(o => {
    if (!o.sh || o.sh.reduce((a, b) => a + b, 0) !== o.n) throw new Error(o.s + ': shells do not sum to Z');
  });

  const body = rows.map(o => '  ' + JSON.stringify(o)).join(',\n');
  const out = `// Periodic table data — generated from Bowserinator/Periodic-Table-JSON (CC BY-SA 3.0)
// via scripts/gen-elements.js. Do not hand-edit values; regenerate instead.
// Keys: n number · s symbol · name · m atomic mass (u) · c category slug ·
//       g group · p period · x/y grid position (y 9/10 = pulled-out La/Ac rows) ·
//       ec electron configuration · sh shells · en electronegativity (Pauling) ·
//       ie 1st ionization energy (kJ/mol) · melt/boil (K) · den density
//       (g/L for gases, g/cm³ otherwise) · ph phase at RT · d discovery
window.PT_CATEGORIES = ${JSON.stringify(CATS)};
window.PT_ELEMENTS = [
${body}
];
`;
  fs.writeFileSync(OUT, out);
  console.log('wrote', OUT, '—', (out.length / 1024).toFixed(1) + 'KB');
}

main().catch(err => { console.error(err); process.exit(1); });
