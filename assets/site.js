(() => {
  const store = {
    get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch {} },
  };

  // Theme toggle. The initial theme is applied by the inline script in <head> to avoid a flash.
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  // Videos that differ per theme (the hero: logo reveal at night, the forest walk in light mode).
  const syncThemeVideos = (theme) => {
    document.querySelectorAll("video.theme-video").forEach((video) => {
      const src = video.dataset[`${theme}Src`];
      if (!src || video.getAttribute("src") === src) return;
      video.poster = video.dataset[`${theme}Poster`];
      video.src = src;
      video.play().catch(() => {});
    });
  };
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeColor) themeColor.content = theme === "light" ? "#efe9d6" : "#090d2e";
    syncThemeVideos(theme);
  };
  applyTheme(root.dataset.theme || "dark");
  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      applyTheme(next);
      store.set("linhug:theme", next);
    });
  });

  // Remember an explicit language choice so the home page stops auto-suggesting.
  document.querySelectorAll("[data-set-lang]").forEach((link) => {
    link.addEventListener("click", () => store.set("linhug:lang", link.dataset.setLang));
  });

  // Language menu closes on an outside click or Escape.
  const langMenus = document.querySelectorAll(".lang-menu");
  document.addEventListener("click", (event) => {
    langMenus.forEach((menu) => { if (menu.open && !menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    langMenus.forEach((menu) => {
      if (!menu.open) return;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    });
  });

  // Forest scenes (light theme): sections tagged data-scene pick the backdrop; pages without tags
  // move through the scenes by scroll progress. While a scene is active the camera slowly pushes
  // in toward its landmark (the library towers, the gates, the castle, the LINHUG stones) as you scroll through it.
  const scenes = [...document.querySelectorAll(".forest-scenes .scene")];
  const sceneSections = [...document.querySelectorAll("[data-scene]")];
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ZOOM_FROM = 1.04;
  const ZOOM_TO = 1.38;
  let sceneFrame = 0;
  const updateScene = () => {
    sceneFrame = 0;
    if (root.dataset.theme !== "light" || !scenes.length) return;
    const probe = window.scrollY + window.innerHeight * 0.45;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    // Where each scene starts in the document; it ends where the next one starts.
    let starts;
    if (sceneSections.length) {
      starts = scenes.map((_, i) => (i ? Infinity : 0));
      for (const section of sceneSections) {
        const index = Number(section.dataset.scene) - 1;
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (index > 0 && top < starts[index]) starts[index] = top;
      }
    } else {
      starts = scenes.map((_, i) => (max * i) / scenes.length + window.innerHeight * 0.45);
      starts[0] = 0;
    }
    const docEnd = document.documentElement.scrollHeight;
    let index = 0;
    for (let i = 1; i < starts.length; i++) if (starts[i] <= probe) index = i;
    const end = starts.slice(index + 1).find((at) => at !== Infinity) ?? docEnd;
    const progress = Math.min(1, Math.max(0, (probe - starts[index]) / Math.max(1, end - starts[index])));
    scenes.forEach((scene, i) => {
      scene.classList.toggle("is-active", i === index);
      const zoom = !motionOk ? 1 : i === index ? ZOOM_FROM + (ZOOM_TO - ZOOM_FROM) * progress : i < index ? ZOOM_TO : ZOOM_FROM;
      scene.style.setProperty("--zoom", zoom.toFixed(4));
    });
  };
  const queueScene = () => { if (!sceneFrame) sceneFrame = requestAnimationFrame(updateScene); };
  window.addEventListener("scroll", queueScene, { passive: true });
  window.addEventListener("resize", queueScene);
  document.querySelectorAll(".theme-toggle").forEach((button) => button.addEventListener("click", queueScene));
  updateScene();

  // Below-the-fold videos load and play only when visible.
  const lazyVideos = document.querySelectorAll("video[data-lazy]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if ("IntersectionObserver" in window && lazyVideos.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          if (target.preload === "none") target.preload = "metadata";
          if (!reduceMotion.matches) target.play().catch(() => {});
        } else if (!target.paused) {
          target.pause();
        }
      });
    }, { rootMargin: "200px 0px" });
    lazyVideos.forEach((video) => observer.observe(video));
  }

  // Screenshot carousel.
  const screenTrack = document.querySelector(".screen-track");
  if (!screenTrack) return;
  let autoScrollTimer;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  const screenStep = () => {
    const card = screenTrack.querySelector(".screen-card");
    return card ? card.getBoundingClientRect().width + 30 : 320;
  };
  const moveScreens = (direction) => {
    const maxScroll = screenTrack.scrollWidth - screenTrack.clientWidth;
    if (direction > 0 && screenTrack.scrollLeft >= maxScroll - screenStep() * 0.5) {
      screenTrack.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && screenTrack.scrollLeft <= 8) {
      screenTrack.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      screenTrack.scrollBy({ left: screenStep() * direction, behavior: "smooth" });
    }
  };
  const stopAutoScroll = () => window.clearInterval(autoScrollTimer);
  const startAutoScroll = () => {
    stopAutoScroll();
    if (!reduceMotion.matches) autoScrollTimer = window.setInterval(() => moveScreens(1), 2800);
  };

  document.querySelector(".screen-arrow-left")?.addEventListener("click", () => moveScreens(-1));
  document.querySelector(".screen-arrow-right")?.addEventListener("click", () => moveScreens(1));
  screenTrack.addEventListener("mouseenter", stopAutoScroll);
  screenTrack.addEventListener("mouseleave", () => { if (!isDragging) startAutoScroll(); });
  screenTrack.addEventListener("mousedown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = screenTrack.scrollLeft;
    screenTrack.classList.add("is-dragging");
    stopAutoScroll();
    event.preventDefault();
  });
  window.addEventListener("mousemove", (event) => {
    if (isDragging) screenTrack.scrollLeft = dragStartScroll - (event.clientX - dragStartX) * 1.2;
  });
  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    screenTrack.classList.remove("is-dragging");
    startAutoScroll();
  });
  screenTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveScreens(-1);
    if (event.key === "ArrowRight") moveScreens(1);
  });
  reduceMotion.addEventListener("change", startAutoScroll);
  startAutoScroll();
})();
