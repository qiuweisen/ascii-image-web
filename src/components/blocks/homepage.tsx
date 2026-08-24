import { AsciiConverter } from '@/components/ascii/ascii-converter';
import { Link } from '@tanstack/react-router';
import { m } from '@/locale/paraglide/messages';

const faqs = [
  [m.ascii_faq_privacy_question, m.ascii_faq_privacy_answer],
  [m.ascii_faq_stretch_question, m.ascii_faq_stretch_answer],
  [m.ascii_faq_use_question, m.ascii_faq_use_answer],
];

export function HomePage() {
  return (
    <div className="ascii-site">
      <section className="ascii-hero">
        <div className="ascii-container ascii-hero-grid">
          <div className="ascii-kicker">
            <span className="ascii-pulse" /> {m.ascii_hero_kicker()}
          </div>
          <h1>
            {m.ascii_hero_title_prefix()} <span>ASCII</span>
          </h1>
          <p className="ascii-lede">{m.ascii_hero_text()}</p>
          <div className="ascii-hero-meta">
            <span>⌘ {m.ascii_hero_meta_account()}</span>
            <span>↯ {m.ascii_hero_meta_preview()}</span>
            <span>◎ {m.ascii_hero_meta_offline()}</span>
          </div>
        </div>
      </section>

      <main className="ascii-container ascii-main">
        <AsciiConverter />

        <section className="ascii-section" aria-labelledby="use-cases-title">
          <div className="ascii-section-heading">
            <span className="ascii-index">01</span>
            <h2 id="use-cases-title">{m.ascii_use_title()}</h2>
          </div>
          <div className="ascii-use-grid">
            {[
              [m.ascii_use_readme_title(), m.ascii_use_readme_body()],
              [m.ascii_use_social_title(), m.ascii_use_social_body()],
              [m.ascii_use_poster_title(), m.ascii_use_poster_body()],
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
            <h2 id="styles-title">{m.ascii_styles_title()}</h2>
          </div>
          <div className="ascii-style-links">
            <Link to="/line-art" className="ascii-style-link">
              <span>{m.ascii_styles_line_label()}</span>
              <strong>{m.ascii_styles_line_description()}</strong>
              <b>→</b>
            </Link>
            <Link to="/ascii-art-for-discord" className="ascii-style-link">
              <span>{m.ascii_styles_discord_label()}</span>
              <strong>{m.ascii_styles_discord_description()}</strong>
              <b>→</b>
            </Link>
            <Link to="/ascii-art-for-readme" className="ascii-style-link">
              <span>{m.ascii_styles_readme_label()}</span>
              <strong>{m.ascii_styles_readme_description()}</strong>
              <b>→</b>
            </Link>
            <div className="ascii-style-link is-muted">
              <span>04 / Braille</span>
              <strong>{m.ascii_styles_braille_description()}</strong>
              <em>{m.ascii_styles_soon()}</em>
            </div>
            <div className="ascii-style-link is-muted">
              <span>05 / Color</span>
              <strong>{m.ascii_styles_color_description()}</strong>
              <em>{m.ascii_styles_soon()}</em>
            </div>
          </div>
        </section>

        <section
          className="ascii-section ascii-faq"
          aria-labelledby="faq-title"
        >
          <div className="ascii-section-heading">
            <span className="ascii-index">03</span>
            <h2 id="faq-title">{m.ascii_faq_title()}</h2>
          </div>
          {faqs.map(([getQuestion, getAnswer]) => (
            <details key={getQuestion()}>
              <summary>
                {getQuestion()}
                <span>+</span>
              </summary>
              <p>{getAnswer()}</p>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
}
