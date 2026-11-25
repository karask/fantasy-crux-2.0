// Draws the two cross-section maps of the Warm Hill for Lullaby for a Dragon: the keepers' plan
// of the works, which the players find in the lodge, and the GM's map with the dragon, the
// scores, the Sky Door and the thief's way out. It reuses the rules-diagram kit, so the maps
// share the books' palette and type. Run from the repository root, because the kit measures text
// with fonts from node_modules:
//
//   node adventures/lullaby-for-a-dragon/map/build-maps.mjs
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  arrow,
  badge,
  chip,
  colour,
  escapeXml,
  line,
  rect,
  svgDocument,
  text,
} from '../../../scripts/diagrams/kit.mjs';
import { type } from '../../../scripts/diagrams/kit.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

const width = 1200;
const height = 930;
const rockBottom = 840;
const vine = '#5b6b3a';

const labelStyle = { ...type.label, size: 15 };
const smallStyle = { ...type.small, size: 14 };
const noteStyle = { ...type.note, size: 15 };
const titleStyle = { ...type.big, size: 30 };

// The hill: terraces climbing from the press house to the tower, then a steep fall to the gorge.
const terraces = [
  [0, 300],
  [70, 300],
  [70, 286],
  [160, 280],
  [160, 262],
  [250, 254],
  [250, 236],
  [340, 226],
  [340, 206],
  [430, 196],
  [430, 176],
  [520, 166],
  [520, 146],
  [610, 136],
  [610, 118],
  [690, 110],
  [740, 110],
  [820, 150],
  [900, 230],
  [980, 330],
  [1020, 420],
  [1040, 520],
  [1050, 640],
  [width, 650],
];

