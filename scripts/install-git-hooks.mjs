// Points git at the versioned hooks in .githooks/ so a fresh clone gets the pre-push
// checks from its first `npm install`. Runs as the `prepare` lifecycle script, which
// also fires during `npm ci` on a runner, so anywhere without a working tree to guard
// this exits quietly rather than failing the install.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const hooksPath = '.githooks';

if (process.env.CI) {
  process.exit(0);
}

if (!existsSync(path.resolve('.git'))) {
  process.exit(0);
}

try {
  const current = execFileSync('git', ['config', '--get', 'core.hooksPath'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

  if (current === hooksPath) {
    process.exit(0);
  }
} catch {
  // `git config --get` exits non-zero when the key is unset, which is the common case.
}

try {
  execFileSync('git', ['config', 'core.hooksPath', hooksPath], { stdio: 'ignore' });
  console.log(`Git hooks enabled: core.hooksPath -> ${hooksPath}`);
} catch (error) {
  console.warn(`Could not set core.hooksPath: ${error.message}`);
}
