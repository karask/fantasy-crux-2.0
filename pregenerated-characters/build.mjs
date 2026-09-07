// Rebuild and audit the eight sheets using the canonical local rules and authored allocations.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { criticalCeiling, improvementFor } from '../src/lib/rules-contract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const rule = (file) => read(`src/content/rules/${file}.md`);
const data = JSON.parse(read('pregenerated-characters/characters.json'));
const concepts = read('pregenerated-characters/01-concepts.md');
const racesText = rule('gm-tools/fantasy-races');
const creation = rule('characters/character-creation');
const ongoingMagic = rule('magic/ongoing-and-magical-actions');
assert.match(ongoingMagic, /Active Magnitude cannot exceed permanent, unmodified INT\./);
const clean = (s) => s.replaceAll('`', '').replaceAll('**', '').trim();
const rows = (s) =>
  s
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .map((line) => line.slice(1, line.lastIndexOf('|')).split('|').map(clean))
    .filter((row) => !row.every((cell) => /^[\s:-]+$/.test(cell)));
const table = (heads, values) =>
  [
    `| ${heads.join(' | ')} |`,
    `| ${heads.map(() => '---').join(' | ')} |`,
    ...values.map((v) => `| ${v.join(' | ')} |`),
  ].join('\n');
const money = (cp) => `${Math.floor(cp / 10)} SP${cp % 10 ? ` ${cp % 10} CP` : ''}`;
const crit = (value) =>
  criticalCeiling(value) === 1 ? '01' : `01–${String(criticalCeiling(value)).padStart(2, '0')}`;
const ruleLink = (file) => `../src/content/rules/${file}.md`;
const currency = (s) => {
  const match = s.replaceAll(',', '').match(/^(\d+) (SP|CP)$/);
  assert(match, `Unknown price: ${s}`);
  return Number(match[1]) * (match[2] === 'SP' ? 10 : 1);
};
const spreads = Object.fromEntries(
  rows(racesText.split('## Random characteristics')[0])
    .filter((r) => r.length === 8 && /^\d+$/.test(r[1]))
    .map(([name, ...values]) => [name, values.map(Number)]),
);
const maxima = Object.fromEntries(
  rows(racesText.split('## Racial maxima')[1].split('## Racial abilities')[0])
    .filter((r) => r.length === 8 && /^\d+$/.test(r[1]))
    .map(([name, ...values]) => [name, values.map(Number)]),
);
const categories = { Resistances: 50, Combat: 50, Knowledge: 50, Practical: 75 };
const formulas = {};
let category;
for (const row of rows(creation.split('### Base skills')[1].split('### Allocate points')[0])) {
  const headers = {
    Resistances: 'Resistances',
    'Combat skills': 'Combat',
    'Knowledge skills': 'Knowledge',
    'Practical skills': 'Practical',
  };
  if (headers[row[0]]) category = headers[row[0]];
  else formulas[row[0]] = { category, formula: row[1] };
}
assert.equal(Object.keys(formulas).length, 27);
const origins = rows(
  rule('gazetteer/index').split('## Peoples, cultures, and languages')[1].split('## Religion')[0],
).filter((r) => r[0] !== 'Origin' && r[2]?.includes(' · '));
const cultures = origins.map((r) => r[2].split(' · ')[0]);
const languages = origins.map((r) => r[2].split(' · ')[1]);
assert.equal(cultures.length, 9);
const commonLores = [
  'Alchemy',
  'Magic',
  'Military Tactics',
  'Spirit World',
  'Undead',
  'Law and Heraldry',
  'Astronomy',
];
commonLores.forEach((lore) => assert(rule('skills/knowledge-skills').includes(`**${lore}**`)));
const loreFields = [...new Set([...commonLores, ...data.characters.map((c) => c.ownLore)])];
const crafts = [
  'Blacksmith',
  'Bowyer',
  'Brewer',
  'Carpenter',
  'Mason',
  'Potter',
  'Tailor',
  'Calligraphy',
];
const innate = {
  Human: [],
  Goblin: [['Blind Sight (heat)', 5]],
  Dwarf: [
    ['Blind Sight (heat)', 5],
    ['Earth Sense', 2],
  ],
  Orc: [['Adrenaline Surge', 4]],
  Elf: [
    ['Low-Light Sight', 3],
    ['Terrain Expertise (Forest)', 2],
  ],
};
for (const abilities of Object.values(innate))
  for (const [name, cost] of abilities) assert(racesText.includes(`${name}, ${cost} IP`));
