import {
  IconClipboard,
  IconDownload,
  IconRefresh,
  IconUpload,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

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

export function AsciiConverter() {
  const [source, setSource] = useState<HTMLCanvasElement | null>(null);
  const [output, setOutput] = useState('');
  const [width, setWidth] = useState(88);
  const [contrast, setContrast] = useState(10);
  const [ramp, setRamp] = useState<Ramp>('classic');
  const [invert, setInvert] = useState(false);
  const [status, setStatus] = useState('DEMO OUTPUT');
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
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = [...(event.clipboardData?.items ?? [])]
        .find((item) => item.type.startsWith('image/'))
        ?.getAsFile();
      if (file) {
        event.preventDefault();
        loadFile(file);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });
  const loadFile = (file?: File) => {
    if (
      !file ||
      !file.type.startsWith('image/') ||
      file.size > 10 * 1024 * 1024
    ) {
      setStatus('ERROR / USE AN IMAGE UNDER 10MB');
      return;
    }
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d')?.drawImage(image, 0, 0);
      setStatus('LOCAL IMAGE / COMPLETE');
      update(canvas);
    };
    image.src = URL.createObjectURL(file);
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(output);
    setStatus('COPIED TO CLIPBOARD');
  };
  const download = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('TXT DOWNLOADED');
  };
  return (
    <section className="ascii-workspace" aria-label="Image to ASCII converter">
      <div className="ascii-workspace-bar">
        <span>
          <i className="ascii-pulse" /> CONVERTER / BROWSER LOCAL
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
            <strong>Drop an image here</strong>
            <span>or browse / paste from clipboard</span>
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
              OUTPUT WIDTH <output>{width} COL</output>
            </label>
            <input
              id="width"
              type="range"
              min="40"
              max="160"
              step="4"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
            />
          </div>
          <div className="ascii-control-group">
            <label htmlFor="contrast">
              CONTRAST{' '}
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
              onChange={(e) => setContrast(+e.target.value)}
            />
          </div>
          <fieldset className="ascii-control-group">
            <legend>CHARACTER RAMP</legend>
            <div className="ascii-segmented">
              {(Object.keys(RAMPS) as Ramp[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={ramp === key ? 'is-active' : ''}
                  onClick={() => setRamp(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="ascii-check">
            <input
              type="checkbox"
              checked={invert}
              onChange={(e) => setInvert(e.target.checked)}
            />{' '}
            Invert mapping
          </label>
          <div className="ascii-actions">
            <Button onClick={copy} size="lg">
              <IconClipboard /> Copy text
            </Button>
            <Button onClick={download} variant="outline" size="lg">
              <IconDownload /> Download .txt
            </Button>
            <button
              type="button"
              className="ascii-reset"
              onClick={() => {
                setWidth(88);
                setContrast(10);
                setRamp('classic');
                setInvert(false);
                setStatus('DEMO OUTPUT');
                update(null);
              }}
              aria-label="Reset settings"
            >
              <IconRefresh />
            </button>
          </div>
          <p className="ascii-privacy">
            Your image never leaves this tab. Processing uses the Canvas API and
            can work offline.
          </p>
        </div>
        <div className="ascii-output-wrap">
          <div className="ascii-output-head">
            <span>ASCII OUTPUT</span>
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
