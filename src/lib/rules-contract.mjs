const gradeRank = {
  fumble: 0,
  failure: 1,
  success: 2,
  critical: 3,
};

function assertPercentage(value, label = 'skill') {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be an integer from 0 to 100.`);
  }
}

function assertRoll(value) {
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new RangeError('D100 results must be integers from 1 to 100.');
  }
}

function compareResultQuality(first, second) {
  const firstRank = gradeRank[first.grade];
  const secondRank = gradeRank[second.grade];
  if (firstRank !== secondRank) return firstRank > secondRank ? 1 : -1;
  if (first.roll === second.roll) return 0;

  const successful = firstRank >= gradeRank.success;
  if (successful) return first.roll > second.roll ? 1 : -1;
  return first.roll < second.roll ? 1 : -1;
}

export function criticalCeiling(skill) {
  assertPercentage(skill);
  if (skill === 0) return 0;
  return Math.max(1, Math.floor(skill / 10));
}

export function fumbleFloor(skill) {
  assertPercentage(skill);
  return skill === 100 ? 100 : 99;
}

export function resultGrade(skill, roll) {
  assertPercentage(skill);
  assertRoll(roll);

  if (roll >= fumbleFloor(skill)) return 'fumble';
  if (roll <= criticalCeiling(skill)) return 'critical';
  if (roll <= skill) return 'success';
  return 'failure';
}

export function chooseModifiedResult({ skill, candidates, modifier }) {
  assertPercentage(skill);
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new TypeError('Modified tests require at least one candidate D100 result.');
  }
  if (modifier !== 'bonus' && modifier !== 'penalty') {
    throw new TypeError('Modifier must be either bonus or penalty.');
  }

  const graded = candidates.map((roll) => {
    assertRoll(roll);
    return { grade: resultGrade(skill, roll), roll };
  });

  return graded.reduce((chosen, candidate) => {
    const comparison = compareResultQuality(candidate, chosen);
    const candidateWins = modifier === 'bonus' ? comparison > 0 : comparison < 0;
    return candidateWins ? candidate : chosen;
  }).roll;
}

export function improvementFor(skill) {
  assertPercentage(skill);

  if (skill <= 50) return 5;
  if (skill <= 99) return 3;
  return 0;
}

export function opposedWinner(first, second) {
  for (const participant of [first, second]) {
    assertPercentage(participant.skill);
    if (!(participant.grade in gradeRank)) {
      throw new TypeError(`Unknown result grade: ${participant.grade}`);
    }
    assertRoll(participant.roll);
  }

  const comparison = compareResultQuality(first, second);
  if (comparison !== 0) return comparison > 0 ? first.role : second.role;

  if (first.skill !== second.skill) return first.skill > second.skill ? first.role : second.role;

  const defender = [first, second].find((participant) => participant.role === 'defender');
  return defender?.role ?? 'status-quo';
}

export function powerPointsRecovered({ pow, hours }) {
  if (!Number.isInteger(pow) || pow < 0) {
    throw new RangeError('POW must be a non-negative integer.');
  }
  if (!Number.isFinite(hours) || hours < 0) {
    throw new RangeError('Rest must be a non-negative number of hours.');
  }
  if (hours >= 8) return pow;

  const recoverySteps = Math.floor(hours / 2);
  return Math.min(pow, recoverySteps * Math.round(pow / 4));
}
