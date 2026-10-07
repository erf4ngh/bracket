# Track Bracket

Pick an artist, get a seeded song bracket, fill it out song vs song, then compare everyone's picks on the call.

Live site: https://erf4ngh.github.io/bracket/ (once the setup below is done). Anyone with the link can sign in with Google, or join with just a name, and play.

## What it does

- **Build** – type an artist and choose 16, 32 or 64 songs. Claude picks songs (you copy a prompt into Claude and paste its reply back, so it's free) from across their albums and singles, ranks them, and seeds the bracket so #1 and #2 can only meet in the final. You can remove, swap, add or drag to reorder songs before it goes live, or paste your own list (`Song - Album`, one per line).
- **Pick** – one matchup at a time, with Spotify / YouTube / Apple Music links on each song, progress by round, who the winner plays next, and a grid to jump to any match. Use ← / → to pick and S to skip.
- **Bracket** – the full two-sided bracket, fit to the screen or at full size, with a switcher for friends' brackets. Changing an early pick clears later picks that depended on it.
- **Compare** – a copyable invite link, who's done, the group's champion vote, how closely each friend's picks match yours, group standings and the first-round matchups where people disagreed. Other people's picks stay hidden until you finish yours.
- **Listen** – the track list grouped by album, with a copy button for playlist importers like TuneMyMusic or Soundiiz.

## Hosting it (free)

The site is static files on **GitHub Pages**. Accounts and shared data live in **Firebase** on its free Spark plan, which never asks for a card. Lineups come from your own Claude chat, so nothing here costs money. The free Firestore quota is tens of thousands of reads and writes a day, far more than a group of friends uses.

One-time setup, about 10 minutes:

1. **Create a Firebase project.** Go to [console.firebase.google.com](https://console.firebase.google.com), click *Create a project*, and skip Google Analytics.
2. **Add a web app.** In *Project settings > General > Your apps*, click the `</>` icon, register an app (no Firebase Hosting needed), and copy the `firebaseConfig` values into [`config.js`](config.js) in place of `firebase: null`.
3. **Turn on sign-in.** *Build > Authentication > Get started > Sign-in method*: enable **Google** and **Anonymous** (Anonymous is the "join with just your name" option).
4. **Allow your site's address.** *Authentication > Settings > Authorized domains*: add `erf4ngh.github.io`.
5. **Create the database.** *Build > Firestore Database > Create database*, pick a location near you, start in production mode. Then open the *Rules* tab, replace everything with the contents of [`firestore.rules`](firestore.rules) and click *Publish*.
6. **Turn on GitHub Pages.** In this repo's *Settings > Pages*, set *Source* to **GitHub Actions**. Every push to `main` then deploys through [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

If you change `firestore.rules` later, paste it into the console again, or run `npx firebase-tools deploy --only firestore:rules --project <your-project-id>`.

The Firebase config values in `config.js` are meant to be public. What protects the data is `firestore.rules`: everyone signed in can see brackets, picks and names, but people can only change their own picks and name, and only delete brackets they made.

## How it's built

No build step. The site is three files:

| File | What it is |
| --- | --- |
| [`index.html`](index.html) | The whole app: HTML, CSS and JavaScript |
| [`config.js`](config.js) | Your Firebase settings (`firebase: null` keeps everything in the browser) |
| [`firestore.rules`](firestore.rules) | Who can read and write what |

The app talks to its data through one small adapter (`loadFirebase` in `index.html`), so the same code also runs in two other modes:

- **No config:** everything is saved in that browser only. Handy for trying it out.
- **As a claude.ai Artifact:** if the page is published as an Artifact with the `db`, `user` and `sample` capabilities, it uses those instead, and "Build bracket" asks Claude directly. Artifacts that use `db` can only be shared inside your own claude.ai organization, which is why the site is hosted here instead.

Opening a bracket puts `#b=<id>` in the address, so that link takes friends straight to it after they sign in.

### Trying it locally

Serve the folder with any static server (for example `python3 -m http.server`) and open it. To test sign-in and sharing without touching your real project, run the Firebase emulators with `npx firebase-tools emulators:start --project demo-bracket`. Then set `emulators: true` in `config.js`, with any placeholder `firebase` values whose `projectId` is `demo-bracket`.

### Data shapes

`brackets/<id>` (Firestore collection)

```jsonc
{
  "artist": "Travis Scott",
  "size": 32,
  "albums": [{ "name": "Rodeo", "year": 2015, "color": "#1F2026" }],
  "songs": [{ "t": "Antidote", "a": 0, "seed": 4 }], // in slot order, top-left to bottom-right
  "seeding": "seeded" | "shuffled" | "custom",
  "source": "claude" | "manual" | "import",
  "createdBy": "<user id>",
  "createdAt": 1759600000000
}
```

`picks/<userId>`

```jsonc
{ "b": { "<bracketId>": { "w": [0, 3, null, ...], "done": false, "updatedAt": 1759600000000 } } }
```

`w` has `size - 1` entries. Matches are numbered round by round. Match `i` of round `r` is fed by matches `2i` and `2i+1` of round `r-1`. Each entry is the winning slot index, or `null` if that match hasn't been picked yet.

`users/<userId>`

```jsonc
{ "name": "Alice", "avatarUrl": "https://…" } // avatarUrl is "" for name-only accounts
```

[`seed/travis-scott.json`](seed/travis-scott.json) is a sample Travis Scott bracket in this shape.
