#!/usr/bin/env node

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const talentRoot = path.join(repoRoot, 'src', 'content', 'rules', 'talents');
const creatureRoot = path.join(repoRoot, 'src', 'content', 'rules', 'creatures');
const reportPath = path.join(repoRoot, 'docs', 'design', 'talent-balance-audit.md');

const gradeRank = Object.freeze({ fumble: 0, failure: 1, success: 2, critical: 3 });
const distributionCache = new Map();

const assessments = Object.freeze({
  'talent.alchemist': ['Change', 'Specify range, attack skill, defence, damage, and a spent miss.'],
  'talent.ambusher': ['Change', 'Limit the converted Critical to mundane combat attacks.'],
  'talent.athletics-expertise': [
    'Add',
    'A chosen-application penalty remover priced to the Tracker precedent.',
  ],
  'talent.battle-awareness': ['Keep', 'A bounded positional defence fits the 3-IP standard tier.'],
  'talent.counter': [
    'Keep',
    'Strong magical denial still costs a Reaction and full Magnitude in PP.',
  ],
  'talent.cutpurse': [
    'Keep',
    'One Action replaces the explicit one-minute baseline, fitting 2 IP.',
  ],
  'talent.deception-expertise': [
    'Add',
    'A chosen-application penalty remover priced to the Tracker precedent.',
  ],
  'talent.defensive-stance': ['Keep', 'A shield-only defensive trade fits the narrow tier.'],
  'talent.disarm': ['Change', 'Keep 2 IP, but explicitly bar fixed or impossible targets.'],
  'talent.enchanter': [
    'Change',
    'Cap extant enchantments by permanent unmodified POW and creator.',
  ],
  'talent.favoured-weapon': [
    'Keep',
    'The +1 applies only to ordinary damage and costs 3 IP per weapon.',
  ],
  'talent.field-surgeon': ['Keep', 'Expert portable Surgery is a bounded 3-IP permission.'],
  'talent.indirect': [
    'Keep',
    'Training grants the route; each crossed barrier still adds Magnitude.',
  ],
  'talent.iron-fist': [
    'Change',
    'Exclude listed natural weapons and retain the 3-IP damage/Size step.',
  ],
  'talent.killing-angle': ['Keep', 'Once-per-round conditional 1D4 damage fits the 4-IP tier.'],
  'talent.lockbreaker': ['Keep', 'A narrow extended-task shortcut fits the 2-IP permission tier.'],
  'talent.master-assassin': [
    'Keep',
    'A 5-IP Expert capstone adds damage only through Killing Angle.',
  ],
  'talent.master-brawler': [
    'Change',
    'Exclude listed natural weapons; the 7-IP chain buys damage and Size.',
  ],
  'talent.master-craftsman': ['Keep', 'A broad Expert campaign/economy benefit warrants 4 IP.'],
  'talent.mastery': [
    'Change',
    'Replace generic Mastery with once-per-round exact-weapon Expertise.',
  ],
  'talent.merchants-eye': ['Keep', 'Reliable appraisal plus bounded availability fits 3 IP.'],
  'talent.mighty-shot': [
    'Keep',
    'A 5-IP Expert damage capstone is limited to one shot each round.',
  ],
  'talent.missile-guard': ['Keep', 'Removing one named Active Guard penalty fits 2 IP.'],
  'talent.off-hand-mastery': [
    'Keep',
    'A 5-IP capstone removes the penalty from one core extra option.',
  ],
  'talent.physician': [
    'Keep',
    'The resistance boost and poison retry are specialised Expert support.',
  ],
  'talent.point-blank-shot': [
    'Change',
    "Price at 3 IP and remove exactly one enemy's -2P engagement tax.",
  ],
  'talent.poisoner': ['Change', 'Define application, expiry, spending, and repeated exposure.'],
  'talent.practised-hands': ['Keep', 'More healing plus one bounded retry warrants 4 IP.'],
  'talent.protector': ['Keep', 'Redirecting the base Reaction to an ally fits 2 IP.'],
  'talent.quick-reflexes': ['Keep', 'A flat initiative edge with dual prerequisites fits 3 IP.'],
  'talent.rally': ['Change', 'At 4 IP and one Action, affect two allies with non-stacking expiry.'],
  'talent.rapid-shot': [
    'Change',
    'Raise 3 to 4 IP; -1P, all Reactions, and weapon limits bound the multiplier.',
  ],
  'talent.selective': ['Keep', 'Training breaks area inclusion; +1 Magnitude prices each use.'],
  'talent.shaping': [
    'Change',
    'Keep 20 IP, but permit declared starting investment into the new skill.',
  ],
  'talent.shield-cover': [
    'Keep',
    'Passive -1P is shield-bound, non-stacking, and bypassed by areas/direct harm.',
  ],
  'talent.shield-rush': ['Keep', 'A no-damage push plus resisted prone effect fits 3 IP.'],
  'talent.signature-weapon': ['Keep', 'The second +1 costs 4 IP and retains all Favoured limits.'],
  'talent.silent-step': ['Keep', 'Half-speed opposed concealment pressure fits 3 IP.'],
  'talent.silver-tongue': ['Keep', 'One bounded failed-test reroll per scene fits 3 IP.'],
  'talent.steady-aim': ['Keep', 'Preserving Aim through a Reaction is a narrow 2-IP benefit.'],
  'talent.steady-casting': ['Change', 'Remove only one total named penalty before cancellation.'],
  'talent.subdue': ['Change', 'Exclude Talent damage from its knockout threshold and fallback.'],
  'talent.tactician': ['Keep', 'A campaign-scale command permission fits the broad 4-IP tier.'],
  'talent.terrain-expertise': [
    'Add',
    'A chosen-terrain penalty remover priced to the Tracker precedent.',
  ],
  'talent.tracker': [
    'Keep',
    'Remove one residual trail-finding penalty, never create a Bonus die.',
  ],
  'talent.trigger': [
    'Keep',
    'Training unlocks delayed timing while wait/effect Duration still costs Magnitude.',
  ],
  'talent.trip': ['Keep', 'Trading all damage for prone is a standard 3-IP maneuver.'],
  'talent.veiled': [
    'Keep',
    'Training unlocks concealment while +1 Magnitude and -1P preserve cost.',
  ],
  'talent.wayfinder': [
    'Change',
    'Bound the safeguard to navigation Fumbles and ordinary travel procedure.',
  ],
  'talent.weak-point': [
    'Change',
    'Require time, access, Engineering, duration, and a retry condition.',
  ],
  'talent.wrestler': [
    'Keep',
    'Advanced effects require an established hold and another opposed Action.',
  ],
});

