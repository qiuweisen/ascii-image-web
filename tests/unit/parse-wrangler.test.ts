import { describe, expect, it } from 'vitest';
import { parseWranglerContent } from '../../scripts/parse-wrangler';

describe('parseWranglerContent', () => {
  it('preserves URL values while removing JSONC comments', () => {
    const config = parseWranglerContent(`{
      // production origin
      "vars": { "VITE_BASE_URL": "https://asciiimage.com" },
      "d1_databases": [{ "database_name": "ascii-image-web", }],
    }`);

    expect(config.vars).toEqual({
      VITE_BASE_URL: 'https://asciiimage.com',
    });
    expect(config.d1_databases?.[0]?.database_name).toBe('ascii-image-web');
  });
});
