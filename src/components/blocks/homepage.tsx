import { AsciiConverter } from '@/components/ascii/ascii-converter';
import { Link } from '@tanstack/react-router';

const faqs = [
  [
    'Does my image leave my device?',
    'No. The image is decoded and rendered in your browser. Nothing is uploaded or stored.',
  ],
  [
    'Why does my output look stretched?',
    'ASCII characters are taller than they are wide. Keep aspect-ratio compensation enabled for more natural proportions.',
  ],
  [
    'What can I use ASCII art for?',
    'Copy it into a terminal, README, Discord message, code comment, social bio, or poster concept.',
  ],
];

export function HomePage() {
  return (
    <div className="ascii-site">
      <section className="ascii-hero">
        <div className="ascii-container ascii-hero-grid">
          <div className="ascii-kicker">
            <span className="ascii-pulse" /> LOCAL / NO UPLOAD / READY
          </div>
          <h1>
            Image to <span>ASCII</span>
          </h1>
          <p className="ascii-lede">
            Turn a photo into luminous monospace art in your browser. Tune the
            density, copy the result, and keep the original file on your device.
          </p>
          <div className="ascii-hero-meta">
            <span>⌘ no account</span>
            <span>↯ instant preview</span>
            <span>◎ works offline</span>
          </div>
        </div>
      </section>

      <main className="ascii-container ascii-main">
        <AsciiConverter />

        <section className="ascii-section" aria-labelledby="use-cases-title">
          <div className="ascii-section-heading">
            <span className="ascii-index">01</span>
            <h2 id="use-cases-title">Made for places where images get lost</h2>
          </div>
          <div className="ascii-use-grid">
            {[
              [
                'README / TERMINAL',
                'Keep a visual signature inside code, issues, and shell scripts.',
              ],
              [
                'SOCIAL / DISCORD',
                'Paste a compact portrait, reaction, or divider without attaching a file.',
              ],
              [
                'POSTER / COVER',
                'Push contrast and character density until a photo becomes a graphic texture.',
              ],
            ].map(([title, body]) => (
              <article key={title} className="ascii-use-item">
                <div className="ascii-use-mark">+_</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ascii-section" aria-labelledby="styles-title">
          <div className="ascii-section-heading">
            <span className="ascii-index">02</span>
            <h2 id="styles-title">Choose a different signal</h2>
          </div>
          <div className="ascii-style-links">
            <Link to="/line-art/" className="ascii-style-link">
              <span>01 / LINE ART</span>
              <strong>One-line pieces to copy</strong>
              <b>→</b>
            </Link>
            <div className="ascii-style-link is-muted">
              <span>02 / BRAILLE</span>
              <strong>High-detail dot mapping</strong>
              <em>SOON</em>
            </div>
            <div className="ascii-style-link is-muted">
              <span>03 / COLOR</span>
              <strong>Keep the source palette</strong>
              <em>SOON</em>
            </div>
          </div>
        </section>

        <section
          className="ascii-section ascii-faq"
          aria-labelledby="faq-title"
        >
          <div className="ascii-section-heading">
            <span className="ascii-index">03</span>
            <h2 id="faq-title">Field notes</h2>
          </div>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
}
