import { readFileSync } from 'node:fs';
import nunjucks from 'nunjucks';
import { expect, it } from 'vitest';
import downloads from '../../src/_data/downloads.mjs';

it('has no approved adventures yet and keeps future GM entries out of the public grid', () => {
  expect(downloads.filter((entry) => entry.audience === 'gm')).toEqual([]);
  const fixture = {
    ...downloads[0],
    id: 'test-adventure',
    audience: 'gm',
    title: 'Spoiler fixture',
    description: 'Secret plot fixture',
  };
  const html = nunjucks.renderString(readFileSync('src/downloads.njk', 'utf8'), {
    downloads: [...downloads, fixture],
  });
  const [publicPart, gmPart] = html.split('<section id="gm-adventures"');
  expect(publicPart).not.toContain('Spoiler fixture');
  expect(publicPart).not.toContain('Secret plot fixture');
  expect(gmPart).toContain('data-pagefind-ignore hidden');
  expect(gmPart).toContain('Spoiler fixture');
  expect(gmPart).toContain('Secret plot fixture');
});
