import {
  IconClipboard,
  IconDownload,
  IconRefresh,
  IconUpload,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { trackAsciiEvent } from '@/lib/analytics-events';
import { m } from '@/locale/paraglide/messages';
import {
  ASCII_PRESETS,
  formatAsciiOutput,
  type AsciiOutputFormat,
  type AsciiPresetId,
} from './ascii-converter-model';

const RAMPS = {
  classic: ' .,:;irsXA253hMHGS#9B&@',
  dense: ' .-:=+*#%@',
  blocks: ' ░▒▓█',
};
type Ramp = keyof typeof RAMPS;

function demoImage(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const g = ctx.createLinearGradient(0, 0, 180, 120);
  g.addColorStop(0, '#102d34');
  g.addColorStop(1, '#d4f5e9');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 180, 120);
  ctx.fillStyle = '#0b1114';
  ctx.beginPath();
  ctx.arc(90, 50, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(52, 80, 76, 30);
  return canvas;
}

function renderAscii(
  source: HTMLCanvasElement,
  width: number,
  ramp: string,
  contrast: number,
  invert: boolean
) {
  const ratio = source.height / source.width;
  const cols = Math.max(20, width);
  const rows = Math.max(4, Math.floor(cols * ratio * 0.48));
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(source, 0, 0, cols, rows);
  const pixels = ctx.getImageData(0, 0, cols, rows).data;
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      let value =
        (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114) /
        255;
      value = (value - 0.5) * (1 + contrast / 50) + 0.5;
      if (invert) value = 1 - value;
      line +=
        ramp[
          Math.min(
            ramp.length - 1,
            Math.max(0, Math.floor(value * ramp.length))
          )
        ];
    }
    lines.push(line);
  }
  return lines.join('\n');
}

