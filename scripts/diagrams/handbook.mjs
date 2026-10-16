// Print variants for the A5 player handbook. They share the website kit, palette, and type,
// but are laid out wide and shallow so they fit a 123 mm text column beside their page's text.
// At that width one unit prints at about 0.7 pt, so mixed-case text stays at 14.5 units or more
// (10 pt, the handbook's table minimum) and uppercase labels at 13 or more (9 pt).
// Each page's prose carries the full rule; these diagrams only summarise it.
import {
  arrow,
  card,
  colour,
  die,
  line,
  lineHeight,
  rect,
  svgDocument,
  text,
  textLines,
  tones,
  type,
  wrap,
} from './kit.mjs';

const width = 480;
const margin = 4;
const big = { ...type.body, size: 16 };
const note = { ...type.note, size: 14.5 };
const small = { ...type.small, size: 13 };
const mono = { ...type.mono, size: 14.5 };

/** A row of equal step boxes joined by arrows. Returns markup and box geometry. */
function stepRow(steps, top, { tone = 'plain', gap = 14, padding = 12 } = {}) {
  const boxWidth = (width - margin * 2 - gap * (steps.length - 1)) / steps.length;
  const boxHeight = Math.max(
    ...steps.map(
      ([title, body]) => card(0, 0, boxWidth, { title, body, bodyStyle: note, padding }).height,
    ),
  );
  const parts = [];
  const centres = [];
  steps.forEach(([title, body, stepTone], index) => {
    const x = margin + index * (boxWidth + gap);
    centres.push(x + boxWidth / 2);
    parts.push(
      card(x, top, boxWidth, {
        title,
        body,
        bodyStyle: note,
        padding,
        tone: stepTone ?? tone,
        minHeight: boxHeight,
      }).svg,
    );
    if (index)
      parts.push(
        arrow(
          [
            [x - gap, top + boxHeight / 2],
            [x, top + boxHeight / 2],
          ],
          { head: 6 },
        ),
      );
  });
  return { svg: parts.join(''), boxHeight, centres };
}

/** Damage steps in one row, with the critical shortcut over Parry and armour. */
function damageSteps() {
  const top = 32;
  const row = stepRow(
    [
      ['Roll', 'dice + DM'],
      ['Parry', 'by Size'],
      ['Armour', 'minus AP'],
      ['Reserve', 'if any'],
      ['Lose HP', 'the rest'],
    ],
    top,
    { gap: 10, padding: 8 },
  );
  const [first, , , fourth] = row.centres;
  const bracket = arrow(
    [
      [first, top],
      [first, 22],
      [fourth, 22],
      [fourth, top],
    ],
    {
      stroke: colour.brass,
      dash: '5 3',
      head: 6,
    },
  );
  const label = text(
    (first + fourth) / 2,
    0,
    'Critical hit: maximum damage, skipping Parry and armour',
    note,
    {
      anchor: 'middle',
      fill: colour.brass,
    },
  );
  return svgDocument(width, top + row.boxHeight + 2, bracket + label.svg + row.svg);
}

/** The four result grades for a 60% skill. */
function d100Grades() {
  const parts = [text(margin, 0, 'Skill 60%', small).svg];
  const barTop = 20;
  const barHeight = 44;
  const segments = [
    ['Critical', '01–06', 66, 'good', true],
    ['Success', '07–60', 190, 'good', false],
    ['Failure', '61–98', 150, 'quiet', false],
    ['Fumble', '99–00', width - margin * 2 - 66 - 190 - 150, 'bad', true],
  ];
  let x = margin;
  for (const [grade, range, segmentWidth, tone, strong] of segments) {
    const palette = tones[tone];
    parts.push(
      rect(x, barTop, segmentWidth - 3, barHeight, {
        fill: strong ? palette.head : palette.fill,
        stroke: palette.stroke,
        strokeWidth: 1.4,
        radius: 3,
      }),
    );
    const ink = strong ? '#ffffff' : colour.ink;
    parts.push(
      text(x + (segmentWidth - 3) / 2, barTop + 5, grade, small, { anchor: 'middle', fill: ink })
        .svg,
    );
    parts.push(
      text(x + (segmentWidth - 3) / 2, barTop + 22, range, mono, {
        anchor: 'middle',
        fill: strong ? '#ffffff' : colour.muted,
      }).svg,
    );
    x += segmentWidth;
  }
  return svgDocument(width, barTop + barHeight + 2, parts.join(''));
}

