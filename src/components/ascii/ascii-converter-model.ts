export type AsciiOutputFormat = 'text' | 'markdown' | 'html';
export type AsciiPresetId = 'default' | 'discord' | 'readme';
export type AsciiRamp = 'classic' | 'dense' | 'blocks';

export type AsciiPreset = {
  id: AsciiPresetId;
  width: number;
  contrast: number;
  ramp: AsciiRamp;
  invert: boolean;
  outputFormat: AsciiOutputFormat;
};

export const ASCII_PRESETS: Record<AsciiPresetId, AsciiPreset> = {
  default: {
    id: 'default',
    width: 88,
    contrast: 10,
    ramp: 'classic',
    invert: false,
    outputFormat: 'text',
  },
  discord: {
    id: 'discord',
    width: 56,
    contrast: 14,
    ramp: 'dense',
    invert: false,
    outputFormat: 'text',
  },
  readme: {
    id: 'readme',
    width: 96,
    contrast: 10,
    ramp: 'classic',
    invert: false,
    outputFormat: 'markdown',
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatAsciiOutput(output: string, format: AsciiOutputFormat) {
  if (format === 'markdown') return `\`\`\`text\n${output}\n\`\`\``;
  if (format === 'html') return `<pre>${escapeHtml(output)}</pre>`;
  return output;
}
