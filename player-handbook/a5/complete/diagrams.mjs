const row = (items, extra = '') => `<div class="diagram-row ${extra}">${items.join('')}</div>`;
const card = (label, value, tone = '') =>
  `<div class="diagram-card ${tone}"><span>${label}</span><strong>${value}</strong></div>`;
const die = (label, value) => `<div class="die"><span>${label}</span><b>${value}</b></div>`;

export const diagrams = {
  percentile: `<div class="diagram dice-example" aria-label="Read percentile dice and grade a skill of sixty percent">
    ${row([die('TENS', '5'), die('UNITS', '9'), card('D100 RESULT', '59')])}
    ${row([card('SKILL 60%: CRITICAL', '01-06', 'good'), card('SUCCESS', '07-60', 'good'), card('FAILURE', '61-98'), card('FUMBLE', '99-100', 'bad')])}
    <p class="diagram-note">Tens 0 + units 7 = 07. Tens 0 + units 0 = 100.</p></div>`,
  bonus: `<div class="diagram"><p class="diagram-title">ONE UNITS DIE: 5 · TENS: 2 AND 6 · CANDIDATES: 25 / 65</p>
    ${row([card('BOTH SUCCEED · HIGHER IS STRONGER', '+1B: 65 · -1P: 25', 'good'), card('SUCCESS BEATS FAILURE', '+1B: 25 · -1P: 65')])}
    <p class="diagram-note">Choose grade first. Within the same successful grade, the higher result wins an opposed test.</p></div>`,
  round: `<div class="diagram">${row([card('EACH ROUND', '1 ACTION'), card('EACH ROUND', '1 MOVE'), card('WHEN TRIGGERED', '1 REACTION', 'good')])}</div>`,
  parry: `<div class="diagram"><p class="diagram-title">ORDINARY PARRY AGAINST A HEAVY ATTACK</p>
    ${row([card('MEDIUM SHIELD · HEAVY', 'BLOCK ALL', 'good'), card('ARMING SWORD · MEDIUM', 'BLOCK HALF'), card('DAGGER · LIGHT', 'BLOCK NONE', 'bad')])}</div>`,
  damage: `<div class="diagram damage-diagram"><p class="diagram-title">ORDINARY HEAVY HIT · MEDIUM PARRY · LEATHER ARMOUR</p>
    ${row([card('ROLLED DAMAGE', '12'), card('PARRY BLOCKS', '-6'), card('ARMOUR REMOVES', '-2'), card('HP LOST', '4', 'bad')])}
    <p class="diagram-note">Parry first, armour second. Only the remaining damage reaches HP.</p></div>`,
  offhand: `<div class="diagram">${row([card('EXTRA ATTACK', '-1P', 'bad'), '<b class="or">OR</b>', card('EXTRA PARRY / OPPORTUNITY', '-1P', 'good')])}</div>`,
  intimidate: `<div class="diagram">${row([card('YOU SPEND', '1 ACTION'), card('YOU ROLL', 'INFLUENCE'), card('THEY RESIST', 'PERSISTENCE')])}</div>`,
  wounds: `<div class="diagram"><p class="diagram-title">AFTER REACHING 0 HP: STABILISE BEFORE THE DEADLINE</p>
    ${row([card('UNCONSCIOUS + DYING', '0 HP', 'bad'), card('NEXT ROUND', '1'), card('NEXT ROUND', '2'), card('DIE IF STILL DYING', 'END OF 3', 'bad')])}</div>`,
  recovery: `<div class="diagram">${row([card('PREVENT NEW WOUND CONDITIONS', '1 POINT'), card('AVOID DEATH AT 0 HP', '+1 POINT', 'good')])}
    <p class="diagram-note">Preventing conditions does not prevent HP loss. Two effects cost two points.</p></div>`,
  reload: `<div class="diagram">${row([card('LIGHT CROSSBOW', 'MOVE + BASE REACTION'), card('HEAVY: ALL ACTIONS + ALL REACTIONS', 'WHOLE ROUND', 'bad')])}</div>`,
};
