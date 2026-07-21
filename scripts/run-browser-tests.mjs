import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startPreviewServer, stopPreviewServer } from './serve-site.mjs';

const playwrightCli = fileURLToPath(import.meta.resolve('@playwright/test/cli'));
let child;

function relaySignal(signal) {
  child?.kill(signal);
}

process.on('SIGINT', () => relaySignal('SIGINT'));
process.on('SIGTERM', () => relaySignal('SIGTERM'));

try {
  await startPreviewServer();
  child = spawn(process.execPath, [playwrightCli, 'test', ...process.argv.slice(2)], {
    env: process.env,
    stdio: 'inherit',
  });

  const exitCode = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => resolve(code));
  });
  process.exitCode = exitCode ?? 1;
} finally {
  await stopPreviewServer();
}
