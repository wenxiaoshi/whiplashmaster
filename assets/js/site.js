/* Progressive enhancement for the screenshot carousel. No runtime dependencies. */
(function (environment) {
  'use strict';

  function initCarousel(root, env) {
    const tabs = Array.from(root.querySelectorAll('[data-slide]'));
    const panels = Array.from(root.querySelectorAll('[data-panel]'));
    const pauseButton = root.querySelector('[data-pause]');
    const count = root.querySelector('[data-count]');
    if (!tabs.length || tabs.length !== panels.length || !pauseButton || !count) return null;

    const doc = env.document;
    const media = env.matchMedia('(prefers-reduced-motion: reduce)');
    const configuredInterval = Number(root.dataset.interval);
    const interval = configuredInterval >= 1000 ? configuredInterval : 3000;
    let selected = 0;
    let paused = media.matches;
    let timer = null;
    const listeners = [];

    function listen(target, name, callback) {
      target.addEventListener(name, callback);
      listeners.push(() => target.removeEventListener(name, callback));
    }

    function show(index) {
      selected = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => {
        const active = i === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      count.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(tabs.length).padStart(2, '0')}`;
    }

    function stop() {
      if (timer !== null) env.clearInterval(timer);
      timer = null;
    }

    function restart() {
      stop();
      if (!paused && !doc.hidden) timer = env.setInterval(() => show(selected + 1), interval);
      pauseButton.textContent = paused ? '继续轮播' : '暂停轮播';
      pauseButton.setAttribute('aria-label', paused ? '继续自动轮播' : '暂停自动轮播');
    }

    tabs.forEach((tab, i) => {
      listen(tab, 'click', () => { show(i); restart(); });
      listen(tab, 'keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        show(next);
        tabs[next].focus();
        restart();
      });
    });
    panels.forEach(panel => {
      const image = panel.querySelector('img');
      const fallback = panel.querySelector('.image-fallback');
      if (!image || !fallback) return;
      function handleImageError() { image.hidden = true; fallback.hidden = false; }
      listen(image, 'error', handleImageError);
      if (image.complete && image.naturalWidth === 0) handleImageError();
    });
    listen(pauseButton, 'click', () => { paused = !paused; restart(); });
    listen(doc, 'visibilitychange', restart);
    listen(env, 'pagehide', stop);
    listen(env, 'pageshow', restart);
    listen(media, 'change', event => { paused = event.matches; restart(); });
    show(0);
    restart();
    return { destroy() { stop(); listeners.forEach(remove => remove()); } };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCarousel };
  } else {
    environment.document.querySelectorAll('[data-carousel]').forEach(root => initCarousel(root, environment));
  }
})(typeof window === 'undefined' ? globalThis : window);
