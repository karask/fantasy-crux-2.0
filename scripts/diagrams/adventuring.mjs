import {
  arrow,
  card,
  colour,
  line,
  rect,
  svgDocument,
  text,
  textLines,
  type,
  wrap,
} from './kit.mjs';

const width = 420;
const margin = 14;

function flame(cx, cy) {
  return (
    `<path d="M${cx} ${cy - 14}c8 8 12 12 8 20c-3 5 -13 5 -16 0c-4 -8 0 -12 8 -20z" fill="${colour.oxide}"/>` +
    `<path d="M${cx} ${cy - 4}c4 4 5 7 3 10c-1 2 -5 2 -6 0c-2 -3 -1 -6 3 -10z" fill="${colour.brassTint}"/>`
  );
}

/** How a light source's bands fall off with distance, using a torch. */
function lightBands() {
  const parts = [];
  const barTop = 30;
  const barHeight = 62;
  const start = 40;
  const bands = [
    ['Illuminated', '0–3 m', 'No penalty', 82, colour.brassTint, colour.ink],
    ['Partial\ndarkness', 'to 9 m', '-1P', 92, '#d9d1c1', colour.ink],
    ['Darkness', 'to 15 m', '-2P · ½ move', 104, '#5b6462', '#ffffff'],
    [
      'Pitch black',
      'beyond',
      'No sight · ¼ move',
      width - margin - start - 82 - 92 - 104,
      colour.iron,
      '#ffffff',
    ],
  ];
  parts.push(flame(margin + 10, barTop + barHeight / 2));
  parts.push(text(margin + 10, barTop - 24, 'Torch', type.small, { anchor: 'middle' }).svg);
  let x = start;
  for (const [name, distance, effect, segmentWidth, fill, ink] of bands) {
    parts.push(
      rect(x, barTop, segmentWidth - 2, barHeight, {
        fill,
        stroke: colour.ink,
        strokeWidth: 1.2,
        radius: 2,
      }),
    );
    const label = textLines(
      x + (segmentWidth - 2) / 2,
      barTop + 4,
      name.split('\n'),
      { ...type.small, lineHeight: 1.05 },
      { anchor: 'middle', fill: ink },
    );
    parts.push(label.svg);
    const effectLines = wrap(effect, { ...type.mono, size: 12 }, segmentWidth - 10);
    parts.push(
      textLines(
        x + (segmentWidth - 2) / 2,
        barTop + barHeight - 6 - effectLines.length * 13.8,
        effectLines,
        { ...type.mono, size: 12 },
        { anchor: 'middle', fill: ink },
      ).svg,
    );
    parts.push(
      text(x + (segmentWidth - 2) / 2, barTop + barHeight + 6, distance, type.note, {
        anchor: 'middle',
        fill: colour.muted,
      }).svg,
    );
    x += segmentWidth;
  }
  const caption = textLines(
    margin,
    barTop + barHeight + 32,
    wrap(
      'A light lights its radius. Partial darkness reaches three times the radius, and Darkness five times.',
      type.note,
      width - margin * 2,
    ),
    type.note,
    { fill: colour.muted },
  );
  parts.push(caption.svg);
  return svgDocument(width, barTop + barHeight + 32 + caption.height + 4, parts.join(''));
}

/** The Fatigue track: failing tests moves down; rest moves back up. */
function fatigueTrack() {
  const parts = [];
  const cardWidth = 250;
  const laneX = margin + cardWidth + 14;
  const laneWidth = width - margin - laneX;
  const gap = 34;
  const states = [
    ['Fresh', 'No penalty.', 'plain'],
    ['Fatigued', '-1P on tests, ¾ Movement, Combat Order -3.', 'warn'],
    ['Exhausted', '-2P on tests, ½ Movement, Combat Order -6.', 'bad'],
  ];
  const steps = ['Fail a Fatigue test', 'Strenuous again: fail a test at -1P'];
  let y = 6;
  const boxes = [];
  states.forEach(([title, body, tone], index) => {
    const box = card(margin, y, cardWidth, { title, body, tone, bodyStyle: type.note });
    parts.push(box.svg);
    boxes.push({ top: y, bottom: y + box.height });
    y += box.height;
    if (index < states.length - 1) {
      const x = margin + 34;
      parts.push(
        arrow(
          [
            [x, y],
            [x, y + gap],
          ],
          { stroke: colour.oxide },
        ),
      );
      parts.push(text(x + 10, y + 9, steps[index], type.note, { fill: colour.oxide }).svg);
      y += gap;
    }
  });

  // Rest returns either state to fresh.
  const restX = laneX + laneWidth - 8;
  parts.push(
    line(
      [
        [margin + cardWidth, boxes[2].top + 18],
        [restX, boxes[2].top + 18],
        [restX, boxes[1].top + 18],
      ],
      { stroke: colour.good, width: 1.8 },
    ),
  );
  parts.push(
    line(
      [
        [margin + cardWidth, boxes[1].top + 18],
        [restX, boxes[1].top + 18],
      ],
      { stroke: colour.good, width: 1.8 },
    ),
  );
  parts.push(
    arrow(
      [
        [restX, boxes[1].top + 18],
        [restX, boxes[0].top + 18],
        [margin + cardWidth, boxes[0].top + 18],
      ],
      { stroke: colour.good },
    ),
  );
  const restLabel = textLines(
    laneX + 2,
    boxes[0].bottom + 2,
    wrap('Rest 20 − CON hours, minimum 1', type.note, laneWidth - 22),
    type.note,
    { fill: colour.good },
  );
  parts.push(restLabel.svg);

  const fumble = card(margin, y + 14, width - margin * 2, {
    title: 'Fumbled Fatigue test',
    body: 'Unconscious for 3D6 minutes, then wake Fatigued.',
    tone: 'bad',
    bodyStyle: type.note,
  });
  parts.push(fumble.svg);
  return svgDocument(width, y + 14 + fumble.height + 6, parts.join(''));
}

export default {
  'light-bands': lightBands,
  'fatigue-track': fatigueTrack,
};
