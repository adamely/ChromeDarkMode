const STORAGE_KEY = 'darkModeOrigins';
const STYLE_ID = 'dark-mode-ext-style';
const DARK_CSS = `
  html { filter: invert(1) hue-rotate(180deg) !important; }
  img, video, iframe, canvas, picture, svg image {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

// Toggle dark mode when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url || !tab.url.startsWith('http')) return;

  const origin = new URL(tab.url).origin;
  const { [STORAGE_KEY]: origins = [] } = await chrome.storage.local.get(STORAGE_KEY);

  const isCurrentlyEnabled = origins.includes(origin);
  const willEnable = !isCurrentlyEnabled;

  const updatedOrigins = willEnable
    ? [...origins, origin]
    : origins.filter((o) => o !== origin);

  await chrome.storage.local.set({ [STORAGE_KEY]: updatedOrigins });

  // Apply or remove dark mode on the current page
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: willEnable ? injectDarkMode : removeDarkMode,
    args: [STYLE_ID, DARK_CSS],
  });

  updateBadge(tab.id, willEnable);
});

// Update badge when a tab finishes loading (handles refresh)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  try {
    const origin = new URL(tab.url).origin;
    const { [STORAGE_KEY]: origins = [] } = await chrome.storage.local.get(STORAGE_KEY);
    updateBadge(tabId, origins.includes(origin));
  } catch {
    // Ignore non-parseable URLs (chrome://, etc.)
  }
});

function updateBadge(tabId, isEnabled) {
  chrome.action.setBadgeText({ tabId, text: isEnabled ? 'ON' : '' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#4f46e5' });
}

// These functions are serialized and injected into the page — keep them self-contained
function injectDarkMode(styleId, css) {
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
}

function removeDarkMode(styleId) {
  const style = document.getElementById(styleId);
  if (style) style.remove();
}
