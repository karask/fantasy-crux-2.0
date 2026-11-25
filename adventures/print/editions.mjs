// Which Markdown files make each Gamemaster edition, in what order, and how each handout is
// printed. Every handout section of the players' file is also printed in full, with its GM notes,
// in the chapter of that name; the print pages repeat only what the players should see.
//
// Handout kinds: player (the whole section), card (a fenced block of numbered signals), ledger and
// letter (handwriting on ruled paper), plate (engraved brass), bill (a printed account with a
// stamp), document and decree (formal papers), inscription (carved stone), track-and-tokens
// (a track of boxes, and cut-out tokens if the section has them), seals (the courier's seal
// ribbon), songsheet (a printed song from a fenced block: title, stanzas, closing note).

const stars = (count, seed, top, bottom) => {
  let state = seed;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  return Array.from({ length: count }, () => {
    const x = (random() * 206 + 2).toFixed(1);
    const y = (top + random() * (bottom - top)).toFixed(1);
    const r = (0.18 + random() * 0.45).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4efe5" opacity="${(0.35 + random() * 0.6).toFixed(2)}"/>`;
  }).join('');
};

/** A mine in cross-section under a rising hill, flooding from below, with twelve lamps. */
function mineCover() {
  const tunnel = (x, y, w) =>
    `<rect x="${x}" y="${y}" width="${w}" height="3.4" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.45"/>`;
  const lamp = (x, y) =>
    `<circle cx="${x}" cy="${y}" r="0.95" fill="#f1e6c6"/><circle cx="${x}" cy="${y}" r="2.4" fill="#f1e6c6" opacity="0.18"/>`;
  return `<svg class="cover-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 296.5" aria-hidden="true">
<rect width="210" height="296.5" fill="#1c2325"/>
${stars(70, 7, 6, 120)}
<path d="M0 141 H120 L210 121 V296.5 H0 Z" fill="#232c2e"/>
<path d="M0 141 H120 L210 121" fill="none" stroke="#e7e0d2" stroke-width="0.6"/>
<rect x="14" y="130" width="19" height="11" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.45"/>
<path d="M12.5 130 L23.5 124 L34.5 130 Z" fill="#4d5857"/>
<rect x="28" y="116" width="3" height="11" fill="#4d5857"/>
<path d="M37 141 L45 125.5 L53 141" fill="none" stroke="#e7e0d2" stroke-width="0.7"/>
<line x1="39.5" y1="136" x2="50.5" y2="136" stroke="#e7e0d2" stroke-width="0.45"/>
<circle cx="45" cy="126" r="2.6" fill="#1c2325" stroke="#e7e0d2" stroke-width="0.5"/>
<line x1="33" y1="132" x2="43" y2="127" stroke="#e7e0d2" stroke-width="0.3"/>
<path d="M57 120.5 q0-4 3.3-4 q3.3 0 3.3 4 l1 2.2 h-8.6 z" fill="#c49a45"/>
<circle cx="60.3" cy="123.4" r="0.8" fill="#c49a45"/>
<path d="M66.5 116.5 q2.2 2.4 0 4.8 M69 115.3 q3.3 3.6 0 7.2" fill="none" stroke="#c49a45" stroke-width="0.45" stroke-linecap="round"/>
<rect x="43.3" y="141" width="3.4" height="111" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.45"/>
${tunnel(46.7, 170, 131.5)}
${tunnel(46.7, 200, 70)}
<rect x="116.7" y="191" width="24" height="16" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.45"/>
<rect x="117" y="201.5" width="23.4" height="5.2" fill="#2c6a83" opacity="0.85"/>
${tunnel(46.7, 232, 115)}
<path d="M161.7 235.4 V223 Q172 214 182.3 223 V235.4 Z" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.45"/>
<rect x="176" y="173.4" width="2.2" height="45" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.35"/>
${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<line x1="176.2" x2="178" y1="${177 + i * 4.6}" y2="${177 + i * 4.6}" stroke="#e7e0d2" stroke-width="0.25"/>`).join('')}
<path d="M0 239 q8 -1.6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V262 H0 Z" fill="#2c6a83" opacity="0.92"/>
<rect x="43.6" y="239" width="2.8" height="13" fill="#2c6a83"/>
<rect x="46.7" y="234.2" width="115" height="1.2" fill="#2c6a83"/>
<ellipse cx="104" cy="250.5" rx="1.25" ry="0.75" fill="#f1e6c6"/>
<ellipse cx="109.2" cy="250.5" rx="1.25" ry="0.75" fill="#f1e6c6"/>
${lamp(84, 171.8)}${lamp(96, 171.8)}
${lamp(124, 199.5)}${lamp(130, 199.5)}${lamp(136, 199.5)}
${lamp(165.5, 230)}${lamp(169.5, 228)}${lamp(173.5, 227)}${lamp(177.5, 228)}${lamp(167.5, 233.2)}${lamp(172, 233.2)}${lamp(176.5, 233.2)}
</svg>`;
}

/** A night road climbing to a lit waygate, under the seven seals of the Errand. */
function roadCover() {
  const seals = ['Gate', 'Hearth', 'Scale', 'Rose', 'Hammer', 'Storm', 'Star'];
  const sealSvg = seals
    .map((name, index) => {
      const cx = 27 + index * 26;
      const ash = index === 0;
      return `<circle cx="${cx}" cy="250" r="9.2" fill="${ash ? '#6b6760' : '#8e2b19'}" stroke="${ash ? '#b9b4ab' : '#c4523b'}" stroke-width="0.9"/>
