import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
}

test('home and primary rules navigation work at the target width', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Fantasy Crux 2.0');
  await expect(page.getByRole('link', { name: /Enter the rules/i })).toBeVisible();
  await expect(page.locator('.chapter-directory li')).toHaveCount(10);
  await expect(page.locator('.chapter-nav a').nth(0)).toContainText('00');
  await expect(page.locator('.chapter-nav a').nth(4)).toContainText('04');
  await expect(page.locator('.chapter-nav a').nth(7)).toContainText('07');
  await expect(page.locator('.chapter-nav a').nth(7)).toContainText('Adventuring');
  await expect(page.locator('.chapter-nav a').nth(8)).toContainText('GM Tools');
  await expect(page.locator('.chapter-nav a').nth(9)).toContainText('Creatures');
  await expect(page.locator('.chapter-nav a').nth(10)).toContainText('License');
  await expectNoHorizontalOverflow(page);

  await page.goto('/rules/combat/#off-hand-options');
  await expect(page.locator('h1')).toHaveText('Combat');
  await expect(page.locator('#off-hand-options')).toContainText('Fighting With Off-Hand Options');
  await expect(page.locator('main')).toContainText('make one free attack');
  await expect(page.locator('main')).toContainText('cannot Dodge');

  // Intimidate is a Combat Action, restored from the LaTeX combat chapter.
  const intimidate = page.locator('#rounds-and-actions--intimidate');
  await expect(intimidate).toHaveText(/Intimidate/);
  const intimidateRule = intimidate.locator('xpath=ancestor::section[1]');
  await expect(intimidateRule).toContainText('Influence against the target’s Persistence');
  await expect(intimidateRule).toContainText('A fumbled Persistence routs them outright.');
  await expectNoHorizontalOverflow(page);

  // The header stays pinned, so search is reachable from anywhere on a long chapter.
  const header = page.locator('.site-header');
  const anchored = await header.evaluate((element) => element.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollBy(0, 3000));
  await expect(header).toBeInViewport();
  expect(await header.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(
    anchored,
    0,
  );
  await expect(page.getByLabel('Search the rules')).toBeInViewport();
});