function draw(gm) {
  const parts = [];
  const put = (x, y, value, style, options) => parts.push(text(x, y, value, style, options).svg);

  // Sky and rock. The keepers' plan is drawn on old paper.
  parts.push(rect(0, 0, width, height, { fill: gm ? colour.paper : '#f6efdc', radius: 0 }));
  const bottom = gm ? rockBottom : height;
  parts.push(
    `<polygon points="${terraces.map(([x, y]) => `${x},${y}`).join(' ')} ${width},${bottom} 0,${bottom}" fill="${gm ? colour.bone : '#e9dcbc'}"/>`,
  );

  // Open spaces: outlines first, fills second, so connected spaces join without a seam.
  const stair = [
    [712, 112],
    [744, 150],
    [700, 190],
    [748, 230],
    [704, 270],
    [752, 310],
    [708, 350],
    [740, 384],
  ];
  const spaces = [
    { polyline: stair, width: 14 },
    { rect: [690, 250, 96, 26] }, // the steam gallery
    { rect: [700, 372, 150, 52] }, // the keepers' lodge
    {
      polyline: [
        [840, 416],
        [866, 440],
        [850, 470],
      ],
      width: 14,
    }, // the lower passage
    {
      path: 'M560 470 Q560 440 590 440 H850 Q880 440 880 470 V620 Q880 640 860 640 H580 Q560 640 560 620 Z',
    }, // the Lullaby
    {
      path: 'M250 360 Q250 236 400 232 Q520 230 552 300 Q572 360 570 470 Q566 500 540 500 H300 Q252 500 250 450 Z',
    }, // her chamber
    { rect: [410, 186, 24, 50] }, // the Sky Door shaft
    {
      polyline: [
        [876, 612],
        [940, 622],
        [1000, 632],
        [1052, 640],
      ],
      width: 26,
    }, // the stream cave
    {
      polyline: [
        [120, 700],
        [330, 676],
        [470, 650],
        [566, 622],
      ],
      width: 12,
      fill: colour.goodTint,
    }, // the stream, from the deep hill
  ];
  const shape = (space, fill, stroke, extra) => {
    const edge = stroke ? ` stroke="${stroke}" stroke-width="${extra}"` : '';
    if (space.rect) {
      const [x, y, w, h] = space.rect;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${edge}/>`;
    }
    if (space.path) return `<path d="${space.path}" fill="${fill}"${edge}/>`;
    const points = space.polyline.map(([x, y]) => `${x},${y}`).join(' ');
    return `<polyline points="${points}" fill="none" stroke="${stroke ?? fill}" stroke-width="${space.width + (stroke ? extra : 0)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  };
  const ink = gm ? colour.ink : '#4a3b1c';
  const open = gm ? colour.paper : '#fbf6e8';
  for (const space of spaces) parts.push(shape(space, ink, ink, 3.2));
  for (const space of spaces) parts.push(shape(space, space.fill ?? open));

  // The surface, the vines and the warm stones.
  parts.push(line(terraces, { stroke: ink, width: 2.2 }));
  for (let index = 0; index < terraces.length - 1; index += 1) {
    const [x1, y1] = terraces[index];
    const [x2, y2] = terraces[index + 1];
    if (y1 !== y2 && Math.abs(x2 - x1) > 4 && x2 <= 690) {
      for (let x = x1 + 10; x < x2 - 4; x += 16) {
        const y = y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
        parts.push(
          `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 9}" stroke="${vine}" stroke-width="1.4"/><circle cx="${x + 2.5}" cy="${y - 5}" r="2" fill="#6b2f5a"/>`,
        );
      }
    }
  }

  // The tower on the summit, and the press house at the foot of the hill.
  parts.push(
    rect(690, 60, 44, 52, { fill: gm ? colour.boneLight : '#efe2c2', stroke: ink, radius: 0 }),
  );
  parts.push(
    line(
      [
        [686, 60],
        [738, 60],
      ],
      { stroke: ink, width: 3 },
    ),
  );
  for (const x of [694, 708, 722])
    parts.push(
      rect(x, 52, 8, 8, {
        fill: gm ? colour.boneLight : '#efe2c2',
        stroke: ink,
        strokeWidth: 1.2,
        radius: 0,
      }),
    );
  parts.push(`<polygon points="24,264 82,240 140,264" fill="${gm ? colour.muted : '#7a6a48'}"/>`);
  parts.push(
    rect(30, 264, 104, 36, { fill: gm ? colour.boneLight : '#efe2c2', stroke: ink, radius: 0 }),
  );

  // Water: the stream through the Lullaby and down the cave to the spring.
  const water = (points, w) =>
    parts.push(
      `<polyline points="${points.map(([x, y]) => `${x},${y}`).join(' ')}" fill="none" stroke="${colour.goodTint}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  water(
    [
      [566, 626],
      [700, 630],
      [870, 630],
    ],
    12,
  );
  water(
    [
      [876, 620],
      [940, 630],
      [1000, 640],
      [1052, 646],
    ],
    10,
  );
  parts.push(rect(1052, 638, 148, 14, { fill: colour.goodTint, radius: 0 }));

  // The Lullaby: pipes, the waterwheel and the cradle with its score.
  const pipeHeights = [70, 104, 136, 120, 92, 150, 128, 96, 112, 84];
  pipeHeights.forEach((h, index) => {
    const x = 724 + index * 15;
    parts.push(
      rect(x, 600 - h, 9, h, {
        fill: gm ? '#d7b866' : '#e3cf98',
        stroke: gm ? colour.brass : '#7a6a48',
        strokeWidth: 1.1,
        radius: 1,
      }),
    );
  });
  parts.push(
    `<circle cx="620" cy="596" r="30" fill="none" stroke="${ink}" stroke-width="2.4"/>` +
      [0, 30, 60, 90, 120, 150]
        .map((deg) => {
          const a = (deg * Math.PI) / 180;
          return `<line x1="${620 - 30 * Math.cos(a)}" y1="${596 - 30 * Math.sin(a)}" x2="${620 + 30 * Math.cos(a)}" y2="${596 + 30 * Math.sin(a)}" stroke="${ink}" stroke-width="1.3"/>`;
        })
        .join(''),
  );
  parts.push(
    rect(596, 524, 32, 12, {
      fill: gm ? '#e2b93b' : '#d8c07a',
      stroke: colour.brass,
      strokeWidth: 1.4,
      radius: 3,
    }),
  );
  parts.push(
    line(
      [
        [580, 466],
        [870, 466],
      ],
      { stroke: ink, width: 2.2 },
    ),
  );

  // Her chamber: the hoard, and on the GM map, the dragon herself.
  parts.push(
    `<path d="M262 490 Q300 452 360 470 Q420 440 480 466 Q530 448 560 476 L560 494 Q552 500 540 500 H300 Q262 500 262 490 Z" fill="${gm ? '#e9c862' : '#e3cf98'}" opacity="0.9"/>`,
  );
  if (gm) {
    const dark = '#7d2414';
    parts.push(
      // Tail, curled round the front of her.
      `<path d="M546 468 C 566 490 528 500 466 500 C 416 500 382 498 360 494" fill="none" stroke="${dark}" stroke-width="14" stroke-linecap="round"/>` +
        `<path d="M546 468 C 566 490 528 500 466 500 C 416 500 382 498 360 494" fill="none" stroke="${colour.oxide}" stroke-width="10" stroke-linecap="round"/>` +
        // Body.
        `<path d="M362 470 C 342 412 392 374 460 378 C 530 382 562 430 550 468 C 542 492 502 498 452 496 C 404 494 372 490 362 470 Z" fill="${colour.oxide}" stroke="${dark}" stroke-width="2"/>` +
        // Folded wing on her back.
        `<path d="M398 394 L 428 330 L 452 354 L 476 320 L 494 350 L 520 332 L 524 394 Q 470 408 398 394 Z" fill="#c4523b" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>` +
        `<path d="M408 394 L 428 334 M 446 396 L 476 324 M 488 396 L 518 336" fill="none" stroke="${dark}" stroke-width="1.4"/>` +
        // Neck down to her head, resting on the gold.
        `<path d="M394 432 C 362 420 332 440 320 466" fill="none" stroke="${dark}" stroke-width="28" stroke-linecap="round"/>` +
        `<path d="M394 432 C 362 420 332 440 320 466" fill="none" stroke="${colour.oxide}" stroke-width="24" stroke-linecap="round"/>` +
        `<path d="M334 460 C 320 450 290 452 270 464 L 258 474 C 268 484 300 488 334 482 Z" fill="${colour.oxide}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>` +
        `<path d="M322 456 L 348 440 L 332 460 Z M 312 455 L 334 434 L 320 457 Z" fill="${dark}"/>` +
        `<path d="M292 467 q 7 4 14 0" fill="none" stroke="#f1e6c6" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M256 470 q -10 -7 -20 -3 M 256 478 q -10 4 -20 2" fill="none" stroke="#e2b93b" stroke-width="1.6" stroke-linecap="round"/>`,
    );
    // The Silver Score, under her right forefoot.
    parts.push(
      rect(328, 487, 42, 9, { fill: '#c9ccd1', stroke: '#6d6a63', strokeWidth: 1.2, radius: 2 }),
    );
    parts.push(
      `<path d="M346 497 C 346 480 366 476 378 486 L 382 497 Z" fill="${colour.oxide}" stroke="${dark}" stroke-width="1.6"/>` +
        `<path d="M348 497 l -3 4 M 358 497 l -2 4 M 368 497 l -1 4" stroke="${dark}" stroke-width="1.6" stroke-linecap="round"/>`,
    );
    // Warm air rising through the vines.
    for (const x of [300, 380, 470, 560]) {
      const surface = terraces.reduce((y, [tx, ty], index) => {
        const next = terraces[index + 1];
        if (!next || x < tx || x > next[0] || tx === next[0]) return y;
        return ty + ((next[1] - ty) * (x - tx)) / (next[0] - tx);
      }, 0);
      parts.push(
        `<path d="M${x} ${surface - 16} q 6 -8 0 -16 q -6 -8 0 -16" fill="none" stroke="${colour.oxide}" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>`,
      );
    }
  }
  // The Sky Door, sealed.
  parts.push(rect(404, 182, 36, 8, { fill: ink, radius: 1 }));

  // Song-locks.
  const lock = (cx, cy, numeral) =>
    parts.push(badge(cx, cy, numeral, { tone: 'warn', radius: 11 }));
  lock(712, 124, 'I');
  lock(860, 398, 'II');
  lock(850, 478, 'III');

  // Title and legend.
  put(28, 22, gm ? 'The Warm Hill' : 'The works under the Warm Hill', titleStyle, { fill: ink });
  put(
    28,
    62,
    gm
      ? 'GM map: the works, her chamber and the way out'
      : 'Keepers’ plan, copied for the lodge wall',
    noteStyle,
    {
      fill: gm ? colour.muted : '#6b5a36',
    },
  );
  const legend = [
    [badge(893, 31, 'I', { tone: 'warn', radius: 9 }), 'Song-lock: sing the verse'],
    [
      rect(880, 46, 26, 14, {
        fill: colour.goodTint,
        stroke: colour.good,
        strokeWidth: 1.2,
        radius: 2,
      }),
      'Underground stream',
    ],
  ];
  if (gm) {
    legend.push([
      line(
        [
          [880, 75],
          [906, 75],
        ],
        { stroke: colour.oxide, width: 2.2, dash: '6 4' },
      ),
      "Lucan's way out",
    ]);
  }
  legend.forEach(([swatch, words], index) => {
    parts.push(swatch);
    put(914, 22 + index * 22, words, noteStyle, { fill: ink });
  });

  // Labels.
  put(756, 70, 'Signal tower', labelStyle, { fill: ink });
  put(16, 222, 'Press house · the Crush', labelStyle, { fill: ink });
  put(796, 255, 'Steam gallery', smallStyle, { fill: ink });
  put(772, 300, "Keepers' stair", smallStyle, { fill: ink });
  put(775, 386, "Keepers' lodge", smallStyle, { anchor: 'middle', fill: ink });
  put(600, 448, 'The Lullaby', labelStyle, { fill: ink });
  put(684, 646, 'Waterwheel', smallStyle, { fill: ink });
  put(590, 542, gm ? 'Golden Score' : 'Cradle', smallStyle, { fill: gm ? colour.brass : ink });
  put(310, 296, gm ? 'Her chamber · the hoard' : 'Her chamber', labelStyle, {
    fill: gm ? colour.oxide : ink,
  });
  if (!gm) put(310, 318, 'Do not enter. Do not wake.', noteStyle, { fill: '#6b5a36' });
  put(446, 200, 'Sky Door · sealed', smallStyle, { fill: ink });
  put(120, 708, 'Stream from the deep hill', smallStyle, { fill: ink });
  put(1196, 662, gm ? 'Warm Spring · cut grate' : 'Warm Spring · water grate', smallStyle, {
    anchor: 'end',
    fill: ink,
  });
  put(886, 584, 'Stream cave', smallStyle, { fill: ink });
  if (gm) {
    put(296, 516, 'Silver Score, under her right forefoot', smallStyle, { fill: colour.muted });
    put(300, 168, 'warm air', smallStyle, { fill: colour.oxide });
    parts.push(
      arrow(
        [
          [880, 600],
          [990, 616],
          [1046, 628],
        ],
        { stroke: colour.oxide, width: 2.2, dash: '6 4', head: 9 },
      ),
    );
    put(16, 316, '← Lenmarch and the Empty Chair', smallStyle, { fill: colour.muted });
  } else {
    put(
      28,
      760,
      'Gates open to the song. Keep the wheel turning. Keep the score in its cradle.',
      noteStyle,
      {
        fill: '#6b5a36',
      },
    );
    put(28, 782, 'If the music stops, she wakes.', noteStyle, { fill: '#6b5a36' });
  }

  // The Waking, on the GM map.
  if (gm) {
    put(24, 873, 'The Waking', labelStyle);
    for (let box = 1; box <= 10; box += 1) {
      const x = 170 + (box - 1) * 74;
      const tone = box === 10 ? 'bad' : [4, 7].includes(box) ? 'warn' : 'plain';
      const fill = { plain: colour.paper, warn: colour.brassTint, bad: colour.oxideTint }[tone];
      const stroke = { plain: colour.ink, warn: colour.brass, bad: colour.oxide }[tone];
      parts.push(rect(x, 866, 66, 30, { fill, stroke, strokeWidth: 1.5, radius: 3 }));
      put(x + 33, 872, String(box), labelStyle, { anchor: 'middle' });
    }
    for (const [box, words] of [
      [4, 'Dreaming'],
      [7, 'Stirring'],
      [10, 'Awake'],
    ])
      put(170 + (box - 1) * 74 + 33, 902, words, smallStyle, { anchor: 'middle' });
    parts.push(
      chip(1190, 868, 'Depths not to scale', { tone: 'plain', style: smallStyle, anchor: 'end' })
        .svg,
    );
  }

  const title = gm ? 'The Warm Hill: GM map' : 'The works under the Warm Hill: keepers’ plan';
  return svgDocument(width, height, `<title>${escapeXml(title)}</title>\n${parts.join('\n')}`);
}

for (const [name, gm] of [
  ['player-map.svg', false],
  ['gm-map.svg', true],
]) {
  writeFileSync(path.join(here, name), draw(gm));
  console.log(`wrote ${path.relative(process.cwd(), path.join(here, name))}`);
}