const retiredAssessments = Object.freeze([
  {
    title: 'Sure Hand',
    cost: 4,
    decision: 'Retire',
    finding:
      'Routine unhurried work already avoids a roll, so the Talent had no stable priced benefit.',
  },
  {
    title: 'Committed Strike',
    cost: 3,
    decision: 'Retire',
    finding:
      'The +1B nearly doubles armour-ignoring Criticals for a forfeit that swings a round too hard; withdrawn pending a rework.',
  },
  {
    title: 'Deadeye',
    cost: 4,
    decision: 'Retire',
    finding:
      'A backline shooter often pays nothing real for the Reaction forfeit; withdrawn with Committed Strike pending a rework.',
  },
]);

function parseScalar(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readFrontmatterSource(file) {
  const text = readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) throw new Error(`Missing YAML frontmatter: ${path.relative(repoRoot, file)}`);
  return { block: match[1], text };
}

function readFrontmatter(file) {
  const { block } = readFrontmatterSource(file);
  const data = {};
  for (const line of block.split('\n')) {
    const scalar = line.match(/^([A-Za-z][A-Za-z0-9]*):(?:\s*(.*))?$/);
    if (scalar && scalar[2]) data[scalar[1]] = parseScalar(scalar[2]);
  }
  return data;
}

function readTalents() {
  const talents = readdirSync(talentRoot)
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .map((name) => {
      const file = path.join(talentRoot, name);
      const data = readFrontmatter(file);
      if (data.type !== 'talent') throw new Error(`${name} is not marked type: talent.`);
      const cost = Number(data.cost);
      if (!Number.isInteger(cost)) throw new Error(`${name} has a non-integer cost.`);
      return { ...data, cost, file: name };
    })
    .sort((left, right) => left.title.localeCompare(right.title, 'en'));

  if (talents.length !== 51) {
    throw new Error(`Expected 51 published Talents; found ${talents.length}.`);
  }

  const publishedIds = new Set(talents.map(({ id }) => id));
  const assessedIds = new Set(Object.keys(assessments));
  const missing = [...publishedIds].filter((id) => !assessedIds.has(id));
  const stale = [...assessedIds].filter((id) => !publishedIds.has(id));
  if (missing.length || stale.length) {
    throw new Error(
      `Talent assessment mismatch. Missing: ${missing.join(', ') || 'none'}. ` +
        `Stale: ${stale.join(', ') || 'none'}.`,
    );
  }
  return talents;
}