test('every rules chapter links to each of its sections below the chapter heading', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const chapterIds = [
    'start-here',
    'characters',
    'skills',
    'equipment',
    'combat',
    'magic',
    'talents',
    'adventuring',
    'gm-tools',
    'creatures',
  ];

  for (const chapterId of chapterIds) {
    await page.goto(`/rules/${chapterId}/`);

    const sectionTabs = page.locator('.chapter-heading + .chapter-tabs');

    // Single-section chapters skip the tabs menu — there is nothing to navigate between. Start
    // Here holds one rule; every Talent lives in one filterable section.
    if (chapterId === 'start-here' || chapterId === 'talents') {
      await expect(sectionTabs).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
      continue;
    }

    await expect(sectionTabs).toBeVisible();
    await expect(sectionTabs).toHaveAttribute('aria-label', 'In this chapter');

    const links = sectionTabs.getByRole('link');
    expect(await links.count()).toBeGreaterThan(0);

    const destinations = await links.evaluateAll((items) =>
      items.map((item) => item.getAttribute('href')),
    );
    for (const destination of destinations) {
      expect(destination).toMatch(/^#[a-z0-9-]+$/);
      await expect(page.locator(destination)).toHaveCount(1);
    }

    await expectNoHorizontalOverflow(page);
  }

  await page.goto('/rules/combat/');
  await page.locator('.chapter-tabs').getByRole('link', { name: 'Damage and Wounds' }).click();
  await expect(page).toHaveURL(/#damage-and-wounds$/);
  await expect(page.locator('#damage-and-wounds')).toBeInViewport();

  await page.goto('/rules/creatures/');
  await expect(
    page.locator('.chapter-tabs').getByRole('link', { name: 'Creature Profiles' }),
  ).toHaveAttribute('href', '#creature-list-title');
});

test('Talent filters progressively enhance the complete catalogue', async ({ page }) => {
  await page.goto('/rules/talents/');
  await expect(page.locator('.talent-list [data-filter-item]')).toHaveCount(47);
  await page.getByRole('button', { name: 'Shield' }).click();
  const visibleCards = page.locator('.talent-list [data-filter-item]:visible');
  await expect(visibleCards).not.toHaveCount(0);
  await expect(visibleCards.first()).toContainText(/shield/i);
  await expect(page.locator('[data-filter-count]')).not.toHaveText('47');
  await expect(page.getByRole('status')).toContainText('Talents available');

  // The magic tag covers Shaping and the two Talents that build on it.
  await page.getByRole('button', { name: 'Magic' }).click();
  await expect(visibleCards).toHaveCount(9);

  // Talents reach past combat, so the non-combat tags filter too.
  await page.getByRole('button', { name: 'Social' }).click();
  await expect(visibleCards).toHaveCount(3);
  await expect(visibleCards.first()).toContainText('Silver Tongue');

  await page.getByRole('button', { name: 'Survival' }).click();
  await expect(visibleCards).toHaveCount(2);

  // Medicine has its own tag, so Field Surgeon no longer sits under Survival.
  await page.getByRole('button', { name: 'Healing' }).click();
  await expect(visibleCards).toHaveCount(3);
  await expectNoHorizontalOverflow(page);
});

test('Shaping is a first-class rules chapter', async ({ page }) => {
  const sections = [
    'becoming-a-shaper',
    'building-a-shaping',
    'techniques-and-forms',
    'effects',
    'casting-and-defence',
    'ongoing-and-magical-actions',
    'rituals-and-examples',
  ];

  await page.goto('/');
  const magicItem = page.locator('.chapter-directory li').filter({ hasText: 'Shaping' });
  await expect(magicItem).not.toHaveClass(/is-future/);
  await magicItem.getByRole('link', { name: /Shaping/ }).click();
  await expect(page.locator('h1')).toHaveText('Shaping');
  const headings = page.locator('.rule-section-heading h2');
  await expect(headings).toHaveCount(7);
  expect(await headings.evaluateAll((items) => items.map((item) => item.id))).toEqual(sections);
  await expect(page.locator('#becoming-a-shaper')).toBeVisible();
  await expect(page.locator('main')).not.toContainText('Magic rules are in development.');
  await expectNoHorizontalOverflow(page);

  // Shaping is bought as a Talent, so creation points at the Talent and the Talent at the chapter.
  await page.goto('/rules/characters/');
  await expect(page.getByRole('link', { name: 'Shaping', exact: true }).last()).toHaveAttribute(
    'href',
    '/rules/talents/#shaping',
  );

  await page.goto('/rules/talents/#shaping');
  const shaping = page.locator('#shaping').locator('xpath=ancestor::section[1]');
  await expect(shaping).toContainText('20');
  await expect(shaping.getByRole('link', { name: 'Shaper', exact: true })).toHaveAttribute(
    'href',
    '/rules/magic/#becoming-a-shaper',
  );

  await page.goto('/rules/magic/#building-a-shaping');
  await expect(page.locator('#building-a-shaping')).toHaveText(/Building a Shaping/);
  await expect(page.locator('main')).toContainText('Intensity + Range + Duration + Reach');
  await expect(page.locator('.table-wrap')).not.toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('the bestiary publishes every profile and filters by creature type', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/rules/creatures/');
  const profiles = page.locator('[data-filter-item]');
  await expect(profiles).toHaveCount(57);
  await expect(page.locator('#creature-tags')).toBeVisible();
  await expect(page.locator('#multiattack')).toBeVisible();

  const usage = page.locator('#using-creatures').locator('xpath=ancestor::section[1]');
  await expect(usage).toContainText('Dwarf, Elf, Goblin, Orc, and Lizardman');
  await expect(usage).toContainText('roughly as many creatures as player characters');
  await usage.getByRole('link', { name: 'Fantasy Races' }).click();
  await expect(page.locator('#fantasy-races')).toBeVisible();
  await page.goBack();

  const dragon = page.locator('#dragon').locator('xpath=ancestor::article[1]');
  await expect(dragon).toContainText('Bite — Unarmed Combat 100%');
  await expect(dragon.locator('.stat-row').first()).toContainText('70');
  await expect(dragon.locator('.creature-tags')).toContainText('living');
  await expect(dragon.locator('.creature-portrait')).toBeVisible();

  const illustratedProfiles = [
    { slug: 'bear', image: '/assets/images/creatures/bear.webp' },
    { slug: 'dragon', image: '/assets/images/creatures/dragon.webp' },
    { slug: 'dryad', image: '/assets/images/creatures/dryad.webp' },
    { slug: 'ghoul', image: '/assets/images/creatures/ghoul.webp' },
    { slug: 'ghost', image: '/assets/images/creatures/ghost.webp' },
    { slug: 'giant-spider', image: '/assets/images/creatures/giant-spider.webp' },
    { slug: 'griffin', image: '/assets/images/creatures/griffin.webp' },
    { slug: 'hag', image: '/assets/images/creatures/hag.webp' },
    { slug: 'mummy', image: '/assets/images/creatures/mummy.webp' },
    { slug: 'naiad', image: '/assets/images/creatures/naiad.webp' },
    { slug: 'ogre', image: '/assets/images/creatures/ogre.webp' },
    { slug: 'oread', image: '/assets/images/creatures/oread.webp' },
    { slug: 'skeleton', image: '/assets/images/creatures/skeleton.webp' },
    { slug: 'vampire', image: '/assets/images/creatures/vampire.webp' },
    { slug: 'zombie', image: '/assets/images/creatures/zombie.webp' },
  ];

  for (const { slug, image } of illustratedProfiles) {
    const profile = page.locator(`#${slug}`).locator('xpath=ancestor::article[1]');
    const portrait = profile.locator('.creature-portrait');
    const artwork = portrait.locator('img');

    await expect(profile).toHaveClass(/creature-profile--illustrated/);
    await expect(artwork).toBeVisible();
    await expect(artwork).toHaveAttribute('src', image);
    await expect(artwork).toHaveAttribute('srcset', new RegExp(`${slug}-320\\.webp 320w`));
    await expect(artwork).toHaveAttribute('srcset', new RegExp(`${slug}\\.webp 640w`));

    const portraitWidth = await portrait.evaluate((element) =>
      Math.round(element.getBoundingClientRect().width),
    );
    expect(portraitWidth).toBeGreaterThanOrEqual(200);
  }

  const everyCreatureProfile = page.locator('.creature-profile');
  await expect(everyCreatureProfile).toHaveCount(57);
  await expect(page.locator('.creature-profile--illustrated')).toHaveCount(57);

  for (const profile of await everyCreatureProfile.all()) {
    const artwork = profile.locator('.creature-portrait img');
    await expect(artwork).toBeVisible();
    await expect(artwork).toHaveAttribute('alt', /\S+/);
    await expect(artwork).toHaveAttribute('src', /\/assets\/images\/creatures\/.+\.webp/);
    await expect(artwork).toHaveAttribute('srcset', /-320\.webp 320w/);
    await expect(artwork).toHaveAttribute('srcset', /\.webp 640w/);
    await artwork.scrollIntoViewIfNeeded();
    await expect
      .poll(() => artwork.evaluate((image) => image.complete && image.naturalWidth > 0))
      .toBe(true);
  }

  // Each characteristic also lists the dice it was generated from, so a GM can roll a variant.
  await expect(dragon.locator('.stat-dice').first()).toHaveText('(20D6)');
  await expect(
    page.locator('#reading-a-profile').locator('xpath=ancestor::section[1]'),
  ).toContainText('vary an individual');

  const golem = page.locator('#golem').locator('xpath=ancestor::article[1]');
  await expect(golem.locator('.stat-dice', { hasText: '(1D6/2D6)' }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Undead' }).click();
  await expect(page.locator('[data-filter-item]:visible')).toHaveCount(5);
  await expect(page.locator('[data-filter-count]')).toHaveText('5');
  await expect(page.locator('#vampire')).toBeVisible();
  await expect(page.locator('#dragon')).toBeHidden();

  // A link into a filtered-out profile has to widen the filter rather than jump nowhere.
  await page.evaluate(() => {
    window.location.hash = '#dragon';
  });
  await expect(page.locator('#dragon')).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  await expectNoHorizontalOverflow(page);
});

test('Gamemaster tools publish the procedures that reach past one character', async ({ page }) => {
  await page.goto('/rules/gm-tools/');
  await expect(page.locator('h1')).toHaveText('GM Tools');

  const sections = page.locator('.rule-section-heading h2');
  expect(await sections.evaluateAll((items) => items.map((item) => item.id))).toEqual([
    'plunder',
    'enchanted-items',
    'ships-and-sailing',
    'mass-combat',
    'calling-for-tests',
    'fantasy-races',
    'minor-npcs',
    'epic-characters',
  ]);

  await expect(page.locator('#plunder').locator('xpath=ancestor::section[1]')).toContainText(
    'Wealth of kings',
  );
  const ships = page.locator('#ships-and-sailing').locator('xpath=ancestor::section[1]');
  await expect(ships).toContainText('Three-masted');
  await expect(ships).toContainText('Broadside');
  await expect(ships.locator('.table-wrap').first()).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#mass-combat').locator('xpath=ancestor::section[1]')).toContainText(
    'Lore (Military Tactics)',
  );
  const fantasyRaces = page.locator('#fantasy-races').locator('xpath=ancestor::section[1]');
  await expect(fantasyRaces).toContainText('Random characteristics');
  await expect(fantasyRaces).toContainText('Racial maxima');
  await expect(fantasyRaces).toContainText('DEX 27');
  await expectNoHorizontalOverflow(page);

  // Each creature carries the rating the plunder table reads.
  await page.goto('/rules/creatures/#dragon');
  const dragon = page.locator('#dragon').locator('xpath=ancestor::article[1]');
  await expect(dragon.locator('.creature-inline').last()).toContainText('Plunder');
  await expect(dragon.locator('.creature-inline').last()).toContainText('5');
  await dragon.getByRole('link', { name: 'Plunder' }).click();
  await expect(page.locator('h1')).toHaveText('GM Tools');
});

test('the Open Game License ships with the rules it covers', async ({ page }) => {
  await page.goto('/rules/combat/');
  const footerLink = page.locator('.site-footer').getByRole('link', { name: 'Open Game License' });
  await expect(footerLink).toBeVisible();
  await footerLink.click();

  await expect(page).toHaveURL(/\/license\/$/);
  await expect(page.locator('h1')).toContainText('Open Game License Version 1.0a');
  await expect(page.getByRole('heading', { name: '15. Copyright Notice' })).toBeVisible();
  await expect(page.locator('main')).toContainText(
    'Open Game License v 1.0a Copyright 2000, Wizards of the Coast, Inc.',
  );
  await expect(page.locator('main')).toContainText('OpenQuest Copyright 2009-2013');
  await expect(page.locator('main')).toContainText('Fantasy Crux 2.0 Copyright 2026');
  // The typographer must not rewrite (c) as a copyright sign inside clause 1.
  await expect(page.locator('main li').first()).toContainText('(c) “Distribute”');
  await expectNoHorizontalOverflow(page);
});

test('Pagefind returns indexed rules and Talents', async ({ page }) => {
  await page.goto('/search/');
  await page.getByLabel('Rule, term, or Talent').fill('faster Combat Order');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-search-status]')).toContainText(/results? for/i);
  await expect(page.locator('[data-search-results]')).toContainText('Quick Reflexes');

  await page.getByLabel('Rule, term, or Talent').fill('DEX 13');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-search-results]')).toContainText('Quick Reflexes');

  await page.getByLabel('Rule, term, or Talent').fill('combat');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const status = page.locator('[data-search-status]');
  await expect(status).toContainText(/results? for/i);
  const reportedCount = Number((await status.textContent()).match(/^\d+/)?.[0]);
  await expect(page.locator('[data-search-results] li')).toHaveCount(reportedCount);

  await page.getByLabel('Rule, term, or Talent').fill('Effect');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-search-results] li').first()).toBeVisible();
  await expect(page.locator('[data-search-results]')).not.toContainText('#');

  await page.getByLabel('Rule, term, or Talent').fill('Unmake Fire cell');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-search-results]')).toContainText('Becoming a Shaper');

  await page.getByLabel('Rule, term, or Talent').fill('corpse-eater');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-search-results]')).toContainText('Ghoul');

  await page.getByLabel('Rule, term, or Talent').fill('broadside');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('[data-search-results]')).toContainText('Ships and Sailing');

  await page.getByLabel('Rule, term, or Talent').fill('"rules are in development"');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(status).toContainText('0 results');
  await expect(page.locator('[data-search-results] li')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

// A long rule such as Character creation covers many steps, so a hit inside one must link to that
// step rather than dumping the reader at the top of the rule.
test('search links into the matching subsection of a long rule', async ({ page }) => {
  await page.goto('/search/');

  await page.getByLabel('Rule, term, or Talent').fill('Damage Modifier');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const damage = page
    .locator('[data-search-results] li')
    .filter({ has: page.getByRole('link', { name: 'Damage Modifier', exact: true }) })
    .first();
  await expect(damage.getByRole('link')).toHaveAttribute(
    'href',
    '/rules/characters/#character-creation--characters-damage-modifier',
  );
  await expect(damage.locator('.search-result-meta')).toHaveText('characters · Character creation');

  // A match on the rule as a whole still reports the rule, with no subsection trail.
  await page.getByLabel('Rule, term, or Talent').fill('corpse-eater');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const ghoul = page.locator('[data-search-results] li').first();
  await expect(ghoul.getByRole('link')).toHaveAttribute('href', '/rules/creatures/#ghoul');
  await expect(ghoul.locator('.search-result-meta')).toHaveText('creatures');

  // Following a subsection result lands on that heading rather than the rule heading.
  await page.getByLabel('Rule, term, or Talent').fill('Damage Modifier');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await damage.getByRole('link').click();
  await expect(page).toHaveURL(/#character-creation--characters-damage-modifier$/);
  await expect(page.locator('#character-creation--characters-damage-modifier')).toBeInViewport();
  await expectNoHorizontalOverflow(page);
});

test('table-heavy rules remain within the target width', async ({ page }) => {
  for (const route of ['/rules/equipment/', '/rules/combat/', '/rules/magic/']) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.table-wrap').first()).toHaveAttribute('tabindex', '0');
    await expectNoHorizontalOverflow(page);
  }
});

test('core pages have no automatically detectable accessibility violations', async ({ page }) => {
  // Scanning the single-page chapters, the 57-profile bestiary included, takes a while.
  test.slow();

  for (const route of [
    '/',
    '/rules/combat/',
    '/rules/talents/',
    '/rules/magic/',
    '/rules/gm-tools/',
    '/rules/creatures/',
    '/license/',
    '/search/',
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, `${route}: ${JSON.stringify(results.violations)}`).toEqual([]);
  }
});

test('the rules remain readable without JavaScript', async ({ browser, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8080/rules/talents/');
  await expect(page.locator('.talent-list [data-filter-item]')).toHaveCount(47);
  await expect(page.locator('.filter-bar')).toBeHidden();
  await expect(page.locator('main')).toContainText('Off-Hand Mastery');
  await expect(page.locator('#off-hand-mastery')).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await context.close();
});
