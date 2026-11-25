import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

const root = process.cwd();
const campaign = path.join(root, 'adventures/seven-bells-for-no-king');
const paths = [path.join(campaign, 'README.md'), ...fs.readdirSync(campaign).filter(x => /^\d.*\.md$/.test(x)).sort().map(x => path.join(campaign, x))];
for (const adventure of ['the-lamp-that-went-dark', 'the-patients-of-hollow-ward']) {
  const dir = path.join(root, 'adventures', adventure);
  paths.push(...fs.readdirSync(dir).filter(x => /^\d.*\.md$/.test(x)).sort().map(x => path.join(dir, x)));
}
const creaturePaths = new Set();
for (const file of paths) {
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/\]\(([^)#]*creatures\/[^)#]+\.md)(?:#[^)]*)?\)/g)) {
    const full = path.resolve(path.dirname(file), match[1]);
    if (fs.existsSync(full)) creaturePaths.add(full);
  }
}
paths.push(...[...creaturePaths].sort());
paths.push(path.join(root, 'src/license.md'));
const md = new MarkdownIt({html: false});
const slug = text => text.toLowerCase().replace(/\{#[^}]+\}/g, '').trim().replace(/[^\p{L}\p{N} _-]/gu, '').replaceAll(' ', '-');
const docs = paths.map(file => {
  const {data, content} = matter(fs.readFileSync(file, 'utf8'));
  let body = content;
  if (data.type === 'creature') {
    const stats = Object.entries(data.characteristics || {}).map(([key, value]) => `**${key.toUpperCase()}:** ${value}`).join(' · ');
    const derived = Object.entries(data.derived || {}).map(([key, value]) => `**${key}:** ${value}`).join(' · ');
    body = `# ${data.title}\n\n${data.summary || ''}\n\n${stats}\n\n${derived}\n\n**Tags:** ${(data.tags || []).join(', ')}\n\n${(data.derivedNotes || []).join(' ')}\n\n## Skills\n\n${(data.skills || []).map(x => '- '+x).join('\n')}\n\n## Attacks\n\n${(data.attacks || []).map(x => '- '+x).join('\n')}\n\n**Talents:** ${data.talents || 'None'}\n\n${(data.attackNotes || []).join(' ')}\n\n${body}`;
  }
  const tokens = md.parse(body, {});
  const title = tokens.find((t,i) => i && tokens[i-1].type === 'heading_open')?.content || data.title || path.basename(file);
  const id = 'd'+crypto.createHash('md5').update(file).digest('hex').slice(0,12);
  const anchors = {};
  let h=0;
  for (let i=0;i<tokens.length;i++) if(tokens[i].type==='heading_open') {
    const text=tokens[i+1].content; const key=id+'h'+h++;
    anchors[slug(text)]=key;
    const explicit=text.match(/\{#([^}]+)\}/); if(explicit) anchors[explicit[1]]=key;
    tokens[i].pdfKey=key;
  }
  return {file, title, id, anchors, tokens, group:file.startsWith(campaign)?'Campaign':file.includes('/creatures/')?'Creature reference':file.endsWith('/src/license.md')?'License':'Complete introductory adventures'};
});
fs.writeFileSync(path.join(root,'tmp/pdfs/seven-bells-mobile/inputs.json'),JSON.stringify(docs));
console.log(`${docs.length} documents prepared, including ${creaturePaths.size} creature references.`);