const abilityText = (name) => {
  if (name === 'Terrain Expertise (Forest)')
    return `${talent('terrain-expertise')
      .content.replace(/^## Effect\s*/, '')
      .trim()}\n\nThe chosen terrain is **Forest**. This mandatory racial purchase waives its Natural Lore prerequisite.`;
  const marker = `**${name}:** `;
  assert(racesText.includes(marker));
  return racesText.split(marker)[1].split('\n\n')[0];
};
const talent = (slug) => matter(rule(`talents/${slug}`));
const weaponText = rule('equipment/weapons');
const close = Object.fromEntries(
  rows(weaponText.split('## Close Combat weapons')[1].split('## Ranged weapons')[0])
    .filter((r) => r.length === 7 && r[0] !== 'Weapon')
    .map((r) => [
      r[0],
      { name: r[0], type: r[1], damage: r[2], minimum: r[3], enc: r[4], size: r[5], price: r[6] },
    ]),
);
const ranged = Object.fromEntries(
  rows(weaponText.split('## Ranged weapons')[1].split('## Reloading crossbows')[0])
    .filter((r) => r.length === 8 && r[0] !== 'Weapon')
    .map((r) => [
      r[0],
      {
        name: r[0],
        type: r[1],
        damage: r[2],
        range: r[3],
        minimum: r[4],
        enc: r[5],
        size: r[6],
        price: r[7],
      },
    ]),
);
const items = { ...close, ...ranged };
for (const r of rows(rule('equipment/general-gear').split('## Containers')[0]))
  if (r.length === 3 && r[0] !== 'Item') items[r[0]] = { name: r[0], enc: r[1], price: r[2] };
for (const r of rows(weaponText.split('## Ammunition')[1]))
  if (r.length === 3 && r[0] !== 'Ammunition')
    items[r[0]] = { name: r[0], enc: r[1], price: r[2], units: 10 };
for (const r of rows(rule('equipment/armour')))
  if (r.length === 4 && r[0] !== 'Armour')
    items[r[0]] = { name: r[0], ap: Number(r[1]), enc: r[2], price: r[3] };
const round = Math.round;
const rendered = [];
const audits = [];
assert.equal(data.characters.length, 8);
assert.equal(new Set(data.characters.map((c) => c.id)).size, 8);
assert.equal(
  data.startingMoneySP,
  140,
  'This roster uses the explicitly approved fixed-money exception.',
);

