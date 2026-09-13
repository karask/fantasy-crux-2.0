// Spoiler protection, not authentication: direct file links remain public.
const panel = document.querySelector('#gm-adventures');
const trigger = document.querySelector('[data-gm-trigger]');
if (panel && trigger) {
  const storageKey = 'crux-gm-adventures';
  function setVisible(visible, focus = true) {
    panel.hidden = !visible;
    try {
      if (visible) sessionStorage.setItem(storageKey, 'visible');
      else sessionStorage.removeItem(storageKey);
    } catch {
      // The current page still works when browser storage is unavailable.
    }
    if (focus) (visible ? panel.querySelector('h2') : trigger).focus();
  }
  function toggle() {
    if (!panel.hidden) setVisible(false);
    else if (window.confirm('GM adventures contain spoilers. Continue?')) setVisible(true);
  }
  try {
    if (sessionStorage.getItem(storageKey) === 'visible') setVisible(true, false);
  } catch {
    // Default to hidden.
  }
  panel.querySelector('[data-gm-hide]').addEventListener('click', () => setVisible(false));
  document.addEventListener('keydown', (event) => {
    if (
      event.repeat ||
      event.isComposing ||
      event.target.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
      )
    )
      return;
    if (
      event.ctrlKey &&
      event.altKey &&
      !event.shiftKey &&
      !event.metaKey &&
      event.code === 'KeyG'
    ) {
      event.preventDefault();
      toggle();
    }
  });
  let timer;
  let origin;
  function cancelHold() {
    clearTimeout(timer);
    origin = null;
  }
  trigger.addEventListener('pointerdown', (event) => {
    cancelHold();
    if (!event.isPrimary || event.button !== 0) return;
    origin = { x: event.clientX, y: event.clientY };
    timer = setTimeout(() => {
      cancelHold();
      toggle();
    }, 800);
  });
  trigger.addEventListener('pointermove', (event) => {
    if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 12) cancelHold();
  });
  for (const event of ['pointerup', 'pointercancel', 'pointerleave'])
    trigger.addEventListener(event, cancelHold);
  trigger.addEventListener('contextmenu', (event) => event.preventDefault());
  window.addEventListener('blur', cancelHold);
  document.addEventListener('visibilitychange', cancelHold);
}