function readCreatureRoster() {
  const profiles = readdirSync(creatureRoot)
    .filter((name) => name.endsWith('.md'))
    .flatMap((name) => {
      const file = path.join(creatureRoot, name);
      const { block, text } = readFrontmatterSource(file);
      if (!/^type:\s*creature\s*$/m.test(block)) return [];

      const id = block.match(/^id:\s*(.+)$/m)?.[1].trim();
      const titleValue = block.match(/^title:\s*(.+)$/m)?.[1];
      if (!id || !titleValue) throw new Error(`${name} lacks a creature id or title.`);
      const title = parseScalar(titleValue);
      const derivedBlock = block.match(/^derived:\s*\n((?: {2}.+(?:\n|$))*)/m)?.[1] ?? '';
      const apValue = derivedBlock.match(/^ {2}ap:\s*(.+)$/m)?.[1] ?? '';
      let apValues = apValue.match(/\d+/g)?.map(Number) ?? [];

      // Elementals publish four rank profiles in a body table instead of nested derived data.
      if (id === 'creatures.elemental') {
        const lines = text.split('\n');
        const headerIndex = lines.findIndex((line) => {
          const cells = markdownCells(line);
          return cells.includes('Rank') && cells.includes('AP');
        });
        const headers = markdownCells(lines[headerIndex] ?? '');
        const apIndex = headers.indexOf('AP');
        apValues = [];
        for (const line of lines.slice(headerIndex + 2)) {
          if (!line.trimStart().startsWith('|')) break;
          const value = markdownCells(line)[apIndex];
          if (/^\d+$/.test(value)) apValues.push(Number(value));
        }
        if (headerIndex < 0 || apIndex < 0 || apValues.length !== 4) {
          throw new Error('Could not read all four Elemental AP ranks.');
        }
      }
      return [{ apValues, id, title }];
    })
    .sort((left, right) => left.title.localeCompare(right.title, 'en'));

  if (profiles.length !== 57) {
    throw new Error(`Expected 57 creature records; found ${profiles.length}.`);
  }

  const bands = new Map([
    ['0', 0],
    ['1–2', 0],
    ['3–4', 0],
    ['5–6', 0],
    ['7+', 0],
    ['No numeric AP', 0],
  ]);
  for (const profile of profiles) {
    const maximum = profile.apValues.length ? Math.max(...profile.apValues) : null;
    const band =
      maximum === null
        ? 'No numeric AP'
        : maximum === 0
          ? '0'
          : maximum <= 2
            ? '1–2'
            : maximum <= 4
              ? '3–4'
              : maximum <= 6
                ? '5–6'
                : '7+';
    bands.set(band, bands.get(band) + 1);
  }

  return {
    bands,
    numeric: profiles.filter(({ apValues }) => apValues.length > 0).length,
    total: profiles.length,
  };
}

