# linhug.com

Static site for LinHug, served by GitHub Pages from `main`.

The HTML pages are **generated**. Do not edit `index.html`, `how-to-play/`, `tr/`, `es/`, `pt/`, `id/`, `hi/`, `privacy.html`, `terms.html`, `404.html`, `sitemap.xml` or `robots.txt` by hand. Edit the sources and rebuild:

| What | Where |
| --- | --- |
| Page copy (EN, TR, ES, PT, ID, HI), FAQ, game rules | `scripts/content.mjs` |
| Page templates, word-list pages, sitemap | `scripts/build.mjs` |
| Privacy / Terms text | `src/pages/privacy.html`, `src/pages/terms.html` |
| Styles (dark night sky + light forest theme) | `assets/site.css` |
| Theme toggle, per-theme hero video, forest scene switching, carousel, lazy videos | `assets/site.js` |
| Turkish dictionary snapshot | `src/data/tr-words.json` (from `linhug-mobile/dictionaries/words/tr.json`) |

```sh
node scripts/build.mjs        # regenerate every page, sitemap.xml, robots.txt, manifest
./scripts/make-og.sh          # re-render the share images (needs Google Chrome)
python3 -m http.server 8765   # preview at http://127.0.0.1:8765
```

The light theme uses the forest intro from the app: `assets/media/linhug-walk.mp4` (hero video, re-encoded from `linhug-mobile/assets/videos/daily-intro-walk.mp4`) and `forest-scene-1..3.webp`, which cross-fade behind the page as sections tagged `data-scene` scroll into view.

Languages follow the app's UI languages (`LANGS` in `scripts/content.mjs`). English is the default; on English pages a visitor whose browser prefers another supported language is redirected once, unless they picked one in the language menu. Privacy and Terms stay English-only, and the word lists are Turkish-only.

To refresh the word lists after the game dictionary changes, copy the new `tr.json` over `src/data/tr-words.json` and rebuild.

`_config.yml` keeps `src/` and `scripts/` out of the published site.
