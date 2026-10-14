import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('One-use enchanted items', () => {
  const items = read('src/content/rules/gm-tools/enchanted-items.md');
  const enchanter = read('src/content/rules/talents/enchanter.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');

  it('prices a one-use item by its effect plus 1 for the binding', () => {
    expect(items).toMatch(/One-use items[^.]*skip Duration 4/i);
    expect(items).toMatch(/own Duration, then add 1 for the binding/i);
    expect(items).toMatch(/charge keeps until it is used/i);
    expect(items).toMatch(/healing potion[^.]*Magnitude 2/i);
    expect(examples).toMatch(/`1D4` healing potion[^\n]*\|\s+2 \|/);
  });

  it('keeps one-use items within capacity and commitment until used', () => {
    expect(items).toMatch(/pays a one-use item's PP when binding it/i);
    expect(items).toMatch(/commits the maker's maximum PP and counts toward their active total/i);
    expect(enchanter).toMatch(/or as a one-use item, a bound/i);
    expect(enchanter).toMatch(/unused one-use item commits the same way/i);
  });
});
