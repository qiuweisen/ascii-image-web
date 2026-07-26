import { rmSync } from 'node:fs';

const E2E_STATE_PATH = './.wrangler/e2e-state';

rmSync(E2E_STATE_PATH, { recursive: true, force: true });
