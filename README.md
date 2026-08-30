# Houston Packet Field

A small offline-first PWA for keeping a personal packet-radio directory, known connection routes, quick command reference, and field observations.

## Run locally

Because service workers require HTTP/HTTPS, don't open `index.html` directly with `file://` if you want offline caching.

From this folder, run one of these:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

## Put it on an iPhone

Deploy the folder to any static HTTPS host (GitHub Pages, Cloudflare Pages, Netlify, etc.). Open that URL in Safari, tap **Share → Add to Home Screen**. After the first successful load, the app shell works offline.

## Data

Your edits are stored in browser `localStorage` on that device/browser. Use **••• → Export JSON backup** periodically. Import restores a backup. Clearing Safari website data can erase local data, so exports matter.

## Starter observations

The included seed data is intentionally conservative and based on recent manual testing: BIGBOY, WR5GC, FOXHOP, TARNOD, LCCHAT, LCITY, TARBOX, and GC. Frequencies are left blank where they were not firmly established.

## V1 scope

- Search/filter station directory
- Add/edit/delete station records
- Known-route graph
- Field log
- Command reference
- JSON backup/restore
- Offline PWA caching

No internet lookup or radio control is performed by this version.
