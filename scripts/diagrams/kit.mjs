// Drawing primitives for rules diagrams. Every diagram shares this palette, type scale, and set of
// shapes so the whole book reads as one visual system (see docs/design/rules-style-guide.md).
// Output is plain SVG with presentation attributes only: no ids, no <defs>, and no CSS, so a
// diagram can be inlined anywhere on a chapter page, or placed in a print pipeline, unchanged.
import { measure } from './font-metrics.mjs';

export const colour = {
  ink: '#171c1d',
  iron: '#1c2325',
  paper: '#f8f4ec',
  bone: '#e7e0d2',
  boneLight: '#f4efe5',
  rule: '#b7ad9b',
  muted: '#4d5857',
  oxide: '#a73e29',
  oxideTint: '#f3dcd3',
  brass: '#8a6d22',
  brassTint: '#f1e6c6',
  good: '#2c6a83',
  goodTint: '#dbe9ee',
};

const families = {
  display: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  body: "'Atkinson Hyperlegible', Arial, sans-serif",
  mono: "'IBM Plex Mono', Consolas, monospace",
};

export const type = {
  label: {
    font: 'display700',
    family: families.display,
    weight: 700,
    size: 14,
    tracking: 0.07,
    upper: true,
  },
  small: {
    font: 'display700',
    family: families.display,
    weight: 700,
    size: 12.5,
    tracking: 0.08,
    upper: true,
  },
  body: { font: 'body400', family: families.body, weight: 400, size: 15, lineHeight: 1.3 },
  bodyBold: { font: 'body700', family: families.body, weight: 700, size: 15, lineHeight: 1.3 },
  note: { font: 'body400', family: families.body, weight: 400, size: 13.5, lineHeight: 1.3 },
  mono: { font: 'mono500', family: families.mono, weight: 500, size: 14 },
  big: {
    font: 'display700',
    family: families.display,
    weight: 700,
    size: 26,
    tracking: 0.01,
    upper: true,
  },
};

export const tones = {
  plain: {
    fill: colour.paper,
    stroke: colour.ink,
    head: colour.iron,
    headText: colour.boneLight,
    text: colour.ink,
  },
  good: {
    fill: colour.goodTint,
    stroke: colour.good,
    head: colour.good,
    headText: '#ffffff',
    text: colour.ink,
  },
  bad: {
    fill: colour.oxideTint,
    stroke: colour.oxide,
    head: colour.oxide,
    headText: '#ffffff',
    text: colour.ink,
  },
  warn: {
    fill: colour.brassTint,
    stroke: colour.brass,
    head: colour.brass,
    headText: '#ffffff',
    text: colour.ink,
  },
  quiet: {
    fill: colour.boneLight,
    stroke: colour.rule,
    head: colour.muted,
    headText: colour.boneLight,
    text: colour.ink,
  },
};

const round = (value) => Math.round(value * 100) / 100;

export function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function shown(text, style) {
  return style.upper ? text.toUpperCase() : text;
}

export function textWidth(text, style) {
  return measure(shown(text, style), style.font, style.size, style.tracking ?? 0);
}

/** Greedy word wrap using real font advances. Explicit newlines force a break. */
export function wrap(text, style, maxWidth) {
  const lines = [];
  for (const paragraph of String(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && textWidth(candidate, style) > maxWidth) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    lines.push(line);
  }
  return lines;
}

export function lineHeight(style) {
  return style.size * (style.lineHeight ?? 1.15);
}

function textAttributes(style, fill, anchor) {
  const attributes = [
    `font-family="${escapeXml(style.family)}"`,
    `font-size="${style.size}"`,
    `font-weight="${style.weight}"`,
    `fill="${fill}"`,
  ];
  if (style.tracking) attributes.push(`letter-spacing="${round(style.tracking * style.size)}"`);
  if (anchor !== 'start') attributes.push(`text-anchor="${anchor}"`);
  return attributes.join(' ');
}

/** One or more lines of text. `y` is the top of the first line. Returns markup and height. */
export function textLines(x, y, lines, style, { fill = colour.ink, anchor = 'start' } = {}) {
  const step = lineHeight(style);
  // Place the baseline so cap height sits inside the line box, close to optical centre.
  const firstBaseline = y + step / 2 + style.size * 0.34;
  const spans = lines
    .map(
      (line, index) =>
        `<tspan x="${round(x)}" y="${round(firstBaseline + index * step)}">${escapeXml(shown(line, style))}</tspan>`,
    )
    .join('');
  return {
    svg: `<text ${textAttributes(style, fill, anchor)}>${spans}</text>`,
    height: lines.length * step,
  };
}

export function text(x, y, value, style, options) {
  return textLines(x, y, [value], style, options);
}

export function rect(
  x,
  y,
  width,
  height,
  { fill = 'none', stroke = 'none', strokeWidth = 1.5, radius = 5, dash } = {},
) {
  const attributes = [
    `x="${round(x)}"`,
    `y="${round(y)}"`,
    `width="${round(width)}"`,
    `height="${round(height)}"`,
    `rx="${radius}"`,
    `fill="${fill}"`,
  ];
  if (stroke !== 'none') attributes.push(`stroke="${stroke}"`, `stroke-width="${strokeWidth}"`);
  if (dash) attributes.push(`stroke-dasharray="${dash}"`);
  return `<rect ${attributes.join(' ')}/>`;
}

