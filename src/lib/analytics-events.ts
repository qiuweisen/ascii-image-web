export type AsciiAnalyticsEventName =
  | 'ascii_upload'
  | 'ascii_paste'
  | 'ascii_conversion_complete'
  | 'ascii_copy'
  | 'ascii_download'
  | 'ascii_preset_select'
  | 'ascii_format_select'
  | 'ascii_control_change';

export type AsciiAnalyticsEvent = {
  name: AsciiAnalyticsEventName;
  payload: Record<string, unknown>;
};

const EVENT_FIELDS: Record<AsciiAnalyticsEventName, string[]> = {
  ascii_upload: ['mimeType', 'fileSize'],
  ascii_paste: ['mimeType', 'fileSize'],
  ascii_conversion_complete: ['source', 'width', 'rows'],
  ascii_copy: ['format'],
  ascii_download: ['format'],
  ascii_preset_select: ['preset'],
  ascii_format_select: ['format'],
  ascii_control_change: ['control', 'value'],
};

function sanitizePayload(event: AsciiAnalyticsEvent) {
  const allowed = EVENT_FIELDS[event.name];
  return Object.fromEntries(
    allowed.flatMap((key) => {
      const value = event.payload[key];
      if (
        typeof value === 'string' ||
        (typeof value === 'number' && Number.isFinite(value))
      ) {
        return [[key, value]];
      }
      return [];
    })
  );
}

export function trackAsciiEvent(event: AsciiAnalyticsEvent) {
  if (typeof window === 'undefined') return;

  const payload = sanitizePayload(event);
  if (typeof window.gtag === 'function') {
    window.gtag('event', event.name, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: event.name, ...payload });
  }

  if (typeof window.plausible === 'function') {
    window.plausible(event.name, { props: payload });
  }

  if (typeof window.umami?.track === 'function') {
    window.umami.track(event.name, payload);
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, unknown> }
    ) => void;
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}
