import { describe, expect, it } from 'vitest';
import {
  ASCII_PRESETS,
  formatAsciiOutput,
  type AsciiOutputFormat,
} from '@/components/ascii/ascii-converter-model';

describe('ascii converter model', () => {
  it('provides distinct Discord and README presets', () => {
    expect(ASCII_PRESETS.discord.width).toBeLessThan(
      ASCII_PRESETS.readme.width
    );
    expect(ASCII_PRESETS.discord.outputFormat).toBe('text');
    expect(ASCII_PRESETS.readme.outputFormat).toBe('markdown');
  });

  it.each<AsciiOutputFormat>([
    'text',
    'markdown',
    'html',
  ])('serializes %s output without losing line breaks', (format) => {
    const output = 'A<B\nC&D';
    const result = formatAsciiOutput(output, format);

    if (format === 'text') expect(result).toBe(output);
    if (format === 'markdown') expect(result).toBe('```text\nA<B\nC&D\n```');
    if (format === 'html') expect(result).toBe('<pre>A&lt;B\nC&amp;D</pre>');
  });
});