/** A polyline ending in a solid arrowhead at its last point. */
export function arrow(points, { stroke = colour.ink, width = 1.6, dash, head = 8 } = {}) {
  const [x2, y2] = points.at(-1);
  const [x1, y1] = points.at(-2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const back = [x2 - head * Math.cos(angle), y2 - head * Math.sin(angle)];
  const spread = head * 0.55;
  const left = [back[0] + spread * Math.sin(angle), back[1] - spread * Math.cos(angle)];
  const right = [back[0] - spread * Math.sin(angle), back[1] + spread * Math.cos(angle)];
  const line = [...points.slice(0, -1), back].map(([x, y]) => `${round(x)},${round(y)}`).join(' ');
  const dashed = dash ? ` stroke-dasharray="${dash}"` : '';
  return (
    `<polyline points="${line}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dashed}/>` +
    `<polygon points="${[[x2, y2], left, right].map(([x, y]) => `${round(x)},${round(y)}`).join(' ')}" fill="${stroke}"/>`
  );
}

export function line(points, { stroke = colour.ink, width = 1.5, dash } = {}) {
  const dashed = dash ? ` stroke-dasharray="${dash}"` : '';
  return `<polyline points="${points.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${width}"${dashed}/>`;
}

/** A small rounded chip holding a modifier or cost, such as `-1P` or `+1 M`. */
export function chip(x, y, value, { tone = 'plain', style = type.mono, anchor = 'start' } = {}) {
  const palette = tones[tone];
  const width = textWidth(value, style) + 14;
  const height = style.size + 10;
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const label = text(
    left + width / 2,
    y,
    value,
    { ...style, lineHeight: height / style.size },
    {
      fill: tone === 'plain' ? colour.ink : palette.stroke,
      anchor: 'middle',
    },
  );
  return {
    svg:
      rect(left, y, width, height, {
        fill: palette.fill,
        stroke: palette.stroke,
        strokeWidth: 1.2,
        radius: height / 2,
      }) + label.svg,
    width,
    height,
  };
}

/** A circled number for steps. */
export function badge(cx, cy, value, { tone = 'plain', radius = 13 } = {}) {
  const palette = tones[tone];
  const label = text(
    cx,
    cy - radius,
    String(value),
    { ...type.label, size: 15, lineHeight: (radius * 2) / 15 },
    {
      fill: palette.headText,
      anchor: 'middle',
    },
  );
  return (
    `<circle cx="${round(cx)}" cy="${round(cy)}" r="${radius}" fill="${palette.head}"/>` + label.svg
  );
}

/**
 * A card: optional header bar, then wrapped body text. Height follows the content.
 * `body` may be a string or an array of { text, style } runs placed as separate paragraphs.
 */
export function card(
  x,
  y,
  width,
  {
    title,
    body,
    tone = 'plain',
    bodyStyle = type.body,
    padding = 12,
    minHeight = 0,
    align = 'start',
    dash,
  } = {},
) {
  const palette = tones[tone];
  const parts = [];
  let cursor = y;
  const headHeight = title ? 28 : 0;
  if (title) cursor += headHeight;

  const paragraphs =
    body === undefined ? [] : Array.isArray(body) ? body : [{ text: body, style: bodyStyle }];
  const bodyParts = [];
  let bodyHeight = 0;
  if (paragraphs.length) {
    bodyHeight += padding - 2;
    for (const [index, paragraph] of paragraphs.entries()) {
      const style = paragraph.style ?? bodyStyle;
      const lines = wrap(paragraph.text, style, width - padding * 2);
      const tx = align === 'middle' ? x + width / 2 : x + padding;
      const block = textLines(tx, cursor + bodyHeight, lines, style, {
        fill: paragraph.fill ?? palette.text,
        anchor: align,
      });
      bodyParts.push(block.svg);
      bodyHeight += block.height + (index < paragraphs.length - 1 ? 4 : 0);
    }
    bodyHeight += padding - 2;
  }

  const height = Math.max(minHeight, headHeight + bodyHeight);
  parts.push(
    rect(x, y, width, height, {
      fill: palette.fill,
      stroke: palette.stroke,
      strokeWidth: 1.5,
      radius: 5,
      dash,
    }),
  );
  if (title) {
    parts.push(
      `<path d="M${round(x + 0.75)} ${round(y + 5.75)}a5 5 0 0 1 5 -5h${round(width - 11.5)}a5 5 0 0 1 5 5v${round(headHeight - 5.75)}h${round(-(width - 1.5))}z" fill="${palette.head}"/>`,
    );
    parts.push(
      text(
        align === 'middle' ? x + width / 2 : x + padding,
        y,
        title,
        { ...type.label, lineHeight: headHeight / type.label.size },
        {
          fill: palette.headText,
          anchor: align,
        },
      ).svg,
    );
  }
  parts.push(...bodyParts);
  return { svg: parts.join(''), height, width };
}

/** Wraps finished content in a standalone SVG document. */
export function svgDocument(width, height, content) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(width)} ${round(height)}" width="${round(width)}" height="${round(height)}">`,
    content,
    '</svg>',
    '',
  ].join('\n');
}

/** A ten-sided die face (a kite) showing one digit, centred on (cx, cy). */
export function die(cx, cy, value, { size = 34, tone = 'plain' } = {}) {
  const palette = tones[tone];
  const half = size / 2;
  const points = [
    [cx, cy - half],
    [cx + half * 0.86, cy - half * 0.18],
    [cx, cy + half],
    [cx - half * 0.86, cy - half * 0.18],
  ]
    .map(([x, y]) => `${round(x)},${round(y)}`)
    .join(' ');
  const label = text(
    cx,
    cy - half * 0.62,
    String(value),
    { ...type.big, size: size * 0.5, lineHeight: 1.6 },
    {
      anchor: 'middle',
      fill: tone === 'plain' ? colour.ink : palette.stroke,
    },
  );
  return `<polygon points="${points}" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="1.6" stroke-linejoin="round"/>${label.svg}`;
}