<text x="${cx}" y="251.6" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="4.1" letter-spacing="0.25" fill="${ash ? '#2f2d2a' : '#fbe9d8'}">${name.toUpperCase()}</text>`;
    })
    .join('');
  return `<svg class="cover-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 296.5" aria-hidden="true">
<rect width="210" height="296.5" fill="#1c2325"/>
${stars(140, 11, 6, 170)}
<path d="M0 182 Q40 170 80 176 T150 170 T210 174 V296.5 H0 Z" fill="#232c2e"/>
<path d="M0 196 Q50 186 105 192 T210 188 V296.5 H0 Z" fill="#283234"/>
<path d="M104 177 C 108 190 92 198 98 210 S 128 226 112 296.5 H 150 C 150 250 112 228 110 210 S 112 188 106 177 Z" fill="#3a4547"/>
<path d="M96.5 177 V167.5 Q105 158 113.5 167.5 V177" fill="none" stroke="#c49a45" stroke-width="1.2"/>
<path d="M99.5 177 V168.6 Q105 162 110.5 168.6 V177 Z" fill="#f1e6c6" opacity="0.8"/>
<circle cx="105" cy="171" r="16" fill="#f1e6c6" opacity="0.07"/>
<circle cx="105" cy="171" r="9" fill="#f1e6c6" opacity="0.1"/>
<path d="M14 250 H196" stroke="#8b7a52" stroke-width="5.5" opacity="0.55"/>
${sealSvg}
</svg>`;
}

/** A vineyard hill at night, a tower with a lit window, and a dragon asleep on her gold inside. */
function dragonCover() {
  const hill = [
    [
      [0, 182],
      [40, 160],
      [80, 136],
      [118, 132],
    ],
    [
      [118, 132],
      [150, 130],
      [180, 146],
      [210, 164],
    ],
  ];
  const point = ([a, b, c, d], t) =>
    [0, 1].map(
      (axis) =>
        (1 - t) ** 3 * a[axis] +
        3 * (1 - t) ** 2 * t * b[axis] +
        3 * (1 - t) * t ** 2 * c[axis] +
        t ** 3 * d[axis],
    );
  const vines = [7, 14, 21]
    .flatMap((offset) =>
      hill.flatMap((segment) =>
        Array.from({ length: 26 }, (_, index) => {
          const [x, y] = point(segment, (index + 0.5) / 26);
          return `<circle cx="${x.toFixed(1)}" cy="${(y + offset).toFixed(1)}" r="0.75" fill="#7d4a6e"/>`;
        }),
      ),
    )
    .join('');
  const notes = [
    [131, 112, 0.95],
    [140, 105, 0.8],
    [150, 99, 0.65],
    [160, 95, 0.5],
  ]
    .map(
      ([x, y, o]) =>
        `<g opacity="${o}"><ellipse cx="${x}" cy="${y}" rx="2.1" ry="1.5" transform="rotate(-20 ${x} ${y})" fill="#e2b93b"/><line x1="${x + 1.9}" y1="${y - 0.4}" x2="${x + 1.9}" y2="${y - 9}" stroke="#e2b93b" stroke-width="0.6"/><path d="M${x + 1.9} ${y - 9} q 3 1.5 2.4 4.5" fill="none" stroke="#e2b93b" stroke-width="0.6"/></g>`,
    )
    .join('');
  const dark = '#7d2414';
  const red = '#a73e29';
  const dragon = `<g transform="translate(-27.9 96.7) scale(0.32)">
