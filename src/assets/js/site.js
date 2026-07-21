document.documentElement.classList.add('js');

function enhanceTalentBrowser() {
  const browser = document.querySelector('[data-talent-browser]');
  if (!browser) return;

  const buttons = [...browser.querySelectorAll('[data-talent-filter]')];
  const cards = [...browser.querySelectorAll('[data-talent-card]')];
  const count = browser.querySelector('[data-talent-count]');
  const empty = browser.querySelector('[data-filter-empty]');

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.talentFilter;
      let visible = 0;

      for (const candidate of buttons) {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      }
      for (const card of cards) {
        const tags = (card.dataset.tags ?? '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.hidden = !show;
        if (show) visible += 1;
      }

      count.textContent = String(visible);
      empty.hidden = visible !== 0;
    });
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
  let pagefind;

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
      status.textContent = `${response.results.length} result${response.results.length === 1 ? '' : 's'} for “${term}”.`;

      for (const record of records) {
        const item = document.createElement('li');
        const meta = textElement('p', record.meta.chapter ?? 'Rules', 'search-result-meta');
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        const excerpt = document.createElement('p');
        link.href = record.url;
        link.textContent = record.meta.title ?? 'Untitled rule';
        excerpt.innerHTML = record.excerpt;
        heading.append(link);
        item.append(meta, heading, excerpt);
        results.append(item);
      }
    } catch (error) {
      console.error(error);
      status.textContent =
        'Search could not load. Use the chapter menu or Quick Reference instead.';
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

enhanceTalentBrowser();
enhanceExamples();
enhanceSearch();
