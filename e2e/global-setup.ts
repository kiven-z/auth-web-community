import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { backendReadyFlagPath } from './support/backend-ready';
import { probeBackend } from './support/probe-backend';

const e2eRoot = path.dirname(fileURLToPath(import.meta.url));

export default async function globalSetup(): Promise<void> {
  const apiBaseUrl = process.env.E2E_API_URL ?? 'http://localhost:8080';
  const ready = await probeBackend(apiBaseUrl);

  mkdirSync(path.dirname(backendReadyFlagPath), { recursive: true });
  writeFileSync(backendReadyFlagPath, ready ? '1' : '0', 'utf8');

  mkdirSync(path.join(e2eRoot, '.auth'), { recursive: true });

  if (ready) {
    console.log(`[e2e] Backend ready: ${apiBaseUrl}`);
    return;
  }

  if (process.env.E2E_SKIP_IF_NO_BACKEND === '1') {
    console.warn(`[e2e] Backend not reachable at ${apiBaseUrl}; tests will be skipped.`);
    return;
  }

  throw new Error(
    `[e2e] Backend not reachable at ${apiBaseUrl}. Start auth stack (gateway :8080) or set E2E_SKIP_IF_NO_BACKEND=1.`
  );
}
