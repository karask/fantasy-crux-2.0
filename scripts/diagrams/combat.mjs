import { arrow, card, colour, line, rect, svgDocument, text, textLines, type } from './kit.mjs';

const width = 420;
const margin = 14;

function rangeBands() {
  const barTop = 40;
  const barHeight = 34;
  const start = 40;
  const range = 214;
  const double = 346;
  const end = width - margin;
  const parts = [];

  // The shooter.
  parts.push(
    `<circle cx="${margin + 8}" cy="${barTop + barHeight / 2}" r="8" fill="${colour.ink}"/>`,
  );
  parts.push(text(margin + 8, barTop - 26, 'You', type.small, { anchor: 'middle' }).svg);

  parts.push(
    rect(start, barTop, range - start, barHeight, {
      fill: colour.goodTint,
      stroke: colour.good,
      radius: 3,
    }),
  );
  parts.push(
    rect(range, barTop, double - range, barHeight, {
      fill: colour.brassTint,
      stroke: colour.brass,
      radius: 3,
    }),
  );
  parts.push(
    rect(double, barTop, end - double, barHeight, {
      fill: colour.oxideTint,
      stroke: colour.oxide,
      radius: 3,
      dash: '4 3',
    }),
  );

  const middle = barTop + (barHeight - type.label.size * 1.15) / 2;
  parts.push(
    text((start + range) / 2, middle, 'Attack normally', type.label, {
      anchor: 'middle',
      fill: colour.good,
    }).svg,
  );
  parts.push(
    text(
      (range + double) / 2,
      middle,
      '-2P',
      { ...type.mono, size: 16 },
      { anchor: 'middle', fill: colour.brass },
    ).svg,
  );
  parts.push(
    text((double + end) / 2, middle, 'No hit', type.label, { anchor: 'middle', fill: colour.oxide })
      .svg,
  );

  const tickTop = barTop + barHeight;
  for (const [x, label, example] of [
    [start, '0', '0 m'],
    [range, 'Range', '75 m'],
    [double, '2 × Range', '150 m'],
  ]) {
    parts.push(
      line(
        [
          [x, tickTop],
          [x, tickTop + 9],
        ],
        { width: 1.5 },
      ),
    );
    parts.push(text(x, tickTop + 12, label, type.small, { anchor: 'middle' }).svg);
    parts.push(
      text(x, tickTop + 30, example, type.note, { anchor: 'middle', fill: colour.muted }).svg,
    );
  }

  const caption = textLines(
    margin,
    tickTop + 58,
    ['Example: a shortbow has Range 75 m.'],
    type.note,
    {
      fill: colour.muted,
    },
  );
  parts.push(caption.svg);
  return svgDocument(width, tickTop + 58 + caption.height + 4, parts.join(''));
}

function damageSteps() {
  const mainWidth = 262;
  const laneX = margin + mainWidth + 16;
  const laneWidth = width - margin - laneX;
  const gap = 20;
  const parts = [];
  const steps = [
    ['1 · Roll damage', 'Weapon dice, plus DM and any extra dice.'],
    ['2 · Parry', 'A winning Parry blocks all, half, or none, by Size.'],
    ['3 · Armour', 'Subtract Armour Points (AP).'],
    ['4 · Vitality reserve', 'If the target has one, it absorbs damage next.'],
    ['5 · Lose HP', 'Lose what is left. HP never drops below 0.'],
  ];

  let y = 6;
  const boxes = [];
  for (const [index, [title, body]] of steps.entries()) {
    const box = card(margin, y, mainWidth, { title, body, tone: 'plain' });
    parts.push(box.svg);
    boxes.push({ top: y, bottom: y + box.height });
    y += box.height;
    if (index < steps.length - 1) {
      parts.push(
        arrow([
          [margin + mainWidth / 2, y],
          [margin + mainWidth / 2, y + gap],
        ]),
      );
      y += gap;
    }
  }

  // Critical hits bypass Parry and armour but still meet a vitality reserve.
  const calloutTop = boxes[1].top;
  const callout = card(laneX, calloutTop, laneWidth, {
    title: 'Critical',
    body: 'Maximum damage. Skips Parry and armour.',
    tone: 'warn',
    bodyStyle: type.note,
  });
  parts.push(callout.svg);
  const fromY = boxes[0].top + 16;
  parts.push(
    arrow(
      [
        [margin + mainWidth, fromY],
        [laneX + laneWidth / 2, fromY],
        [laneX + laneWidth / 2, calloutTop],
      ],
      { stroke: colour.brass, dash: '5 3' },
    ),
  );
  const toY = boxes[3].top + 16;
  parts.push(
    arrow(
      [
        [laneX + laneWidth / 2, calloutTop + callout.height],
        [laneX + laneWidth / 2, toY],
        [margin + mainWidth, toY],
      ],
      {
        stroke: colour.brass,
        dash: '5 3',
      },
    ),
  );

  // Two consequences of the HP loss.
  const forkTop = y + gap + 8;
  const half = (width - margin * 2 - 12) / 2;
  const wound = card(margin, forkTop, half, {
    title: 'One hit ≥ MWL',
    body: 'Major Wound: Wounded and Bleeding.',
    tone: 'bad',
  });
  const dying = card(margin + half + 12, forkTop, half, {
    title: 'At 0 HP',
    body: 'Unconscious and Dying.',
    tone: 'bad',
    minHeight: wound.height,
  });
  const centre = margin + mainWidth / 2;
  parts.push(
    arrow(
      [
        [centre, y],
        [centre, y + gap / 2],
        [margin + half / 2, y + gap / 2],
        [margin + half / 2, forkTop],
      ],
      { stroke: colour.oxide },
    ),
  );
  parts.push(
    arrow(
      [
        [centre, y + gap / 2],
        [margin + half + 12 + half / 2, y + gap / 2],
        [margin + half + 12 + half / 2, forkTop],
      ],
      {
        stroke: colour.oxide,
      },
    ),
  );
  parts.push(wound.svg, dying.svg);
  return svgDocument(width, forkTop + Math.max(wound.height, dying.height) + 6, parts.join(''));
}

