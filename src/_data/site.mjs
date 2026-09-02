import { readFileSync } from 'node:fs';

const illustrationProgram = JSON.parse(
  readFileSync(
    new URL('../../art/library/chapters/illustration-program.json', import.meta.url),
    'utf8',
  ),
);
const chapterArt = Object.fromEntries(
  Object.keys(illustrationProgram.chapterCounts).map((chapter) => [
    chapter,
    illustrationProgram.subjects.filter((subject) => subject.chapter === chapter),
  ]),
);

export default {
  title: 'Fantasy Crux 2.0 Beta',
  motto: 'Steel & Consequence',
  edition: 'Cold Iron Edition',
  description: 'Compact, gritty fantasy rules built for fast use at the table.',
  chapterArt,
  primaryNav: [
    { number: 0, label: 'Start Here', href: '/rules/start-here/' },
    { number: 1, label: 'Characters', href: '/rules/characters/' },
    { number: 2, label: 'Skills', href: '/rules/skills/' },
    { number: 3, label: 'Equipment', href: '/rules/equipment/' },
    { number: 4, label: 'Combat', href: '/rules/combat/' },
    { number: 5, label: 'Talents', href: '/rules/talents/' },
    { number: 6, label: 'Shaping', href: '/rules/magic/' },
    { number: 7, label: 'Adventuring', href: '/rules/adventuring/' },
    { number: 8, label: 'GM Tools', href: '/rules/gm-tools/' },
    { number: 9, label: 'Creatures', href: '/rules/creatures/' },
    { number: 10, label: 'Gazetteer', href: '/rules/gazetteer/' },
    { number: '§', label: 'License', href: '/license/' },
  ],
};
