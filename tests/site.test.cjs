'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { initCarousel } = require('../assets/js/site.js');

class Events {
  constructor() { this.listeners = new Map(); }
  addEventListener(name, callback) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(callback);
  }
  removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); }
  fire(name, event = {}) {
    const payload = { prevented: false, preventDefault() { this.prevented = true; }, ...event };
    for (const callback of this.listeners.get(name) || []) callback(payload);
    return payload;
  }
}
class Element extends Events {
  constructor() { super(); this.attributes = {}; this.hidden = false; this.textContent = ''; this.tabIndex = -1; this.focused = false; }
  setAttribute(name, value) { this.attributes[name] = value; }
  focus() { this.focused = true; }
}
function fixture({ reduced = false, hidden = false, interval = '3000' } = {}) {
  const tabs = Array.from({ length: 4 }, () => new Element());
  const panels = tabs.map(() => {
    const panel = new Element();
    panel.image = new Element(); panel.image.complete = false; panel.image.naturalWidth = 1206;
    panel.fallback = new Element(); panel.fallback.hidden = true;
    panel.querySelector = selector => selector === 'img' ? panel.image : panel.fallback;
    return panel;
  });
  const pause = new Element(), count = new Element();
  const root = { dataset: { interval }, querySelectorAll: selector => selector === '[data-slide]' ? tabs : panels,
    querySelector: selector => selector === '[data-pause]' ? pause : count };
  const env = new Events(), doc = new Events(), media = new Events(), timers = new Map();
  doc.hidden = hidden; media.matches = reduced;
  env.document = doc; env.matchMedia = () => media;
  let timerId = 0;
  env.setInterval = (callback, delay) => { const id = ++timerId; timers.set(id, { callback, delay }); return id; };
  env.clearInterval = id => timers.delete(id);
  const tick = () => [...timers.values()].forEach(timer => timer.callback());
  return { root, tabs, panels, pause, count, env, doc, media, timers, tick };
}
function selected(f) { return f.tabs.findIndex(tab => tab.attributes['aria-selected'] === 'true'); }
function assertOnePanel(f, index) {
  assert.equal(selected(f), index);
  assert.deepEqual(f.panels.map(panel => panel.hidden), f.panels.map((_, i) => i !== index));
  assert.deepEqual(f.tabs.map(tab => tab.tabIndex), f.tabs.map((_, i) => i === index ? 0 : -1));
}

test('one accessible panel starts selected, on a 3000ms timer', () => {
  const f = fixture(); initCarousel(f.root, f.env);
  assertOnePanel(f, 0); assert.equal(f.count.textContent, '01 / 04');
  assert.equal(f.timers.size, 1); assert.equal([...f.timers.values()][0].delay, 3000);
});
test('automatic rotation covers all panels and wraps without moving focus', () => {
  const f = fixture(); initCarousel(f.root, f.env);
  for (const i of [1, 2, 3, 0]) { f.tick(); assertOnePanel(f, i); }
  assert.equal(f.tabs.some(tab => tab.focused), false);
});
test('manual selection resets the interval without adding a second timer', () => {
  const f = fixture(); initCarousel(f.root, f.env);
  const previous = [...f.timers.keys()][0]; f.tabs[3].fire('click');
  assertOnePanel(f, 3); assert.equal(f.count.textContent, '04 / 04');
  assert.equal(f.timers.size, 1); assert.equal(f.timers.has(previous), false);
  f.tick(); assertOnePanel(f, 0);
});
test('keyboard supports arrows and Home/End with correct focus', () => {
  const f = fixture(); initCarousel(f.root, f.env);
  assert.equal(f.tabs[0].fire('keydown', { key: 'ArrowLeft' }).prevented, true);
  assertOnePanel(f, 3); assert.equal(f.tabs[3].focused, true);
  f.tabs[3].fire('keydown', { key: 'Home' }); assertOnePanel(f, 0);
  f.tabs[0].fire('keydown', { key: 'End' }); assertOnePanel(f, 3);
  f.tabs[3].fire('keydown', { key: 'ArrowDown' }); assertOnePanel(f, 0);
  assert.equal(f.tabs[0].fire('keydown', { key: 'Tab' }).prevented, false);
});
test('explicit pause preserves the slide, manual selection works, resume runs once', () => {
  const f = fixture(); initCarousel(f.root, f.env);
  f.pause.fire('click'); assert.equal(f.timers.size, 0); assert.equal(f.pause.attributes['aria-label'], '继续自动轮播');
  f.tabs[2].fire('click'); assertOnePanel(f, 2); assert.equal(f.timers.size, 0);
  f.pause.fire('click'); assert.equal(f.timers.size, 1); f.tick(); assertOnePanel(f, 3);
});
test('background visibility stops timing and returning preserves selection', () => {
  const f = fixture(); initCarousel(f.root, f.env); f.tick();
  f.doc.hidden = true; f.doc.fire('visibilitychange'); assert.equal(f.timers.size, 0); assertOnePanel(f, 1);
  f.doc.hidden = false; f.doc.fire('visibilitychange'); assert.equal(f.timers.size, 1); assertOnePanel(f, 1);
  f.env.fire('pageshow'); assert.equal(f.timers.size, 1);
});
test('reduced-motion preference starts paused and can be explicitly resumed', () => {
  const f = fixture({ reduced: true }); initCarousel(f.root, f.env);
  assert.equal(f.timers.size, 0); f.pause.fire('click'); assert.equal(f.timers.size, 1);
  f.media.fire('change', { matches: true }); assert.equal(f.timers.size, 0);
});
test('pagehide stops timing, pageshow resumes once, destroy removes listeners', () => {
  const f = fixture(); const carousel = initCarousel(f.root, f.env);
  f.env.fire('pagehide'); assert.equal(f.timers.size, 0);
  f.env.fire('pageshow'); assert.equal(f.timers.size, 1);
  carousel.destroy(); assert.equal(f.timers.size, 0);
  f.pause.fire('click'); f.env.fire('pageshow'); assert.equal(f.timers.size, 0);
});
test('failed screenshot presents its functional fallback instead of an empty frame', () => {
  const f = fixture(); initCarousel(f.root, f.env);
  f.panels[1].image.fire('error');
  assert.equal(f.panels[1].image.hidden, true); assert.equal(f.panels[1].fallback.hidden, false);
});
test('already failed cached screenshot is detected during initialization', () => {
  const f = fixture(); f.panels[0].image.complete = true; f.panels[0].image.naturalWidth = 0;
  initCarousel(f.root, f.env); assert.equal(f.panels[0].fallback.hidden, false);
});
test('missing panels do not create a timer and invalid intervals fall back to 3000ms', () => {
  const f = fixture(); f.panels.pop(); assert.equal(initCarousel(f.root, f.env), null); assert.equal(f.timers.size, 0);
  const invalid = fixture({ interval: 'NaN' }); initCarousel(invalid.root, invalid.env);
  assert.equal([...invalid.timers.values()][0].delay, 3000);
});
