import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const rulesRoot = path.resolve('src/content/rules');

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(location);
    return entry.name.endsWith('.md') ? [location] : [];
  });
}

const records = markdownFiles(rulesRoot).map((file) => {
  const parsed = matter(readFileSync(file, 'utf8'));
  return { file, ...parsed };
});

const recordById = (id) => records.find((record) => record.data.id === id);
const talentById = (id) => {
  const record = recordById(id);
  expect(record, `${id} should be published`).toBeDefined();
  return record;
};

describe('approved Talent rebalance', () => {
  it('publishes a 51-Talent catalogue without Sure Hand or player Mastery', () => {
    const titles = records
      .filter((record) => record.data.type === 'talent')
      .map((record) => record.data.title);

    expect(titles).toHaveLength(51);
    expect(titles).toContain('Weapon Expertise');
    expect(titles).not.toContain('Mastery');
    expect(titles).not.toContain('Sure Hand');
    expect(records.some((record) => record.data.id === 'talent.sure-hand')).toBe(false);
  });

  it('recasts the immutable Mastery record as once-per-round Weapon Expertise', () => {
    const expertise = talentById('talent.mastery');
    const text = expertise.content;

    expect(expertise.data).toMatchObject({
      title: 'Weapon Expertise',
      slug: 'weapon-expertise',
      cost: 4,
      activation: 'passive',
    });
    expect(expertise.data.prerequisites).toMatch(/Close Combat or Ranged Combat at 76%/i);
    expect(expertise.data.prerequisites).toMatch(/used by the chosen weapon/i);
    expect(text).toMatch(/choose (?:one )?(?:exact )?weapon type/i);
    expect(text).toMatch(/weapon table/i);
    expect(text).toMatch(/at least 76%[^.]*skill used to attack with it/i);
    expect(text).toMatch(/actual unmodified base (?:combat )?skill/i);
    expect(text).toMatch(/declare[^.]*before (?:you )?roll/i);
    expect(text).toMatch(/once per character per round/i);
    expect(text).toMatch(/across all (?:of )?your Weapon Expertise purchases/i);
    expect(text).toMatch(/attack[^.]*Parry[^.]*Active Guard[^.]*Opportunity Attack/is);
    expect(text).toMatch(/after[^.]*Bonus and Penalty[^.]*cancell/i);
    expect(text).toMatch(/before[^.]*cap/i);
    expect(text).toMatch(/remove one remaining Penalty die/i);
    expect(text).toMatch(/never creates? (?:a )?Bonus die/i);
    expect(text).toMatch(/Rapid Shot[^.]*ineligible/i);
    expect(text).toMatch(/off-hand[^.]*ineligible/i);
    expect(text).toMatch(/does not[^.]*Unarmed[^.]*natural[^.]*Shaping/is);
    expect(text).toMatch(/improvised/i);
    expect(text).toMatch(/different weapon types/i);
    expect(text).toMatch(/one test[^.]*once/i);
    expect(text).toMatch(/dual-profile[^.]*relevant[^.]*skill/i);
  });

  it('prices action multipliers and defines Point-Blank Shot and Rally exactly', () => {
    const rapidShot = talentById('talent.rapid-shot');
    const pointBlank = talentById('talent.point-blank-shot');
    const rally = talentById('talent.rally');

    expect(rapidShot.data.cost).toBe(4);
    expect(pointBlank.data.cost).toBe(3);
    expect(pointBlank.content).toContain('-2P');
    expect(pointBlank.content).toMatch(/max\s*\(\s*0\s*,\s*N\s*[−-]\s*1\s*\)/i);
    expect(pointBlank.content).toMatch(/N[^.]*(?:engaging enem|enemies engaging)/i);
    expect(pointBlank.content).toMatch(
      /at (?:the time of|attack time|the moment of) (?:each )?attack/i,
    );

    expect(rally.data.cost).toBe(4);
    expect(rally.content).toMatch(/two allies/i);
    expect(rally.content).toMatch(/hear and understand/i);
    expect(rally.content).toMatch(/next single test/i);
    expect(rally.content).toMatch(/before the end of (?:each|that) ally's next turn/i);
    expect(rally.content).toMatch(/consum/i);
    expect(rally.content).toMatch(/maximum of one Rally benefit/i);
    expect(rally.content).toMatch(/new[^.]*replaces/i);
    expect(rally.content).toMatch(/Only one Rally[^.]*test/i);
    expect(rally.content).toMatch(/cannot Rally yourself/i);
  });
});

describe('base Grapple state machine', () => {
  it('distinguishes one controller from the held participant and accounts for limbs', () => {
    const grapple = recordById('combat.grappling');
    expect(grapple).toBeDefined();
    const text = grapple.content;

    expect(text).toMatch(/one controller/i);
    expect(text).toMatch(/held (?:character|participant|target)/i);
    expect(text).toMatch(/free[^.]*usable[^.]*limb/i);
    expect(text).toMatch(/commit[^.]*limb/i);
    expect(text).toMatch(/second (?:usable )?limb[^.]*\+1B/i);
    expect(text).toMatch(/commit[^.]*second[^.]*before[^.]*establish/i);
    expect(text).toMatch(/\+1B[^.]*establish[^.]*escape[^.]*Wrestler/is);
    expect(text).toMatch(/add or release[^.]*start of (?:your|their) (?:own )?turn/i);
    expect(text).toMatch(/cannot release[^.]*last[^.]*without ending/i);
    expect(text).toMatch(/only the controller[^.]*release[^.]*freely/i);
    expect(text).toMatch(/held[^.]*must escape/i);
  });

  it('defines every ending route, help, and the weapon-Parry consequence', () => {
    const text = recordById('combat.grappling').content;

    expect(text).toMatch(/failed[^.]*establish[^.]*free/i);
    expect(text).toMatch(/successful escape[^.]*separation[^.]*incapac/is);
    expect(text).toMatch(/loss of[^.]*last committed limb/i);
    expect(text).toMatch(/already (?:held|controlled)[^.]*cannot[^.]*independent/i);
    expect(text).toMatch(/combined Assistance/i);
    expect(text).toMatch(/helper[^.]*commit[^.]*limb/i);
    expect(text).toMatch(/helper[^.]*never[^.]*controller/i);
    expect(text).toMatch(/target wins[^.]*successful weapon Parry/is);
    expect(text).toMatch(/1 HP[^.]*ignoring AP/i);
    expect(text).toMatch(/only[^.]*establish/i);
    expect(text).toMatch(/failed[^.]*Parry[^.]*deals no damage/i);
  });

  it('limits occupied limbs and applies bounded situational modifiers', () => {
    const text = recordById('combat.grappling').content;

    expect(text).toMatch(/committed limb[^.]*cannot[^.]*attack[^.]*Parry/is);
    expect(text).toMatch(/committed limb[^.]*off-hand/is);
    expect(text).toMatch(/Unarmed[^.]*ready Light one-handed weapon/is);
    expect(text).toMatch(/cannot take a Movement Action/i);
    expect(text).toContain('-1P');
    expect(text).toMatch(/Size[^.]*anatomy[^.]*footing/i);
    expect(text).toMatch(/one clear circumstance[^.]*\+1B[^.]*-1P/is);
    expect(text).toMatch(/overwhelming[^.]*\+2[^.]*\+3[^.]*impossible/is);
    expect(text).toMatch(/never[^.]*both[^.]*Bonus[^.]*Penalty/is);
    expect(text).toMatch(/second limb[^.]*separate/i);
  });

  it('keeps the generated statistical audit synchronized with the catalogue', () => {
    expect(() =>
      execFileSync(process.execPath, ['scripts/analyze-talent-balance.mjs', '--check'], {
        cwd: path.resolve('.'),
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });
});

describe('Talent edge-case rulings', () => {
  it('gives Cutpurse a defined ordinary-time baseline to compress', () => {
    const practical = recordById('skills.practical').content;
    const cutpurse = talentById('talent.cutpurse').content;

    expect(practical).toMatch(/pickpocket[^.]*plant[^.]*small item/i);
    expect(practical).toMatch(/sustained access[^.]*one minute|one minute[^.]*sustained access/i);
    expect(cutpurse).toMatch(/instead of[^.]*one minute|one minute[^.]*one Combat Action/i);
  });

  it('limits Ambusher and unarmed damage Talents to their intended attacks', () => {
    const ambusher = talentById('talent.ambusher').content;
    const ironFist = talentById('talent.iron-fist').content;
    const masterBrawler = talentById('talent.master-brawler').content;

    expect(ambusher).toMatch(/Close Combat, Ranged Combat, or Unarmed Combat/i);
    expect(ambusher).toMatch(/not Shaping/i);
    for (const text of [ironFist, masterBrawler]) {
      expect(text).toMatch(/ordinary (?:fists|punches)[^.]*kicks/i);
      expect(text).toMatch(/never[^.]*listed natural weapon/i);
    }
  });

  it('makes Subdue damage thresholds independent of Talent damage bonuses', () => {
    const subdue = talentById('talent.subdue').content;

    expect(subdue).toMatch(/listed weapon(?: or unarmed)? damage[^.]*Damage Modifier/i);
    expect(subdue).toMatch(/Talent damage bonuses[^.]*do not/i);
    expect(subdue).toMatch(/threshold[^.]*fallback|fallback[^.]*threshold/i);
  });

  it('removes only one named casting penalty and bars impossible Disarms', () => {
    const steadyCasting = talentById('talent.steady-casting').content;
    const disarm = talentById('talent.disarm').content;

    expect(steadyCasting).toMatch(/ignore one total Penalty die/i);
    expect(steadyCasting).toMatch(/Wounded or grappled/i);
    expect(steadyCasting).toMatch(/before[^.]*Bonus and Penalty[^.]*cancell/i);
    expect(steadyCasting).toMatch(/both[^.]*only one/i);

    expect(disarm).toMatch(/fused/i);
    expect(disarm).toMatch(/fixed/i);
    expect(disarm).toMatch(/secure/i);
    expect(disarm).toMatch(/anatomically impossible/i);
  });
});
