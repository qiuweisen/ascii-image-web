import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { IconClipboard, IconSearch } from '@tabler/icons-react';
import { m } from '@/locale/paraglide/messages';
import { seo } from '@/lib/seo';

type Category = 'animals' | 'faces' | 'love' | 'objects' | 'dividers';
const pieces: [Category, string][] = [
  ['animals', '=^..^='],
  ['animals', 'U・ᴥ・U'],
  ['animals', '<°)))><'],
  ['animals', '(_/ )'],
  ['faces', '(•_•)'],
  ['faces', '¯\\_(ツ)_/¯'],
  ['faces', '(¬_¬)'],
  ['faces', '(^_^)/'],
  ['love', '<3'],
  ['love', '(づ￣ ³￣)づ'],
  ['love', '♡(˘▽˘>ԅ( ˘⌣˘)'],
  ['love', '(っ´▽`)っ♥'],
  ['objects', '[||||]'],
  ['objects', '|==[:::::::::::::>'],
  ['objects', 'c[_]'],
  ['objects', '--{ @'],
  ['dividers', '───── ⋆⋅☆⋅⋆ ─────'],
  ['dividers', '════ ⋆★⋆ ════'],
  ['dividers', '· · ───── ·𖥸· ───── · ·'],
  ['dividers', '━━━━⊱⋆⊰━━━━'],
];
const categoryLabels: Record<Category, () => string> = {
  animals: m.ascii_category_animals,
  faces: m.ascii_category_faces,
  love: m.ascii_category_love,
  objects: m.ascii_category_objects,
  dividers: m.ascii_category_dividers,
};
export const Route = createFileRoute('/line-art')({
  head: () =>
    seo('/line-art', {
      title: m.ascii_line_art_meta_title(),
      description: m.ascii_line_art_meta_description(),
    }),
  component: LineArtPage,
});
function LineArtPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [copied, setCopied] = useState('');
  const categories: (Category | 'all')[] = [
    'all',
    ...new Set(pieces.map(([c]) => c)),
  ];
  const filtered = useMemo(
    () =>
      pieces.filter(
        ([c, art]) =>
          (category === 'all' || c === category) &&
          (!query ||
            `${categoryLabels[c]()} ${art}`
              .toLowerCase()
              .includes(query.toLowerCase()))
      ),
    [query, category]
  );
  return (
    <div className="ascii-site">
      <main className="ascii-container ascii-line-page">
        <div className="ascii-kicker">
          <span className="ascii-pulse" /> {m.ascii_line_art_kicker()}
        </div>
        <h1>
          {m.ascii_line_art_title_prefix()} <span>ASCII art</span>
        </h1>
        <p className="ascii-lede">{m.ascii_line_art_description()}</p>
        <div className="ascii-library-tools">
          <label className="ascii-search">
            <IconSearch />
            <input
              id="ascii-art-search"
              name="ascii-art-search"
              aria-label={m.ascii_line_art_search()}
              placeholder={m.ascii_line_art_search_placeholder()}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="ascii-category-tabs">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
              >
                {item === 'all'
                  ? m.ascii_category_all()
                  : categoryLabels[item]()}
              </button>
            ))}
          </div>
        </div>
        <div className="ascii-piece-grid">
          {filtered.map(([cat, art], index) => (
            <article className="ascii-piece" key={`${cat}-${index}`}>
              <div className="ascii-piece-meta">
                <span>{categoryLabels[cat]().toUpperCase()}</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (!navigator.clipboard)
                        throw new Error('Clipboard unavailable');
                      await navigator.clipboard.writeText(art);
                      setCopied(`${cat}-${index}`);
                    } catch {
                      setCopied('');
                    }
                  }}
                  aria-label={`${m.ascii_line_art_copy()} ${categoryLabels[cat]()} ASCII art`}
                >
                  <IconClipboard />
                  {copied === `${cat}-${index}`
                    ? m.ascii_line_art_copied()
                    : m.ascii_line_art_copy()}
                </button>
              </div>
              <pre>{art}</pre>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
