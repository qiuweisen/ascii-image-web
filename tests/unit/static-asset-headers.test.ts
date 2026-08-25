import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const headersPath = resolve(process.cwd(), 'public/_headers');
const headers = existsSync(headersPath)
  ? readFileSync(headersPath, 'utf8')
  : '';

describe('static asset cache headers', () => {
  it('caches fingerprinted assets immutably', () => {
    expect(headers).toContain('/assets/*');
    expect(headers).toContain(
      'Cache-Control: public, max-age=31536000, immutable'
    );
    expect(headers).toContain('/fonts/*');
  });

  it('caches generated image assets with revalidation', () => {
    expect(headers).toContain('/ascii/*');
    expect(headers).toContain('/*.webp');
    expect(headers).toContain(
      'Cache-Control: public, max-age=604800, stale-while-revalidate=86400'
    );
  });
});
