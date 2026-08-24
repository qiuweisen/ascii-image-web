import { afterEach, describe, expect, it } from 'vitest';
import {
  trackAsciiEvent,
  type AsciiAnalyticsEvent,
} from '@/lib/analytics-events';

const originalWindow = globalThis.window;

afterEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: originalWindow,
  });
});

describe('trackAsciiEvent', () => {
  it('forwards a sanitized event to the data layer', () => {
    const dataLayer: unknown[] = [];
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { dataLayer },
    });

    const event: AsciiAnalyticsEvent = {
      name: 'ascii_copy',
      payload: { format: 'markdown', output: 'private text' },
    };

    trackAsciiEvent(event);

    expect(dataLayer).toEqual([
      { event: 'ascii_copy', format: 'markdown' },
    ]);
  });

  it('no-ops when analytics is unavailable', () => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {},
    });

    expect(() =>
      trackAsciiEvent({
        name: 'ascii_conversion_complete',
        payload: { source: 'upload', width: 56, rows: 20 },
      })
    ).not.toThrow();
  });
});
