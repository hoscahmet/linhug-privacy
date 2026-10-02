// All user-facing copy for the generated pages, per language.
// Game facts mirror linhug-mobile (shared/gameRules.ts, src/localization/*). Keep them in sync.

export const SITE = "https://linhug.com";
export const APP_STORE = "https://apps.apple.com/app/id6788700503";
export const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.linhug.game";
export const SUPPORT_EMAIL = "accounts@linhug.com";
export const SOCIAL = [
  { name: "TikTok", url: "https://www.tiktok.com/@linhug.game", path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-3.77h-3.1v12.66a2.89 2.89 0 1 1-2-2.75V9.68a6 6 0 1 0 5.11 5.94v-6.4a7.9 7.9 0 0 0 4.65 1.5V7.65a4.85 4.85 0 0 1-.89-.96Z" },
  { name: "Instagram", url: "https://www.instagram.com/linhuggame", path: "M7.25 2h9.5A5.26 5.26 0 0 1 22 7.25v9.5A5.26 5.26 0 0 1 16.75 22h-9.5A5.26 5.26 0 0 1 2 16.75v-9.5A5.26 5.26 0 0 1 7.25 2Zm-.17 2A3.08 3.08 0 0 0 4 7.08v9.84A3.08 3.08 0 0 0 7.08 20h9.84A3.08 3.08 0 0 0 20 16.92V7.08A3.08 3.08 0 0 0 16.92 4H7.08ZM17.9 5.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 6.75A5.25 5.25 0 1 1 6.75 12 5.26 5.26 0 0 1 12 6.75Zm0 2A3.25 3.25 0 1 0 15.25 12 3.25 3.25 0 0 0 12 8.75Z" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/linhug", path: "M6.5 8.3H3.2V20h3.3V8.3ZM4.85 3A1.93 1.93 0 1 0 4.9 6.86 1.93 1.93 0 0 0 4.85 3ZM20.8 13.3c0-3.53-1.88-5.17-4.39-5.17a3.8 3.8 0 0 0-3.44 1.89V8.3H9.66V20H13v-5.8c0-1.53.29-3 2.18-3 1.86 0 1.88 1.74 1.88 3.1V20h3.31l.43-6.7Z" },
  { name: "Facebook", url: "https://www.facebook.com/people/Linhuggame/61592726338132/", path: "M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.25-1.5 1.55-1.5H16.9V3.62A22.2 22.2 0 0 0 14.5 3.5c-2.38 0-4 1.45-4 4.12V9.9H7.8V13h2.7v8h3.2Z" },
];

export const SCREENSHOTS = [
  ["store-01-your-word-adventure.webp", { en: "LinHug home screen — Your Word Adventure Starts Here", tr: "LinHug ana ekranı — kelime macerası burada başlıyor" }],
  ["store-02-find-your-room.webp", { en: "LinHug rooms screen — Find Friends and Join a Room", tr: "LinHug odalar ekranı — arkadaşlarını bul ve odaya katıl" }],
  ["store-03-make-the-rules.webp", { en: "LinHug create room screen — Make the Rules", tr: "LinHug oda oluşturma ekranı — kuralları sen belirle" }],
  ["store-04-easy-to-learn.webp", { en: "LinHug how to play screen — Easy to Learn", tr: "LinHug nasıl oynanır ekranı — öğrenmesi kolay" }],
  ["store-05-keep-words-moving.webp", { en: "LinHug gameplay screen — Keep Words Moving", tr: "LinHug oyun ekranı — kelimeler akmaya devam etsin" }],
  ["store-06-fair-turns-fast-fun.webp", { en: "LinHug turn order screen — Fair Turns, Fast Fun", tr: "LinHug sıra ekranı — adil sıralar, hızlı eğlence" }],
  ["store-07-climb-the-scoreboard.webp", { en: "LinHug scoreboard screen — Climb the Scoreboard", tr: "LinHug skor tablosu — zirveye tırman" }],
];

export const HUNT_POINTS = [[2, 1], [3, 1], [4, 2], [5, 4], [6, 7], [7, 11], [8, 16], [9, 22], [10, 29]];

const LEGAL_NOTICE_EN = "The LinHug name, logo, characters, graphics and audio, interface designs, text, and software are protected under applicable intellectual property laws. These materials may not be copied, adapted, distributed, extracted, or used commercially without prior written permission.";

export const copy = {
  en: {
    locale: "en_US",
    paths: { home: "/", howTo: "/how-to-play/" },
    skip: "Skip to content",
    nav: [
      ["/#modes", "Game modes"],
      ["/how-to-play/", "How to play"],
      ["/#faq", "FAQ"],
    ],
    download: "Download",
    themeLabel: "Switch between light and dark theme",
    langSwitch: { label: "Türkçe", short: "TR", aria: "Bu sayfayı Türkçe görüntüle" },
    homeAria: "LinHug home",
    footer: {
      rights: "© 2026 LinHug. All rights reserved.",
      social: "Follow LinHug on social media",
      followOn: (name) => `Follow LinHug on ${name}`,
      links: [["/how-to-play/", "How to play"], ["/privacy.html", "Privacy Policy"], ["/terms.html", "Terms of Use"], [`mailto:${SUPPORT_EMAIL}`, "Support"]],
      notice: LEGAL_NOTICE_EN,
    },
    badges: { apple: "Download on the App Store", google: "Get it on Google Play", appleAria: "Download LinHug on the App Store", googleAria: "Get LinHug on Google Play" },
    home: {
      title: "Word Chain Game with Friends — LinHug for iPhone & Android",
      description: "LinHug is a free multiplayer word chain game. Create a room, invite friends and follow the last letter in English or Turkish. Download for iOS and Android.",
      kicker: "Live multiplayer word battles",
      h1: "Word chain game.",
      h1Accent: "Keep the chain alive.",
      intro: "LinHug is a free multiplayer word game for iPhone and Android. Create a room, invite your friends and turn the last letter of every word into your next move. Play Classic Chain, Word Battle or Letter Hunt with English or Turkish words.",
      meta: ["Free to play", "iOS & Android", "English & Turkish words"],
      reelAria: "LinHug mascot completing the logo",
      reelBadge: "Meet LinHug",
      modesTitle: "Three ways to play.",
      modesLead: "Every room picks a mode, a word language and a timer. Start calm, end in a photo finish.",
      modes: [
        { icon: "∞", title: "Classic Chain", text: "The original word chain. Each word must start with the last letter of the previous one. Run out of time and you are out; the last player standing earns a +20 survival bonus.", tag: "Turn based" },
        { icon: "⚡", title: "Word Battle", text: "Everyone answers the same letter challenge in the same round. Send one valid, unique word before the timer ends; longer words score more.", tag: "Everyone plays" },
        { icon: "★", title: "Letter Hunt", text: "Everyone gets the same 8, then 9, then 10 letter tiles. Find as many words as you can in three 45-second rounds. Long words are worth big points.", tag: "3 rounds · 45 seconds" },
      ],
      chainTitle: "How a word chain works.",
      chainLead: "One rule keeps the game moving: your word starts where the last one ended.",
      chain: ["appl<b>e</b>", "elephan<b>t</b>", "tige<b>r</b>", "rocke<b>t</b>", "train"],
      steps: [
        ["Create or join a room", "Open a public room, or make a private one and share the invite code with friends."],
        ["Follow the last letter", "Your word must start with the final letter of the previous word, and it must be in the dictionary."],
        ["Beat the timer", "Think fast. Repeated words are rejected and the clock keeps ticking."],
        ["Climb the scoreboard", "Every letter counts. Win rounds, collect points and rise up the leaderboard."],
      ],
      howToLink: "Read the full rules →",
      featuresTitle: "A word game built for friends.",
      featuresLead: "Simple to start, hard to put down. Every room creates a new chain and every second matters.",
      features: [
        { icon: "⌂", title: "Private rooms", text: "Create a private room and share a code. Your friends join from Rooms → Join room with code." },
        { icon: "☺", title: "Your avatar, your style", text: "Pick an avatar and a room background, then bring your personality into every match." },
        { icon: "◎", title: "Play as a guest", text: "No sign-up needed. Optionally sign in with Apple or Google to keep your progress on a new device." },
      ],
      screensTitle: "Your word adventure, at a glance.",
      screensLead: "Find a room, make the rules, learn the chain, and race your friends to the top of the scoreboard.",
      screensAria: "LinHug app screenshots",
      prev: "Show previous app screenshot",
      next: "Show next app screenshot",
      swipe: "Swipe or use the arrows to explore",
      videosTitle: "See LinHug in motion.",
      videosLead: "Quick rounds, surprising words, and the playful energy of keeping the chain alive.",
      videos: [
        ["linhug-gameplay", "Play together", "Invite your friends and turn every round into a fast multiplayer challenge."],
        ["linhug-word-chain", "Keep the words flowing", "Think quickly, follow the last letter, and keep the chain moving before time runs out."],
        ["linhug-avatar", "Meet your avatar", "Choose your style and bring your own personality into every LinHug room."],
        ["linhug-rocket", "Launch into the game", "Jump into a room, start the challenge, and keep your word streak moving."],
      ],
      faqTitle: "Frequently asked questions",
      faq: [
        ["What is LinHug?", "LinHug is a free multiplayer word chain game for iPhone, iPad and Android. You play live against friends or other players in rooms, taking turns to keep a chain of words going."],
        ["How do you play a word chain game?", "Each player says a word that starts with the last letter of the previous word. For example: apple → elephant → tiger. Words cannot be repeated, they must be real dictionary words, and you have to answer before the timer runs out. See the <a href=\"/how-to-play/\">full rules</a>."],
        ["Is LinHug free?", "Yes. LinHug is free to download and play on the App Store and Google Play."],
        ["Can I play privately with friends?", "Yes. Create a private room and share its invite code. Friends open Rooms → Join room with code and enter it to join you."],
        ["Which languages can I play in?", "Each room chooses its word language: English or Turkish. The app interface is available in English, Turkish, Spanish, Portuguese, Indonesian and Hindi."],
        ["Do I need an account?", "No. You can play as a guest right away. If you want to keep your progress on another device, you can optionally sign in with Apple or Google."],
        ["What is Letter Hunt?", "Letter Hunt is an anagram-style mode. Everyone gets the same letter tiles (8, then 9, then 10) and has 45 seconds per round to find as many words as possible. Longer words earn far more points."],
      ],
      ctaTitle: "Your next word starts here.",
      ctaText: "Bring your friends together and see how long you can keep the chain alive.",
      ctaIcon: "LinHug app icon",
    },
    howTo: {
      title: "How to Play Word Chain — LinHug Rules & Game Modes",
      description: "Learn the word chain rules: start with the last letter, beat the timer and never repeat a word. Plus Word Battle and Letter Hunt scoring in LinHug.",
      crumbs: [["/", "Home"], [null, "How to play"]],
      h1: "How to play word chain",
      lead: "Word chain (also called the last letter game or word snake) is a classic word game: every new word has to begin with the last letter of the word before it. LinHug turns it into a live multiplayer game with a timer, three modes and a dictionary that checks every word.",
      sections: [
        ["The basic rule", [
          "<p>The first player gets a starting letter. Every following word must start with the <strong>last letter of the previous word</strong>:</p>",
          "<p class=\"callout\"><strong>apple → elephant → tiger → rocket → train</strong></p>",
          "<ul><li>Words must be in the room’s dictionary (English or Turkish).</li><li>A word can only be used once per game.</li><li>You must answer before the round timer ends.</li><li>Proper names and abbreviations do not count.</li></ul>",
        ]],
        ["Classic Chain", [
          "<p>Players take turns in order. Each valid word scores <strong>one point per letter</strong>, so longer words help you pull ahead. If your timer runs out, you are out of the round. The last player standing receives a <strong>+20 survival bonus</strong>, and the highest total score wins.</p>",
          "<p>Tip: words that end with rare letters (like <em>x</em>) put pressure on the next player. When a word ends in <em>x</em>, the next player may start with any letter.</p>",
        ]],
        ["Word Battle", [
          "<p>Everyone plays at the same time. Each round shows one letter challenge, and every player sends <strong>one valid, unique word</strong> that starts with that letter before the timer ends. Points are based on word length, so a long, rare word beats a quick short one.</p>",
        ]],
        ["Letter Hunt", [
          "<p>All players receive the same letter tiles: <strong>8 in round one, 9 in round two and 10 in round three</strong>. Tap tiles to build words (each tile once per word) and send as many different words as you can in <strong>45 seconds</strong>. Opponents’ words stay hidden until the round ends.</p>",
          "@@HUNT_TABLE@@",
          "<p>The highest total after three rounds wins. Ties share the win.</p>",
        ]],
        ["Rooms, friends and bots", [
          "<p>Join a public room from the Rooms screen, or create your own and choose the mode, word language, room size, round time and visibility. Private rooms get an invite code you can share. LinHug also keeps open Letter Hunt lobbies with friendly bots, so there is always a game to jump into.</p>",
        ]],
        ["Tips to win", [
          "<ul><li>Learn words that end with tricky letters to trap the next player.</li><li>Save a few long words for each letter: they are worth more points.</li><li>In Letter Hunt, look for common endings first, then rearrange them into longer words.</li><li>Do not panic: a short valid word is better than running out of time.</li></ul>",
        ]],
      ],
      huntTable: ["Word length", "Points"],
    },
    notFound: { title: "Page not found — LinHug", h1: "This chain is broken.", text: "We couldn’t find that page. Head back home and start a new word.", button: "Back to LinHug" },
  },

  tr: {
    locale: "tr_TR",
    paths: { home: "/tr/", howTo: "/tr/nasil-oynanir/" },
    skip: "İçeriğe geç",
    nav: [
      ["/tr/#modlar", "Oyun modları"],
      ["/tr/nasil-oynanir/", "Nasıl oynanır"],
      ["/tr/kelimeler/", "Kelime listeleri"],
    ],
    download: "İndir",
    themeLabel: "Açık ve koyu tema arasında geçiş yap",
    langSwitch: { label: "English", short: "EN", aria: "View this page in English" },
    homeAria: "LinHug ana sayfa",
    footer: {
      rights: "© 2026 LinHug. Tüm hakları saklıdır.",
      social: "LinHug’ı sosyal medyada takip et",
      followOn: (name) => `LinHug’ı ${name}’da takip et`,
      links: [["/tr/nasil-oynanir/", "Nasıl oynanır"], ["/tr/kelimeler/", "Kelime listeleri"], ["/privacy.html", "Gizlilik Politikası"], ["/terms.html", "Kullanım Koşulları"], [`mailto:${SUPPORT_EMAIL}`, "Destek"]],
      notice: "LinHug adı, logosu, karakterleri, grafik ve sesleri, arayüz tasarımları, metinleri ve yazılımı ilgili fikri mülkiyet yasalarıyla korunmaktadır. Bu materyaller önceden yazılı izin alınmadan kopyalanamaz, uyarlanamaz, dağıtılamaz, çıkarılamaz veya ticari amaçla kullanılamaz.",
    },
    badges: { apple: "App Store’dan indir", google: "Google Play’den alın", appleAria: "LinHug’ı App Store’dan indir", googleAria: "LinHug’ı Google Play’den indir" },
    home: {
      title: "Kelime Zinciri Oyunu — Arkadaşlarınla Online Kelime Oyunu | LinHug",
      description: "LinHug ücretsiz, çok oyunculu bir kelime oyunu. Oda kur, arkadaşlarını davet et, son harften kelime türet. iPhone ve Android’de Türkçe kelimelerle oyna.",
      kicker: "Canlı, çok oyunculu kelime düelloları",
      h1: "Kelime zinciri oyunu.",
      h1Accent: "Zinciri koparma!",
      intro: "LinHug, iPhone ve Android için ücretsiz, çok oyunculu bir kelime oyunu. Bir oda kur, arkadaşlarını davet et ve her kelimenin son harfinden yeni bir kelime türet. Klasik Zincir, Kelime Düellosu ve Harf Avı modlarını Türkçe ya da İngilizce kelimelerle oyna.",
      meta: ["Ücretsiz", "iOS ve Android", "Türkçe ve İngilizce kelimeler"],
      reelAria: "LinHug maskotu logoyu tamamlıyor",
      reelBadge: "LinHug ile tanış",
      modesTitle: "Üç farklı oyun modu.",
      modesLead: "Her oda bir mod, bir kelime dili ve bir süre seçer. Sakin başlar, nefes kesen bir finalle biter.",
      modes: [
        { icon: "∞", title: "Klasik Zincir", text: "Bildiğin kelime türetmece. Her kelime, bir önceki kelimenin son harfiyle başlamalı. Süren biterse elenirsin; ayakta kalan son oyuncu +20 hayatta kalma bonusu kazanır.", tag: "Sıralı tur" },
        { icon: "⚡", title: "Kelime Düellosu", text: "Herkes aynı turda aynı harf meydan okumasına cevap verir. Süre bitmeden geçerli ve benzersiz bir kelime gönder; uzun kelimeler daha çok puan getirir.", tag: "Herkes oynar" },
        { icon: "★", title: "Harf Avı", text: "Herkese aynı harf taşları verilir: önce 8, sonra 9, sonra 10. 45 saniyelik üç turda bulabildiğin kadar kelime bul. Uzun kelimeler çok daha fazla puan getirir.", tag: "3 tur · 45 saniye" },
      ],
      chainTitle: "Kelime zinciri nasıl işler?",
      chainLead: "Oyunu tek bir kural döndürür: senin kelimen, öncekinin bittiği harfle başlar.",
      chain: ["kale<b>m</b>", "mas<b>a</b>", "arab<b>a</b>", "anahta<b>r</b>", "renk"],
      steps: [
        ["Oda kur ya da katıl", "Herkese açık bir odaya gir veya özel oda kurup davet kodunu arkadaşlarınla paylaş."],
        ["Son harfi takip et", "Kelimen bir önceki kelimenin son harfiyle başlamalı ve sözlükte bulunmalı."],
        ["Süreyi yen", "Hızlı düşün. Daha önce yazılan kelimeler kabul edilmez, saat de durmaz."],
        ["Skor tablosunda yüksel", "Her harf puan demek. Turları kazan, puan topla, sıralamada yüksel."],
      ],
      howToLink: "Tüm kuralları oku →",
      featuresTitle: "Arkadaşlarla oynamak için tasarlandı.",
      featuresLead: "Başlaması kolay, bırakması zor. Her odada yeni bir zincir kurulur ve her saniye önemlidir.",
      features: [
        { icon: "⌂", title: "Özel odalar", text: "Özel bir oda kur ve kodu paylaş. Arkadaşların Odalar → Kodla odaya katıl bölümünden sana katılır." },
        { icon: "☺", title: "Avatarın, tarzın", text: "Bir avatar ve oda arka planı seç, her maça kendi tarzını getir." },
        { icon: "◎", title: "Misafir olarak oyna", text: "Üyelik gerekmez. İstersen Apple veya Google ile giriş yaparak ilerlemeni yeni bir cihaza taşıyabilirsin." },
      ],
      screensTitle: "Kelime maceran, tek bakışta.",
      screensLead: "Oda bul, kuralları belirle, zinciri öğren ve skor tablosunun zirvesine arkadaşlarınla yarış.",
      screensAria: "LinHug uygulama ekran görüntüleri",
      prev: "Önceki ekran görüntüsünü göster",
      next: "Sonraki ekran görüntüsünü göster",
      swipe: "Kaydır ya da okları kullan",
      videosTitle: "LinHug’ı hareket halinde gör.",
      videosLead: "Hızlı turlar, şaşırtıcı kelimeler ve zinciri ayakta tutmanın keyfi.",
      videos: [
        ["linhug-gameplay", "Birlikte oyna", "Arkadaşlarını davet et, her turu hızlı bir çok oyunculu yarışa dönüştür."],
        ["linhug-word-chain", "Kelimeler aksın", "Hızlı düşün, son harfi takip et ve süre bitmeden zinciri devam ettir."],
        ["linhug-avatar", "Avatarınla tanış", "Tarzını seç ve her LinHug odasına kendi kişiliğini getir."],
        ["linhug-rocket", "Oyuna fırla", "Bir odaya gir, meydan okumayı başlat ve kelime serini sürdür."],
      ],
      wordsTitle: "Zincirde takıldın mı?",
      wordsText: "Rakibin “ğ” ile biten bir kelime mi yazdı, yoksa aklına “j” ile başlayan kelime mi gelmiyor? LinHug’ın Türkçe sözlüğünden hazırlanan kelime listelerine göz at: harfe göre başlayan ve biten kelimeler, harf sayısına göre kelimeler.",
      wordsLink: "Tüm kelime listeleri →",
      faqTitle: "Sıkça sorulan sorular",
      faq: [
        ["LinHug nedir?", "LinHug, iPhone, iPad ve Android için ücretsiz, çok oyunculu bir kelime zinciri oyunudur. Odalarda arkadaşlarınla ya da diğer oyuncularla canlı oynar, sırayla kelime türeterek zinciri devam ettirirsin."],
        ["Kelime zinciri oyunu nasıl oynanır?", "Her oyuncu, bir önceki kelimenin son harfiyle başlayan yeni bir kelime söyler. Örneğin: kalem → masa → araba. Aynı kelime iki kez kullanılamaz, kelime sözlükte olmalıdır ve süre bitmeden cevap verilmelidir. Ayrıntılar için <a href=\"/tr/nasil-oynanir/\">nasıl oynanır</a> sayfasına bak."],
        ["LinHug ücretsiz mi?", "Evet. LinHug’ı App Store ve Google Play’den ücretsiz indirip oynayabilirsin."],
        ["Türkçe kelimelerle oynayabilir miyim?", "Evet. Oda kurarken kelime dili olarak Türkçeyi seç. Türkçe sözlükte 38.000’den fazla kelime var; uygulamanın arayüzü de tamamen Türkçe."],
        ["Hangi kelimeler geçerli sayılır?", "Sözlükteki kelimelerin yalın halleri geçerlidir. Özel isimler, kısaltmalar ve çekimli biçimler (ör. “kitaplar”, “evde”) kabul edilmez."],
        ["“ğ” ile biten kelime yazılırsa ne olur?", "Türkçede “ğ” ile başlayan kelime olmadığı için, “ğ” ile biten bir kelimeden (ör. dağ, bağ) sonra sıradaki oyuncu istediği harfle başlayabilir. <a href=\"/tr/kelimeler/ğ-ile-biten-kelimeler/\">ğ ile biten kelimeler</a> listesine göz at."],
        ["Arkadaşlarımla özel oda kurabilir miyim?", "Evet. Özel oda kur ve davet kodunu paylaş. Arkadaşların Odalar → Kodla odaya katıl bölümüne kodu girerek katılır."],
        ["Hesap açmam gerekiyor mu?", "Hayır. Hemen misafir olarak oynayabilirsin. İlerlemeni başka bir cihazda sürdürmek istersen isteğe bağlı olarak Apple veya Google ile giriş yapabilirsin."],
      ],
      ctaTitle: "Sıradaki kelime seni bekliyor.",
      ctaText: "Arkadaşlarını topla ve zinciri ne kadar uzun süre ayakta tutabileceğinizi görün.",
      ctaIcon: "LinHug uygulama simgesi",
    },
    howTo: {
      title: "Kelime Zinciri Nasıl Oynanır? Kurallar ve Oyun Modları | LinHug",
      description: "Kelime zinciri (kelime türetmece) kuralları: son harfle başla, süreyi kaçırma, aynı kelimeyi tekrarlama. Kelime Düellosu ve Harf Avı puanlaması.",
      crumbs: [["/tr/", "Ana sayfa"], [null, "Nasıl oynanır"]],
      h1: "Kelime zinciri nasıl oynanır?",
      lead: "Kelime zinciri (kelime türetmece, son harf oyunu) klasik bir kelime oyunudur: her yeni kelime, bir önceki kelimenin son harfiyle başlamak zorundadır. LinHug bu oyunu süre sınırı, üç farklı mod ve her kelimeyi kontrol eden bir sözlükle canlı, çok oyunculu bir oyuna dönüştürür.",
      sections: [
        ["Temel kural", [
          "<p>İlk oyuncuya bir başlangıç harfi verilir. Sonraki her kelime, <strong>bir önceki kelimenin son harfiyle</strong> başlamalıdır:</p>",
          "<p class=\"callout\"><strong>kalem → masa → araba → anahtar → renk</strong></p>",
          "<ul><li>Kelime, odanın sözlüğünde (Türkçe veya İngilizce) bulunmalıdır.</li><li>Bir kelime aynı oyunda yalnızca bir kez kullanılabilir.</li><li>Tur süresi bitmeden cevap vermelisin.</li><li>Özel isimler, kısaltmalar ve çekimli biçimler (ör. “evler”, “okulda”) geçerli değildir.</li></ul>",
        ]],
        ["Klasik Zincir", [
          "<p>Oyuncular sırayla oynar. Her geçerli kelime <strong>harf sayısı kadar puan</strong> kazandırır, yani uzun kelimeler seni öne geçirir. Süren biterse turdan elenirsin. Ayakta kalan son oyuncu <strong>+20 hayatta kalma bonusu</strong> alır ve en yüksek toplam puan oyunu kazanır.</p>",
          "<p>“ğ” ile biten bir kelime yazılırsa (ör. <em>dağ</em>, <em>yağ</em>), Türkçede “ğ” ile başlayan kelime olmadığı için sıradaki oyuncu <strong>istediği harfle</strong> başlayabilir. <a href=\"/tr/kelimeler/ğ-ile-biten-kelimeler/\">ğ ile biten kelimeler</a> listesine göz at.</p>",
        ]],
        ["Kelime Düellosu", [
          "<p>Herkes aynı anda oynar. Her turda bir harf meydan okuması çıkar ve her oyuncu süre bitmeden o harfle başlayan <strong>geçerli ve benzersiz bir kelime</strong> gönderir. Puan kelime uzunluğuna göre hesaplanır; uzun ve az bilinen bir kelime, hızlı yazılmış kısa bir kelimeyi yener.</p>",
        ]],
        ["Harf Avı", [
          "<p>Bütün oyunculara aynı harf taşları verilir: <strong>birinci turda 8, ikincide 9, üçüncüde 10</strong>. Taşlara dokunarak kelime oluştur (her taş bir kelimede bir kez kullanılır) ve <strong>45 saniyede</strong> bulabildiğin kadar farklı kelime gönder. Rakiplerin kelimeleri tur bitene kadar gizli kalır.</p>",
          "@@HUNT_TABLE@@",
          "<p>Üç tur sonunda en yüksek puanı toplayan kazanır. Eşitlikte galibiyet paylaşılır.</p>",
        ]],
        ["Odalar, arkadaşlar ve botlar", [
          "<p>Odalar ekranından herkese açık bir odaya katıl ya da kendi odanı kurup modu, kelime dilini, oda boyutunu, tur süresini ve görünürlüğü seç. Özel odalara paylaşabileceğin bir davet kodu verilir. LinHug’da her zaman açık, botlu Harf Avı odaları da bulunur; böylece katılabileceğin bir oyun hep vardır.</p>",
        ]],
        ["Kazanmak için ipuçları", [
          "<ul><li>Rakibini zorlayan harflerle biten kelimeler öğren; örneğin <a href=\"/tr/kelimeler/j-ile-biten-kelimeler/\">j ile biten</a> ya da <a href=\"/tr/kelimeler/f-ile-biten-kelimeler/\">f ile biten</a> kelimeler.</li><li>Her harf için birkaç uzun kelime aklında olsun; uzun kelimeler daha çok puan getirir.</li><li>Harf Avı’nda önce yaygın ekleri ve hecelerini bul, sonra onları daha uzun kelimelere dönüştür.</li><li>Panik yapma: kısa ama geçerli bir kelime, sürenin bitmesinden iyidir.</li></ul>",
          "<p>Takıldığın harfler için <a href=\"/tr/kelimeler/\">Türkçe kelime listelerine</a> göz at.</p>",
        ]],
      ],
      huntTable: ["Kelime uzunluğu", "Puan"],
    },
    notFound: { title: "Sayfa bulunamadı — LinHug", h1: "Bu zincir koptu.", text: "Aradığın sayfayı bulamadık. Ana sayfaya dönüp yeni bir kelimeyle başla.", button: "LinHug’a dön" },
  },
};
