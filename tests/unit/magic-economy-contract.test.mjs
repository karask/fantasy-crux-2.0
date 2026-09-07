import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('advancement and Shaping investment', () => {
  const improvement = read('src/content/rules/characters/improvement.md');
  const becoming = read('src/content/rules/magic/becoming-a-shaper.md');
  const building = read('src/content/rules/magic/building-a-shaping.md');
  const casting = read('src/content/rules/magic/casting-and-defence.md');
  const magicHub = read('src/content/rules/magic/index.md');

  it('publishes the canonical one-IP skill progression and a practical award pace', () => {
    expect(improvement).toMatch(/0[–-]50%[^\n]*\+5%/i);
    expect(improvement).toMatch(/51[–-]99%[^\n]*\+3%/i);
    expect(improvement).toMatch(/100%[^.]*cannot be improved|cannot improve[^.]*100%/i);
    expect(improvement).toMatch(/3(?:[–-]| to )5 IP per adventure/i);
  });

  it('lets a starting Shaper reserve the Talent before allocating Knowledge points', () => {
    expect(becoming).toMatch(
      /(?:declare|reserve)[^.]*(?:20 IP|Shaping Talent)[^.]*before[^.]*skill (?:point )?allocation/i,
    );
    expect(becoming).toMatch(/up to 30[^.]*Knowledge[^.]*points[^.]*Shaping/i);
    expect(becoming).toMatch(/base[^.]*`?INT \+ POW`?/i);
    expect(becoming).toMatch(/(?:still|remains)[^.]*sacrifice|trading[^.]*skill points[^.]*20 IP/i);
  });

  it('prices every additional outcome at its own lowest applicable Intensity', () => {
    expect(magicHub).toMatch(/for each[^.]*outcome[^.]*Intensity/i);
    expect(magicHub).toMatch(/shared[^.]*Range[^.]*Duration[^.]*Reach[^.]*once/i);
    expect(building).toMatch(/each outcome[^.]*own[^.]*lowest[^.]*Intensity/i);
    expect(building).toMatch(/sum[^.]*each outcome(?:'s)?[^.]*Intensity/i);
    expect(building).toMatch(/no (?:individual )?outcome[^.]*exceed[^.]*maximum Intensity/i);
    expect(building).toMatch(/shared Range, Duration, and Reach count once/i);
    expect(building).toMatch(
      /heal(?:ing)?[^\n.]*I3[^\n.]*resilien(?:ce|t)[^\n.]*I2[^\n.]*touch[^\n.]*M5/i,
    );
    expect(casting).toMatch(/each Projected outcome[^.]*own Intensity[^.]*Impact Size/i);
    expect(casting).toMatch(/outcomes share[^.]*guard roll[^.]*each outcome[^.]*separately/i);
    expect(casting).toMatch(/Backlash[^.]*highest outcome Intensity/i);
    expect(casting).toMatch(/Counter or Dispel[^.]*target[^.]*highest outcome Intensity/i);
  });
});

describe('Enchanter capacity and attribution', () => {
  const enchanter = read('src/content/rules/talents/enchanter.md');
  const enchantedItems = read('src/content/rules/gm-tools/enchanted-items.md');
  const minorNpcs = read('src/content/rules/gm-tools/minor-npcs.md');
  const ongoing = read('src/content/rules/magic/ongoing-and-magical-actions.md');
  const rituals = read('src/content/rules/magic/rituals-and-examples.md');

  it('derives capacity from permanent unmodified POW', () => {
    expect(enchanter).toMatch(/Enchantment Capacity[^.]*permanent,? unmodified POW/i);
    expect(enchanter).toMatch(/temporary[^.]*POW[^.]*does not (?:change|affect)[^.]*capacity/i);
    expect(enchanter).toMatch(/permanent[^.]*POW[^.]*recalculat(?:es|e)[^.]*capacity/i);
  });

  it('replaces both PP commitment and active Magnitude for bound enchantments', () => {
    expect(enchanter).toMatch(
      /Duration 4[^.]*Mythic Duration 5[^.]*(?:neither|leaves?)[^.]*PP commitment[^.]*active total/i,
    );
    expect(ongoing).toMatch(/tied anchors[\s\S]{0,100}Enchantment Capacity[^.]*only exception/i);
    expect(enchantedItems).toMatch(
      /With[^.]*Enchanter[^.]*either route[^.]*Enchantment Capacity[^.]*(?:neither|leaves?)[^.]*PP commitment[^.]*active total/i,
    );
    expect(rituals).toMatch(/With[^.]*Enchanter[^.]*Capacity[^.]*not[^.]*active total/i);
  });

  it('keeps a mythic price separate from creator commitments', () => {
    expect(enchantedItems).toMatch(
      /Without Enchanter[^.]*either route[^.]*maximum Power Points[^.]*Magnitude[^.]*active total/i,
    );
    expect(enchantedItems).toMatch(/mythic lasting price[^.]*(?:never|does not)[^.]*commitment/i);
    expect(enchanter).toMatch(
      /both Duration 4[^.]*Duration 5[^.]*commit maximum PP[^.]*Magnitude[^.]*active total/i,
    );
    expect(ongoing).toMatch(
      /permanent anchored enchantment[^.]*without Enchanter[^.]*commits full Magnitude/i,
    );
    expect(rituals).toMatch(
      /price[^.]*never reduces[^.]*Magnitude[^.]*PP commitment[^.]*active total[^.]*Enchantment Capacity[^.]*Dispel strength/i,
    );
  });

  it('expresses the minor-NPC enchanted item in complete Shaping notation', () => {
    expect(minorNpcs).toMatch(
      /Warding Amulet[^\n]*Ward·Force\/Motion[^\n]*I1[^\n]*D4[^\n]*M5[^\n]*continuous[^\n]*2 AP/i,
    );
    expect(minorNpcs).toMatch(/Magnitude 5 continuous enchantment/i);
    expect(minorNpcs).toMatch(/bearer commits 5 maximum PP/i);
    expect(minorNpcs).toMatch(/does not add to worn armour[^.]*whichever is higher/i);
    expect(minorNpcs).toMatch(/amulet[^.]*vulnerable anchor/i);
  });

  it('charges every extant effect to its original creator', () => {
    expect(enchanter).toMatch(/Continuous or Activated effect[^.]*full final Magnitude once/i);
    expect(enchanter).toMatch(
      /Every unused charge[^.]*Charged effect[^.]*full final Magnitude separately/i,
    );
    expect(enchanter).toMatch(/attributed[^.]*original (?:creator|maker)/i);
    expect(enchanter).toMatch(/sale,? theft,? (?:or )?gift|sold,? stolen,? (?:or )?given/i);
    expect(enchanter).toMatch(/(?:each|every)[^.]*Shaping[^.]*layer[^.]*separately/i);
    expect(enchanter).toMatch(/multiple Enchanters|more than one Enchanter|multi-enchanter/i);
    expect(enchanter).toMatch(
      /(?:ritual )?(?:helpers?|contributors?)[^.]*(?:never|do not) (?:inherit|take|gain)[^.]*capacity/i,
    );
  });

  it('checks capacity on every way an enchantment can grow', () => {
    expect(enchanter).toMatch(/creation,? restoration,? (?:or )?(?:a )?Magnitude increase/i);
    expect(enchanter).toMatch(/must fit[^.]*capacity/i);
    expect(enchanter).toMatch(/Mythic[^.]*counts|no[^.]*Mythic[^.]*exemption/i);
  });

  it('frees capacity only when the enchantment actually ends', () => {
    expect(enchanter).toMatch(
      /capacity[^.]*frees?[^.]*permanently ends|permanently ends[^.]*capacity/i,
    );
    expect(enchanter).toMatch(/Dispelled/i);
    expect(enchanter).toMatch(/anchor[^.]*destroyed/i);
    expect(enchanter).toMatch(/stored charge[^.]*used/i);
    expect(enchanter).toMatch(/Using a charge frees that charge's capacity/i);
    expect(enchanter).toMatch(/Activated use does not end[^.]*reusable enchantment/i);
    expect(enchanter).toMatch(
      /temporary suppression[^.]*continues? to count|suppressed[^.]*still counts/i,
    );
    expect(enchanter).toMatch(
      /permanent POW loss[\s\S]{0,500}over[^.]*capacity[\s\S]{0,500}persist[\s\S]{0,500}no new[\s\S]{0,500}restor(?:e|ation)[\s\S]{0,500}increase/i,
    );
  });
});

describe('enchanted-item operation and Trigger timing', () => {
  const items = read('src/content/rules/gm-tools/enchanted-items.md');
  const trigger = read('src/content/rules/talents/trigger.md');

  it('separates Continuous, Activated, and Charged resource models', () => {
    expect(items).toMatch(/\| \*\*Continuous\*\*[^\n]*commits the bearer's maximum PP/i);
    expect(items).toMatch(/\| \*\*Activated\*\*[^\n]*bearer pays PP equal to Magnitude/i);
    expect(items).toMatch(/\| \*\*Charged\*\*[^\n]*Prepaid by the maker/i);
    expect(items).not.toMatch(/\| \*\*Triggered\*\*/i);
    expect(items).not.toMatch(/\| \*\*Consumable\*\*/i);
    expect(items).toMatch(/potion or scroll[^.]*one-charge Charged item/i);
    expect(items).toMatch(/multi-charge item[^.]*last charge/i);
  });

  it('uses Trigger as paid timing for an Activated or Charged use', () => {
    expect(items).toMatch(/Activated or Charged effect normally resolves immediately/i);
    expect(items).toMatch(/includes \[Trigger\][^.]*activation instead arms one use/i);
    expect(items).toMatch(/observable event is fixed when the item is made/i);
    expect(items).toMatch(/target[^.]*use-specific choices[^.]*when the use is armed/i);
    expect(items).toMatch(/fires once[^.]*without another Action/i);
    expect(items).toMatch(/Arming spends the PP or charge[^.]*never occurs[^.]*wait expires/i);
    expect(items).toMatch(/Continuous effects cannot include Trigger/i);
    expect(trigger).toMatch(/Activated or Charged effect arms one use/i);
    expect(trigger).toMatch(/Trigger expires without firing/i);
  });
});

describe('Active Magnitude coverage', () => {
  const ongoing = read('src/content/rules/magic/ongoing-and-magical-actions.md');
  const becoming = read('src/content/rules/magic/becoming-a-shaper.md');
  const improvement = read('src/content/rules/characters/improvement.md');

  it('uses INT for sustained complexity and retains POW for magical fuel', () => {
    expect(ongoing).toMatch(/Active Magnitude cannot exceed permanent, unmodified INT/i);
    expect(ongoing).not.toMatch(/Active Magnitude cannot exceed permanent, unmodified POW/i);
    expect(ongoing).toMatch(/INT represents the complexity[^.]*POW supplies the PP/i);
    expect(ongoing).toMatch(/temporary change to INT[^.]*does not affect[^.]*limit/i);
    expect(ongoing).toMatch(/permanent change[^.]*recalculates/i);
    expect(becoming).toMatch(/INT and POW both establish the Shaping skill/i);
    expect(becoming).toMatch(/INT limits total[^.]*Active Magnitude[^.]*POW sets maximum PP/i);
    expect(improvement).toMatch(/recalculate derived attributes[^.]*Active Magnitude limit/i);
  });

  it('counts every ongoing Shaping and names the newer ongoing outcomes', () => {
    expect(ongoing).toMatch(/Every ongoing Shaping counts its full Magnitude/i);
    expect(ongoing).toMatch(
      /movement modes[^.]*senses[^.]*concealment[^.]*conditions[^.]*vitality reserves[^.]*waiting Triggers/i,
    );
    expect(ongoing).toMatch(/Enchantment Capacity[^.]*only exception/i);
    expect(ongoing).toMatch(
      /instant effects[^.]*completed permanent transformations[^.]*no longer ongoing/i,
    );
  });
});

describe('travel and practical Talent procedures', () => {
  const travel = read('src/content/rules/adventuring/travel.md');
  const wayfinder = read('src/content/rules/talents/wayfinder.md');
  const alchemist = read('src/content/rules/talents/alchemist.md');
  const poisoner = read('src/content/rules/talents/poisoner.md');
  const weakPoint = read('src/content/rules/talents/weak-point.md');

  it('resolves uncertain navigation once per travel day or changed route', () => {
    expect(travel).toMatch(
      /(?:Natural Lore[\s\S]{0,160}once[\s\S]{0,160}(?:uncertain )?travel day|once[\s\S]{0,160}(?:uncertain )?travel day[\s\S]{0,160}Natural Lore)/i,
    );
    expect(travel).toMatch(
      /material(?:ly)?[^.]*route[^.]*change|route[^.]*material(?:ly)? changes/i,
    );
    expect(travel).toMatch(/success[^.]*full progress/i);
    expect(travel).toMatch(/failure[^.]*one quarter[^.]*progress/i);
    expect(travel).toMatch(/fumble[^.]*no progress[^.]*lost/i);
  });

  it('makes Wayfinder a bounded navigation safeguard', () => {
    expect(wayfinder).toMatch(/see the sky|read the ground/i);
    expect(wayfinder).toMatch(/downgrade[^.]*Fumble[^.]*ordinary Failure/i);
    expect(wayfinder).toMatch(/(?:prevents?|not) [^.]*lost/i);
    expect(wayfinder).toMatch(/does not[^.]*other (?:travel )?hazards/i);
  });

  it('fully specifies an alchemical-fire attack', () => {
    expect(alchemist).toMatch(/ready Light flask/i);
    expect(alchemist).toMatch(/Ranged Combat/i);
    expect(alchemist).toMatch(/Range[^.]*10|10 metres/i);
    expect(alchemist).toMatch(/`?1D6`? fire[^.]*no (?:damage modifier|DM)/i);
    expect(alchemist).toMatch(/normal Reactions/i);
    expect(alchemist).toMatch(/miss[^.]*wastes?[^.]*dose/i);
    expect(alchemist).toMatch(/fumble[^.]*firing into (?:a )?crowd[^.]*applicable/i);
  });

  it('defines application, expiry, and repeat exposure for crafted poison', () => {
    expect(poisoner).toMatch(/Combat Action[^.]*apply[^.]*cutting or piercing weapon/i);
    expect(poisoner).toMatch(/first hit[^.]*deals? HP|first[^.]*HP damage/i);
    expect(poisoner).toMatch(/one hour/i);
    expect(poisoner).toMatch(/then[^.]*spent|dose[^.]*spent/i);
    expect(poisoner).toMatch(/same[^.]*active poison[^.]*(?:does not|doesn't) stack/i);
    expect(poisoner).toMatch(/same[^.]*active poison[^.]*no (?:additional|extra) resistance/i);
    expect(poisoner).toMatch(/ingested[^.]*activates?[^.]*consumed/i);
  });

  it('makes Weak Point a test with a bounded duration and retry condition', () => {
    expect(weakPoint).toMatch(/10 minutes/i);
    expect(weakPoint).toMatch(/access[^.]*quiet/i);
    expect(weakPoint).toMatch(/successful Engineering test/i);
    expect(weakPoint).toMatch(/direct[^.]*allies[^.]*accessible[^.]*join/i);
    expect(weakPoint).toMatch(
      /ignore[^.]*object(?:'s)? AP[\s\S]{0,160}(?:repaired|materially change[ds]?)/i,
    );
    expect(weakPoint).toMatch(/failure[^.]*no benefit/i);
    expect(weakPoint).toMatch(/no retry[^.]*material[^.]*circumstances change/i);
  });
});

describe('shared timing vocabulary', () => {
  const startHere = [
    read('src/content/rules/start-here/index.md'),
    read('src/content/rules/start-here/d100-percentile.md'),
  ].join('\n');
  const heroPoints = read('src/content/rules/characters/character-creation.md');
  const actions = read('src/content/rules/combat/rounds-and-actions.md');

  it('defines a scene as one continuous immediate episode', () => {
    expect(startHere).toMatch(/scene[^.]*continuous (?:episode|situation)/i);
    expect(startHere).toMatch(/shared immediate situation/i);
    expect(startHere).toMatch(/Gamemaster[^.]*announces?[^.]*(?:meaningful )?(?:break|change)/i);
  });

  it('gives every reroll the same timing and one-reroll limit', () => {
    expect(heroPoints).toMatch(
      /(?:each|a) test[^.]*(?:maximum|at most|no more than)[^.]*one reroll|test[^.]*rerolled[^.]*(?:at most|no more than) once/i,
    );
    expect(heroPoints).toMatch(/after[^.]*result[^.]*before[^.]*(?:consequences|cost|Backlash)/i);
    expect(heroPoints).toMatch(/new result (?:must )?stands/i);
    expect(heroPoints).toMatch(/Fumble[^.]*failed test[^.]*effect[^.]*failed/i);
  });

  it('forbids retroactively forfeiting an action or Reaction already spent', () => {
    expect(actions).toMatch(
      /cannot choose[^.]*(?:forfeits?|restricts?)[^.]*(?:Action|Reaction)[^.]*already (?:used|spent)[^.]*incompatib/i,
    );
  });
});