for (const [index, c] of data.characters.entries()) {
  const a = c.characteristics;
  const names = ['STR', 'CON', 'DEX', 'SIZ', 'INT', 'POW', 'CHA'];
  assert.deepEqual(Object.keys(a), names);
  assert.equal(
    Object.values(a).reduce((sum, n) => sum + n, 0),
    86,
    `${c.name}: characteristic budget`,
  );
  names.forEach((key, i) =>
    assert(
      Number.isInteger(a[key]) &&
        a[key] >= (['INT', 'SIZ'].includes(key) ? 7 : 3) &&
        a[key] <= Math.min(18, maxima[c.race][i]),
      `${c.name}: ${key} bounds`,
    ),
  );
  if (c.race === 'Human') assert(c.age >= 18 && c.age <= 28);
  assert.equal(Object.values(c.conversions).reduce((sum, n) => sum + n / 5, 0) <= 12, true);
  for (const [pool, amount] of Object.entries(c.conversions))
    assert(
      ['Resistances', 'Combat', 'Practical'].includes(pool) &&
        amount >= 0 &&
        amount <= 20 &&
        amount % 5 === 0,
    );

  const skills = [];
  const addSkill = (name, template) => {
    const source =
      template === 'Shaping' ? { category: 'Knowledge', formula: 'INT + POW' } : formulas[template];
    assert(source, `${name} has no canonical base`);
    const base = source.formula
      .split(' + ')
      .reduce((sum, term) => sum + (a[term] ?? Number(term)), 0);
    const pool = c.allocation[name] ?? 0;
    const ip = c.skillImprovements.includes(name) ? improvementFor(base + pool) : 0;
    assert(Number.isInteger(pool) && pool >= 0 && pool <= 30);
    assert(
      pool + ip <= 30,
      `${c.name}: conservatively keep all creation increases within +30 on ${name}`,
    );
    const score = base + pool + ip;
    assert(score >= 0 && score <= 100);
    skills.push({
      name,
      category: source.category,
      template,
      base,
      pool,
      ip,
      score,
      critical: crit(score),
    });
  };
  Object.entries(formulas)
    .filter(([, v]) => ['Resistances', 'Combat'].includes(v.category))
    .forEach(([name]) => addSkill(name, name));
  cultures.forEach((name) =>
    addSkill(`Culture (${name})`, name === 'Whitewater' ? 'Culture (own)' : 'Culture (other)'),
  );
  addSkill('Culture (another named culture)', 'Culture (other)');
  languages.forEach((name) =>
    addSkill(`Language (${name})`, name === 'River Crown' ? 'Language (own)' : 'Language (other)'),
  );
  addSkill('Language (another named language)', 'Language (other)');
  loreFields.forEach((name) =>
    addSkill(`Lore (${name})`, name === c.ownLore ? 'Lore (own field)' : 'Lore (other)'),
  );
  addSkill('Lore (another named field)', 'Lore (other)');
  addSkill('Natural Lore', 'Natural Lore');
  if (c.shaping) addSkill('Shaping', 'Shaping');
  Object.entries(formulas)
    .filter(([, v]) => v.category === 'Practical')
    .forEach(([name]) => {
      if (name === 'Craft (type)') {
        crafts.forEach((craft) => addSkill(`Craft (${craft})`, name));
        addSkill('Craft (another named trade)', name);
      } else addSkill(name, name);
    });
  assert.equal(new Set(skills.map((s) => s.name)).size, skills.length);
  assert.equal(new Set(skills.map((s) => s.template)).size, 27 + Number(Boolean(c.shaping)));
  const bySkill = Object.fromEntries(skills.map((s) => [s.name, s]));
  for (const key of Object.keys(c.allocation))
    assert(bySkill[key], `Unrecognised allocation: ${key}`);
  assert.equal(new Set(c.skillImprovements).size, c.skillImprovements.length);
  c.skillImprovements.forEach((name) => assert(bySkill[name]));
  const poolRows = Object.entries(categories).map(([name, budget]) => {
    const removed = c.conversions[name] ?? 0;
    const spent = skills.filter((s) => s.category === name).reduce((sum, s) => sum + s.pool, 0);
    assert.equal(spent, budget - removed, `${c.name}: ${name} pool`);
    return [name, budget, removed, removed / 5, spent, 0];
  });
  const innateCost = innate[c.race].reduce((sum, [, cost]) => sum + cost, 0);
  assert(innateCost <= 10);
  const bonusIP = Object.values(c.conversions).reduce((sum, n) => sum + n / 5, 0);
  assert(
    c.skillImprovements.length <= 10 - innateCost,
    'Skill improvements must use ordinary starting IP, never converted IP.',
  );
  const talentRecords = c.talents.map((t) => ({ ...t, ...talent(t.slug) }));
  assert.equal(new Set(c.talents.map((t) => `${t.slug}:${t.choice ?? ''}`)).size, c.talents.length);
  for (const t of talentRecords) {
    const pre = t.data.prerequisites;
    let legal;
    if (t.slug === 'shaping')
      legal =
        Boolean(c.shaping) &&
        concepts.includes(`**${c.shaping.cells[0]}**`) &&
        concepts.includes(`**${c.shaping.cells[1]}**`);
    else if (t.slug === 'close-quarters-knack') legal = a.DEX >= 13 && a.SIZ <= 9;
    else if (t.slug === 'quick-reflexes') legal = a.DEX >= 13 && bySkill.Dodge.score >= 51;
    else if (t.slug === 'favoured-weapon')
      legal = c.closeWeapon === t.choice && bySkill['Close Combat'].score >= 51;
    else if (t.slug === 'subdue')
      legal = bySkill['Close Combat'].score >= 51 || bySkill['Unarmed Combat'].score >= 51;
    else {
      const match = pre.match(/^(.+) (\d+)%$/);
      assert(match, `Review unhandled prerequisite: ${pre}`);
      legal = bySkill[match[1]]?.score >= Number(match[2]);
    }
    assert(legal, `${c.name}: prerequisite for ${t.data.title}: ${pre}`);
  }
  const talentCost = talentRecords.reduce((sum, t) => sum + t.data.cost, 0);
  const ipSpent = innateCost + talentCost + c.skillImprovements.length;
  assert.equal(ipSpent, 10 + bonusIP, `${c.name}: IP ledger`);
  if (c.shaping) {
    assert(talentRecords.some((t) => t.slug === 'shaping' && t.data.cost === 20));
    assert.equal(c.shaping.cells.length, 2);
    assert.equal(new Set(c.shaping.cells).size, 2);
    c.shaping.cells.forEach((cell) =>
      assert(
        cell.split('·').includes(c.shaping.specialty) &&
          rule('magic/techniques-and-forms').includes(`\`${cell}\``),
      ),
    );
  } else assert(!bySkill.Shaping);

  const inventory = new Map();
  const addItem = (name, qty, source) => {
    assert(items[name], `Unknown item: ${name}`);
    assert(Number.isInteger(qty) && qty > 0);
    const item = inventory.get(name) ?? { ...items[name], free: 0, bought: 0 };
    item[source] += qty;
    inventory.set(name, item);
  };
  [
    'Leather',
    'Backpack',
    'Rope, 10 metres',
    'Flint and Tinder',
    'Waterskin',
    c.closeWeapon,
    c.rangedWeapon,
    'Dagger',
  ].forEach((name) => addItem(name, 1, 'free'));
  assert(close[c.closeWeapon]);
  assert(ranged[c.rangedWeapon]);
  if (c.package === 'shield') {
    assert(c.shield?.startsWith('Shield,'));
    assert(
      close[c.closeWeapon].type.startsWith('1H') || close[c.closeWeapon].type.startsWith('Flex'),
    );
    addItem(c.shield, 1, 'free');
  } else {
    assert.equal(c.package, 'two-handed');
    assert.equal(close[c.closeWeapon].type.startsWith('2H'), true);
    assert.equal(c.shield, undefined);
  }
  c.purchases.forEach(([name, qty]) => addItem(name, qty, 'bought'));
  const costCP = [...inventory.values()].reduce(
    (sum, item) => sum + item.bought * currency(item.price),
    0,
  );
  const cashCP = data.startingMoneySP * 10 - costCP;
  assert(cashCP >= 0, `${c.name}: overspent equipment`);
  let listedENC = 0;
  let smallItems = 0;
  const inventoryRows = [...inventory.values()].map((item) => {
    const quantity = item.free + item.bought;
    const units = quantity * (item.units ?? 1);
    if (item.enc === '—') smallItems += units;
    else listedENC += Number(item.enc) * quantity;
    return [
      item.name,
      quantity,
      item.enc,
      item.free
        ? item.bought
          ? `${item.free} free; ${item.bought} bought`
          : 'Free package'
        : 'Purchased',
      money(item.bought * currency(item.price)),
    ];
  });
  const smallENC = Math.floor(smallItems / 20);
  listedENC += smallENC;
  const hp = round((a.SIZ + a.CON) / 2);
  const mwl = round(hp / 2);
  const capacity = a.STR + a.SIZ;
  const dm =
    capacity <= 10
      ? '-1D6'
      : capacity <= 15
        ? '-1D4'
        : capacity <= 25
          ? '+0'
          : capacity <= 30
            ? '+1D4'
            : '+1D6';
  const armour = items.Leather;
  const reflexes = c.talents.some((t) => t.slug === 'quick-reflexes') ? 2 : 0;
  const baseOrder = round((a.DEX + a.INT) / 2);
  const order = baseOrder - Number(armour.enc) + reflexes;
  const move =
    c.race === 'Human'
      ? 15
      : Number(
          matter(rule(`creatures/${c.race.toLowerCase()}`)).data.derived.movement.split(' ')[0],
        );
  assert(listedENC <= capacity, `${c.name}: listed ENC exceeds capacity`);
  for (const ammo of ['Arrows (10)', 'Crossbow bolts (10)']) {
    const q = inventory.get(ammo);
    if (q) assert((q.free + q.bought) * 10 <= (inventory.get('Quiver')?.bought ?? 0) * 30);
  }
  const attacks = [];
  const damageFor = (w, isRanged, twoHand = false) => {
    const addDM = !isRanged || w.type.includes('Thrown');
    const fav = c.talents.some((t) => t.slug === 'favoured-weapon' && t.choice === w.name) ? 1 : 0;
    return [
      w.damage,
      ...(addDM && dm !== '+0'
        ? [dm.startsWith('+') ? `+ ${dm.slice(1)}` : `- ${dm.slice(1)}`]
        : []),
      ...(fav ? ['+ 1'] : []),
      ...(twoHand ? ['+ 2'] : []),
    ].join(' ');
  };
  const addAttack = (w, isRanged, twoHand = false) => {
    const requirements = w.minimum === '—' ? ['—', '—'] : w.minimum.split('/');
    for (const [i, key] of ['STR', 'DEX'].entries())
      if (requirements[i] !== '—')
        assert(
          a[key] >= Number(requirements[i]) - (twoHand && key === 'STR' ? 2 : 0),
          `${c.name}: ${w.name} ${key} requirement`,
        );
    const skill =
      w.name === 'Unarmed' ? 'Unarmed Combat' : isRanged ? 'Ranged Combat' : 'Close Combat';
    const distance = isRanged
      ? w.range.replace('STR × 2', String(a.STR * 2)).replace('STR', String(a.STR))
      : 'Close, ≤2 m';
    attacks.push([
      `${w.name}${twoHand ? ' (two hands)' : ''}`,
      `${bySkill[skill].score}% (${crit(bySkill[skill].score)})`,
      `\`${damageFor(w, isRanged, twoHand)}\``,
      w.size,
      distance,
      twoHand ? 'Flex, 2H: +2 included' : w.type,
      twoHand ? `${Number(requirements[0]) - 2}/${requirements[1]}` : w.minimum,
    ]);
  };
  for (const name of inventory.keys()) {
    if (close[name]) {
      addAttack(close[name], false);
      if (close[name].type.startsWith('Flex')) addAttack(close[name], false, true);
    }
    if (ranged[name]) addAttack(ranged[name], true);
  }
  addAttack(close.Unarmed, false);

  const intro = concepts
    .split(new RegExp(`^## ${index + 1}\\. `, 'm'))[1]
    .split(/^## /m)[0]
    .split('\n')
    .slice(1)
    .join('\n')
    .trim();
  const talentSections = [
    ...innate[c.race].map(
      ([name, cost]) =>
        `### ${name} — ${cost} IP (required ancestry ability)\n\n${abilityText(name)}\n\nSource: [Fantasy Races](${ruleLink('gm-tools/fantasy-races')}).`,
    ),
    ...talentRecords
      .filter((t) => t.slug !== 'shaping')
      .map(
        (t) =>
          `### ${t.data.title}${t.choice ? ` (${t.choice})` : ''} — ${t.data.cost} IP\n\n**Prerequisite met:** ${t.data.prerequisites}.${t.choice ? ` **Selected application/weapon:** ${t.choice}.` : ''}\n\n${t.content.replace(/^\s*## Effect\s*/, '').trim()}\n\nSource: [${t.data.title}](${ruleLink(`talents/${t.slug}`)}).`,
      ),
  ];
  const pools = table(
    ['Pool', 'Original', 'Converted', 'IP gained', 'Allocated', 'Unallocated'],
    poolRows,
  );
  const improvements =
    c.skillImprovements
      .map(
        (name) =>
          `${name}: ${bySkill[name].base + bySkill[name].pool}% → ${bySkill[name].score}% (1 ordinary IP)`,
      )
      .join('; ') || 'None';
  const ipLine = `**IP:** 10 ordinary + ${bonusIP} converted = ${10 + bonusIP}; ${innateCost} required ancestry + ${talentCost} Talents + ${c.skillImprovements.length} IP on skill improvements = ${ipSpent} spent; **0 unspent**. Required ancestry is paid from the ordinary 10 IP. All skill improvements below use ordinary IP; converted IP buys Talents only. No characteristics were improved with IP.\n\n**Skill improvements:** ${improvements}.`;
  const skillTables = [];
  for (const group of [
    'Resistances',
    'Combat',
    'Cultures',
    'Languages',
    'Lores and Shaping',
    'Practical',
  ]) {
    const selected = skills.filter((s) =>
      group === 'Cultures'
        ? s.name.startsWith('Culture (')
        : group === 'Languages'
          ? s.name.startsWith('Language (')
          : group === 'Lores and Shaping'
            ? s.category === 'Knowledge' &&
              !s.name.startsWith('Culture (') &&
              !s.name.startsWith('Language (')
            : s.category === group,
    );
    const values = selected.map((s) => [
      s.name === `Culture (Whitewater)` ||
      s.name === 'Language (River Crown)' ||
      s.name === `Lore (${c.ownLore})`
        ? `${s.name} **(own)**`
        : s.name,
      `${s.base}%`,
      `+${s.pool}`,
      `+${s.ip}`,
      `**${s.score}%**`,
      s.critical,
    ]);
    if (group === 'Lores and Shaping' && !c.shaping)
      values.push(['Shaping — Talent not purchased', '—', '—', '—', '**Unavailable**', '—']);
    skillTables.push(
      `### ${group}\n\n${table(['Skill', 'Base', 'Pool +', 'IP +', 'Final', 'Critical'], values)}`,
    );
  }
  let magic =
    '## Magic\n\n**No Shaping Talent, Shaping skill, known cells, Sense Magic, Dispel, or Counter.** PP are still recorded normally; they grant no unlisted ability.';
  if (c.shaping) {
    const score = bySkill.Shaping.score;
    const safe = score <= 25 ? 1 : score <= 50 ? 2 : score <= 75 ? 3 : score < 100 ? 4 : 5;
    const examples = c.shaping.examples.map((e) => {
      assert(c.shaping.cells.includes(e.cell));
      assert(e.intensity <= safe);
      const magnitude = e.intensity + e.range + e.duration + e.reach;
      assert(magnitude <= safe + 2);
      return [
        e.name,
        e.cell,
        `${e.intensity} + ${e.range} + ${e.duration} + ${e.reach} = **${magnitude}**`,
        `${magnitude} PP; ${magnitude > safe ? `-${magnitude - safe}P casting` : 'no overreach penalty'}`,
        e.effect,
      ];
    });
    magic = `## Shaping — 20 IP\n\n**Creation declaration:** Shaping was declared and its full 20 IP reserved before Knowledge allocation. The supernatural discovery and instruction are described above. Trading 15 Resistance, 15 Combat, and 20 Practical points supplies 10 IP; the ordinary 10 IP supplies the rest.\n\n**Shaping ${score}% (Critical ${crit(score)}); Veteran; maximum Intensity ${safe}; Safe Magnitude ${safe}; ordinary maximum Magnitude ${safe + 2}. Specialty: ${c.shaping.specialty}. Known cells: ${c.shaping.cells.join(', ')}.** No other cells or magical Talents; Counter is unavailable.\n\n**Practice:** ${c.shaping.practice}\n\n**Tell:** ${c.shaping.tell}\n\n### Ready workings\n\nExamples are uses of known cells, not separately learned spells. Each uses one outcome and Reach 0: one person-sized subject or smaller. Larger subjects require paid Reach. The formula columns are **Intensity + Range + Duration + Reach** with no additional adjustments. Damage and healing dice below are play-time rules, not character-generation rolls.\n\n${table(['Working', 'Exact cell', 'Magnitude', 'Ordinary success', 'Effect and limits'], examples)}\n\n### Casting, resources, and universal actions\n\n- **Cast:** declare the effect and confirm its Magnitude, route, defence, and PP with the GM; spend one Combat Action and test Shaping. Keep Movement and eligible Reactions unless another rule prevents them. Practice must be possible.\n- **Payment:** success costs Magnitude PP; Critical costs half, rounded normally, and does not maximise effect dice. A safe failure costs 1 PP with no effect. Failed overreach costs half Magnitude (rounded normally) and causes Backlash. A fumble costs full Magnitude and causes Backlash. A successful effect stopped by defence still costs its normal PP. Apply a Hero Point reroll before costs or Backlash.\n- **Overreach:** M${safe + 1} takes -1P; M${safe + 2} takes -2P; higher requires a ritual. Maximum Intensity remains ${safe}. Cancelling a penalty does not remove overreach risk.\n- **Backlash:** the GM may choose rather than roll: take Magnitude damage ignoring armour; lose another Magnitude PP; an immediate Reach-0 effect at one lower Intensity strikes a valid nearby subject (I0 is cosmetic); or become Fatigued, escalate Fatigued to Exhausted, or collapse if already Exhausted. The full [Backlash table](${ruleLink('magic/casting-and-defence')}) governs.\n- **Ongoing:** active Magnitude starts at 0 and cannot exceed permanent INT ${a.INT}. Ongoing effects count full Magnitude; instantaneous effects do not. Dismiss on your turn without an Action. Maintaining concentration or active control spends the Combat Action each round; maintain only one. Damage or serious distraction forces Persistence; failure ends maintenance. At 0 PP, resolve the casting then fall unconscious and end concentration.\n- **Sense Magic:** one Combat Action, 1 PP, Shaping test; detect active magic within 15 m. Success gives location and Form; Critical also gives Technique, Magnitude, and concentrated/triggered/anchored state. Failure reveals nothing; a fumble gives a false impression and conspicuous Tell, not Backlash. Veiled magic opposes with its stored casting result.\n- **Dispel:** one Combat Action; Magnitude equals target Shaping's full Magnitude + Range, Reach 0. Check normal limits, roll and pay normally, then on Success/Critical oppose the original Shaper's current unmodified Shaping (if unknown, 10 × original Magnitude, maximum 100%). You must succeed and win. Active anchored enchantments qualify; completed permanent transformations do not.\n\nSources: [Becoming a Shaper](${ruleLink('magic/becoming-a-shaper')}), [Building a Shaping](${ruleLink('magic/building-a-shaping')}), [Effects](${ruleLink('magic/effects')}), [Casting and Defence](${ruleLink('magic/casting-and-defence')}), [Ongoing and universal actions](${ruleLink('magic/ongoing-and-magical-actions')}).`;
  }

  const sheet = `# ${c.name}\n\n[Choose another PC](README.md) · [All eight concepts](01-concepts.md) · [Shared play reference](02-play-reference.md)\n\n## Character\n\n${intro}\n\n## Characteristics and condition\n\n${table(
    ['Characteristic', 'Racial start', 'Allocated change', 'Final'],
    names.map((name, i) => [
      name,
      spreads[c.race][i],
      `${a[name] - spreads[c.race][i] >= 0 ? '+' : ''}${a[name] - spreads[c.race][i]}`,
      a[name],
    ]),
  )}\n\n**56 starting points + 30 allocated = 86.** No rolled characteristics or IP increases.\n\n${table(
    ['Attribute', 'Starting value / calculation'],
    [
      ['HP', `**${hp}/${hp}** = round((${a.SIZ} + ${a.CON}) / 2)`],
      ['Major Wound Level', `**${mwl}** = round(${hp} / 2)`],
      ['PP', `**${a.POW}/${a.POW}**`],
      ['Hero Points', '**2 unspent**'],
      ['Damage Modifier', `**${dm}**; STR + SIZ = ${capacity}`],
      ['Armour', `**${armour.ap} AP**, Leather; ${armour.enc} ENC already deducted below`],
      [
        'Combat Order',
        `**${order}** = round((${a.DEX} + ${a.INT}) / 2) − ${armour.enc}${reflexes ? ` + ${reflexes} Quick Reflexes` : ''}; add the normal D10 in play`,
      ],
      [
        'Movement',
        `**${move} m** per round; Sprint up to ${move * 2} m with its normal action/reaction restrictions`,
      ],
      ['Carrying capacity', `**${capacity} ENC**; absolute maximum ${capacity * 2} ENC`],
      [
        'Listed carried ENC',
        `**${listedENC}**; includes ${smallENC} ENC for ${smallItems} negligible items; see the explicit source gap below`,
      ],
      [
        'PP recovery',
        `${round(a.POW / 4)} per complete 2 hours of rest; full recovery after 8 hours`,
      ],
      [
        'Natural HP recovery',
        `${round(a.CON / 4)} per 24 hours of no more than light activity; a Major Wound requires successful Surgery/equivalent first`,
      ],
      [
        'Conditions',
        'Rested; no Wounded, Bleeding, Dying, Fatigued, Exhausted, poison, or disease',
      ],
      [
        'Magic commitments',
        '0 active Magnitude; 0 committed PP; no enchantments or active effects',
      ],
      ['Unspent IP', '0'],
      ['Cash remaining', `**${money(cashCP)}**`],
    ],
  )}\n\nRound exact halves up for attributes. Critical ranges use the integer tens digit instead. ${c.race !== 'Human' ? `Movement follows the published [${c.race} profile](${ruleLink(`creatures/${c.race.toLowerCase()}`)}); its NPC characteristic and skill scores are not used.` : ''}\n\n## Every skill\n\n**Final** is the unmodified skill to use in play; situational Bonus/Penalty dice are separate. All 27 general-skill templates are represented. Every gazetteer culture and language, the seven common Lore fields plus this roster's fields, and the listed Craft examples appear individually, including untrained scores. Each subject is a separate skill: an “another named…” row states the creation base for a new subject, not one shared skill that improves every subject. Knowledge still needs a plausible source; a base score grants no impossible information. **Own culture: Whitewater; own language: River Crown; own Lore: ${c.ownLore}.** Familiar Craft: ${c.craft}; it has no free bonus.\n\n${skillTables.join('\n\n')}\n\n## Abilities\n\n${talentSections.join('\n\n') || 'No ancestry abilities or nonmagical Talents.'}\n\n${magic}\n\n## Weapons and defence\n\nDamage below already includes DM where applicable and any Favoured Weapon bonus. Do not add them again. Weapon Criticals can replace ordinary damage under the combat matrix; magical Criticals never maximise effect dice. The **STR/DEX** column gives requirements for the stated grip; this character meets them all.\n\n${table(['Attack / item', 'Skill % (Critical)', 'Ordinary damage', 'Size', 'Range', 'Hands / tags', 'STR/DEX'], attacks)}\n\n**Ready equipment:** ${c.loadout}\n\n**Defence:** Dodge ${bySkill.Dodge.score}% (Critical ${crit(bySkill.Dodge.score)}), once per round using only the base Reaction; ranged Dodge takes -1P. Weapon/shield Parry uses Close Combat ${bySkill['Close Combat'].score}%; unarmed Parry uses Unarmed Combat ${bySkill['Unarmed Combat'].score}%. A ready shield can Active Guard thrown weapons without a penalty, or physical missiles and individually targeted Projected Shaping at -1P. A ready weapon can guard thrown weapons at -1P. Ordinary passive shield cover exists only if the Shield Cover Talent is listed above.\n\n**In play:** ${c.tactics}\n\n## Equipment and money\n\nStarting wealth is **140 SP**, the user's explicitly approved fixed replacement for the published 4D6 × 10 SP roll. The ${c.package === 'shield' ? 'shield and one-handed weapon' : 'two-handed weapon'} package and standard travelling equipment are free. All extras use published list prices, with no Trade roll, credit, or resale income.\n\n${table(['Item / purchase unit', 'Quantity', 'ENC per unit', 'Source', 'Cash spent'], inventoryRows)}\n\nAlso carried from the free package: **14 days of travelling provisions**. The waterskin holds two days of water. ${inventory.has('Healing Kit') ? `Healing Kits: **${inventory.get('Healing Kit').bought} ${inventory.get('Healing Kit').bought === 1 ? 'kit' : 'kits'} × 5 uses = ${inventory.get('Healing Kit').bought * 5} uses**, all unspent; mark one use for every ordinary Healing or Surgery attempt, successful or not. Shaping consumes PP instead.` : 'No personal Healing Kit: Healing tests without a kit take -2P.'}\n\n**Money ledger:** 140 SP − ${money(costCP)} purchases = **${money(cashCP)} remaining**. Ammunition purchase units contain ten projectiles each; the table lists purchased bundles, not individual shots. All ammunition is unspent.\n\n**Carry arrangement and source gap:** Armour is worn; larger weapons and rope are slung or secured outside the backpack; tools and provisions are packed. Arrows/bolts use the listed quiver, sling bullets the listed slingbag. Negligible items are counted individually and grouped at 20 per ENC. Containers do not erase ENC. The rules assign no ENC to travelling provisions or coins, so **${listedENC} is the total of published ENC values, not an invented weight for food and money**. No overload penalty is present from the listed values; any campaign ruling that adds those missing weights must be checked against capacity ${capacity}. No extra rescue supplies from the adventure briefing are included here.\n\n## Creation ledger\n\n${pools}\n\n${ipLine}\n\n**Validation:** characteristic budget and bounds, every skill base, exact category spending, at most +30 total creation increase per skill, skill/IP limits, mandatory ancestry costs, Talent prerequisites, weapon minimums, package choices, cash, ammunition capacity, and all listed ENC values checked by [build.mjs](build.mjs).\n\nSources: [Character creation](${ruleLink('characters/character-creation')}), [Improvement](${ruleLink('characters/improvement')}), [Fantasy Races](${ruleLink('gm-tools/fantasy-races')}), [Weapons](${ruleLink('equipment/weapons')}), [Armour](${ruleLink('equipment/armour')}), [General Gear](${ruleLink('equipment/general-gear')}), [Encumbrance](${ruleLink('adventuring/encumbrance')}).\n`;
  // Copied Talent text retains canonical public-site links; make those usable from the local artifact.
  const portable = sheet.replaceAll('](/rules/', '](https://fantasycrux.org/rules/');
  rendered.push({ file: `${String(index + 1).padStart(2, '0')}-${c.id}.md`, sheet: portable });
  audits.push({
    name: c.name,
    race: c.race,
    characteristics: a,
    hp,
    mwl,
    pp: a.POW,
    activeMagnitudeLimit: a.INT,
    dm,
    order,
    move,
    capacity,
    listedENC,
    smallItems,
    costCP,
    cashCP,
    innateCost,
    talentCost,
    skillIP: c.skillImprovements.length,
    bonusIP,
    totalIP: ipSpent,
    skillCount: skills.length,
    pools: poolRows,
    skills,
  });
}

for (const { file, sheet } of rendered) writeFileSync(resolve(here, file), sheet);
writeFileSync(resolve(here, 'audit.json'), `${JSON.stringify(audits, null, 2)}\n`);
const auditText = `# Creation audit\n\nAll eight builds pass the checks in [build.mjs](build.mjs), using [characters.json](characters.json) and the canonical local Markdown rules. Run \`node pregenerated-characters/build.mjs\` from the repository root to regenerate and recheck. Source baseline: \`${data.rulesRevision}\`; the script reads the current local rules when run.\n\n## Character and resource totals\n\n${table(
  [
    'PC',
    'Characteristic total',
    'HP / MWL',
    'PP',
    'Active M',
    'DM',
    'Order',
    'Move',
    'Capacity / listed ENC',
    'Spent / cash left',
  ],
  audits.map((a) => [
    a.name,
    86,
    `${a.hp} / ${a.mwl}`,
    a.pp,
    a.activeMagnitudeLimit,
    a.dm,
    a.order,
    `${a.move} m`,
    `${a.capacity} / ${a.listedENC}`,
    `${money(a.costCP)} / ${money(a.cashCP)}`,
  ]),
)}\n\n## IP totals\n\n${table(
  ['PC', 'Ordinary', 'Converted', 'Required ancestry', 'Talents', 'Skill IP', 'Unspent'],
  audits.map((a) => [a.name, 10, a.bonusIP, a.innateCost, a.talentCost, a.skillIP, 0]),
)}\n\nBoth Shapers reserve 20 IP before Knowledge allocation. Each converts 15 Resistance, 15 Combat, and 20 Practical points into 3 + 3 + 4 IP, then spends the ordinary 10 IP as well. Knowledge remains 50; 30 goes to Shaping and 20 to own Lore. Neither has spare IP or an unbought magical Talent. Nonhumans pay mandatory ancestry costs from the ordinary 10 IP. All skill improvements use ordinary IP; no converted IP raises a skill. No characteristic is improved with IP.\n\n## Completeness and bounds\n\nEvery sheet displays all 27 canonical general-skill templates, expanded into ${audits[0].skillCount} nonmagical rows, including all nine gazetteer cultures and languages, all common Lore fields, the roster's additional Lore subjects, Craft subjects, and explicit bases for another named subject. Shapers add their Shaping row; non-Shapers explicitly show it as unavailable. These are subject-specific bases, not free training or shared specialist skills.\n\nAll category pools are spent exactly. No skill receives more than 30 total points above its base even when an ordinary-IP improvement is included; no skill exceeds 100%. Each skill improved with IP is improved once and gains +5 at 0–50% or +3 at 51–99%. All Talent prerequisites and ancestry costs are checked. All weapons meet STR and DEX minimums. Characteristic, HP, MWL, Combat Order, DM, PP recovery, Active Magnitude, money, ammunition, and published ENC calculations are generated from fixed inputs. Critical ranges use floor(skill / 10), minimum 01.\n\n## Explicit decisions and source gaps\n\n- **User-approved exception:** fixed 140 SP per character replaces the money roll. Characteristics and ages are chosen, not rolled; the only dice printed on sheets describe future play. Purchases use the ordinary equipment lists and start fully paid.\n- **Nonhuman Movement:** the Dwarf profile supplies 12 m; the Goblin, Orc, and Elf profiles supply 15 m. Only Movement is taken from those profiles; PCs use player creation budgets, paid ancestry abilities, and calculated player skills.\n- **Unspecified ENC:** the free 14 days of provisions and remaining coins are recorded, but the rules give neither a numerical ENC nor an explicit negligible-item mark for them. The sheets label their load as the sum of published ENC values and identify this gap; they do not assign a new weight or claim a fully specified total. A later campaign ruling on food or coin weight requires rechecking loads.\n- **Equipment details:** mundane clothing and cosmetic appearance do not create extra priced gear. Tamsin's Practice uses a washed part of her issued rope. Spell examples are priced uses of known cells, not free additional cells or items.\n- **Starting status:** full HP and PP, 2 Hero Points, no conditions, active effects, enchantments, committed PP, ammunition expenditure, or used Healing Kits. Prior company errands grant no advancement. Briefing rescue supplies remain shared adventure equipment and are not duplicated on personal sheets.\n- **No playtest claim:** this is an arithmetic and rules check. The adventure remains written for three to five players, selecting from this roster; it has not been balanced or playtested for all eight at once.\n\nMachine-readable results, including every skill calculation, are in [audit.json](audit.json).\n`;
writeFileSync(resolve(here, '03-creation-audit.md'), auditText);
console.log(
  `Validated and generated ${rendered.length} PCs, ${audits.reduce((sum, a) => sum + a.skillCount, 0)} explicit skill rows, exact budgets, legal Talents, and priced equipment.`,
);
