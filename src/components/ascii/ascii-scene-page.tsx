import { Link } from '@tanstack/react-router';
import { AsciiConverter } from '@/components/ascii/ascii-converter';
import type { AsciiPresetId } from '@/components/ascii/ascii-converter-model';
import { m } from '@/locale/paraglide/messages';

type SceneStep = {
  title: string;
  body: string;
};

export function AsciiScenePage({
  kicker,
  title,
  lede,
  presetId,
  guideTitle,
  steps,
  exampleTitle,
  exampleBody,
  exampleCode,
}: {
  kicker: string;
  title: string;
  lede: string;
  presetId: Extract<AsciiPresetId, 'discord' | 'readme'>;
  guideTitle: string;
  steps: SceneStep[];
  exampleTitle: string;
  exampleBody: string;
  exampleCode: string;
}) {
  return (
    <div className="ascii-site">
      <header className="ascii-scene-header">
        <div className="ascii-container">
          <div className="ascii-kicker">
            <span className="ascii-pulse" /> {kicker}
          </div>
          <h1>{title}</h1>
          <p className="ascii-lede">{lede}</p>
        </div>
      </header>

      <main className="ascii-container ascii-scene-main">
        <AsciiConverter presetId={presetId} />

        <section className="ascii-section" aria-labelledby="scene-guide-title">
          <div className="ascii-section-heading">
            <span className="ascii-index">01</span>
            <h2 id="scene-guide-title">{guideTitle}</h2>
          </div>
          <ol className="ascii-scene-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="ascii-section ascii-scene-example"
          aria-labelledby="scene-example-title"
        >
          <div className="ascii-section-heading">
            <span className="ascii-index">02</span>
            <h2 id="scene-example-title">{exampleTitle}</h2>
          </div>
          <div className="ascii-scene-example-grid">
            <p>{exampleBody}</p>
            <pre>
              <code>{exampleCode}</code>
            </pre>
          </div>
        </section>

        <nav
          className="ascii-scene-related"
          aria-label={m.ascii_scene_related_title()}
        >
          <span>{m.ascii_scene_related_title()}</span>
          <Link to="/">{m.ascii_scene_home_link()} →</Link>
          <Link to="/line-art">{m.ascii_scene_line_art_link()} →</Link>
          {presetId === 'discord' ? (
            <Link to="/ascii-art-for-readme">
              {m.ascii_scene_readme_title()} →
            </Link>
          ) : (
            <Link to="/ascii-art-for-discord">
              {m.ascii_scene_discord_title()} →
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}
