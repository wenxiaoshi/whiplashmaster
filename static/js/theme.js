/*
 * theme.js
 *
 * 三件事：
 *   1. 深浅色主题切换（localStorage 记忆，默认跟随系统）
 *   2. 移动端导航展开/收起
 *   3. 下载页 tab 切换（若当前页存在下载 tab 元素）
 *
 * 无依赖，纯原生 JS，defer 加载。
 */

(function () {
  'use strict';

  // ---- 1. 主题切换 ------------------------------------------------
  var THEME_KEY = 'wm-theme';
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (saved) { applyTheme(saved); }

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var next;
      if (!current) {
        // 首次点击：翻转系统偏好
        next = prefersDark ? 'light' : 'dark';
      } else {
        next = current === 'dark' ? 'light' : 'dark';
      }
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // ---- 2. 移动端菜单 -----------------------------------------------
  var mobileToggle = document.getElementById('mobileToggle');
  var nav = document.getElementById('siteNav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---- 3. 下载页 tab -----------------------------------------------
  var tabs = document.querySelectorAll('[data-download-tab]');
  var panels = document.querySelectorAll('[data-download-panel]');
  if (tabs.length && panels.length) {
    // 尝试根据 UA 自动选中
    var ua = navigator.userAgent || '';
    var autoTab = 'android';
    if (/iPhone|iPad|iPod/i.test(ua)) { autoTab = 'ios'; }
    else if (/HarmonyOS/i.test(ua)) { autoTab = 'harmonyos'; }

    function activate(name) {
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t.getAttribute('data-download-tab') === name);
      });
      panels.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-download-panel') === name);
      });
    }
    activate(autoTab);

    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        activate(t.getAttribute('data-download-tab'));
      });
    });
  }
})();
