# linhug.com

Static site for LinHug, served by GitHub Pages from `main`.

The HTML pages are **generated**. Do not edit `index.html`, `tr/`, `how-to-play/`, `privacy.html`, `terms.html`, `404.html`, `sitemap.xml` or `robots.txt` by hand. Edit the sources and rebuild:

| What | Where |
| --- | --- |
| Page copy (EN + TR), FAQ, game rules | `scripts/content.mjs` |
| Page templates, word-list pages, sitemap | `scripts/build.mjs` |
| Privacy / Terms text | `src/pages/privacy.html`, `src/pages/terms.html` |
| Styles (dark + light theme) | `assets/site.css` |
| Theme toggle, carousel, lazy videos | `assets/site.js` |
| Turkish dictionary snapshot | `src/data/tr-words.json` (from `linhug-mobile/dictionaries/words/tr.json`) |

```sh
node scripts/build.mjs        # regenerate every page, sitemap.xml, robots.txt, manifest
./scripts/make-og.sh          # re-render the share images (needs Google Chrome)
python3 -m http.server 8765   # preview at http://127.0.0.1:8765
```

To refresh the word lists after the game dictionary changes, copy the new `tr.json` over `src/data/tr-words.json` and rebuild.

`_config.yml` keeps `src/` and `scripts/` out of the published site.