export function AsciiConverter({
  presetId = 'default',
}: {
  presetId?: AsciiPresetId;
}) {
  const preset = ASCII_PRESETS[presetId];
  const [source, setSource] = useState<HTMLCanvasElement | null>(null);
  const [output, setOutput] = useState('');
  const [width, setWidth] = useState(preset.width);
  const [contrast, setContrast] = useState(preset.contrast);
  const [ramp, setRamp] = useState<Ramp>(preset.ramp);
  const [invert, setInvert] = useState(preset.invert);
  const [outputFormat, setOutputFormat] = useState<AsciiOutputFormat>(
    preset.outputFormat
  );
  const [selectedPreset, setSelectedPreset] = useState<AsciiPresetId>(presetId);
  const [status, setStatus] = useState(() => m.ascii_status_demo());
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      setSource(canvas);
      setOutput(renderAscii(canvas, width, RAMPS[ramp], contrast, invert));
    },
    [width, ramp, contrast, invert]
  );
  useEffect(() => {
    update(source ?? demoImage());
  }, [update]);
  const loadFile = useCallback(
    (file?: File, sourceType: 'upload' | 'paste' = 'upload') => {
      if (
        !file ||
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
        file.size > 10 * 1024 * 1024
      ) {
        setStatus(m.ascii_status_invalid_file());
        return;
      }
      const image = new Image();
      const imageUrl = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d')?.drawImage(image, 0, 0);
        URL.revokeObjectURL(imageUrl);
        setStatus(m.ascii_status_image_complete());
        update(canvas);
        trackAsciiEvent({
          name: sourceType === 'paste' ? 'ascii_paste' : 'ascii_upload',
          payload: { mimeType: file.type, fileSize: file.size },
        });
        trackAsciiEvent({
          name: 'ascii_conversion_complete',
          payload: {
            source: sourceType,
            width,
            rows: Math.max(
              4,
              Math.floor(((width * canvas.height) / canvas.width) * 0.48)
            ),
          },
        });
      };
      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        setStatus(m.ascii_status_image_error());
      };
      image.src = imageUrl;
    },
    [update, width]
  );
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = [...(event.clipboardData?.items ?? [])]
        .find((item) => item.type.startsWith('image/'))
        ?.getAsFile();
      if (file) {
        event.preventDefault();
        loadFile(file, 'paste');
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [loadFile]);
  const formattedOutput = formatAsciiOutput(output, outputFormat);
  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(formattedOutput);
      setStatus(m.ascii_status_copied());
      trackAsciiEvent({
        name: 'ascii_copy',
        payload: { format: outputFormat },
      });
    } catch {
      setStatus(m.ascii_status_copy_error());
    }
  };
  const download = () => {
    const extension =
      outputFormat === 'text'
        ? 'txt'
        : outputFormat === 'markdown'
          ? 'md'
          : 'html';
    const mimeType =
      outputFormat === 'html' ? 'text/html' : 'text/plain;charset=utf-8';
    const blob = new Blob([formattedOutput], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus(
      outputFormat === 'markdown'
        ? m.ascii_status_markdown_downloaded()
        : outputFormat === 'html'
          ? m.ascii_status_html_downloaded()
          : m.ascii_status_downloaded()
    );
    trackAsciiEvent({
      name: 'ascii_download',
      payload: { format: outputFormat },
    });
  };
  return (
    <section className="ascii-workspace" aria-label="Image to ASCII converter">
      <div className="ascii-workspace-bar">
        <span>
          <i className="ascii-pulse" /> {m.ascii_status_workspace()}
        </span>
        <span>{status}</span>
      </div>
      <div className="ascii-workspace-grid">
        <div className="ascii-controls">
          <button
            type="button"
            className="ascii-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              loadFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <IconUpload />
            <strong>{m.ascii_drop_title()}</strong>
            <span>{m.ascii_drop_browse()}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
          <div className="ascii-control-group">
            <label htmlFor="width">
              {m.ascii_control_output_width()} <output>{width} COL</output>
            </label>
            <input
              id="width"
              type="range"
              min="40"
              max="160"
              step="4"
              value={width}
              onChange={(e) => {
                const value = +e.target.value;
                setWidth(value);
                trackAsciiEvent({
                  name: 'ascii_control_change',
                  payload: { control: 'width', value },
                });
              }}
            />
          </div>
          <div className="ascii-control-group">
            <label htmlFor="contrast">
              {m.ascii_control_contrast()}{' '}
              <output>
                {contrast > 0 ? '+' : ''}
                {contrast}
              </output>
            </label>
            <input
              id="contrast"
              type="range"
              min="-40"
              max="60"
              value={contrast}
              onChange={(e) => {
                const value = +e.target.value;
                setContrast(value);
                trackAsciiEvent({
                  name: 'ascii_control_change',
                  payload: { control: 'contrast', value },
                });
              }}
            />
          </div>
          <fieldset className="ascii-control-group">
            <legend>{m.ascii_preset_label()}</legend>
            <div className="ascii-segmented">
              {(['default', 'discord', 'readme'] as AsciiPresetId[]).map(
                (id) => (
                  <button
                    key={id}
                    type="button"
                    className={selectedPreset === id ? 'is-active' : ''}
                    onClick={() => {
                      const next = ASCII_PRESETS[id];
                      setSelectedPreset(id);
                      setWidth(next.width);
                      setContrast(next.contrast);
                      setRamp(next.ramp);
                      setInvert(next.invert);
                      setOutputFormat(next.outputFormat);
                      trackAsciiEvent({
                        name: 'ascii_preset_select',
                        payload: { preset: id },
                      });
                    }}
                  >
                    {id === 'default'
                      ? m.ascii_preset_default()
                      : id === 'discord'
                        ? m.ascii_preset_discord()
                        : m.ascii_preset_readme()}
                  </button>
                )
              )}
            </div>
          </fieldset>
          <div className="ascii-control-group">
            <label htmlFor="output-format">
              {m.ascii_control_output_format()}
            </label>
            <select
              id="output-format"
              value={outputFormat}
              onChange={(event) => {
                const format = event.target.value as AsciiOutputFormat;
                setOutputFormat(format);
                trackAsciiEvent({
                  name: 'ascii_format_select',
                  payload: { format },
                });
              }}
            >
              <option value="text">{m.ascii_output_format_text()}</option>
              <option value="markdown">
                {m.ascii_output_format_markdown()}
              </option>
              <option value="html">{m.ascii_output_format_html()}</option>
            </select>
          </div>
          <fieldset className="ascii-control-group">
            <legend>{m.ascii_control_character_ramp()}</legend>
            <div className="ascii-segmented">
              {(Object.keys(RAMPS) as Ramp[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={ramp === key ? 'is-active' : ''}
                  onClick={() => {
                    setRamp(key);
                    trackAsciiEvent({
                      name: 'ascii_control_change',
                      payload: { control: 'ramp', value: key },
                    });
                  }}
                >
                  {key === 'classic'
                    ? m.ascii_ramp_classic()
                    : key === 'dense'
                      ? m.ascii_ramp_dense()
                      : m.ascii_ramp_blocks()}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="ascii-check">
            <input
              type="checkbox"
              checked={invert}
              onChange={(e) => {
                setInvert(e.target.checked);
                trackAsciiEvent({
                  name: 'ascii_control_change',
                  payload: {
                    control: 'invert',
                    value: e.target.checked ? 1 : 0,
                  },
                });
              }}
            />{' '}
            {m.ascii_control_invert()}
          </label>
          <div className="ascii-actions">
            <Button onClick={copy} size="lg">
              <IconClipboard /> {m.ascii_action_copy()}
            </Button>
            <Button onClick={download} variant="outline" size="lg">
              <IconDownload />{' '}
              {outputFormat === 'markdown'
                ? m.ascii_action_download_markdown()
                : outputFormat === 'html'
                  ? m.ascii_action_download_html()
                  : m.ascii_action_download()}
            </Button>
            <button
              type="button"
              className="ascii-reset"
              onClick={() => {
                setSelectedPreset(presetId);
                setWidth(preset.width);
                setContrast(preset.contrast);
                setRamp(preset.ramp);
                setInvert(preset.invert);
                setOutputFormat(preset.outputFormat);
                setStatus(m.ascii_status_demo());
                update(demoImage());
              }}
              aria-label={m.ascii_action_reset()}
            >
              <IconRefresh />
            </button>
          </div>
          <p className="ascii-privacy">{m.ascii_privacy_note()}</p>
        </div>
        <div className="ascii-output-wrap">
          <div className="ascii-output-head">
            <span>{m.ascii_output_label()}</span>
            <span>{output.split('\n').length} ROWS</span>
          </div>
          <pre className="ascii-output" aria-live="polite">
            {output}
          </pre>
        </div>
      </div>
    </section>
  );
}