/** Choosing between Bonus and Penalty candidates: grade first, then the roll. */
function bonusPenalty() {
  const parts = [];
  const diceY = 26;
  parts.push(die(margin + 20, diceY, 5, { tone: 'warn', size: 30 }));
  parts.push(die(margin + 62, diceY, 2, { size: 30 }));
  parts.push(die(margin + 98, diceY, 6, { size: 30 }));
  parts.push(
    text(margin + 20, diceY + 16, 'Units', small, { anchor: 'middle', fill: colour.muted }).svg,
  );
  parts.push(
    text(margin + 80, diceY + 16, 'Tens', small, { anchor: 'middle', fill: colour.muted }).svg,
  );
  parts.push(
    text(margin + 60, diceY + 40, '25 or 65', { ...type.big, size: 24 }, { anchor: 'middle' }).svg,
  );

  const left = margin + 140;
  const gap = 10;
  const panelWidth = (width - margin - left - gap) / 2;
  const panels = [
    ['Skill 70%', 'Both succeed. Higher is better: +1B keeps 65; -1P keeps 25.'],
    ['Skill 60%', '65 fails. Success beats failure: +1B keeps 25; -1P keeps 65.'],
  ];
  const height = Math.max(
    ...panels.map(
      ([title, body]) => card(0, 0, panelWidth, { title, body, bodyStyle: note }).height,
    ),
  );
  panels.forEach(([title, body], index) => {
    parts.push(
      card(left + index * (panelWidth + gap), 2, panelWidth, {
        title,
        body,
        bodyStyle: note,
        minHeight: height,
      }).svg,
    );
  });
  return svgDocument(width, Math.max(height + 4, diceY + 64), parts.join(''));
}

/** Active Magnitude as a budget against INT. */
function activeMagnitude() {
  const parts = [text(margin, 0, 'INT 13 = Active Magnitude limit', small).svg];
  const unit = 30;
  const barTop = 20;
  const barHeight = 38;
  const limitX = margin + 13 * unit;
  parts.push(
    rect(margin, barTop, 13 * unit, barHeight, {
      fill: colour.paper,
      stroke: colour.ink,
      strokeWidth: 2,
      radius: 3,
    }),
  );
  let x = margin;
  for (const [name, tone] of [
    ['Ward M4', 'good'],
    ['Flight M4', 'warn'],
    ['Summon M4', 'quiet'],
  ]) {
    const palette = tones[tone];
    parts.push(
      rect(x + 2, barTop + 3, 4 * unit - 4, barHeight - 6, {
        fill: palette.fill,
        stroke: palette.stroke,
        strokeWidth: 1.2,
        radius: 2,
      }),
    );
    parts.push(text(x + 2 * unit, barTop + 9, name, small, { anchor: 'middle' }).svg);
    x += 4 * unit;
  }
  const rowTop = barTop + barHeight + 8;
  parts.push(
    rect(margin + 12 * unit + 2, rowTop, 3 * unit - 4, 28, {
      fill: colour.oxideTint,
      stroke: colour.oxide,
      strokeWidth: 1.5,
      radius: 2,
      dash: '5 3',
    }),
  );
  parts.push(
    text(margin + 14 * unit, rowTop + 4, '+M3', mono, { anchor: 'middle', fill: colour.oxide }).svg,
  );
  parts.push(
    line(
      [
        [limitX, barTop - 6],
        [limitX, rowTop + 32],
      ],
      { stroke: colour.oxide, width: 2 },
    ),
  );
  parts.push(
    text(
      margin + 12 * unit - 8,
      rowTop + 4,
      'Another ongoing M3 makes 15: dismiss one first.',
      note,
      { anchor: 'end', fill: colour.oxide },
    ).svg,
  );
  return svgDocument(width, rowTop + 32, parts.join(''));
}

/** The Magnitude formula as one equation, using the firebolt. */
function shapingFormula() {
  const parts = [];
  const terms = [
    ['Intensity', '2', 'each outcome'],
    ['Range', '1', 'how far'],
    ['Duration', '0', 'how long'],
    ['Reach', '0', 'how many, how big'],
    ['Adjust', '+0', 'Direct, Trigger…'],
  ];
  const resultWidth = 84;
  const opWidth = 12;
  const termWidth = (width - margin * 2 - resultWidth - opWidth * terms.length) / terms.length;
  const boxHeight = 56;
  let x = margin;
  terms.forEach(([name, value, words], index) => {
    parts.push(
      rect(x, 2, termWidth, boxHeight, { fill: colour.paper, stroke: colour.ink, radius: 4 }),
    );
    parts.push(text(x + termWidth / 2, 5, name, small, { anchor: 'middle' }).svg);
    parts.push(
      text(x + termWidth / 2, 22, value, { ...type.big, size: 28 }, { anchor: 'middle' }).svg,
    );
    parts.push(
      textLines(
        x + termWidth / 2,
        boxHeight + 5,
        wrap(words, note, termWidth + opWidth - 2),
        note,
        { anchor: 'middle', fill: colour.muted },
      ).svg,
    );
    x += termWidth;
    parts.push(
      text(
        x + opWidth / 2,
        18,
        index === terms.length - 1 ? '=' : '+',
        { ...type.big, size: 24 },
        { anchor: 'middle', fill: colour.muted },
      ).svg,
    );
    x += opWidth;
  });
  parts.push(
    rect(x, 2, resultWidth, boxHeight, {
      fill: colour.brassTint,
      stroke: colour.brass,
      radius: 4,
      strokeWidth: 2,
    }),
  );
  parts.push(text(x + resultWidth / 2, 5, 'Magnitude', small, { anchor: 'middle' }).svg);
  parts.push(
    text(
      x + resultWidth / 2,
      22,
      '3',
      { ...type.big, size: 28 },
      { anchor: 'middle', fill: colour.oxide },
    ).svg,
  );
  parts.push(
    textLines(x + resultWidth / 2, boxHeight + 5, wrap('PP and risk', note, resultWidth), note, {
      anchor: 'middle',
      fill: colour.muted,
    }).svg,
  );
  return svgDocument(width, boxHeight + 5 + lineHeight(note) * 2 + 2, parts.join(''));
}

