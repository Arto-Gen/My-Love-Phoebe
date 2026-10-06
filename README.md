# Us, always — for Phoebe Joy, from Jay

A romantic scrapbook website celebrating December 17, 2023. Built with plain HTML, CSS, and JavaScript: no framework, build step, database, subscription, or paid API.

## Open it

Install Node.js 20 or newer if it is not already available. In this folder, run:

```sh
npm start
```

Open **http://127.0.0.1:4173**. Keep the terminal running while you browse. Stop with Ctrl+C. You do not need to run `npm install`.

To preview on a phone or tablet on your own Wi-Fi:

```sh
npm start -- --host 0.0.0.0
```

Then open `http://YOUR-COMPUTER-LAN-IP:4173` on that device. Your computer must stay on, and your firewall must allow the local connection. This is a local preview, not an internet share link.

## Personalize it

**Start with `content.js`.** It contains names, the anniversary, every photo path, the timeline, 22 reasons, five quiz questions, dreams, coupons, and the complete letter. Comments mark every photo slot.

1. Copy your photos into `assets/` using simple filenames such as `our-first-date.jpg`.
2. Replace the relevant `src` in `content.js` with `./assets/our-first-date.jpg`.
3. Change the `alt` description, title, and note to describe your real memory.
4. Refresh the page to see your changes.

`hero.src` is the main portrait print. `hero.smallSrc` is the smaller landscape print. `story` contains milestone photos; `memories` contains the six clickable gallery photos. You can add more gallery entries with the same fields. Keep `tag` equal to `Little moments` or `Adventures` for the current filters.

The included photos are a mood board, **not photographs of you and Phoebe**. After you add your own photos, update the scrapbook wording and remove or change the `.photo-footnote` paragraph in `index.html`.

Your anniversary is `2023-12-17T00:00:00+08:00` (Philippine time). Only the date was supplied, so the timer starts at midnight. Edit the time if you remember the exact moment. It counts elapsed time upward and uses the visitor’s device clock.

For each quiz question, `answer` is the correct option’s position, starting at **0**. The default questions use the anniversary you supplied and sentiments in the website; replace them with your personal trivia if you like.

Most personal content is centralized, but the envelope greeting (`To my Phoebe`) and wax-seal initial (`J`) are in `index.html`. Page colors and layout are in `styles.css`; the interactive section styling is in `extras.css`.

## Music

To play your own song, **you do not need to edit any code**:

1. Copy your MP3 file into the `assets/` folder.
2. Name it exactly `our-song.mp3`. In Windows File Explorer, turn on **View → Show → File name extensions** so it does not accidentally become `our-song.mp3.mp3`. Use an actual MP3 file; changing another audio format's extension does not convert it.
3. Refresh the website, then click **Play our soundtrack**.

To change songs later, replace `assets/our-song.mp3` and refresh the page. The player repeats the song while it is playing.

If you prefer a different filename, change `music.src` in `content.js` (for example, `./assets/our-favorite-song.mp3`). Set `music.volume` between `0` (silent) and `1` (full volume); the default is `0.25`.

Until you add a playable song, the button plays an original, gentle ambient instrumental synthesized in the browser. No song is bundled, no streaming service is required, and music does not autoplay. Music pauses when the tab becomes hidden. Tap play to start again.

## What is saved

New reasons, checklist changes, and coupon redemptions are stored in this browser’s `localStorage`. They survive normal reloads but **do not sync between devices or notify Jay**. Redeeming a coupon saves its date on the device; show it to Jay to claim it. Clearing site data removes the saved additions. Private browsing may erase them when the browser closes. If saving is unavailable, the site tells you the change only lasts for the visit.

The letter can always be opened; it is never locked behind a quiz score. The site includes keyboard controls, native modal focus trapping and Escape dismissal, reduced-motion support, lazy-loaded gallery photos, and no autoplaying video or continuous canvas.

## Publish later

The site is ready for a static host: upload `index.html`, `styles.css`, `extras.css`, `app.js`, `extras.js`, `music.js`, `content.js`, and the entire `assets/` folder. No build command is needed. `server.mjs` and `package.json` are only for local preview. This project has not been published publicly.

The `noindex` meta tag discourages search indexing; it is not password protection. If you want access restricted, use hosting with authentication.

There is no AI API usage in the website. Browser/device usage and account usage quotas cannot be guaranteed to stay below a specific percentage. Work stays modest: a timer updates once a second, animations respect reduced-motion settings, and audio is synthesized only when playing.

## Checks

```sh
npm run check
```

This checks JavaScript syntax. Browser verification covers the timer, soundtrack toggle, note addition, five quiz questions and replay, gallery filtering/navigation, milestone expansion, dream additions/checks, coupon redemption and persistence, the envelope, and responsive layouts.

## Assets

The bundled placeholder photographs come from Unsplash:

- Hero: https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2
- Sea: https://images.unsplash.com/photo-1473116763249-2faaef81ccda
- Flowers: https://images.unsplash.com/photo-1490750967868-88aa4486c946
- Mountains: https://images.unsplash.com/photo-1464822759023-fed622ff2c3b
- Sunrise: https://images.unsplash.com/photo-1470252649378-9c29740c9fa8
- Coffee: https://images.unsplash.com/photo-1442512595331-e89e73853f31

Typefaces: Cormorant Garamond, DM Sans, and Caveat, served by Google Fonts with local fallback fonts. All photographs are stored locally; font loading requires internet access. The line icons are inline SVG.