function grappleFlow() {
  const full = width - margin * 2;
  const gap = 20;
  const parts = [];
  let y = 6;

  const seize = card(margin, y, full, {
    title: '1 · Seize',
    body: 'Spend a Combat Action. Commit one or two limbs, then roll Unarmed Combat.',
  });
  parts.push(seize.svg);
  y += seize.height;
  parts.push(
    arrow([
      [width / 2, y],
      [width / 2, y + gap],
    ]),
  );
  y += gap;

  const defend = card(margin, y, full, {
    title: '2 · Target defends',
    body: 'It can spend one Reaction to Dodge or Parry as an opposed test. With no defence, you roll unopposed.',
    tone: 'warn',
  });
  parts.push(defend.svg);
  y += defend.height;

  const leftWidth = 236;
  const rightX = margin + leftWidth + 12;
  const rightWidth = width - margin - rightX;
  const branchTop = y + gap + 14;
  const hold = card(margin, branchTop, leftWidth, {
    title: '3 · Hold',
    body: 'You are the controller. Neither of you can take a Movement Action. Both take -1P on every test and fight only unarmed or with a Light one-handed weapon.',
  });
  const fail = card(rightX, branchTop, rightWidth, {
    title: 'No hold',
    body: 'A successful weapon Parry that wins deals you 1 HP, ignoring AP.',
    tone: 'bad',
    bodyStyle: type.note,
  });
  parts.push(
    arrow([
      [margin + leftWidth / 2, y],
      [margin + leftWidth / 2, branchTop],
    ]),
  );
  parts.push(
    text(margin + leftWidth / 2 + 8, y + 6, 'You win', type.small, { fill: colour.ink }).svg,
  );
  parts.push(
    arrow(
      [
        [rightX + rightWidth / 2, y],
        [rightX + rightWidth / 2, branchTop],
      ],
      { stroke: colour.oxide },
    ),
  );
  parts.push(
    text(rightX + rightWidth / 2 + 8, y + 6, 'You lose', type.small, { fill: colour.oxide }).svg,
  );
  parts.push(hold.svg, fail.svg);
  y = branchTop + hold.height;

  parts.push(
    arrow([
      [margin + leftWidth / 2, y],
      [margin + leftWidth / 2, y + gap],
    ]),
  );
  y += gap;
  const escape = card(margin, y, full, {
    title: '4 · Escape or release',
    body: [
      {
        text: 'The held participant spends a Combat Action and wins an opposed Unarmed Combat test. Opposing it costs no Reaction.',
        style: type.body,
      },
      {
        text: 'The controller can release the grapple freely on their own turn.',
        style: type.body,
      },
    ],
  });
  parts.push(escape.svg);
  y += escape.height;
  return svgDocument(width, y + 6, parts.join(''));
}

export default {
  'range-bands': rangeBands,
  'damage-steps': damageSteps,
  'grapple-flow': grappleFlow,
};
