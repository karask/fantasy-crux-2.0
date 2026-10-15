import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

function cleanCell(cell) {
  return cell
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replaceAll('**', '')
    .replaceAll('`', '')
    .trim();
}

function tableWithHeader(markdown, firstHeader) {
  const table = [...markdown.matchAll(/(?:^\|.*\|\r?\n){2,}/gm)]
    .map((match) =>
      match[0]
        .trim()
        .split(/\r?\n/)
        .map((line) => line.split('|').slice(1, -1).map(cleanCell)),
    )
    .find((rows) => rows[0][0] === firstHeader);
  return table && { header: table[0], body: table.slice(2) };
}

describe('combat quick references', () => {
  const reactions = read('src/content/rules/combat/attacks-and-reactions.md');
  const activeGuard = read('src/content/rules/combat/active-guard.md');
  const offHand = read('src/content/rules/combat/off-hand-options.md');

  it('answers which defence stops which attack, matching the defence rules', () => {
    expect(tableWithHeader(reactions, 'Incoming attack')).toEqual({
      header: [
        'Incoming attack',
        'Dodge',
        'Parry with a weapon',
        'Parry with a shield',
        'Armour (AP)',
      ],
      body: [
        ['Close weapon or unarmed attack', 'Yes', 'Yes', 'Yes', 'Yes'],
        [
          'Thrown weapon, such as a dagger or javelin',
          'Yes, -1P',
          'Yes, -1P, with Active Guard',
          'Yes, with Active Guard',
          'Yes',
        ],
        [
          'Arrow, crossbow bolt, or sling stone',
          'Yes, -1P',
          'No',
          'Yes, -1P, with Active Guard',
          'Yes',
        ],
        [
          'Projected Shaping at one target, such as a firebolt',
          'Yes, -1P',
          'No',
          'Yes, -1P, with Active Guard',
          'Yes',
        ],
        ['Projected Shaping over an area, such as a frost burst', 'Yes, -1P', 'No', 'No', 'Yes'],
        ['Direct Shaping, such as searing heat', 'No', 'No', 'No', 'No: only magical Wards count'],
      ],
    });
    expect(reactions).toMatch(/Direct Shapings[^.]*Resilience or Persistence/i);
    expect(reactions).toMatch(/critical hits\*\* ignore armour; critical Shapings do not/i);
  });

  it('lets the extra off-hand Reaction make an Active Guard with both modifiers', () => {
    expect(offHand).toMatch(/extra Parry[^.]*`-1P`\. The Parry can be an \[Active Guard\]/i);
    expect(activeGuard).toMatch(/extra off-hand Reaction[^.]*Active Guard\. Its `-1P` adds/i);
  });
});

describe('Shaping limits by expertise', () => {
  const building = read('src/content/rules/magic/building-a-shaping.md');

  it('derives the casting ceilings from Safe Magnitude', () => {
    const limits = tableWithHeader(building, 'Shaping');
    expect(limits.header).toEqual([
      'Shaping',
      'Expertise',
      'Maximum Intensity',
      'Safe Magnitude',
      'Highest Magnitude without a ritual',
      'Highest Magnitude with a ritual',
    ]);
    expect(limits.body.map((row) => row[1])).toEqual([
      'Novice',
      'Apprentice',
      'Veteran',
      'Expert',
      'Master',
    ]);
    for (const [, , maximum, safe, normal, ritual] of limits.body) {
      const safeMagnitude = Number(safe);
      expect(Number(maximum)).toBe(safeMagnitude);
      expect(Number(normal)).toBe(safeMagnitude + 2);
      expect(Number(ritual)).toBe(Math.max(safeMagnitude + 2, safeMagnitude * 2));
    }
  });
});

describe('rulings confirmed during the plain-English rewrite', () => {
  const position = read('src/content/rules/combat/position-and-mounted-combat.md');
  const rounds = read('src/content/rules/combat/rounds-and-actions.md');
  const reactions = read('src/content/rules/combat/attacks-and-reactions.md');
  const casting = read('src/content/rules/magic/casting-and-defence.md');
  const ongoing = read('src/content/rules/magic/ongoing-and-magical-actions.md');
  const paths = read('src/content/rules/magic/techniques-and-forms.md');

  it('applies higher ground and prone to the affected character', () => {
    expect(position).toMatch(/higher ground\s*\|\s*`\+1B` to that side/);
    expect(position).toMatch(/is prone\s*\|\s*`-1P` to that side/);
    expect(position).toMatch(
      /prone defender gives the attacker `\+1B` and takes `-1P` on its own Reaction/,
    );
  });

  it('lets the Gamemaster judge how an intimidated enemy gives way', () => {
    expect(rounds).toMatch(/If you win, the Gamemaster decides how the enemy gives way/);
    expect(rounds).toMatch(
      /full strength rarely just flee[^.]*\. They are more likely to hesitate and lose a turn/,
    );
    expect(rounds).toMatch(
      /only a Critical Influence against a failed Persistence forces a surrender/,
    );
  });

  it('keeps every Reaction on a Withdraw', () => {
    expect(rounds).toMatch(/\[Withdraw\]\(#withdraw\)\s*\|\s*Used\s*\|\s*Used\s*\|\s*Kept\s*\|/);
    expect(rounds).toMatch(/You keep your base Reaction and any extra off-hand Reaction/);
  });

  it('rounds halves up', () => {
    expect(reactions).toMatch(/blocked half rounds up/i);
    expect(casting).toMatch(/Half Magnitude rounds up/);
    expect(casting).toMatch(/blocks half that outcome's damage, rounded up/);
  });

  it('opposes Dispel with a Shaping check for the original Shaper', () => {
    expect(ongoing).toMatch(
      /roll a Shaping check for the original Shaper, against their current unmodified Shaping/,
    );
    expect(ongoing).toMatch(/`10 × original Magnitude`, maximum 100%/);
  });

  it('limits unwilling Bend·Paths moves at Intensity 2', () => {
    expect(paths).toMatch(
      /Intensity 2 moves a willing subject within Range, or an unwilling one up to 3 metres/,
    );
  });
});
