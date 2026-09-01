# Cortexify Capture

A Chrome/Edge Manifest V3 extension for frictionless capture into [Cortexify](https://www.cortexify.in/).

## Why this product

Cortexify already organizes links and documents after they arrive. The missing piece is capture at the moment of discovery. This extension turns capture into one click while preserving Cortexify's existing AI processing, duplicate checks, inbox and collections.

## Features

- Save the active page and immediately route it to a Cortexify collection
- Detect URLs already in the library before saving
- Save selected text as a note with title and source URL
- Save a window's useful tabs as a batch, with per-tab selection and duplicate counts
- Right-click any page, link or text selection
- Keyboard save with `Alt+Shift+S`
- Uses the user's existing Cortexify session; no API key or password is stored by the extension
- Clear in-popup processing, duplicate and error states

## Install locally

1. Download this folder.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and choose this folder.
5. Pin Cortexify Capture.
6. Open Cortexify and sign in. The extension connects automatically.


## Permissions used

- `activeTab`: reads the active page only after you invoke the extension.
- `contextMenus`: adds save actions to page, link, and selection context menus.
- `storage`: keeps the mirrored Cortexify session and extension state in Chrome local storage.
- `scripting`: runs capture helpers in the active tab when requested.
- `notifications`: shows save results outside the popup.
- Host access to `cortexify.in` and its Supabase project: connects to the signed-in Cortexify app and its existing data API.

## Test

```bash
node tests/unit.test.js
```

For live acceptance, sign in to Cortexify, load the unpacked extension, then verify: active page save, duplicate save, collection routing, selected-text note, batch save, context menus, and reconnect after logout/login.

## Privacy and security

The content script only runs on cortexify.in. It mirrors the existing signed-in session into Chrome's local extension storage. Requests go only to cortexify.in and its existing Supabase project. Passwords and AI keys are never read. Disconnect removes the mirrored session. Publishing to the Chrome Web Store should include a privacy policy explaining authentication storage and host permissions.

## Known backend contract

This build integrates with Cortexify's current `/api/process-content`, `content`, `collections`, `collection_content` and `notes` interfaces. If those routes or schemas change, update `api.js`.

## License

MIT
