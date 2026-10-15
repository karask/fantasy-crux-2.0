import {
  card,
  colour,
  line,
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

/** A build receipt: each dial as a 0–5 scale, summed into Magnitude, using the firebolt. */
function shapingFormula() {
  const parts = [];
  const left = margin;
  const inner = left + 12;
  const right = width - margin;
  const pipStart = 214;
  const pipGap = 21;
  const valueX = right - 12;
  const rows = [
    ['Intensity', 'Each outcome: how strong', 2],
    ['Range', 'How far', 1],
    ['Duration', 'How long', 0],
    ['Reach', 'How many, how big', 0],
  ];

  let y = 6;
  const headHeight = 28;
  parts.push(
    `<path d="M${left + 0.75} ${y + 5.75}a5 5 0 0 1 5 -5h${width - margin * 2 - 11.5}a5 5 0 0 1 5 5v${headHeight - 5.75}h${-(width - margin * 2 - 1.5)}z" fill="${colour.iron}"/>`,
  );
  parts.push(
    text(
      inner,
      y,
      'Example: a 2D6 firebolt within 15 m',
      { ...type.label, lineHeight: headHeight / type.label.size },
      { fill: colour.boneLight },
    ).svg,
  );
  const bodyTop = y + headHeight;
  y = bodyTop + 8;

  const rowHeight = 46;
  for (const [label, note, value] of rows) {
    parts.push(text(inner, y + 4, label, type.label).svg);
    parts.push(text(inner, y + 22, note, type.note, { fill: colour.muted }).svg);
    for (let pip = 1; pip <= 5; pip += 1) {
      const cx = pipStart + (pip - 1) * pipGap;
      const cy = y + 20;
      const filled = pip <= value;
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="7" fill="${filled ? colour.iron : colour.paper}" stroke="${colour.ink}" stroke-width="1.3"/>`,
      );
      parts.push(
        text(
          cx,
          cy - 22,
          String(pip),
          { ...type.small, size: 10.5 },
          { anchor: 'middle', fill: colour.muted },
        ).svg,
      );
    }
    parts.push(
      text(valueX, y + 6, String(value), { ...type.big, size: 28 }, { anchor: 'end' }).svg,
    );
    y += rowHeight;
    parts.push(
      line(
        [
          [inner, y - 4],
          [right - 12, y - 4],
        ],
        { stroke: colour.rule, width: 1 },
      ),
    );
  }

  parts.push(text(inner, y + 4, 'Adjustments', type.label).svg);
  parts.push(
    text(inner, y + 22, 'Direct Harm, Trigger, and so on', type.note, { fill: colour.muted }).svg,
  );
  parts.push(text(valueX, y + 6, '+0', { ...type.big, size: 28 }, { anchor: 'end' }).svg);
  y += rowHeight;

  parts.push(
    line(
      [
        [inner, y - 2],
        [right - 12, y - 2],
      ],
      { stroke: colour.ink, width: 2.5 },
    ),
  );
  const totalTop = y + 6;
  parts.push(
    rect(inner - 4, totalTop, right - inner - 8, 46, {
      fill: colour.brassTint,
      stroke: colour.brass,
      radius: 4,
    }),
  );
  parts.push(text(inner + 6, totalTop + 4, '= Magnitude', { ...type.big, size: 24 }, {}).svg);
  parts.push(
    text(inner + 8, totalTop + 27, 'Add every dial and adjustment', type.note, {
      fill: colour.muted,
    }).svg,
  );
  parts.push(
    text(
      valueX,
      totalTop + 6,
      '3',
      { ...type.big, size: 32 },
      { anchor: 'end', fill: colour.oxide },
    ).svg,
  );
  y = totalTop + 46 + 12;

  parts.splice(
    0,
    0,
    rect(left, 6, width - margin * 2, y - 6, { fill: colour.paper, stroke: colour.ink, radius: 5 }),
  );

  // What Magnitude controls.
  y += 10;
  parts.push(text(left, y, 'Magnitude sets', type.label, { fill: colour.ink }).svg);
  y += 26;
  const gap = 10;
  const cellWidth = (width - margin * 2 - gap) / 2;
  const uses = [
    ['PP cost', 'Pay it in Power Points when the casting succeeds.'],
    ['Risk', 'Above your Safe Magnitude, casting is harder and failure hurts.'],
    ['Active load', 'While it lasts, it counts against your INT.'],
    ['Dispel strength', 'The higher it is, the harder it is to Dispel.'],
  ];
  const cards = uses.map(([title, body]) =>
    card(0, 0, cellWidth, { title, body, bodyStyle: type.note, tone: 'quiet' }),
  );
  const rowHeights = [
    Math.max(cards[0].height, cards[1].height),
    Math.max(cards[2].height, cards[3].height),
  ];
  uses.forEach(([title, body], index) => {
    const column = index % 2;
    const rowIndex = Math.floor(index / 2);
    const cx = left + column * (cellWidth + gap);
    const cy = y + (rowIndex === 0 ? 0 : rowHeights[0] + gap);
    parts.push(
      card(cx, cy, cellWidth, {
        title,
        body,
        bodyStyle: type.note,
        tone: 'quiet',
        minHeight: rowHeights[rowIndex],
      }).svg,
    );
  });
  y += rowHeights[0] + gap + rowHeights[1];
  return svgDocument(width, y + 6, parts.join(''));
}

function figure(cx, groundY, { fill = colour.iron } = {}) {
  return (
    `<circle cx="${cx}" cy="${groundY - 56}" r="10" fill="${fill}"/>` +
    `<path d="M${cx - 13} ${groundY}v-30a13 13 0 0 1 26 0v30z" fill="${fill}"/>`
  );
}

function shield(x, y) {
  // A heater shield seen side-on, held in front of the body.
  return `<path d="M${x} ${y}h14v20c0 9 -5 15 -7 17c-2 -2 -7 -8 -7 -17z" fill="${colour.brass}" stroke="${colour.ink}" stroke-width="1.5"/>`;
}

function flame(cx, cy, scale = 1) {
  const s = (value) => Math.round(value * scale * 100) / 100;
  return (
    `<path d="M${cx} ${cy - s(11)}c${s(6)} ${s(6)} ${s(9)} ${s(9)} ${s(6)} ${s(15)}c${s(-2)} ${s(4)} ${s(-10)} ${s(4)} ${s(-12)} 0c${s(-3)} ${s(-6)} ${s(0)} ${s(-9)} ${s(6)} ${s(-15)}z" fill="${colour.oxide}"/>` +
    `<path d="M${cx} ${cy - s(3)}c${s(3)} ${s(3)} ${s(4)} ${s(5)} ${s(2)} ${s(8)}c${s(-1)} ${s(1)} ${s(-3)} ${s(1)} ${s(-4)} 0c${s(-1)} ${s(-3)} ${s(0)} ${s(-5)} ${s(2)} ${s(-8)}z" fill="${colour.brassTint}"/>`
  );
}

/** Projected Harm crosses space; Direct Harm arises inside the target. */
function harmDelivery() {
  const gap = 12;
  const panelWidth = (width - margin * 2 - gap) / 2;
  const top = 6;
  const sceneHeight = 104;
  const parts = [];

  const panels = [
    {
      x: margin,
      title: 'Projected',
      tone: 'plain',
      facts: [
        ['Crosses space', type.bodyBold],
        ['Dodge or shield, both at -1P', type.note],
        ['Cover and worn armour apply', type.note],
        ['No extra cost', type.note],
      ],
      scene: (x, ground) => {
        const caster = x + 30;
        const target = x + panelWidth - 30;
        let svg = figure(caster, ground);
        svg += figure(target, ground, { fill: colour.muted });
        svg += shield(target - 27, ground - 44);
        // The bolt crosses the open space between them.
        svg += line(
          [
            [caster + 18, ground - 30],
            [target - 62, ground - 30],
          ],
          { stroke: colour.oxide, width: 2.5, dash: '3 5' },
        );
        svg += flame(target - 46, ground - 26, 1.5);
        return svg;
      },
    },
    {
      x: margin + panelWidth + gap,
      title: 'Direct',
      tone: 'bad',
      facts: [
        ['Arises inside the target', type.bodyBold],
        ['Resilience or Persistence; a win negates it all', type.note],
        ['Only magical Wards protect', type.note],
        ['Costs +1 Magnitude', type.note],
      ],
      scene: (x, ground) => {
        const caster = x + 30;
        const target = x + panelWidth - 30;
        let svg = figure(caster, ground);
        svg += figure(target, ground, { fill: colour.muted });
        // A clear route is still needed, but nothing travels along it.
        svg += line(
          [
            [caster + 18, ground - 56],
            [target - 18, ground - 56],
          ],
          { stroke: colour.muted, width: 1.5, dash: '1 5' },
        );
        svg += `<circle cx="${target}" cy="${ground - 20}" r="17" fill="${colour.oxideTint}" fill-opacity="0.55" stroke="${colour.oxide}" stroke-width="2"/>`;
        svg += flame(target, ground - 17, 1.1);
        return svg;
      },
    },
  ];

  let bottom = 0;
  const rendered = panels.map((panel) => {
    let svg = '';
    const headHeight = 28;
    const ground = top + headHeight + sceneHeight - 10;
    svg += panel.scene(panel.x, ground);
    svg += line(
      [
        [panel.x + 10, ground],
        [panel.x + panelWidth - 10, ground],
      ],
      { stroke: colour.rule, width: 1.5 },
    );
    let y = top + headHeight + sceneHeight + 6;
    for (const [fact, style] of panel.facts) {
      const lines = wrap(fact, style, panelWidth - 24);
      const block = textLines(panel.x + 12, y, lines, style);
      svg += block.svg;
      y += block.height + 4;
    }
    bottom = Math.max(bottom, y + 6);
    return { panel, svg };
  });

  for (const { panel, svg } of rendered) {
    const frame = card(panel.x, top, panelWidth, {
      title: panel.title,
      tone: panel.tone,
      minHeight: bottom - top,
    });
    parts.push(frame.svg, svg);
  }
  return svgDocument(width, bottom + 6, parts.join(''));
}

/** Active Magnitude as a budget against INT. */
function activeMagnitude() {
  const parts = [];
  const limit = 13;
  const barLeft = margin + 2;
  const unit = 25;
  const barTop = 46;
  const barHeight = 46;
  const limitX = barLeft + limit * unit;
  const shapings = [
    ['Ward', 4, 'good'],
    ['Flight', 4, 'warn'],
    ['Summon', 4, 'quiet'],
  ];

  parts.push(text(margin, 2, 'INT 13 = your Active Magnitude limit', type.label).svg);
  parts.push(
    rect(barLeft, barTop, limit * unit, barHeight, {
      fill: colour.paper,
      stroke: colour.ink,
      strokeWidth: 2,
      radius: 3,
    }),
  );
  let x = barLeft;
  for (const [label, magnitude, tone] of shapings) {
    const palette = tones[tone];
    parts.push(
      rect(x + 2, barTop + 3, magnitude * unit - 4, barHeight - 6, {
        fill: palette.fill,
        stroke: palette.stroke,
        strokeWidth: 1.2,
        radius: 2,
      }),
    );
    parts.push(
      text(x + (magnitude * unit) / 2, barTop + 6, label, type.label, { anchor: 'middle' }).svg,
    );
    parts.push(
      text(x + (magnitude * unit) / 2, barTop + 23, `M${magnitude}`, type.mono, {
        anchor: 'middle',
        fill: colour.muted,
      }).svg,
    );
    x += magnitude * unit;
  }
  parts.push(
    text(barLeft + 12 * unit, barTop + barHeight + 6, '12 used', type.small, {
      anchor: 'end',
      fill: colour.good,
    }).svg,
  );

  // The limit line, and a further ongoing Shaping that would cross it.
  const overflowTop = barTop + barHeight + 30;
  const overflowLeft = barLeft + 12 * unit;
  parts.push(
    line(
      [
        [limitX, barTop - 18],
        [limitX, overflowTop + barHeight - 4],
      ],
      { stroke: colour.oxide, width: 2 },
    ),
  );
  parts.push(
    text(limitX, barTop - 30, 'Limit 13', type.small, { anchor: 'middle', fill: colour.oxide }).svg,
  );
  parts.push(
    rect(overflowLeft + 2, overflowTop, 3 * unit - 4, barHeight - 8, {
      fill: colour.oxideTint,
      stroke: colour.oxide,
      strokeWidth: 1.5,
      radius: 2,
      dash: '5 3',
    }),
  );
  parts.push(
    text(overflowLeft + (3 * unit) / 2, overflowTop + 9, '+M3', type.mono, {
      anchor: 'middle',
      fill: colour.oxide,
    }).svg,
  );
  const message = textLines(
    barLeft,
    overflowTop,
    wrap(
      'Another ongoing M3 would make 15: too much. Dismiss one Shaping first.',
      type.note,
      12 * unit - 18,
    ),
    type.note,
    {
      fill: colour.oxide,
    },
  );
  parts.push(message.svg);

  const noteTop = Math.max(overflowTop + barHeight, overflowTop + message.height) + 6;
  const note = textLines(
    barLeft,
    noteTop,
    wrap(
      'Instant Shapings, such as a firebolt, end at once and count nothing.',
      type.note,
      width - margin * 2,
    ),
    type.note,
    {
      fill: colour.muted,
    },
  );
  parts.push(note.svg);
  return svgDocument(width, noteTop + note.height + 6, parts.join(''));
}

export default {
  'shaping-formula': shapingFormula,
  'harm-delivery': harmDelivery,
  'active-magnitude': activeMagnitude,
};
