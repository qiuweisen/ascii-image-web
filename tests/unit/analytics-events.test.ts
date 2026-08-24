import { afterEach, describe, expect, it, vi } from 'vitest';
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

    expect(dataLayer).toEqual([{ event: 'ascii_copy', format: 'markdown' }]);
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

  it('does not duplicate GA events when gtag is available', () => {
    const dataLayer: unknown[] = [];
    const gtag = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { dataLayer, gtag },
    });

    trackAsciiEvent({
      name: 'ascii_download',
      payload: { format: 'html' },
    });

    expect(gtag).toHaveBeenCalledWith('event', 'ascii_download', {
      format: 'html',
    });
    expect(dataLayer).toEqual([]);
  });

  it('forwards sanitized events to Umami when configured', () => {
    const track = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { umami: { track } },
    });

    trackAsciiEvent({
      name: 'ascii_preset_select',
      payload: { preset: 'discord', output: 'private text' },
    });

    expect(track).toHaveBeenCalledWith('ascii_preset_select', {
      preset: 'discord',
    });
  });
});
