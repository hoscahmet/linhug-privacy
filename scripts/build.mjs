#!/usr/bin/env node
// Generates every HTML page, sitemap.xml, robots.txt and the web manifest.
// Run: node scripts/build.mjs   (no dependencies)
// Edit copy in scripts/content.mjs, legal text in src/pages/*.html, styles in assets/site.css.
import { readFile, writeFile, mkdir, rm, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, APP_STORE, PLAY_STORE, SUPPORT_EMAIL, SOCIAL, SCREENSHOTS, HUNT_POINTS, LANGS, copy } from "./content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const sitemap = [];

const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absolute = (path) => SITE + encodeURI(path.normalize("NFC"));
const hashOf = async (file) => createHash("sha256").update(await readFile(join(ROOT, file))).digest("hex").slice(0, 10);
const assetVersion = { css: await hashOf("assets/site.css"), js: await hashOf("assets/site.js") };

async function emit(path, html, { sitemapEntry = true, alternates } = {}) {
  const file = path.endsWith(".html") ? path : join(path, "index.html");
  const target = join(ROOT, file.normalize("NFC"));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
  if (sitemapEntry) sitemap.push({ path, alternates });
}

// ---------- Shared chrome ----------

// Share images exist per language once scripts/make-og.sh has rendered them; otherwise fall back to English.
const ogLangs = new Set();
for (const lang of LANGS) await access(join(ROOT, `assets/media/og-${lang}.jpg`)).then(() => ogLangs.add(lang), () => {});
// Browser-language prefixes that differ from our codes (legacy "in" for Indonesian).
const LANG_ALIASES = { in: "id" };
const SKY_LAYOUT = [[5, 18, 24, -6, 42], [16, 25, 31, -19, -38], [29, 17, 26, -11, 30], [42, 21, 33, -25, -45], [55, 17, 28, -14, 50], [68, 26, 35, -8, -32], [80, 19, 25, -21, 38], [92, 22, 30, -3, -48]];

const icons = {
  moon: '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  sun: '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
};

const storeButtons = (t) => `<div class="store-buttons">
            <a class="store-button" href="${APP_STORE}" target="_blank" rel="noopener" aria-label="${esc(t.badges.appleAria)}"><img src="/app-store-badge.png" alt="${esc(t.badges.apple)}" width="168" height="56" /></a>
            <a class="store-button" href="${PLAY_STORE}" target="_blank" rel="noopener" aria-label="${esc(t.badges.googleAria)}"><img src="/google-play-badge.png" alt="${esc(t.badges.google)}" width="168" height="56" /></a>
          </div>`;

const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": data }).replace(/</g, "\\u003c")}</script>`;

const breadcrumbLd = (crumbs, currentPath) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map(([path, name], index) => ({ "@type": "ListItem", position: index + 1, name, item: absolute(path ?? currentPath) })),
});

const breadcrumbNav = (crumbs, label) => `<nav aria-label="${esc(label)}"><ol class="breadcrumbs">${crumbs
  .map(([path, name]) => (path ? `<li><a href="${esc(path)}">${esc(name)}</a></li>` : `<li aria-current="page">${esc(name)}</li>`))
  .join("")}</ol></nav>`;