function markdownCells(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

function assertSkill(skill) {
  if (!Number.isInteger(skill) || skill < 0 || skill > 100) {
    throw new RangeError(`Skill must be an integer from 0 to 100; received ${skill}.`);
  }
}

function assertModifier(modifier) {
  if (!Number.isInteger(modifier) || modifier < -3 || modifier > 3) {
    throw new RangeError(`Modifier must be an integer from -3P to +3B; received ${modifier}.`);
  }
}

function d100(tens, units) {
  return tens === 0 && units === 0 ? 100 : tens * 10 + units;
}

function grade(skill, roll) {
  const fumbleFloor = skill === 100 ? 100 : 99;
  if (roll >= fumbleFloor) return 'fumble';
  const criticalCeiling = skill === 0 ? 0 : Math.max(1, Math.floor(skill / 10));
  if (roll <= criticalCeiling) return 'critical';
  if (roll <= skill) return 'success';
  return 'failure';
}

function compareResults(skill, firstRoll, secondRoll) {
  const firstGrade = grade(skill, firstRoll);
  const secondGrade = grade(skill, secondRoll);
  if (gradeRank[firstGrade] !== gradeRank[secondGrade]) {
    return gradeRank[firstGrade] > gradeRank[secondGrade] ? 1 : -1;
  }
  if (firstRoll === secondRoll) return 0;
  const successful = firstGrade === 'critical' || firstGrade === 'success';
  if (successful) return firstRoll > secondRoll ? 1 : -1;
  return firstRoll < secondRoll ? 1 : -1;
}

function selectedDistribution(skill, modifier = 0) {
  assertSkill(skill);
  assertModifier(modifier);
  const cacheKey = `${skill}:${modifier}`;
  if (distributionCache.has(cacheKey)) return distributionCache.get(cacheKey);

  const tensDice = 1 + Math.abs(modifier);
  const tensCombinations = 10 ** tensDice;
  const counts = Array(101).fill(0);

  for (let units = 0; units <= 9; units += 1) {
    for (let encoded = 0; encoded < tensCombinations; encoded += 1) {
      let remainder = encoded;
      let selected;
      for (let die = 0; die < tensDice; die += 1) {
        const candidate = d100(remainder % 10, units);
        remainder = Math.floor(remainder / 10);
        if (selected === undefined) {
          selected = candidate;
          continue;
        }
        const comparison = compareResults(skill, candidate, selected);
        if ((modifier > 0 && comparison > 0) || (modifier < 0 && comparison < 0)) {
          selected = candidate;
        }
      }
      counts[selected] += 1;
    }
  }

  const result = Object.freeze({ counts: Object.freeze(counts), total: 10 * tensCombinations });
  distributionCache.set(cacheKey, result);
  return result;
}

function unopposedSummary(skill, modifier = 0) {
  const distribution = selectedDistribution(skill, modifier);
  const counts = { critical: 0, success: 0, failure: 0, fumble: 0 };
  for (let roll = 1; roll <= 100; roll += 1) {
    counts[grade(skill, roll)] += distribution.counts[roll];
  }
  return {
    ...counts,
    total: distribution.total,
    passed: counts.critical + counts.success,
  };
}

function opposedSummary({
  attackerSkill,
  attackerModifier = 0,
  defenderSkill,
  defenderModifier = 0,
}) {
  assertSkill(attackerSkill);
  assertSkill(defenderSkill);
  const attacker = selectedDistribution(attackerSkill, attackerModifier);
  const defender = selectedDistribution(defenderSkill, defenderModifier);
  let attackerWins = 0;
  let exactTies = 0;

  for (let attackRoll = 1; attackRoll <= 100; attackRoll += 1) {
    const attackCount = attacker.counts[attackRoll];
    if (!attackCount) continue;
    for (let defenceRoll = 1; defenceRoll <= 100; defenceRoll += 1) {
      const defenceCount = defender.counts[defenceRoll];
      if (!defenceCount) continue;
      const weight = attackCount * defenceCount;
      const comparison = compareOpposed(
        { skill: attackerSkill, roll: attackRoll },
        { skill: defenderSkill, roll: defenceRoll },
      );
      if (comparison > 0) attackerWins += weight;
      if (comparison === 0) exactTies += weight;
    }
  }

  return {
    attackerWins,
    exactTies,
    defenderWins: attacker.total * defender.total - attackerWins,
    total: attacker.total * defender.total,
  };
}

function compareOpposed(attacker, defender) {
  const attackGrade = grade(attacker.skill, attacker.roll);
  const defenceGrade = grade(defender.skill, defender.roll);
  if (gradeRank[attackGrade] !== gradeRank[defenceGrade]) {
    return gradeRank[attackGrade] > gradeRank[defenceGrade] ? 1 : -1;
  }
  if (attacker.roll !== defender.roll) {
    const successful = attackGrade === 'critical' || attackGrade === 'success';
    if (successful) return attacker.roll > defender.roll ? 1 : -1;
    return attacker.roll < defender.roll ? 1 : -1;
  }
  if (attacker.skill !== defender.skill) return attacker.skill > defender.skill ? 1 : -1;
  return 0; // An exact roll/base-skill tie belongs to the defender.
}

function expectedDamage({ skill, modifier, attacks, ordinaryDamage, criticalDamage }) {
  const result = unopposedSummary(skill, modifier);
  const perAttack =
    (result.success * ordinaryDamage + result.critical * criticalDamage) / result.total;
  return perAttack * attacks;
}

function expectedD8PostArmour({ skill, fixedBonus, armour }) {
  const result = unopposedSummary(skill, 0);
  let ordinaryTotal = 0;
  for (let face = 1; face <= 8; face += 1) {
    ordinaryTotal += Math.max(0, face + fixedBonus - armour);
  }
  const ordinaryAverage = ordinaryTotal / 8;
  return (result.success * ordinaryAverage + result.critical * 8) / result.total;
}

function percent(part, total, digits = 1) {
  return `${trimFixed((part * 100) / total, digits)}%`;
}

function trimFixed(value, digits) {
  return value.toFixed(digits).replace(/\.0+$|(?<=\.[0-9]*?)0+$/u, '');
}

function modifierLabel(modifier) {
  if (modifier === 0) return 'None';
  return modifier > 0 ? `+${modifier}B` : `${modifier}P`;
}

function tierFor(cost) {
  if (cost === 2) return 'T1 narrow';
  if (cost === 3) return 'T2 standard';
  if (cost === 4) return 'T3 broad';
  if (cost === 5) return 'T4 capstone';
  if (cost === 10) return 'S1 subsystem';
  if (cost === 20) return 'S2 access';
  throw new Error(`No agreed tier for ${cost} IP.`);
}

function tableCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function markdownTable(headers, rows, alignments = []) {
  const cells = [headers, ...rows].map((row) => row.map(tableCell));
  const widths = headers.map((_, column) => Math.max(3, ...cells.map((row) => row[column].length)));
  const formatRow = (row) =>
    `| ${row
      .map((cell, column) =>
        alignments[column] === 'right'
          ? cell.padStart(widths[column])
          : cell.padEnd(widths[column]),
      )
      .join(' | ')} |`;
  const separator = widths.map((width, column) => {
    if (alignments[column] === 'right') return `${'-'.repeat(width - 1)}:`;
    if (alignments[column] === 'center') return `:${'-'.repeat(width - 2)}:`;
    return '-'.repeat(width);
  });
  return [formatRow(cells[0]), formatRow(separator), ...cells.slice(1).map(formatRow)].join('\n');
}

function buildReport() {
  const talents = readTalents();
  const roster = readCreatureRoster();
  const costCounts = new Map();
  for (const talent of talents) costCounts.set(talent.cost, (costCounts.get(talent.cost) ?? 0) + 1);
  const ordinary = talents.filter(({ cost }) => cost < 10);
  const ordinaryMean = ordinary.reduce((sum, { cost }) => sum + cost, 0) / ordinary.length;

  const unopposedRows = [25, 51, 76, 90].map((skill) => [
    `${skill}%`,
    ...[-1, 0, 1].map((modifier) => {
      const result = unopposedSummary(skill, modifier);
      return percent(result.passed, result.total, 1);
    }),
  ]);

  const opposedRows = [51, 76, 90].map((skill) => [
    `${skill}%`,
    ...[-1, 0, 1].map((modifier) => {
      const result = opposedSummary({
        attackerSkill: skill,
        attackerModifier: modifier,
        defenderSkill: skill,
        defenderModifier: 0,
      });
      return percent(result.attackerWins, result.total, 2);
    }),
  ]);

  const grappleRows = [51, 76, 90].map((skill) => {
    const bothPenalised = opposedSummary({
      attackerSkill: skill,
      attackerModifier: -1,
      defenderSkill: skill,
      defenderModifier: -1,
    });
    const heldHasLeverage = opposedSummary({
      attackerSkill: skill,
      attackerModifier: 0,
      defenderSkill: skill,
      defenderModifier: -1,
    });
    const controllerHasLeverage = opposedSummary({
      attackerSkill: skill,
      attackerModifier: -1,
      defenderSkill: skill,
      defenderModifier: 0,
    });
    return [
      `${skill}%`,
      percent(bothPenalised.attackerWins, bothPenalised.total, 2),
      percent(heldHasLeverage.attackerWins, heldHasLeverage.total, 2),
      percent(controllerHasLeverage.attackerWins, controllerHasLeverage.total, 2),
    ];
  });

  const actionRows = [76, 90].map((skill) => {
    const standard = unopposedSummary(skill, 0);
    const rapid = unopposedSummary(skill, -1);
    const rapidPass = rapid.passed / rapid.total;
    return [
      `${skill}%`,
      trimFixed(standard.passed / standard.total, 3),
      trimFixed((2 * rapid.passed) / rapid.total, 3),
      percent(1 - (1 - rapidPass) ** 2, 1, 2),
      trimFixed((2 * rapid.critical) / rapid.total, 3),
      trimFixed(standard.critical / standard.total, 3),
      percent(1 - (1 - rapid.fumble / rapid.total) ** 2, 1, 2),
    ];
  });

  const damageRows = [];
  for (const skill of [51, 76, 90]) {
    damageRows.push([
      `${skill}%`,
      'Standard shot',
      trimFixed(
        expectedDamage({ skill, modifier: 0, attacks: 1, ordinaryDamage: 4.5, criticalDamage: 8 }),
        3,
      ),
      trimFixed(
        expectedDamage({ skill, modifier: 0, attacks: 1, ordinaryDamage: 5.5, criticalDamage: 8 }),
        3,
      ),
      skill >= 76
        ? trimFixed(
            expectedDamage({
              skill,
              modifier: 0,
              attacks: 1,
              ordinaryDamage: 6.5,
              criticalDamage: 8,
            }),
            3,
          )
        : '—',
    ]);
    if (skill >= 76) {
      damageRows.push([
        `${skill}%`,
        'Rapid Shot',
        trimFixed(
          expectedDamage({
            skill,
            modifier: -1,
            attacks: 2,
            ordinaryDamage: 4.5,
            criticalDamage: 8,
          }),
          3,
        ),
        trimFixed(
          expectedDamage({
            skill,
            modifier: -1,
            attacks: 2,
            ordinaryDamage: 5.5,
            criticalDamage: 8,
          }),
          3,
        ),
        trimFixed(
          expectedDamage({
            skill,
            modifier: -1,
            attacks: 2,
            ordinaryDamage: 6.5,
            criticalDamage: 8,
          }),
          3,
        ),
      ]);
    }
  }

  const armourRows = [76, 90].flatMap((skill) =>
    [0, 2, 5, 6].map((armour) => [
      `${skill}%`,
      armour,
      ...[0, 1, 2].map((fixedBonus) =>
        trimFixed(expectedD8PostArmour({ skill, fixedBonus, armour }), 5),
      ),
    ]),
  );
  const rosterRows = [...roster.bands].map(([band, count]) => [band, count]);

  const talentRows = talents.map((talent) => {
    const [decision, finding] = assessments[talent.id];
    return [talent.title, talent.cost, tierFor(talent.cost), decision, finding];
  });
  for (const retired of retiredAssessments) {
    talentRows.push([
      retired.title,
      retired.cost,
      tierFor(retired.cost),
      retired.decision,
      retired.finding,
    ]);
  }

  const costSummary = [...costCounts.entries()]
    .sort(([left], [right]) => left - right)
    .map(([cost, count]) => `${cost} IP × ${count}`)
    .join('; ');
  const additionalOutcome = unopposedSummary(51, -2);
  const additionalOutcomeSuccess = percent(additionalOutcome.passed, additionalOutcome.total, 1);
  const additionalOutcomeBacklash = percent(
    additionalOutcome.total - additionalOutcome.passed,
    additionalOutcome.total,
    1,
  );
  const ordinaryMeanLabel = trimFixed(ordinaryMean, 2);
  const shapingEquivalent = trimFixed(20 / ordinaryMean, 2);
  const tierRows = [
    ['T1 narrow', '2 IP', 'Narrow permission, safeguard, or removal of one named penalty'],
    ['T2 standard', '3 IP', 'Reusable domain technique or bounded passive benefit'],
    [
      'T3 broad',
      '4 IP',
      'Broad reliability, Expert option, campaign permission, or a substantially bounded action multiplier',
    ],
    ['T4 capstone', '5 IP', 'Peak capstone or less-bounded action multiplier'],
    ['S1 subsystem', '10 IP', 'A bounded supernatural production subsystem'],
    ['S2 access', '20 IP', 'Entry to a full supernatural rules engine'],
  ];

  return `<!-- Generated by scripts/analyze-talent-balance.mjs. Do not hand-edit. -->

# Talent balance audit

This is a deterministic audit of the 51 published player Talents. It records the approved
keep/change decisions against the pre-rebalance rules; **Change** means the corrective design
now represented in the working rules, not an outstanding edit, and **Add** marks a Talent
introduced after that audit. Sure Hand, Committed Strike, and Deadeye are shown as legacy
**Retire** decisions outside the current 51.

## Method and assumptions

- The statistical model exactly enumerates the shared-units procedure in
  [Bonus and Penalty dice](../../src/content/rules/skills/bonus-and-penalty-dice.md): one units
  die is paired with every tens die, candidates are graded, and the best/worst outcome is kept.
- Outcome order is Critical > Success > Failure > Fumble. Higher rolls are better within a
  successful grade; lower rolls are better within Failure or Fumble.
- Opposed contestants select their own result first. Grade, roll, and base skill are then
  compared; the defender wins an exact roll/base-skill tie.
- Every number is an exhaustive integer count, not a simulation. A normal test has 100 equally
  likely inputs; a one-die modified test has 1,000. Opposed counts are the Cartesian product of
  the two exact distributions.
- Damage examples use an unopposed, ready shortbow (1D8), no Aim, Damage Modifier, armour, or
  other modifier. Ordinary hits average 4.5. An unopposed Critical deals 8 and, under the combat
  matrix, does not add Favoured/Signature Weapon damage. Rapid Shot makes two independent -1P
  attacks and forfeits all Reactions.

## Pricing framework and opportunity cost

${markdownTable(['Tier', 'Price', 'Calibration'], tierRows, ['left', 'right', 'left'])}

Published costs are ${costSummary}. The 48 Talents below 10 IP average ${ordinaryMeanLabel} IP.
Shaping therefore costs about ${shapingEquivalent} ordinary Talents, consumes 20 of the maximum 22 starting IP,
and requires converting at least 50 of the 225 starting pool points when bought at creation.
Keeping its 20-IP price preserves dedication; letting a declared starting Shaper allocate up to
30 Knowledge points to the new skill makes that sacrifice visible and playable rather than
leaving the character at only INT + POW.

## Exact test probabilities

The first table is the chance to achieve any Success, including a Critical. It supplies the key
calibration points directly: 51% becomes 26.1/51/75.9, 76% becomes 58/76/94, and 90% becomes
81/90/99 under -1P/none/+1B.

${markdownTable(['Skill', '-1P', 'None', '+1B'], unopposedRows)}

The next table is the attacker's chance to win against an equal-skill, unmodified defender.
The corrected outcome-aware chooser produces the intended roughly 33/49.5/66 progression;
the small skill-dependent differences are exact.

${markdownTable(['Equal skill', 'Attacker -1P', 'Attacker none', 'Attacker +1B'], opposedRows)}

## Grapple and action-economy context

An equal-skill initial grapple uses the middle opposed column above. Once held, both participants
suffer -1P. With equal limb commitment, the escaping attacker therefore faces -1P versus -1P.
A second committed limb cancels its owner's grapple penalty: if only the held participant commits
it, use none versus -1P; if only the controller commits it, use -1P versus none.

${markdownTable(
  [
    'Skill',
    'Equal limbs (-1P vs -1P)',
    'Held has leverage (none vs -1P)',
    'Controller has leverage (-1P vs none)',
  ],
  grappleRows,
)}

Rapid Shot is not two ordinary attacks. At its 76% prerequisite it raises expected hits only from
0.76 to 1.16, suppresses expected Criticals from 0.07 to 0.014, and forfeits defence. Its scaling
at 90% is much stronger, which supports the change from 3 to 4 IP. “At least one” assumes the two
attack tests are independent. Two penalised rolls also raise the chance of any Fumble from 2% to
7.46%.

${markdownTable(
  [
    'Skill',
    'Standard expected hits',
    'Rapid expected hits',
    'Rapid at least one hit',
    'Rapid expected Criticals',
    'Standard expected Criticals',
    'Rapid any Fumble',
  ],
  actionRows,
)}

Expected pre-defence damage shows the interaction with Favoured and Signature Weapon. Each +1
applies to every ordinary damaging hit, so Rapid Shot multiplies it; it does not apply to an
unopposed Critical. Favoured plus Signature costs 7 IP for the full +2 progression.

${markdownTable(['Skill', 'Action', 'No weapon Talent', 'Favoured (+1)', 'Signature (+2)'], damageRows)}

### Armour and creature-roster calibration

The live creature catalogue contains ${roster.total} creature records. ${roster.numeric} have a numeric AP profile,
including the Elemental rank table; the remaining ${roster.total - roster.numeric} are incorporeal Spirits with no
numeric AP. Conditional profiles are assigned to the band containing their highest listed AP, so
every creature is counted once.

${markdownTable(['Highest listed AP band', 'Creature records'], rosterRows, ['left', 'right'])}

The next table exactly convolves every D8 face after AP for a standard unopposed shortbow attack.
Favoured's +1 and Signature's +2 apply before AP on ordinary hits. Criticals contribute 8 damage,
ignore AP, and omit the fixed Talent bonus. AP 0, 2, 5, and 6 represent the unarmoured, common
light, heavily protected, and top common roster points; Dragon and Golem extend beyond them.

${markdownTable(['Skill', 'AP', 'No weapon Talent', 'Favoured (+1)', 'Signature (+2)'], armourRows, ['left', 'right', 'left', 'left', 'left'])}

## Additional Shaping outcomes versus Talent adjustments

Additional outcomes should remain a Magnitude cost, not gain a Talent gate. Each outcome already
pays its own lowest applicable Intensity, distinct outcomes cannot repeat a cumulative effect, and
the summed Magnitude raises PP cost, overreach, commitment, and Dispel strength. For example,
Alter·Flesh healing at I3 plus Resilience at I2 is M5 before Range, Duration, Reach, or adjustments.
At Shaping 51%, that is Safe +2: only ${additionalOutcomeSuccess} raw success and ${additionalOutcomeBacklash}
Backlash on failure. Requiring a Talent as well would double-charge a generic composition rule.

Keep Talents for learned rule exceptions: Selective breaks the default that areas include allies;
Indirect crosses a barrier; Trigger changes when an effect fires; Veiled conceals the mandatory
Tell. Their IP buys access while Magnitude prices each use. Direct Harm likewise remains +1
Magnitude because it is a delivery route, not training. If play reveals excessive double taxation,
the first lever should be removing Selective's or Trigger's flat +1 Magnitude—not Talent-gating
additional outcomes.

## Talent-by-Talent decision record

All 51 published Talents appear once below. Sure Hand, Committed Strike, and Deadeye are the legacy retirements.

${markdownTable(['Talent', 'IP', 'Tier', 'Decision', 'Audit finding'], talentRows)}

## Reproduction

Run \`node scripts/analyze-talent-balance.mjs\` to print this report,
\`node scripts/analyze-talent-balance.mjs --write\` to regenerate it, or
\`node scripts/analyze-talent-balance.mjs --check\` to fail when the committed report differs.
`;
}

function usage() {
  return `Usage: node scripts/analyze-talent-balance.mjs [--check|--write]\n`;
}

const args = process.argv.slice(2);
if (args.length > 1 || (args[0] && !['--check', '--write', '--help'].includes(args[0]))) {
  process.stderr.write(usage());
  process.exitCode = 2;
} else if (args[0] === '--help') {
  process.stdout.write(usage());
} else {
  const report = buildReport();
  if (args[0] === '--write') {
    mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, report, 'utf8');
    process.stdout.write(`Wrote ${path.relative(repoRoot, reportPath)}\n`);
  } else if (args[0] === '--check') {
    let current = '';
    try {
      current = readFileSync(reportPath, 'utf8').replaceAll('\r\n', '\n');
    } catch {
      // The comparison below reports the same actionable regeneration command for a missing file.
    }
    if (current !== report) {
      process.stderr.write(
        'Talent balance report is stale. Run `node scripts/analyze-talent-balance.mjs --write`.\n',
      );
      process.exitCode = 1;
    } else {
      process.stdout.write('Talent balance report is current.\n');
    }
  } else {
    process.stdout.write(report);
  }
}
