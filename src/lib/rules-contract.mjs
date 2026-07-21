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

export function criticalCeiling(skill) {
  assertPercentage(skill);
  return Math.floor(skill / 10);
}

export function fumbleFloor(skill) {
  assertPercentage(skill);
  return skill === 100 ? 100 : 99;
}

export function improvementFor(skill) {
  assertPercentage(skill);

  if (skill <= 50) return 5;
  if (skill <= 75) return 3;
  if (skill <= 99) return 1;
  return 0;
}

export function opposedWinner(first, second) {
  for (const participant of [first, second]) {
    assertPercentage(participant.skill);
    if (!(participant.grade in gradeRank)) {
      throw new TypeError(`Unknown result grade: ${participant.grade}`);
    }
    if (!Number.isInteger(participant.roll) || participant.roll < 1 || participant.roll > 100) {
      throw new RangeError('Opposed rolls must be integers from 1 to 100.');
    }
  }

  const firstRank = gradeRank[first.grade];
  const secondRank = gradeRank[second.grade];
  if (firstRank !== secondRank) return firstRank > secondRank ? first.role : second.role;

  if (first.roll !== second.roll) {
    const successful = firstRank >= gradeRank.success;
    if (successful) return first.roll > second.roll ? first.role : second.role;
    return first.roll < second.roll ? first.role : second.role;
  }

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
  return Math.min(pow, recoverySteps * Math.ceil(pow / 4));
}