function layout({ lang, path, title, description, body, alternates, ld = [], noindex = false, active }) {
  const t = copy[lang];
  const ogImage = `${SITE}/assets/media/og-${ogLangs.has(lang) ? lang : "en"}.jpg`;
  const hreflang = alternates
    ? Object.entries(alternates).map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${absolute(href)}" />`).join("\n    ") +
      `\n    <link rel="alternate" hreflang="x-default" href="${absolute(alternates.en ?? alternates.tr)}" />`
    : "";
  // English is the default (x-default) version. A visitor whose browser prefers another supported language
  // is sent to that page's twin, unless they already picked a language with the switcher.
  // The first browser language we support wins, so ["en-US", "tr"] stays on English. Crawlers report English.
  const redirects = lang === "en" && alternates
    ? Object.fromEntries(Object.entries(alternates).filter(([code]) => code !== "en").map(([code, href]) => [code, encodeURI(href)]))
    : {};
  const autoLang = Object.keys(redirects).length
    ? `try{if(!localStorage.getItem("linhug:lang")){var m=${JSON.stringify(redirects)},a=${JSON.stringify(LANG_ALIASES)},s=${JSON.stringify(LANGS)},l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];for(var i=0;i<l.length;i++){var c=String(l[i]).toLowerCase().split(/[-_]/)[0];c=a[c]||c;if(s.indexOf(c)>-1){if(m[c])location.replace(m[c]+location.hash);break}}}}catch(e){}`
    : "";
  const langMenu = LANGS.map((code) => {
    const href = alternates?.[code] ?? copy[code].paths.home;
    const current = code === lang ? ' aria-current="true"' : "";
    return `<li><a href="${esc(href)}" hreflang="${code}" lang="${code}" data-set-lang="${code}"${current}>${esc(copy[code].name)}</a></li>`;
  }).join("");
  const nav = t.nav.map(([href, label]) => `<a href="${esc(href)}"${active === href ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("\n          ");
  const sky = t.sky.map((word, i) => {
    const [left, size, duration, delay, drift] = SKY_LAYOUT[i];
    return `<span class="sky-word" style="--left: ${left}%; --size: ${size}px; --duration: ${duration}s; --delay: ${delay}s; --drift: ${drift}px">${word}</span>`;
  }).join("\n      ");

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${absolute(path)}" />`}
    ${hreflang}
    <meta name="theme-color" content="#090d2e" />
    <script>(function(){var d=document.documentElement,t;try{t=localStorage.getItem("linhug:theme")}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t;${autoLang}})();</script>
    <link rel="icon" type="image/png" sizes="48x48" href="/assets/media/favicon-48.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/media/icon-192.png" />
    <link rel="apple-touch-icon" href="/assets/media/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="stylesheet" href="/assets/site.css?v=${assetVersion.css}" />
    <meta name="apple-itunes-app" content="app-id=6788700503" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="LinHug" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${absolute(path)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${t.locale}" />
    ${LANGS.filter((code) => code !== lang).map((code) => `<meta property="og:locale:alternate" content="${copy[code].locale}" />`).join("\n    ")}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    ${ld.length ? jsonLd(ld) : ""}
  </head>
  <body>
    <a class="skip-link" href="#main">${esc(t.skip)}</a>
    <div class="game-backdrop" aria-hidden="true"></div>
    <div class="word-sky" aria-hidden="true">
      ${sky}
    </div>

    <header class="site-header">
      <div class="shell site-nav">
        <a class="brand" href="${t.paths.home}" aria-label="${esc(t.homeAria)}">
          <img src="/assets/media/icon-192.webp" alt="" width="42" height="42" />
          <span class="brand-name">Lin<span>Hug</span></span>
        </a>
        <nav class="nav-links" aria-label="${esc(t.navAria)}">
          ${nav}
          <a class="nav-cta" href="${t.paths.home}#download">${esc(t.download)}</a>
        </nav>
        <div class="nav-tools">
          <details class="lang-menu">
            <summary class="lang-switch" aria-label="${esc(t.langMenu)}" title="${esc(t.langMenu)}">${icons.globe}<span class="lang-label">${esc(t.name)}</span><span class="lang-short" aria-hidden="true">${lang.toUpperCase()}</span></summary>
            <ul class="lang-list">${langMenu}</ul>
          </details>
          <button class="icon-button theme-toggle" type="button" aria-label="${esc(t.themeLabel)}" title="${esc(t.themeLabel)}">${icons.moon}${icons.sun}</button>
        </div>
      </div>
    </header>

    <main id="main">
${body}
    </main>

    <footer class="site-footer">
      <div class="shell footer-inner">
        <div class="footer-main">
          <span>${esc(t.footer.rights)}</span>
          <div class="footer-actions">
            <div class="social-links" aria-label="${esc(t.footer.social)}">
              ${SOCIAL.map((s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${esc(t.footer.followOn(s.name))}" title="${s.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${s.path}"/></svg></a>`).join("\n              ")}
            </div>
            <nav class="footer-links" aria-label="${esc(t.footerAria)}">
              ${t.footer.links.map(([href, label]) => `<a href="${esc(href)}">${esc(label)}</a>`).join("\n              ")}
            </nav>
          </div>
        </div>
        <p class="legal-notice">${esc(t.footer.notice)}</p>
      </div>
    </footer>
    <script src="/assets/site.js?v=${assetVersion.js}" defer></script>
  </body>
</html>
`;
}

// ---------- Home ----------

function organizationLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "LinHug",
    url: `${SITE}/`,
    logo: `${SITE}/assets/media/icon-512.png`,
    email: SUPPORT_EMAIL,
    sameAs: SOCIAL.map((s) => s.url),
  };
}

function appLd(lang) {
  const t = copy[lang];
  return {
    "@type": "MobileApplication",
    "@id": `${SITE}/#app`,
    name: "LinHug",
    alternateName: t.app.alternateName,
    description: t.home.description,
    url: absolute(t.paths.home),
    image: `${SITE}/assets/media/icon-512.png`,
    screenshot: SCREENSHOTS.map(([file]) => `${SITE}/assets/media/screens/${file}`),
    applicationCategory: "GameApplication",
    applicationSubCategory: t.app.genre,
    genre: t.app.genre,
    operatingSystem: "iOS, Android",
    inLanguage: LANGS,
    installUrl: [APP_STORE, PLAY_STORE],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${SITE}/#organization` },
  };
}

const faqLd = (faq) => ({
  "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })),
});

function homePage(lang) {
  const t = copy[lang];
  const h = t.home;
  const isTr = lang === "tr";
  const anchors = t.anchors;

  const body = `      <div class="shell hero">
        <div>
          <p class="kicker">${esc(h.kicker)}</p>
          <h1>${esc(h.h1)}<span class="gradient">${esc(h.h1Accent)}</span></h1>
          <p class="hero-copy">${esc(h.intro)}</p>
          ${storeButtons(t)}
          <ul class="hero-meta">${h.meta.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
        </div>
        <div class="hero-visual">
          <div class="orbit" aria-hidden="true"></div>
          <div class="hero-reel">
            <video autoplay muted loop playsinline preload="metadata" poster="/assets/media/linhug-logo-reveal.webp" width="720" height="1280" aria-label="${esc(h.reelAria)}">
              <source src="/assets/media/linhug-logo-reveal.mp4" type="video/mp4" />
            </video>
            <span class="hero-reel-badge">${esc(h.reelBadge)}</span>
          </div>
        </div>
      </div>

      <section id="${anchors.modes}" aria-labelledby="modes-title">
        <div class="shell">
          <div class="section-heading">
            <h2 id="modes-title">${esc(h.modesTitle)}</h2>
            <p>${esc(h.modesLead)}</p>
          </div>
          <div class="feature-grid">
            ${h.modes.map((m) => `<article class="card feature-card">
              <div class="feature-icon" aria-hidden="true">${m.icon}</div>
              <h3>${esc(m.title)}</h3>
              <p>${esc(m.text)}</p>
              <span class="mode-tag">${esc(m.tag)}</span>
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>

      <section id="${anchors.how}" aria-labelledby="how-title">
        <div class="shell">
          <div class="section-heading">
            <h2 id="how-title">${esc(h.chainTitle)}</h2>
            <p>${esc(h.chainLead)}</p>
          </div>
          <ol class="chain-demo" aria-label="${esc(h.chain.map((w) => w.replace(/<[^>]+>/g, "")).join(" → "))}">
            ${h.chain.map((w, i) => `<li>${w}</li>${i < h.chain.length - 1 ? '<li class="arrow" aria-hidden="true">→</li>' : ""}`).join("\n            ")}
          </ol>
          <ol class="steps">
            ${h.steps.map(([title, text]) => `<li class="card"><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`).join("\n            ")}
          </ol>
          <p style="text-align:center;margin:32px 0 0"><a class="text-link" href="${t.paths.howTo}">${esc(h.howToLink)}</a></p>
        </div>
      </section>

      <section id="${anchors.features}" aria-labelledby="features-title">
        <div class="shell">
          <div class="section-heading">
            <h2 id="features-title">${esc(h.featuresTitle)}</h2>
            <p>${esc(h.featuresLead)}</p>
          </div>
          <div class="feature-grid">
            ${h.features.map((f) => `<article class="card feature-card">
              <div class="feature-icon" aria-hidden="true">${f.icon}</div>
              <h3>${esc(f.title)}</h3>
              <p>${esc(f.text)}</p>
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>

      <section id="${anchors.screens}" aria-labelledby="screens-title">
        <div class="section-heading shell">
          <h2 id="screens-title">${esc(h.screensTitle)}</h2>
          <p>${esc(h.screensLead)}</p>
        </div>
        <div class="screen-showcase">
          <div class="screen-carousel">
            <button class="screen-arrow screen-arrow-left" type="button" aria-label="${esc(h.prev)}">‹</button>
            <div class="screen-track" aria-label="${esc(h.screensAria)}" tabindex="0">
              ${SCREENSHOTS.map(([file, alt]) => `<figure class="screen-card"><img src="/assets/media/screens/${file}" alt="${esc(alt[lang])}" width="640" height="1392" loading="lazy" decoding="async" /></figure>`).join("\n              ")}
            </div>
            <button class="screen-arrow screen-arrow-right" type="button" aria-label="${esc(h.next)}">›</button>
          </div>
          <p class="swipe-note" aria-hidden="true">${esc(h.swipe)}</p>
        </div>
      </section>

      <section id="${anchors.videos}" aria-labelledby="videos-title">
        <div class="shell">
          <div class="section-heading">
            <h2 id="videos-title">${esc(h.videosTitle)}</h2>
            <p>${esc(h.videosLead)}</p>
          </div>
          <div class="video-grid">
            ${h.videos.map(([name, title, text]) => `<article class="card video-card">
              <video data-lazy muted loop playsinline controls preload="none" poster="/assets/media/${name}.webp" width="960" height="540" aria-label="${esc(title)}">
                <source src="/assets/media/${name}.mp4" type="video/mp4" />
              </video>
              <div class="video-copy">
                <h3>${esc(title)}</h3>
                <p>${esc(text)}</p>
              </div>
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>
${isTr ? `
      <section id="${anchors.words}" aria-labelledby="words-title">
        <div class="shell">
          <div class="card word-teaser">
            <div>
              <p class="eyebrow">Kelime listeleri</p>
              <h2 id="words-title">${esc(h.wordsTitle)}</h2>
              <p>${esc(h.wordsText)}</p>
              <a class="text-link" href="/tr/kelimeler/">${esc(h.wordsLink)}</a>
            </div>
            <ul class="letter-grid" aria-label="Harfle başlayan kelimeler">
              ${TR_ALPHABET.filter((l) => wordIndex.starts.has(l)).map((l) => `<li><a href="${startPath(l)}" title="${upper(l)} ile başlayan kelimeler">${upper(l)}</a></li>`).join("")}
            </ul>
          </div>
        </div>
      </section>
` : ""}
      <section id="${anchors.faq}" aria-labelledby="faq-title">
        <div class="shell">
          <div class="section-heading">
            <h2 id="faq-title">${esc(h.faqTitle)}</h2>
          </div>
          <div class="faq">
            ${h.faq.map(([q, a]) => `<details class="card"><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n            ")}
          </div>
        </div>
      </section>

      <section class="shell cta" id="download" aria-labelledby="cta-title">
        <img class="cta-icon" src="/assets/media/icon-192.webp" alt="${esc(h.ctaIcon)}" width="94" height="94" loading="lazy" />
        <h2 id="cta-title">${esc(h.ctaTitle)}</h2>
        <p>${esc(h.ctaText)}</p>
        ${storeButtons(t)}
      </section>`;

  const alternates = Object.fromEntries(LANGS.map((code) => [code, copy[code].paths.home]));
  const ld = [
    organizationLd(),
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "LinHug", inLanguage: LANGS, publisher: { "@id": `${SITE}/#organization` } },
    appLd(lang),
    faqLd(h.faq),
  ];
  return emit(t.paths.home, layout({ lang, path: t.paths.home, title: h.title, description: h.description, body, alternates, ld }), { alternates });
}

// ---------- How to play ----------

function howToPage(lang) {
  const t = copy[lang];
  const p = t.howTo;
  const table = `<table class="score-table"><thead><tr><th scope="row">${esc(p.huntTable[0])}</th>${HUNT_POINTS.map(([n]) => `<th scope="col">${n}</th>`).join("")}</tr></thead><tbody><tr><th scope="row">${esc(p.huntTable[1])}</th>${HUNT_POINTS.map(([, pts]) => `<td>${pts}</td>`).join("")}</tr></tbody></table>`;
  const body = `      <div class="shell page">
        ${breadcrumbNav(p.crumbs, t.crumbAria)}
        <header class="page-head">
          <h1>${esc(p.h1)}</h1>
          <p class="lead">${esc(p.lead)}</p>
        </header>
        <div class="word-layout">
          <article class="card prose">
            ${p.sections.map(([title, parts]) => `<h2>${esc(title)}</h2>\n            ${parts.map((part) => (part === "@@HUNT_TABLE@@" ? `<div style="overflow-x:auto">${table}</div>` : part)).join("\n            ")}`).join("\n            ")}
          </article>
          ${asideCta(lang)}
        </div>
      </div>`;
  const alternates = Object.fromEntries(LANGS.map((code) => [code, copy[code].paths.howTo]));
  const ld = [breadcrumbLd(p.crumbs, t.paths.howTo), { "@type": "Article", headline: p.h1, description: p.description, inLanguage: lang, author: { "@id": `${SITE}/#organization` }, publisher: { "@id": `${SITE}/#organization` }, dateModified: BUILD_DATE, mainEntityOfPage: absolute(t.paths.howTo) }, organizationLd()];
  return emit(t.paths.howTo, layout({ lang, path: t.paths.howTo, title: p.title, description: p.description, body, alternates, ld, active: t.paths.howTo }), { alternates });
}

function asideCta(lang, extra = "") {
  const t = copy[lang];
  return `<aside class="word-aside">
            ${extra}
            <div class="card mini-cta">
              <h2>${esc(t.aside.title)}</h2>
              <p>${esc(t.aside.text)}</p>
              ${storeButtons(t)}
            </div>
          </aside>`;
}

// ---------- Turkish word lists ----------

const TR_ALPHABET = [..."abcçdefgğhıijklmnoöprsştuüvyz"];
const FOLD = { "â": "a", "î": "i", "û": "u" };
const fold = (ch) => FOLD[ch] ?? ch;
const upper = (s) => s.toLocaleUpperCase("tr-TR");
const fmt = (n) => n.toLocaleString("tr-TR");
const collator = new Intl.Collator("tr");
const startPath = (l) => `/tr/kelimeler/${l}-ile-baslayan-kelimeler/`;
const endPath = (l) => `/tr/kelimeler/${l}-ile-biten-kelimeler/`;
const lengthPath = (n) => `/tr/kelimeler/${n}-harfli-kelimeler/`;
const LENGTHS = Array.from({ length: 14 }, (_, i) => i + 2); // 2..15
const LONG_FROM = 13; // starts/ends pages group 13+ letters together

const trWords = JSON.parse(await readFile(join(ROOT, "src/data/tr-words.json"), "utf8")).map((w) => w.normalize("NFC")).sort(collator.compare);
const trCommon = JSON.parse(await readFile(join(ROOT, "src/data/tr-common.json"), "utf8"));
const wordIndex = { starts: new Map(), ends: new Map(), lengths: new Map() };
for (const word of trWords) {
  const chars = [...word];
  const push = (map, key) => (map.get(key) ?? map.set(key, []).get(key)).push(word);
  push(wordIndex.starts, fold(chars[0]));
  push(wordIndex.ends, fold(chars.at(-1)));
  push(wordIndex.lengths, chars.length);
}
const wordLength = (w) => [...w].length;

function groupBy(words, keyOf) {
  const groups = new Map();
  for (const w of words) {
    const key = keyOf(w);
    (groups.get(key) ?? groups.set(key, []).get(key)).push(w);
  }
  return groups;
}

function wordGroupsHtml(groups, headingOf, idOf) {
  return [...groups].map(([key, words]) => `<section class="card word-group" id="${idOf(key)}" aria-labelledby="${idOf(key)}-h">
            <h2 id="${idOf(key)}-h">${esc(headingOf(key))} <small>(${fmt(words.length)})</small></h2>
            <ul class="words">${words.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
          </section>`).join("\n          ");
}

function letterGrid(paths, label, current) {
  return `<ul class="letter-grid" aria-label="${esc(label)}">${paths.map(([letter, href]) => `<li><a href="${href}"${href === current ? ' aria-current="page"' : ""}>${upper(letter)}</a></li>`).join("")}</ul>`;
}

const startLinks = () => TR_ALPHABET.filter((l) => wordIndex.starts.has(l)).map((l) => [l, startPath(l)]);
const endLinks = () => TR_ALPHABET.filter((l) => wordIndex.ends.has(l)).map((l) => [l, endPath(l)]);

function wordAside(current) {
  const extra = `<div class="card">
              <h2>Harfle başlayan kelimeler</h2>
              ${letterGrid(startLinks(), "Harfle başlayan kelimeler", current)}
            </div>
            <div class="card">
              <h2>Harfle biten kelimeler</h2>
              ${letterGrid(endLinks(), "Harfle biten kelimeler", current)}
            </div>
            <div class="card">
              <h2>Harf sayısına göre</h2>
              <ul class="letter-grid wide" aria-label="Harf sayısına göre kelimeler">${LENGTHS.map((n) => `<li><a href="${lengthPath(n)}"${lengthPath(n) === current ? ' aria-current="page"' : ""}>${n}</a></li>`).join("")}</ul>
            </div>`;
  return asideCta("tr", extra);
}

const SOURCE_NOTE = `<p class="source-note">Kelimeler LinHug’ın oyunda kullandığı Türkçe sözlükten alınmıştır. Kaynaklar: <a href="https://github.com/ahmetaa/zemberek-nlp" rel="noopener">Zemberek NLP</a> (Apache 2.0) ve <a href="https://tr.wiktionary.org/" rel="noopener">Vikisözlük</a> katkıcıları (CC BY-SA 4.0). Özel isimler, kısaltmalar ve çekimli biçimler listede yer almaz.</p>`;

function wordPage({ path, title, description, h1, lead, stats, toc, groupsHtml, crumbName, extraProse = "" }) {
  const crumbs = [["/tr/", "Ana sayfa"], ["/tr/kelimeler/", "Kelime listeleri"], [null, crumbName]];
  const body = `      <div class="shell page">
        ${breadcrumbNav(crumbs, "Sayfa yolu")}
        <header class="page-head">
          <h1>${esc(h1)}</h1>
          <p class="lead">${lead}</p>
          <ul class="stat-row">${stats.map(([value, label]) => `<li><strong>${value}</strong>${esc(label)}</li>`).join("")}</ul>
        </header>
        <div class="word-layout">
          <div>
            ${extraProse}
            <ul class="toc" aria-label="Bölümler">${toc.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join("")}</ul>
            ${groupsHtml}
            ${SOURCE_NOTE}
          </div>
          ${wordAside(path)}
        </div>
      </div>`;
  const ld = [breadcrumbLd(crumbs, path)];
  return emit(path, layout({ lang: "tr", path, title, description, body, ld, active: "/tr/kelimeler/" }));
}

const FAMILIAR = new Set(Object.values(trCommon).flat());
// Prefer everyday words (the bot vocabulary) as examples, then the shortest dictionary words.
const pickExamples = (words, n = 8) => {
  const familiar = words.filter((w) => FAMILIAR.has(w));
  const rest = words.filter((w) => !FAMILIAR.has(w)).sort((a, b) => wordLength(a) - wordLength(b) || collator.compare(a, b));
  return [...familiar, ...rest].slice(0, n);
};
const examples = (words, n = 8) => pickExamples(words, n).map((w) => `<em>${esc(w)}</em>`).join(", ");
const longest = (words) => words.reduce((best, w) => (wordLength(w) > wordLength(best) ? w : best), words[0]);
const lengthKey = (w) => Math.min(wordLength(w), LONG_FROM);
const lengthLabel = (n) => (n >= LONG_FROM ? `${n} ve daha uzun harfli kelimeler` : `${n} harfli kelimeler`);
const lengthGroups = (words) => new Map([...groupBy(words, lengthKey)].sort(([a], [b]) => a - b));

async function startPages() {
  for (const [letter, words] of wordIndex.starts) {
    const L = upper(letter);
    const groups = lengthGroups(words);
    const lead = `Türkçede <strong>${L}</strong> harfiyle başlayan <strong>${fmt(words.length)}</strong> kelime, harf sayısına göre listelendi. Sık kullanılanlardan bazıları: ${examples(words)}. Kelime zinciri, kelime türetmece ve diğer kelime oyunlarında takıldığında bu listeye göz at.`;
    await wordPage({
      path: startPath(letter),
      title: `${L} ile Başlayan Kelimeler (${fmt(words.length)} Kelime) | LinHug`,
      description: `${L} harfiyle başlayan ${fmt(words.length)} Türkçe kelime: 2, 3, 4, 5 harfli ve daha uzun kelimeler harf sayısına göre. Kelime zinciri ve kelime oyunları için liste.`,
      h1: `${L} ile başlayan kelimeler`,
      crumbName: `${L} ile başlayan`,
      lead,
      stats: [[fmt(words.length), "kelime"], [esc(longest(words)), "en uzun kelime"], [fmt(wordIndex.ends.get(letter)?.length ?? 0), `${L} ile biten kelime`]],
      toc: [...groups.keys()].map((n) => [`h${n}`, n >= LONG_FROM ? `${n}+ harf` : `${n} harf`]),
      groupsHtml: wordGroupsHtml(groups, (n) => `${L} ile başlayan ${lengthLabel(n)}`, (n) => `h${n}`),
    });
  }
}

async function endPages() {
  for (const [letter, words] of wordIndex.ends) {
    const L = upper(letter);
    const groups = lengthGroups(words);
    const gNote = letter === "ğ"
      ? `<div class="callout"><p><strong>Kelime zincirinde “ğ” kuralı:</strong> Türkçede “ğ” ile başlayan kelime yoktur. Bu yüzden LinHug’da “ğ” ile biten bir kelime yazıldığında sıradaki oyuncu <strong>istediği harfle</strong> başlayabilir.</p></div>`
      : `<div class="callout"><p><strong>Kelime zinciri ipucu:</strong> ${L} ile biten bir kelime yazdığında rakibin <a href="${wordIndex.starts.has(letter) ? startPath(letter) : "/tr/kelimeler/"}">${L} ile başlayan</a> bir kelime bulmak zorunda kalır. ${(wordIndex.starts.get(letter)?.length ?? 0) < 700 ? `${L} ile başlayan kelime sayısı az olduğu için bu harf rakibini zorlar.` : ""}</p></div>`;
    await wordPage({
      path: endPath(letter),
      title: `${L} ile Biten Kelimeler (${fmt(words.length)} Kelime) | LinHug`,
      description: `${L} harfiyle biten ${fmt(words.length)} Türkçe kelime, harf sayısına göre listelendi. Kelime zinciri ve kelime türetmece oyunlarında rakibini zorlayacak kelimeler.`,
      h1: `${L} ile biten kelimeler`,
      crumbName: `${L} ile biten`,
      lead: `Türkçede sonu <strong>${L}</strong> harfiyle biten <strong>${fmt(words.length)}</strong> kelime. Örnekler: ${examples(words)}. Kelime zinciri oyununda son harfi seçmek, rakibine vereceğin harfi seçmek demektir.`,
      stats: [[fmt(words.length), "kelime"], [esc(longest(words)), "en uzun kelime"], [fmt(wordIndex.starts.get(letter)?.length ?? 0), `${L} ile başlayan kelime`]],
      toc: [...groups.keys()].map((n) => [`h${n}`, n >= LONG_FROM ? `${n}+ harf` : `${n} harf`]),
      groupsHtml: wordGroupsHtml(groups, (n) => `${L} ile biten ${lengthLabel(n)}`, (n) => `h${n}`),
      extraProse: gNote,
    });
  }
}

async function lengthPages() {
  for (const n of LENGTHS) {
    const words = wordIndex.lengths.get(n) ?? [];
    if (!words.length) continue;
    const groups = new Map([...groupBy(words, (w) => fold([...w][0]))].sort(([a], [b]) => collator.compare(a, b)));
    const idOf = (l) => `harf-${l}`;
    await wordPage({
      path: lengthPath(n),
      title: `${n} Harfli Kelimeler (${fmt(words.length)} Türkçe Kelime) | LinHug`,
      description: `${fmt(words.length)} adet ${n} harfli Türkçe kelime, baş harfine göre A’dan Z’ye listelendi. Kelime oyunları, bulmaca ve kelime zinciri için ${n} harfli kelimeler.`,
      h1: `${n} harfli kelimeler`,
      crumbName: `${n} harfli`,
      lead: `Türkçede <strong>${n} harften</strong> oluşan <strong>${fmt(words.length)}</strong> kelime, baş harfine göre sıralandı. Örnekler: ${examples(words)}. LinHug’ın Harf Avı modunda ${n} harfli bir kelime ${HUNT_POINTS.find(([len]) => len === n)?.[1] ?? "en yüksek"} puan getirir.`,
      stats: [[fmt(words.length), "kelime"], [fmt(groups.size), "farklı baş harf"]],
      toc: [...groups.keys()].map((l) => [idOf(l), upper(l)]),
      groupsHtml: wordGroupsHtml(groups, (l) => `${upper(l)} ile başlayan ${n} harfli kelimeler`, idOf),
    });
  }
}

async function wordHub() {
  const path = "/tr/kelimeler/";
  const crumbs = [["/tr/", "Ana sayfa"], [null, "Kelime listeleri"]];
  const ordered = (map) => TR_ALPHABET.filter((l) => map.has(l));
  const hardEndings = ordered(wordIndex.ends).filter((l) => (wordIndex.starts.get(l)?.length ?? 0) < 700 && l !== "ğ");
  const body = `      <div class="shell page">
        ${breadcrumbNav(crumbs, "Sayfa yolu")}
        <header class="page-head">
          <h1>Türkçe kelime listeleri</h1>
          <p class="lead">Kelime zinciri, kelime türetmece, bulmaca ve diğer kelime oyunları için <strong>${fmt(trWords.length)}</strong> Türkçe kelime. Harfle başlayan ve biten kelimeleri ya da harf sayısına göre kelimeleri bul.</p>
        </header>
        <div class="word-layout">
          <div style="display:grid;gap:16px">
            <section class="card prose" aria-labelledby="starts">
              <h2 id="starts">Harfle başlayan kelimeler</h2>
              <p>Sıra sana geldi ama aklına kelime gelmiyor mu? Harfi seç, o harfle başlayan bütün kelimeleri gör.</p>
              ${letterGrid(startLinks(), "Harfle başlayan kelimeler")}
              <p style="margin-top:16px">Not: Türkçede <strong>“ğ” ile başlayan kelime yoktur</strong>.</p>
            </section>
            <section class="card prose" aria-labelledby="ends">
              <h2 id="ends">Harfle biten kelimeler</h2>
              <p>Kelime zincirinde rakibini zorlamak için kelimenin son harfi önemlidir. ${hardEndings.map((l) => `<a href="${endPath(l)}">${upper(l)}</a>`).join(", ")} gibi harflerle biten kelimeler rakibine az seçenek bırakır.</p>
              ${letterGrid(endLinks(), "Harfle biten kelimeler")}
            </section>
            <section class="card prose" aria-labelledby="lengths">
              <h2 id="lengths">Harf sayısına göre kelimeler</h2>
              <p>Wordle benzeri oyunlar, bulmacalar ya da LinHug’ın Harf Avı modu için belirli uzunluktaki kelimeler.</p>
              <ul class="letter-grid wide" aria-label="Harf sayısına göre kelimeler">${LENGTHS.map((n) => `<li><a href="${lengthPath(n)}" title="${n} harfli kelimeler">${n}</a></li>`).join("")}</ul>
            </section>
            <section class="card prose" aria-labelledby="about">
              <h2 id="about">Bu listeler nasıl hazırlandı?</h2>
              <p>Listeler, LinHug’ın kelime zinciri oyununda geçerli saydığı Türkçe sözlükten otomatik üretilir. Sözlükte kelimelerin yalın halleri bulunur; özel isimler, kısaltmalar ve çekimli biçimler (ör. “evler”, “okulda”) yer almaz. Oyunda kabul edilen bir kelime bu listelerde de vardır.</p>
              <p>Kuralları merak ediyorsan <a href="/tr/nasil-oynanir/">kelime zinciri nasıl oynanır</a> sayfasına göz at.</p>
              ${SOURCE_NOTE}
            </section>
          </div>
          ${asideCta("tr")}
        </div>
      </div>`;
  await emit(path, layout({ lang: "tr", path, title: "Türkçe Kelime Listeleri: Harfle Başlayan ve Biten Kelimeler | LinHug", description: `${fmt(trWords.length)} Türkçe kelime: harfle başlayan kelimeler, harfle biten kelimeler ve 2-15 harfli kelimeler. Kelime zinciri ve kelime oyunları için.`, body, ld: [breadcrumbLd(crumbs, path)], active: path }));
}

// ---------- Legal, 404 ----------

async function legalPage(file, title, description, crumbName) {
  const content = await readFile(join(ROOT, "src/pages", file), "utf8");
  const path = `/${file}`;
  const crumbs = [["/", "Home"], [null, crumbName]];
  const body = `      <div class="shell page">
        <div class="legal">
          ${breadcrumbNav(crumbs, "Breadcrumb")}
          <article class="card prose">
${content.split("\n").map((line) => (line ? `            ${line}` : "")).join("\n")}
          </article>
        </div>
      </div>`;
  await emit(path, layout({ lang: "en", path, title, description, body, ld: [breadcrumbLd(crumbs, path)] }));
}

async function notFound() {
  const t = copy.en.notFound;
  const others = LANGS.filter((code) => code !== "en");
  const body = `      <div class="shell page" style="text-align:center;min-height:60vh;display:grid;place-content:center">
        <h1 style="margin:0 auto">${esc(t.h1)}</h1>
        <p class="lead">${esc(t.text)}</p>
        <p style="margin-top:28px"><a class="nav-cta" style="text-decoration:none;font-weight:800" href="/">${esc(t.button)}</a></p>
        <p style="margin-top:20px;display:flex;flex-wrap:wrap;gap:10px 18px;justify-content:center">${others.map((code) => `<a class="text-link" href="${copy[code].paths.home}" lang="${code}">${esc(copy[code].notFound.button)}</a>`).join("")}</p>
      </div>`;
  await emit("/404.html", layout({ lang: "en", path: "/404.html", title: t.title, description: t.text, body, noindex: true }), { sitemapEntry: false });
}

// ---------- Run ----------

await rm(join(ROOT, "tr/kelimeler"), { recursive: true, force: true });
for (const lang of LANGS) {
  await homePage(lang);
  await howToPage(lang);
}
await wordHub();
await startPages();
await endPages();
await lengthPages();
await legalPage("privacy.html", "Privacy Policy | LinHug", "Privacy Policy for LinHug, a multiplayer word chain game: what data the app uses, how it is stored and how to request deletion.", "Privacy Policy");
await legalPage("terms.html", "Terms of Use | LinHug", "Terms of Use and intellectual property notice for LinHug, a multiplayer word chain game.", "Terms of Use");
await notFound();

const urlEntry = ({ path, alternates }) => `  <url>
    <loc>${absolute(path)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>${alternates ? Object.entries(alternates).map(([code, href]) => `\n    <xhtml:link rel="alternate" hreflang="${code}" href="${absolute(href)}" />`).join("") + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(alternates.en)}" />` : ""}
  </url>`;
await writeFile(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.map(urlEntry).join("\n")}
</urlset>
`);
await writeFile(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await writeFile(join(ROOT, "manifest.webmanifest"), JSON.stringify({
  name: "LinHug — Word Chain Game",
  short_name: "LinHug",
  start_url: "/",
  display: "browser",
  background_color: "#090d2e",
  theme_color: "#090d2e",
  icons: [
    { src: "/assets/media/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/media/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  related_applications: [
    { platform: "play", url: PLAY_STORE, id: "com.linhug.game" },
    { platform: "itunes", url: APP_STORE },
  ],
}, null, 2) + "\n");

console.log(`Built ${sitemap.length} indexable pages + 404 (${trWords.length} Turkish words).`);
