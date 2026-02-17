// Runs at document_start on every page load.
// Re-applies dark mode if this origin was previously enabled by the user.

const STORAGE_KEY = 'darkModeOrigins';
const STYLE_ID = 'dark-mode-ext-style';
const DARK_CSS = `
  html { filter: invert(1) hue-rotate(180deg) !important; }
  img, video, iframe, canvas, picture, svg image {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

chrome.storage.local.get(STORAGE_KEY, (result) => {
  const origins = result[STORAGE_KEY] || [];
  if (origins.includes(location.origin)) {
    applyDarkMode();
  }
});

function applyDarkMode() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = DARK_CSS;
  (document.head || document.documentElement).appendChild(style);
}
