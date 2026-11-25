// Draws the two cross-section maps of the Thornwick Deep for Twelve Below: the players' mine plan,
// and the GM's map with the gas, the breach, the troll's routes and the Old Seam. It reuses the
// rules-diagram kit, so the maps share the books' palette and type. Run from the repository root,
// because the kit measures text with fonts from node_modules:
//
//   node adventures/twelve-below/map/build-maps.mjs
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
  textWidth,
  type,
} from '../../../scripts/diagrams/kit.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

const width = 1200;
const height = 930;
const surface = 200;
const depth = (metres) => surface + metres * 4.5; // depths are to scale; lengths are not
const level1 = depth(40);
const level2 = depth(80);
const level3 = depth(120);
const tunnel = 20;
const rockBottom = 850;
const hill = (x) => (x <= 700 ? surface : surface - (x - 700) * 0.2);

const labelStyle = { ...type.label, size: 15 };
const smallStyle = { ...type.small, size: 14 };
const noteStyle = { ...type.note, size: 15 };
const titleStyle = { ...type.big, size: 30 };

function draw(gm) {
  const parts = [];
  const put = (x, y, value, style, options) => parts.push(text(x, y, value, style, options).svg);

  // Sky and rock.
  parts.push(rect(0, 0, width, height, { fill: colour.paper, radius: 0 }));
  parts.push(
    `<polygon points="0,${surface} 700,${surface} ${width},${hill(width)} ${width},${rockBottom} 0,${rockBottom}" fill="${colour.bone}"/>`,
  );

  // Open spaces: every outline is drawn first and every fill second, so connected spaces join
  // without a line between them.
  const spaces = [
    { rect: [214, surface, 34, level3 + 50 - surface] }, // the shaft and its sump
    { rect: [248, level1 - tunnel, 742, tunnel] }, // Level 1, the Upper Drift
    { rect: [110, level2 - tunnel, 104, tunnel] }, // Level 2, the pump gallery
    { rect: [248, level2 - tunnel, 352, tunnel] }, // Level 2, the east drift
    { rect: [600, level2 - 90, 190, 120] }, // the stope
    { rect: [614, level2 + 30, 14, level3 - tunnel - level2 - 30] }, // the old winze
    { rect: [248, level3 - tunnel, 632, tunnel] }, // Level 3, the Deep
    { rect: [958, level1, 12, level3 - 85 - level1] }, // the Chimney
    { path: `M880 ${level3} V${level3 - 74} Q935 ${level3 - 120} 990 ${level3 - 74} V${level3} Z` }, // the Chapel
  ];
  if (gm) {
    spaces.push(
      {
        polyline: [
          [520, level3 + 2],
          [528, level3 + 50],
          [640, level3 + 76],
          [860, level3 + 82],
          [1060, level3 + 76],
          [1140, level3 + 50],
          [1144, level3 - 7],
        ],
        width: 30,
        fill: colour.goodTint,
      },
      {
        polyline: [
          [1144, level3 - 7],
          [1146, level3 - 140],
          [1136, level3 - 290],
          [1146, level3 - 440],
          [1142, level3 - 472],
        ],
        width: 30,
      },
      { ellipse: [1140, 240, 46, 28] }, // the troll's den
      { rect: [1134, hill(1140), 12, 214 - hill(1140)] }, // the Goat Grate
    );
  }
  const shape = (space, fill, stroke, extra) => {
    if (space.rect) {
      const [x, y, w, h] = space.rect;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${extra}"` : ''}/>`;
    }
    if (space.path)
      return `<path d="${space.path}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${extra}"` : ''}/>`;
    if (space.ellipse) {
      const [cx, cy, rx, ry] = space.ellipse;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${extra}"` : ''}/>`;
    }
    const points = space.polyline.map(([x, y]) => `${x},${y}`).join(' ');
    return `<polyline points="${points}" fill="none" stroke="${stroke ?? fill}" stroke-width="${space.width + (stroke ? extra : 0)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  };
  for (const space of spaces) parts.push(shape(space, colour.ink, colour.ink, 3.2));
  for (const space of spaces) parts.push(shape(space, space.fill ?? colour.paper));

  // The ground's surface.
  parts.push(
    line(
      [
        [0, surface],
        [700, surface],
        [width, hill(width)],
      ],
      { width: 2.2 },
    ),
  );

  // Gas, then water over it.
  const gas = { fill: colour.brassTint };
  const gasStart = gm ? 370 : 248;
  parts.push(
    `<g fill="${gas.fill}" fill-opacity="0.85">` +
      `<rect x="${gasStart}" y="${level3 - tunnel}" width="${880 - gasStart}" height="${tunnel}"/>` +
      `<path d="M880 ${level3} V${level3 - 74} Q935 ${level3 - 120} 990 ${level3 - 74} V${level3} Z"/>` +
      (gm ? `<rect x="958" y="${level3 - 135}" width="12" height="50"/>` : '') +
      '</g>',
  );
  const water = (x, y, w, h) => parts.push(rect(x, y, w, h, { fill: colour.goodTint, radius: 0 }));
  water(214, level3 - 7, 34, 57); // sump
  water(248, level3 - 7, 632, 7); // Level 3 tunnel, knee-deep
  water(880, level3 - 7, 110, 7); // Chapel floor
  water(600, level2 + 1, 190, 29); // the flooded stope
  water(614, level2 + 30, 14, level3 - tunnel - level2 - 30); // the winze
  water(110, level2 - 9, 104, 9); // pump gallery, waist-deep

  // The shaft: cage compartment, ladderway, and a landing every 6 m.
  parts.push(
    line(
      [
        [234, surface],
        [234, level3 + 50],
      ],
      { stroke: colour.muted, width: 1 },
    ),
  );
  for (const x of [238, 245])
    parts.push(
      line(
        [
          [x, surface],
          [x, level3 + 50],
        ],
        { stroke: colour.muted, width: 1 },
      ),
    );
  for (let y = surface + 27; y < level3 + 50; y += 27)
    parts.push(
      line(
        [
          [235, y],
          [248, y],
        ],
        { width: 1.6 },
      ),
    );
  parts.push(
    rect(216, surface + 3, 16, 20, {
      fill: colour.brassTint,
      stroke: colour.brass,
      strokeWidth: 1.4,
      radius: 1,
    }),
  );
  // The Chimney's rotten rungs.
  for (let y = level1 + 14; y < level3 - 90; y += 18)
    parts.push(
      line(
        [
          [959, y],
          [969, y],
        ],
        { stroke: colour.muted, width: 1.4 },
      ),
    );

  // Ledge, platform, and the Old Seam wall or its breach.
  parts.push(rect(752, level2 - 30, 38, 6, { fill: colour.muted, radius: 1 }));
  parts.push(rect(886, level3 - 55, 98, 5, { fill: colour.muted, radius: 1 }));
  if (gm) {
    for (const [a, b] of [
      [
        [678, level3 - 18],
        [694, level3 - 2],
      ],
      [
        [690, level3 - 18],
        [702, level3 - 4],
      ],
      [
        [684, level3 - 4],
        [700, level3 - 16],
      ],
    ])
      parts.push(line([a, b], { stroke: colour.muted, width: 3 }));
  } else {
    parts.push(
      line(
        [
          [505, level3],
          [535, level3],
        ],
        { width: 6 },
      ),
    );
  }

  // Buildings at the surface.
  parts.push(rect(140, 80, 14, 60, { fill: colour.muted, radius: 0 }));
  parts.push(
    `<polygon points="54,${surface - 58} 115,${surface - 86} 176,${surface - 58}" fill="${colour.muted}"/>`,
  );
  parts.push(
    rect(60, surface - 58, 110, 58, {
      fill: colour.boneLight,
      stroke: colour.ink,
      radius: 0,
    }),
  );
  parts.push(
    line(
      [
        [170, surface - 48],
        [222, surface - 74],
      ],
      { width: 1.2 },
    ),
  );
  parts.push(
    line(
      [
        [206, surface],
        [231, surface - 78],
        [256, surface],
      ],
      { width: 2.4 },
    ),
  );
  parts.push(
    line(
      [
        [215, surface - 30],
        [247, surface - 30],
      ],
      { width: 1.6 },
    ),
  );
  parts.push(
    `<circle cx="231" cy="${surface - 74}" r="11" fill="${colour.paper}" stroke="${colour.ink}" stroke-width="2"/>`,
  );
  parts.push(
    `<polygon points="296,${surface - 38} 350,${surface - 56} 404,${surface - 38}" fill="${colour.muted}"/>`,
  );
  parts.push(
    rect(300, surface - 38, 100, 38, { fill: colour.boneLight, stroke: colour.ink, radius: 0 }),
  );
  if (gm) {
    parts.push(
      line(
        [
          [1128, hill(1140) + 2],
          [1152, hill(1140) - 3],
        ],
        { width: 4 },
      ),
    );
  }

  // Title and legend.
  put(440, 22, 'The Thornwick Deep', titleStyle);
  put(
    440,
    62,
    gm
      ? 'GM map: the gas, the troll and the Old Seam'
      : 'Mine plan, drawn by Captain Hulda Brannoch',
    noteStyle,
    { fill: colour.muted },
  );
  const legend = [
    [
      rect(880, 22, 26, 14, {
        fill: colour.brassTint,
        stroke: colour.brass,
        strokeWidth: 1.2,
        radius: 2,
      }),
      gm ? 'Firedamp: no naked flames' : 'Firedamp: safety lamps only',
    ],
    [
      rect(880, 44, 26, 14, {
        fill: colour.goodTint,
        stroke: colour.good,
        strokeWidth: 1.2,
        radius: 2,
      }),
      'Water at nightfall',
    ],
    [badge(893, 73, '#', { radius: 9 }), 'Miners trapped, by the ledger'],
  ];
  if (gm)
    legend.push([
      line(
        [
          [880, 95],
          [906, 95],
        ],
        { stroke: colour.oxide, width: 2.2, dash: '6 4' },
      ),
      "The troll's routes",
    ]);
  legend.forEach(([swatch, words], index) => {
    parts.push(swatch);
    put(914, 20 + index * 22, words, noteStyle);
  });

  // Surface labels.
  put(115, 48, 'Engine house', labelStyle, { anchor: 'middle' });
  put(231, 92, 'Pithead', labelStyle, { anchor: 'middle' });
  put(350, 118, 'Lamp room · office', labelStyle, { anchor: 'middle' });
  put(256, surface + 6, 'Cage · holds 4', smallStyle);
  put(256, surface + 36, 'Shaft', labelStyle);
  put(256, surface + 56, 'Ladders, a landing every 6 m', noteStyle);

  // Level labels with their depths, each followed on the GM map by its scene.
  const scene = (x, y, number) =>
    parts.push(chip(x, y, `Scene ${number}`, { tone: 'bad', style: smallStyle }).svg);
  const levelLabel = (y, words, metres, number) => {
    put(262, y, words, labelStyle);
    const after = 262 + textWidth(words, labelStyle) + 10;
    const depthNote = `${metres} m down`;
    put(after, y, depthNote, noteStyle, { fill: colour.muted });
    if (gm) scene(after + textWidth(depthNote, noteStyle) + 14, y - 3.5, number);
  };
  levelLabel(level1 - tunnel - 26, 'Level 1 · Upper Drift', 40, 2);
  levelLabel(level2 - tunnel - 26, 'Level 2', 80, 3);
  levelLabel(level3 - tunnel - 26, 'Level 3 · the Deep', 120, 4);
  if (gm) scene(270, 90, 1);

  put(110, level2 - tunnel - 26, 'Pump gallery', labelStyle);
  put(610, level2 - 84, 'Flooded stope', labelStyle);
  put(798, level2 - 50, '+ pony', smallStyle);
  put(636, level2 + 60, 'Old winze · flooded', smallStyle);
  put(
    640,
    level3 - tunnel - 26,
    gm ? 'Firedamp · no naked flames' : 'Firedamp · safety lamps only',
    labelStyle,
    {
      fill: colour.brass,
    },
  );
  put(870, level3 - 100, 'The Chapel', labelStyle, { anchor: 'end' });
  put(984, 470, 'The Chimney', labelStyle);
  put(984, 492, 'old air raise,', noteStyle);
  put(984, 512, 'rotten rungs', noteStyle);
  put(208, level3 + 20, 'Sump', smallStyle, { anchor: 'end' });
  if (gm) {
    put(256, level3 + 6, 'Station · fresh air', smallStyle);
    put(548, level3 + 6, 'The breach', smallStyle, { fill: colour.oxide });
    put(672, level3 + 6, 'The crawl', smallStyle);
    put(700, level3 + 66, 'The Old Seam · flooded caves', smallStyle);
    put(1086, 228, "Troll's den", labelStyle, { anchor: 'end' });
    put(1126, 150, 'Goat Grate', labelStyle, { anchor: 'end' });
  } else {
    put(470, level3 + 6, 'Old Seam wall · sealed', smallStyle);
  }

  // The twelve, where the ledger puts them.
  parts.push(badge(470, level1 - 10, 2, { radius: 12 }));
  parts.push(badge(771, level2 - 43, 3, { radius: 12 }));
  parts.push(badge(920, level3 - 68, 7, { radius: 12 }));

  // How high the water stands at each threshold.
  for (const [y, words] of [
    [level1, 'Box 12 · dawn'],
    [level2, 'Box 10'],
    [level3 - tunnel, 'Box 8'],
  ])
    parts.push(chip(14, y - 12, words, { tone: 'good', style: smallStyle }).svg);

  // The troll's routes.
  if (gm) {
    const route = { stroke: colour.oxide, width: 2.2, dash: '6 4', head: 9 };
    parts.push(
      arrow(
        [
          [528, level3 + 34],
          [522, level3 - 10],
          [300, level3 - 10],
        ],
        route,
      ),
    );
    parts.push(
      arrow(
        [
          [621, level3 - 12],
          [621, level2 + 12],
        ],
        route,
      ),
    );
    parts.push(
      arrow(
        [
          [246, level3 - 24],
          [246, level1 + 4],
        ],
        route,
      ),
    );
    parts.push(
      arrow(
        [
          [1172, level3 - 40],
          [1174, 282],
        ],
        route,
      ),
    );
  }

  // The Water track.
  put(24, 873, 'The Water', labelStyle);
  for (let box = 1; box <= 12; box += 1) {
    const x = 150 + (box - 1) * 68;
    const tone = box === 12 ? 'bad' : [4, 8, 10].includes(box) ? 'warn' : 'plain';
    const fill = { plain: colour.paper, warn: colour.brassTint, bad: colour.oxideTint }[tone];
    const stroke = { plain: colour.ink, warn: colour.brass, bad: colour.oxide }[tone];
    parts.push(rect(x, 866, 62, 30, { fill, stroke, strokeWidth: 1.5, radius: 3 }));
    put(x + 31, 872, String(box), labelStyle, { anchor: 'middle' });
  }
  for (const [box, words] of [
    [4, 'L3 waist-deep'],
    [8, 'L3 roof'],
    [10, 'Level 2'],
    [12, 'Dawn · Level 1'],
  ])
    put(150 + (box - 1) * 68 + 31, 902, words, smallStyle, { anchor: 'middle' });
  put(1188, 864, 'Depths to scale.', noteStyle, { anchor: 'end', fill: colour.muted });
  put(1188, 884, 'Lengths are not.', noteStyle, { anchor: 'end', fill: colour.muted });

  const title = gm ? 'The Thornwick Deep: GM map' : 'The Thornwick Deep: mine plan';
  return svgDocument(width, height, `<title>${escapeXml(title)}</title>\n${parts.join('\n')}`);
}

for (const [name, gm] of [
  ['player-map.svg', false],
  ['gm-map.svg', true],
]) {
  writeFileSync(path.join(here, name), draw(gm));
  console.log(`wrote ${path.relative(process.cwd(), path.join(here, name))}`);
}
