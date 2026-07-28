document.documentElement.classList.add('js');

// Drives the Talent catalogue and the bestiary: both filter tagged cards in place.
function enhanceFilterBrowsers() {
  for (const browser of document.querySelectorAll('[data-filter-browser]')) {
    const buttons = [...browser.querySelectorAll('[data-filter]')];
    const cards = [...browser.querySelectorAll('[data-filter-item]')];
    const count = browser.querySelector('[data-filter-count]');
    const empty = browser.querySelector('[data-filter-empty]');

    function apply(filter) {
      let visible = 0;

      for (const button of buttons) {
        button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      }
      for (const card of cards) {
        const tags = (card.dataset.filterTags ?? '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.hidden = !show;
        if (show) visible += 1;
      }

      count.textContent = String(visible);
      empty.hidden = visible !== 0;
    }

    // A link to a filtered-out card would otherwise jump nowhere, so widen the filter first.
    function revealTarget() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id && document.getElementById(id);
      if (!target?.closest('[data-filter-item]')?.hidden) return;
      apply('all');
      target.scrollIntoView();
    }

    for (const button of buttons) {
      button.addEventListener('click', () => apply(button.dataset.filter));
    }
    window.addEventListener('hashchange', revealTarget);
  }
}

function enhanceExamples() {
  const headings = [...document.querySelectorAll('.prose h2, .prose h3')].filter((heading) =>
    /^example\b/i.test(heading.textContent.trim()),
  );

  for (const heading of headings) {
    const level = Number(heading.tagName.slice(1));
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const body = document.createElement('div');
    const anchor = heading.querySelector('.heading-anchor');
    details.className = 'example';
    details.open = window.matchMedia('(min-width: 721px)').matches;
    body.className = 'example-content';

    anchor?.remove();
    details.id = heading.id;
    heading.removeAttribute('id');

    let sibling = heading.nextElementSibling;
    while (sibling) {
      const siblingLevel = /^H[1-6]$/.test(sibling.tagName) ? Number(sibling.tagName.slice(1)) : 99;
      if (siblingLevel <= level) break;
      const next = sibling.nextElementSibling;
      body.append(sibling);
      sibling = next;
    }

    heading.replaceWith(details);
    summary.append(heading);
    details.append(summary, body);
  }
}

function textElement(name, text, className) {
  const element = document.createElement(name);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

async function enhanceSearch() {
  const page = document.querySelector('[data-search-page]');
  if (!page) return;

  const form = page.querySelector('[data-search-form]');
  const input = page.querySelector('[data-search-input]');
  const status = page.querySelector('[data-search-status]');
  const results = page.querySelector('[data-search-results]');
  const titleSource = page.querySelector('[data-section-titles]');
  const sectionTitles = titleSource ? JSON.parse(titleSource.textContent) : {};
  let pagefind;

  // Headings inside a rule are namespaced `rule-slug--heading`; recover the rule that owns one.
  function ruleAnchor(url) {
    const [pathname, fragment = ''] = url.split('#', 2);
    const rule = fragment.split('--', 1)[0];
    return rule ? `${pathname}#${rule}` : pathname;
  }

  // Pagefind scores a heading match far above a body match, so the strongest sub-result is the
  // subsection a reader actually wants — long rules stay one result but link to the right step.
  function matchStrength(entry) {
    return (entry.weighted_locations ?? []).reduce((total, at) => total + at.balanced_score, 0);
  }

  async function runSearch(query) {
    const term = query.trim();
    results.replaceChildren();
    if (!term) {
      status.textContent = 'Enter a term to search the rules.';
      return;
    }

    status.textContent = 'Searching…';
    try {
      pagefind ??= await import(new URL('../../pagefind/pagefind.js', import.meta.url));
      const response = await pagefind.search(term);
      const records = await Promise.all(response.results.map((result) => result.data()));
      // Chapters are single pages: keep one result per rule, anchored at its best-matching heading.
      const sections = new Map();

      for (const record of records) {
        for (const entry of record.sub_results?.length ? record.sub_results : [record]) {
          const url = entry.url ?? record.url;
          const rule = ruleAnchor(url);
          const strength = matchStrength(entry);
          if (sections.get(rule)?.strength >= strength) continue;
          const ruleTitle = sectionTitles[rule] ?? record.meta.title ?? 'Untitled rule';
          sections.set(rule, {
            strength,
            chapter: record.meta.chapter ?? 'Rules',
            // A subsection names itself and cites its rule; a whole-rule match just names the rule.
            rule: url === rule ? null : ruleTitle,
            title: url === rule ? ruleTitle : (entry.title ?? ruleTitle),
            url,
            excerpt: entry.excerpt ?? record.excerpt,
          });
        }
      }
      status.textContent = `${sections.size} result${sections.size === 1 ? '' : 's'} for “${term}”.`;

      // Pagefind ranks whole chapter pages, which says nothing about which rule on that page fits.
      // Rules are the search unit here, so order them by their own strongest match instead.
      const ranked = [...sections.values()].sort((left, right) => right.strength - left.strength);

      for (const section of ranked) {
        const item = document.createElement('li');
        const trail = section.rule ? `${section.chapter} · ${section.rule}` : section.chapter;
        const meta = textElement('p', trail, 'search-result-meta');
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        const excerpt = document.createElement('p');
        link.href = section.url;
        link.textContent = section.title;
        excerpt.innerHTML = section.excerpt;
        heading.append(link);
        item.append(meta, heading, excerpt);
        results.append(item);
      }
    } catch (error) {
      console.error(error);
      status.textContent = 'Search could not load. Use the chapter menu instead.';
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = input.value;
    const url = new URL(window.location.href);
    term.trim() ? url.searchParams.set('q', term.trim()) : url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
    runSearch(term);
  });

  const initial = new URLSearchParams(window.location.search).get('q');
  if (initial) {
    input.value = initial;
    await runSearch(initial);
  }
}

enhanceFilterBrowsers();
enhanceExamples();
enhanceSearch();
