import {
  arrow,
  card,
  colour,
  die,
  rect,
  svgDocument,
  text,
  textLines,
  tones,
  type,
  wrap,
} from './kit.mjs';

const width = 420;
const margin = 14;

/** The four result grades on the D100 scale for a 60% skill. */
function d100Grades() {
  const parts = [];
  const barTop = 34;
  const barHeight = 44;
  // Critical and Fumble are widened for legibility; their ranges are labelled exactly.
  const segments = [
    ['Critical', '01–06', 52, 'good'],
    ['Success', '07–60', 168, 'good'],
    ['Failure', '61–98', 120, 'quiet'],
    ['Fumble', '99–00', width - margin * 2 - 52 - 168 - 120, 'bad'],
  ];

  parts.push(text(margin, 4, 'Skill 60%', type.label).svg);
  let x = margin;
  for (const [grade, range, segmentWidth, tone] of segments) {
    const palette = tones[tone];
    const strong = grade === 'Critical' || grade === 'Fumble';
    parts.push(
      rect(x, barTop, segmentWidth - 3, barHeight, {
        fill: strong ? palette.head : palette.fill,
        stroke: palette.stroke,
        strokeWidth: 1.4,
        radius: 3,
      }),
    );
    const labelStyle = segmentWidth < 70 ? type.small : type.label;
    parts.push(
      text(x + (segmentWidth - 3) / 2, barTop + 6, grade, labelStyle, {
        anchor: 'middle',
        fill: strong ? '#ffffff' : colour.ink,
      }).svg,
    );
    parts.push(
      text(
        x + (segmentWidth - 3) / 2,
        barTop + 22,
        range,
        { ...type.mono, size: 13 },
        {
          anchor: 'middle',
          fill: strong ? '#ffffff' : colour.muted,
        },
      ).svg,
    );
    x += segmentWidth;
  }

  // Reading the dice.
  const rowTop = barTop + barHeight + 26;
  parts.push(text(margin, rowTop - 2, 'Read the dice', type.small, { fill: colour.muted }).svg);
  const diceY = rowTop + 36;
  parts.push(die(margin + 24, diceY, 5));
  parts.push(
    text(margin + 24, diceY + 18, 'Tens', type.small, { anchor: 'middle', fill: colour.muted }).svg,
  );
  parts.push(die(margin + 74, diceY, 9));
  parts.push(
    text(margin + 74, diceY + 18, 'Units', type.small, { anchor: 'middle', fill: colour.muted })
      .svg,
  );
  parts.push(
    arrow([
      [margin + 100, diceY],
      [margin + 126, diceY],
    ]),
  );
  parts.push(text(margin + 134, diceY - 15, '59', { ...type.big, size: 28 }, {}).svg);
  parts.push(text(margin + 170, diceY - 10, 'Success at 60%', type.bodyBold, {}).svg);
  const note = textLines(
    margin,
    diceY + 38,
    wrap(
      'A tens die of 0 gives one digit, such as 07. Double zero reads 100.',
      type.note,
      width - margin * 2,
    ),
    type.note,
    {
      fill: colour.muted,
    },
  );
  parts.push(note.svg);
  return svgDocument(width, diceY + 38 + note.height + 6, parts.join(''));
}

/** Choosing between Bonus and Penalty candidates by grade first, then by roll. */
function bonusPenaltyDice() {
  const parts = [];
  const diceY = 30;
  parts.push(die(margin + 22, diceY, 5, { tone: 'warn' }));
  parts.push(
    text(margin + 22, diceY + 18, 'Units', type.small, { anchor: 'middle', fill: colour.muted })
      .svg,
  );
  parts.push(die(margin + 74, diceY, 2));
  parts.push(die(margin + 116, diceY, 6));
  parts.push(
    text(margin + 95, diceY + 18, 'Two tens dice', type.small, {
      anchor: 'middle',
      fill: colour.muted,
    }).svg,
  );
  parts.push(
    arrow([
      [margin + 142, diceY],
      [margin + 170, diceY],
    ]),
  );
  parts.push(text(margin + 180, diceY - 15, '25 or 65', { ...type.big, size: 26 }, {}).svg);
  parts.push(text(margin + 292, diceY - 11, 'Candidates', type.small, { fill: colour.muted }).svg);

  const top = diceY + 44;
  const gap = 12;
  const panelWidth = (width - margin * 2 - gap) / 2;
  const panels = [
    {
      title: 'Skill 70%',
      grades: [
        ['25', 'Success', 'good'],
        ['65', 'Success', 'good'],
      ],
      keep: [
        ['+1B keeps', '65'],
        ['-1P keeps', '25'],
      ],
      why: 'Both succeed, so the higher roll is better.',
    },
    {
      title: 'Skill 60%',
      grades: [
        ['25', 'Success', 'good'],
        ['65', 'Failure', 'bad'],
      ],
      keep: [
        ['+1B keeps', '25'],
        ['-1P keeps', '65'],
      ],
      why: 'A success always beats a failure.',
    },
  ];

  let bottom = 0;
  const drawn = panels.map((panel, index) => {
    const x = margin + index * (panelWidth + gap);
    let svg = '';
    let y = top + 28 + 10;
    for (const [roll, grade, tone] of panel.grades) {
      const palette = tones[tone];
      svg += rect(x + 12, y, 44, 26, {
        fill: palette.fill,
        stroke: palette.stroke,
        strokeWidth: 1.2,
        radius: 4,
      });
      svg += text(
        x + 34,
        y + 1,
        roll,
        { ...type.mono, size: 15, lineHeight: 26 / 15 },
        { anchor: 'middle' },
      ).svg;
      svg += text(
        x + 64,
        y + 2,
        grade,
        { ...type.label, lineHeight: 26 / 14 },
        { fill: palette.stroke === colour.ink ? colour.ink : palette.stroke },
      ).svg;
      y += 32;
    }
    y += 2;
    for (const [label, roll] of panel.keep) {
      svg += text(x + 12, y, label, { ...type.mono, size: 14 }, {}).svg;
      svg += text(
        x + panelWidth - 12,
        y - 2,
        roll,
        { ...type.big, size: 22 },
        { anchor: 'end', fill: colour.oxide },
      ).svg;
      y += 26;
    }
    const why = textLines(x + 12, y + 2, wrap(panel.why, type.note, panelWidth - 24), type.note, {
      fill: colour.muted,
    });
    svg += why.svg;
    y += why.height + 12;
    bottom = Math.max(bottom, y);
    return { x, svg, title: panel.title };
  });
  for (const panel of drawn) {
    parts.push(
      card(panel.x, top, panelWidth, { title: panel.title, minHeight: bottom - top }).svg,
      panel.svg,
    );
  }
  return svgDocument(width, bottom + 6, parts.join(''));
}

export default {
  'd100-grades': d100Grades,
  'bonus-penalty-dice': bonusPenaltyDice,
};
