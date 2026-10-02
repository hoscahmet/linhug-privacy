(() => {
  const store = {
    get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch {} },
  };

  // Theme toggle. The initial theme is applied by the inline script in <head> to avoid a flash.
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeColor) themeColor.content = theme === "light" ? "#f5f4ff" : "#090d2e";
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