<path d="M546 468 C 566 490 528 500 466 500 C 416 500 382 498 360 494" fill="none" stroke="${dark}" stroke-width="14" stroke-linecap="round"/>
<path d="M546 468 C 566 490 528 500 466 500 C 416 500 382 498 360 494" fill="none" stroke="${red}" stroke-width="10" stroke-linecap="round"/>
<path d="M362 470 C 342 412 392 374 460 378 C 530 382 562 430 550 468 C 542 492 502 498 452 496 C 404 494 372 490 362 470 Z" fill="${red}" stroke="${dark}" stroke-width="2"/>
<path d="M398 394 L 428 330 L 452 354 L 476 320 L 494 350 L 520 332 L 524 394 Q 470 408 398 394 Z" fill="#c4523b" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
<path d="M408 394 L 428 334 M 446 396 L 476 324 M 488 396 L 518 336" fill="none" stroke="${dark}" stroke-width="1.4"/>
<path d="M394 432 C 362 420 332 440 320 466" fill="none" stroke="${dark}" stroke-width="28" stroke-linecap="round"/>
<path d="M394 432 C 362 420 332 440 320 466" fill="none" stroke="${red}" stroke-width="24" stroke-linecap="round"/>
<path d="M334 460 C 320 450 290 452 270 464 L 258 474 C 268 484 300 488 334 482 Z" fill="${red}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
<path d="M322 456 L 348 440 L 332 460 Z M 312 455 L 334 434 L 320 457 Z" fill="${dark}"/>
<path d="M292 467 q 7 4 14 0" fill="none" stroke="#f1e6c6" stroke-width="2" stroke-linecap="round"/>
<path d="M256 470 q -10 -7 -20 -3 M 256 478 q -10 4 -20 2" fill="none" stroke="#e2b93b" stroke-width="2" stroke-linecap="round"/>
</g>`;
  return `<svg class="cover-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 296.5" aria-hidden="true">
