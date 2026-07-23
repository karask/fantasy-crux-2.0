import { readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');
const published = matter(read('src/license.md'));

// Quoting style differs between sources of the licence; the words must not.
const publishedText = published.content
  .replace(/[`'’“”"]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

// The Open Game License 1.0a is a fixed document: these are the exact clause headings and the
// Section 15 notices this work inherits. Nothing here may be edited to make a test pass.
const clauses = [
  'Definitions:',
  'The License:',
  'Offer and Acceptance:',
  'Grant and Consideration:',
  'Representation of Authority to Contribute:',
  'Notice of License Copyright:',
  'Use of Product Identity:',
  'Identification:',
  'Updating the License:',
  'Copy of this License:',
  'Use of Contributor Credits:',
  'Inability to Comply:',
  'Termination:',
  'Reformation:',
];

const copyrightNotices = [
  'Open Game License v 1.0a Copyright 2000, Wizards of the Coast, Inc.',
  'Modern System Reference Document Copyright 2002, Wizards of the Coast, Inc.',
  'System Reference Document Copyright 2000-2003, Wizards of the Coast, Inc.',
  'RuneQuest System Reference Document Copyright 2006, Mongoose Publishing',
  'RuneQuest Companion System Reference Document Copyright 2006, Mongoose Publishing',
  'RuneQuest Monster System Reference Document Copyright 2006, Mongoose Publishing',
  'OpenQuest Copyright 2009-2013, D101 Games',
  'Legend Copyright 2011, Mongoose Publishing',
  'The Age of Shadow Copyright 2011; Author Kristian Richards',
  'The Age of Shadow Campaign Guide Copyright 2011; Author Kristian Richards',
  'Fantasy Crux Copyright 2024; Author Konstantinos Karasavvas',
  'Fantasy Crux 2.0 Copyright 2026; Author Konstantinos Karasavvas',
];

describe('Open Game License', () => {
  it('publishes at a stable route so it travels with the content', () => {
    expect(published.data.permalink).toBe('/license/index.html');
    expect(published.data.layout).toBe('layouts/page.njk');
    expect(read('src/_includes/layouts/base.njk')).toContain('href="/license/"');
    expect(read('src/_data/site.mjs')).toContain("href: '/license/'");
  });

  it('reproduces all fifteen sections of the licence', () => {
    expect(clauses).toHaveLength(14);
    for (const clause of clauses) {
      expect(publishedText, clause).toContain(clause);
    }

    expect(publishedText).toContain('15. Copyright Notice');
    expect(publishedText).toContain(
      'You MUST include a copy of this License with every copy of the Open Game Content You Distribute',
    );
    expect(publishedText).toContain(
      'By Using the Open Game Content You indicate Your acceptance of the terms of this License',
    );
  });

  it('credits every work it inherits Open Game Content from, and this edition', () => {
    for (const notice of copyrightNotices) {
      expect(publishedText, notice).toContain(notice.replace(/[’']/g, ''));
    }
  });

  it('leaves the clause markers unaltered by typography', () => {
    // markdown-it's typographer would rewrite (c) as ©, silently editing clause 1.
    expect(published.content).toContain('(c) “Distribute”');
    expect(read('eleventy.config.mjs')).toContain("markdown.disable('replacements')");
  });
});
