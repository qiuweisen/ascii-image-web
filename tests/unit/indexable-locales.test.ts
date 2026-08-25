import { describe, expect, it } from 'vitest';
import * as localeModule from '@/lib/locale';

describe('indexable locales', () => {
  it('indexes only the completed English product locale', () => {
    expect(Reflect.get(localeModule, 'indexableLocales')).toEqual(['en']);
  });

  it('marks unfinished locales as non-indexable', () => {
    const isIndexableLocale = Reflect.get(localeModule, 'isIndexableLocale') as
      | ((locale: string) => boolean)
      | undefined;

    expect(isIndexableLocale).toBeTypeOf('function');
    expect(isIndexableLocale?.('en')).toBe(true);
    expect(isIndexableLocale?.('zh')).toBe(false);
  });
});
