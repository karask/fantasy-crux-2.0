# ADR-001: Use portable Markdown as the canonical lite rules source

## Status

Accepted

## Date

2026-07-22

## Context

Fantasy Crux began as a LaTeX rulebook. The lite edition must be substantially shorter, easy to search during play, readable on phones and desktops, and able to evolve before its magic and illustration systems are chosen. The source also needs to remain useful outside any single website framework.

## Decision

Store each chapter, rule, and Talent as portable Markdown with strict YAML frontmatter. Generate a static website with Eleventy and Nunjucks, then create a client-side Pagefind index over individual rule and Talent pages only.

The interface uses progressive enhancement: navigation and all rules work without JavaScript, while search, Talent filters, and collapsible examples may use it. Legacy LaTeX and candidate magic documents remain unchanged and outside the generated source.

## Alternatives considered

### Continue authoring the lite edition in LaTeX

LaTeX remains strong for print, but it makes at-table navigation, responsive presentation, and section-level search indirect. It would also force the website to depend on a conversion pipeline whose output becomes a second source to debug.

### Put components or raw HTML inside the rules

MDX or embedded HTML would make bespoke layouts convenient, but would couple the rules to one renderer and weaken their portability. Presentation belongs in layouts and CSS; rule prose stays ordinary Markdown.

### Build a client-rendered single-page application

A runtime application could provide rich interactions, but the rules do not need server state. Static HTML is smaller, deploys anywhere, survives JavaScript failure, and is easier to archive.

## Consequences

- Stable IDs and slugs can support durable links while titles and prose evolve.
- Strict validation catches metadata drift before building.
- The site can be hosted as static files with no backend.
- Shared layouts can change the visual system without rewriting rules.
- Component-like behavior cannot be embedded directly in Markdown; it must be expressed through metadata, standard Markdown structures, or progressive enhancement.
- A future print edition will need a deliberate Markdown-to-print pipeline rather than treating the legacy LaTeX as the lite source.
