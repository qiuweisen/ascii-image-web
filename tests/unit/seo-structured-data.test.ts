import { describe, expect, it } from 'vitest';
import { softwareApplicationJsonLd } from '@/lib/seo';

describe('software application structured data', () => {
  it('describes free browser tools with a canonical URL', () => {
    expect(
      softwareApplicationJsonLd({
        path: '/ascii-art-for-readme',
        name: 'ASCII Art for README',
        description: 'Create README ASCII art.',
      })
    ).toMatchObject({
      '@type': 'SoftwareApplication',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  });
});