<rect width="210" height="296.5" fill="#1c2325"/>
${stars(110, 5, 6, 122)}
<path d="M0 182 C 40 160 80 136 118 132 C 150 130 180 146 210 164 V296.5 H0 Z" fill="#232c2e"/>
<path d="M0 182 C 40 160 80 136 118 132 C 150 130 180 146 210 164" fill="none" stroke="#e7e0d2" stroke-width="0.6"/>
${vines}
<rect x="112" y="113" width="12" height="20" fill="#2b3638" stroke="#e7e0d2" stroke-width="0.45"/>
<path d="M111 113 h14 M112 113 v-2.4 h2.6 v2.4 M116.7 113 v-2.4 h2.6 v2.4 M121.4 113 v-2.4 h2.6 v2.4" fill="none" stroke="#e7e0d2" stroke-width="0.45"/>
<rect x="116.4" y="118" width="3.2" height="4.4" fill="#f1e6c6"/>
<circle cx="118" cy="120" r="6" fill="#f1e6c6" opacity="0.08"/>
<path d="M34 238 C 34 204 70 192 106 192 C 150 192 178 206 178 238 C 178 256 166 262 150 262 H 56 C 42 262 34 254 34 238 Z" fill="#2a1712" stroke="#e7e0d2" stroke-width="0.45"/>
<ellipse cx="106" cy="240" rx="64" ry="24" fill="${red}" opacity="0.16"/>
<ellipse cx="106" cy="244" rx="40" ry="14" fill="#e2b93b" opacity="0.1"/>
<path d="M38 254 Q 60 244 80 250 Q 104 240 126 248 Q 150 240 174 252 L 174 256 Q 170 262 150 262 H 56 Q 42 262 38 254 Z" fill="#e2b93b" opacity="0.85"/>
${dragon}
${notes}
</svg>`;
}

export default {
  'twelve-below': {
    title: 'Twelve Below',
    titleLines: ['Twelve', 'Below'],
    titleSize: 104,
    titleTop: 30,
    tagline:
      'Twelve miners are trapped below. The water reaches the top at dawn. Something else is down there.',
    taglineTop: 101,
    coverFoot: ['A four-hour convention adventure', 'Three to six players · beginners welcome'],
    cover: mineCover,
    coverTrack: true,
    date: 'October 2026',
    chapters: [
      {
        file: 'README.md',
        key: 'introduction',
        kicker: 'Before you play',
        title: 'Introduction',
        omitSections: ['Files'],
        omitParagraphs: [/^To redraw the maps after an edit/],
      },
      {
        file: '01-adventure.md',
        key: 'adventure',
        kicker: 'Gamemaster only',
        title: 'The adventure',
      },
      { file: '02-npcs.md', key: 'people', kicker: 'Gamemaster only' },
      { file: '04-running-notes.md', key: 'running', kicker: 'At the table' },
      { file: '03-players-and-handouts.md', key: 'handouts', kicker: 'Read aloud and hand out' },
    ],
    maps: {
      'map/gm-map.svg': { id: 'map-gm', title: 'GM map', note: 'Gamemaster only' },
      'map/player-map.svg': {
        id: 'map-player',
        title: 'Handout 1: the mine plan',
        note: 'Player handout',
      },
    },
    gmMaps: ['map/gm-map.svg'],
    handoutPages: [
      [
        { section: 'player-brief-the-last-delivery-of-the-day', kind: 'player' },
        { section: 'how-to-play', kind: 'player' },
      ],
      [{ map: 'map/player-map.svg' }],
      [{ section: 'handout-2-the-bell-code', kind: 'card' }],
      [{ section: 'handout-3-the-shift-ledger', kind: 'ledger' }],
      [
        { section: 'handout-4-the-brass-plate', kind: 'plate', caption: true },
        { section: 'handout-5-the-goat-dealers-bill', kind: 'bill', stamp: 'CANCELLED' },
      ],
      [{ section: 'handout-6-the-water-and-the-twelve', kind: 'track-and-tokens' }],
    ],
  },
  'the-last-errand': {
    title: 'The Last Errand',
    titleLines: ['The Last', 'Errand'],
    titleSize: 96,
    titleTop: 30,
    tagline: 'The empire’s last courier is still on her round. Tonight, you ride with her.',
    taglineTop: 96,
    coverFoot: ['Four hours across the Crownless Realms', 'Three to five players'],
    cover: roadCover,
    date: 'October 2026',
    chapters: [
      {
        file: 'README.md',
        key: 'introduction',
        kicker: 'Before you play',
        title: 'Introduction',
        omitSections: ['Files'],
      },
      {
        file: '01-adventure.md',
        key: 'adventure',
        kicker: 'Gamemaster only',
        title: 'The adventure',
      },
      { file: '02-npcs.md', key: 'people', kicker: 'Gamemaster only' },
      { file: '04-running-notes.md', key: 'running', kicker: 'At the table' },
      {
        file: '03-player-brief-and-handouts.md',
        key: 'handouts',
        kicker: 'Read aloud and hand out',
      },
    ],
    maps: {},
    gmMaps: [],
    handoutPages: [
      [{ section: 'player-brief-a-night-job', kind: 'player' }],
      [
        { section: 'handout-1-the-escort-contract', kind: 'document' },
        { section: 'handout-2-the-arch-inscription', kind: 'inscription' },
      ],
      [{ section: 'handout-3-a-crowning-letter', kind: 'decree' }],
      [
        { section: 'handout-4-a-letter-to-tam', kind: 'letter' },
        { section: 'handout-5-the-seal-ribbon', kind: 'seals' },
      ],
    ],
  },
  'lullaby-for-a-dragon': {
    title: 'Lullaby for a Dragon',
    titleLines: ['Lullaby', 'for a Dragon'],
    titleSize: 74,
    titleTop: 24,
    tagline: 'Steal from a sleeping dragon. Whatever you do, don’t let the music stop.',
    taglineTop: 72,
    coverFoot: ['A four-hour convention heist', 'Three to six players · beginners welcome'],
    cover: dragonCover,
    date: 'October 2026',
    chapters: [
      {
        file: 'README.md',
        key: 'introduction',
        kicker: 'Before you play',
        title: 'Introduction',
        omitSections: ['Files'],
        omitParagraphs: [/^To redraw the maps after an edit/],
      },
      {
        file: '01-adventure.md',
        key: 'adventure',
        kicker: 'Gamemaster only',
        title: 'The adventure',
      },
      { file: '02-npcs.md', key: 'people', kicker: 'Gamemaster only' },
      { file: '04-running-notes.md', key: 'running', kicker: 'At the table' },
      { file: '03-players-and-handouts.md', key: 'handouts', kicker: 'Read aloud and hand out' },
    ],
    maps: {
      'map/gm-map.svg': { id: 'map-gm', title: 'GM map', note: 'Gamemaster only' },
      'map/player-map.svg': {
        id: 'map-player',
        title: 'Handout 5: the keepers’ plan',
        note: 'Player handout',
      },
    },
    gmMaps: ['map/gm-map.svg'],
    handoutPages: [
      [
        { section: 'player-brief-a-gift-of-wine', kind: 'player' },
        { section: 'how-to-play', kind: 'player' },
      ],
      [{ section: 'handout-1-lady-harrows-commission', kind: 'document' }],
      [{ section: 'handout-2-the-warm-hill-song', kind: 'songsheet' }],
      [
        { section: 'handout-3-the-fourth-verse', kind: 'letter' },
        { section: 'handout-6-lucans-orders', kind: 'document' },
      ],
      [{ section: 'handout-4-the-keepers-log', kind: 'ledger' }],
      [{ map: 'map/player-map.svg' }],
      [{ section: 'handout-7-the-waking', kind: 'track-and-tokens' }],
    ],
  },
};