const costTone = { Used: 'quiet', Kept: 'good', 'None left': 'bad' };

/** What an option spends: one row per option, one chip per resource. */
function costChart(rows, title) {
  const parts = [];
  const nameWidth = 140;
  const columns = ['Combat Action', 'Movement Action', 'Reactions'];
  const columnWidth = (width - margin * 2 - nameWidth) / columns.length;
  const rowHeight = 27;
  if (title) parts.push(text(margin, 0, title, small, { fill: colour.muted }).svg);
  columns.forEach((column, index) => {
    parts.push(
      text(margin + nameWidth + columnWidth * index + columnWidth / 2, 0, column, small, {
        anchor: 'middle',
        fill: colour.muted,
      }).svg,
    );
  });
  let y = 20;
  for (const [name, ...cells] of rows) {
    parts.push(text(margin, y + 2, name, big).svg);
    cells.forEach((cell, index) => {
      const tone = costTone[cell] ?? 'warn';
      const palette = tones[tone];
      const x = margin + nameWidth + columnWidth * index + 6;
      parts.push(
        rect(x, y, columnWidth - 12, rowHeight - 5, {
          fill: palette.fill,
          stroke: palette.stroke,
          strokeWidth: 1.2,
          radius: 11,
        }),
      );
      parts.push(
        text(
          x + (columnWidth - 12) / 2,
          y,
          cell,
          { ...note, lineHeight: (rowHeight - 5) / note.size },
          {
            anchor: 'middle',
            fill: tone === 'quiet' ? colour.ink : palette.stroke,
          },
        ).svg,
      );
    });
    y += rowHeight;
  }
  return svgDocument(width, y, parts.join(''));
}

/** The four creation pools. */
function skillPools() {
  const parts = [];
  const pools = [
    ['Resistances', '50'],
    ['Combat', '50'],
    ['Knowledge', '50'],
    ['Practical', '75'],
  ];
  const gap = 10;
  const poolWidth = (width - margin * 2 - gap * 3) / 4;
  pools.forEach(([name, points], index) => {
    const x = margin + index * (poolWidth + gap);
    parts.push(rect(x, 2, poolWidth, 54, { fill: colour.paper, stroke: colour.ink, radius: 4 }));
    parts.push(text(x + poolWidth / 2, 6, name, small, { anchor: 'middle' }).svg);
    parts.push(
      text(x + poolWidth / 2, 22, points, { ...type.big, size: 28 }, { anchor: 'middle' }).svg,
    );
  });
  return svgDocument(width, 58, parts.join(''));
}

/** The Dying countdown from 0 HP to the end of the third round. */
function dyingCountdown() {
  const row = stepRow(
    [
      ['0 HP', 'Unconscious and Dying', 'bad'],
      ['Rounds 1 to 3', 'Stabilise in time'],
      ['End of round 3', 'Dies if still Dying', 'bad'],
    ],
    2,
  );
  return svgDocument(width, row.boxHeight + 4, row.svg);
}

export default {
  'print-damage-steps': damageSteps,
  'print-d100-grades': d100Grades,
  'print-bonus-penalty': bonusPenalty,
  'print-active-magnitude': activeMagnitude,
  'print-shaping-formula': shapingFormula,
  'print-round-costs': () =>
    costChart([
      ['Attack, aim, or cast', 'Used', 'Kept', 'Kept'],
      ['Withdraw', 'Used', 'Used', 'Kept'],
      ['Sprint', 'Used', 'Used', 'Dodge only'],
      ['Charge', 'Used', 'Used', 'None left'],
    ]),
  'print-reload-costs': () =>
    costChart(
      [
        ['Light crossbow', 'Kept', 'Used', 'Base used'],
        ['Heavy crossbow', 'Used', 'Used', 'None left'],
      ],
      'Reload',
    ),
  'print-skill-pools': skillPools,
  'print-dying-countdown': dyingCountdown,
};
