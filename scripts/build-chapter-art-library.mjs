import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const programPath = path.join(root, 'art', 'library', 'chapters', 'illustration-program.json');
const program = JSON.parse(readFileSync(programPath, 'utf8'));

const sentence = (value) => (String(value).endsWith('.') ? String(value) : `${value}.`);

for (const [id, character] of Object.entries(program.cast)) {
  const directory = path.join(root, 'art', 'library', 'cast', id);
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    path.join(directory, 'PROFILE.md'),
    `# ${character.label}\n\nID: \`${id}\`\n\n${sentence(character.brief)}\n\nCanonical anchor: \`${path.basename(character.anchor)}\`\n\nUse this character's face, body proportions, silhouette, clothing, equipment, and color cues whenever \`${id}\` appears in a chapter-art content brief. The selected style brief controls rendering only; do not redesign the character or inherit an anchor's pose, backdrop, lighting, or mood.\n`,
    'utf8',
  );
}

for (const subject of program.subjects.filter((item) => item.new)) {
  const directory = path.join(root, 'art', 'library', 'subjects', subject.id);
  mkdirSync(path.join(directory, 'styles'), { recursive: true });
  const placement =
    subject.chapter === 'license'
      ? `License page, after \`${subject.pageTarget}\``
      : `${subject.chapter} chapter, ${subject.rule}${
          subject.afterHeading ? ` after \`${subject.afterHeading}\`` : ` at ${subject.position}`
        }`;
  const cast = subject.cast.length
    ? subject.cast.map((id) => `- \`${id}\`: ${program.cast[id].brief}`).join('\n')
    : '- No recurring cast member; use only the objects or incidental figures named in the content block.';

  writeFileSync(
    path.join(directory, 'CONTENT.md'),
    `# ${subject.id}\n\nID: \`${subject.id}\`\n\nWebsite placement: ${placement}\n\nAlt text: ${subject.alt}\n\n## Content block\n\n${sentence(subject.contentBrief)}\n\n## Pose and composition\n\n${sentence(subject.poseBrief)}\n\nShape: \`${subject.shape}\`; website layout: \`${subject.layout}\`${subject.side ? `; side: \`${subject.side}\`` : ''}.\n\n## Recurring cast\n\n${cast}\n\n## Exclusions\n\nNo unrelated characters or props, duplicated anatomy, clipped focal action, readable text, logo, watermark, border, panel division, inherited anchor scenery, or inherited anchor mood.\n\nActive master: \`styles/inked-adventure-comic-vivid.png\`\n`,
    'utf8',
  );
}

console.log(
  `Wrote ${Object.keys(program.cast).length} cast profiles and ${program.newSubjectCount} new chapter-art content briefs.`,
);
