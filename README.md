# Dark Mode Toggle — Chrome Extension

A lightweight Chrome extension that toggles dark mode on any website. Dark mode preference is saved per-origin, so it persists across page refreshes and new tabs.

## How It Works

- Uses CSS `filter: invert(1) hue-rotate(180deg)` to invert page colours while keeping images, videos, and iframes visually correct.
- Preferences are stored per origin (e.g. `https://example.com`) using `chrome.storage.local`.
- A badge on the extension icon shows **ON** when dark mode is active for the current site.

## Installation

To load in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked** → select the `dark-mode-extension/` folder
4. Click the moon icon in your toolbar to test

## Usage

- Click the extension icon to **enable** dark mode on the current site.
- Click again to **restore** the original appearance.
- The **ON** badge indicates dark mode is active for that origin.

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Extension manifest (Manifest V3) |
| `background.js` | Service worker — handles icon clicks and badge updates |
| `content.js` | Content script — re-applies dark mode on page load |
| `icons/` | Extension icons (16×16, 48×48, 128×128) |
| `generate-icons.py` | Script to regenerate icon PNGs |

## Permissions

| Permission | Reason |
|------------|--------|
| `activeTab` | Read the current tab's URL |
| `scripting` | Inject/remove the dark mode stylesheet |
| `storage` | Persist per-origin preferences |
| `tabs` | Detect tab navigation to update the badge |

## License

MIT
