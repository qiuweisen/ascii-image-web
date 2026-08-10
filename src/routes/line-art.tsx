import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { IconClipboard, IconSearch } from '@tabler/icons-react';

const pieces = [
  ['Animals', '=^..^='],
  ['Animals', 'U・ᴥ・U'],
  ['Animals', '<°)))><'],
  ['Animals', '(_/ )'],
  ['Faces', '(•_•)'],
  ['Faces', '¯\\_(ツ)_/¯'],
  ['Faces', '(¬_¬)'],
  ['Faces', '(^_^)/'],
  ['Love', '<3'],
  ['Love', '(づ￣ ³￣)づ'],
  ['Love', '♡(˘▽˘>ԅ( ˘⌣˘)'],
  ['Love', '(っ´▽`)っ♥'],
  ['Objects', '[||||]'],
  ['Objects', '|==[:::::::::::::>'],
  ['Objects', 'c[_]'],
  ['Objects', '--{ @'],
  ['Dividers', '───── ⋆⋅☆⋅⋆ ─────'],
  ['Dividers', '════ ⋆★⋆ ════'],
  ['Dividers', '· · ───── ·𖥸· ───── · ·'],
  ['Dividers', '━━━━⊱⋆⊰━━━━'],
];
export const Route = createFileRoute('/line-art')({
  head: () => ({
    meta: [
      { title: 'One Line ASCII Art - Copyable ASCII Art' },
      {
        name: 'description',
        content:
          'Browse and copy one-line ASCII art for chats, bios, terminals, and messages.',
      },
    ],
  }),
  component: LineArtPage,
});
function LineArtPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [copied, setCopied] = useState('');
  const categories = ['All', ...new Set(pieces.map(([c]) => c))];
  const filtered = useMemo(
    () =>
      pieces.filter(
        ([c, art]) =>
          (category === 'All' || c === category) &&
          (!query || `${c} ${art}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, category]
  );
  return (
    <div className="ascii-site">
      <main className="ascii-container ascii-line-page">
        <div className="ascii-kicker">
          <span className="ascii-pulse" /> LIBRARY / COPYABLE TEXT
        </div>
        <h1>
          One-line <span>ASCII art</span>
        </h1>
        <p className="ascii-lede">
          Small pieces for bios, chats, terminal prompts, and anywhere a full
          image is too much.
        </p>
        <div className="ascii-library-tools">
          <label className="ascii-search">
            <IconSearch />
            <input
              aria-label="Search ASCII art"
              placeholder="Search animals, faces, love..."
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
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="ascii-piece-grid">
          {filtered.map(([cat, art], index) => (
            <article className="ascii-piece" key={`${cat}-${index}`}>
              <div className="ascii-piece-meta">
                <span>{cat.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard?.writeText(art);
                    setCopied(`${cat}-${index}`);
                  }}
                  aria-label={`Copy ${cat} ASCII art`}
                >
                  <IconClipboard />
                  {copied === `${cat}-${index}` ? 'COPIED' : 'COPY'}
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
