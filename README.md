# Bracket

Pick an artist (or a whole lineup of them), get a seeded song bracket, fill it out song vs song, then compare everyone's picks on the call.

Live site: https://erf4ngh.github.io/bracket/ (once the setup below is done). Anyone with the link can sign in with Google, or join with just a name, and play.

## What it does

- **Build** (admins only, from *New bracket*) – type an artist and choose 16, 32 or 64 songs. Claude picks songs (you copy a prompt into Claude and paste its reply back, so it's free) from across their albums and singles, ranks them, and seeds the bracket so #1 and #2 can only meet in the final. You can remove, swap, add or drag to reorder songs before it goes live, or paste your own list (`Song - Album`, one per line). Every song in the review is looked up, so a misspelled or made-up title is flagged before the bracket goes live, and you can play each song's preview to check it's the right one.
- **Edit a live bracket** – *Edit lineup* on a bracket's page (for whoever made it, or an admin) opens the same review screen. Swap artists or songs and whatever you add takes the spot of what it replaces, so every other matchup stays the same. Picks in matches that involve a changed song are cleared for everyone; all other picks stay. The editor tells you how many picks a save will clear before you commit. Changing the size starts the bracket over.
- **Many artists** – switch *New bracket* to *Many artists* for a lineup bracket, like "B-tier rappers who still drop music". Give a theme, list any artists you want (Claude fills the empty spots to fit the theme), and choose how many artists (2, 4, 8 or 16) and songs per artist (2, 4 or 8), up to 64 songs. *Solo songs only* keeps out features and collabs. With the default *Artist groups* draw, each artist's songs knock each other out first, so the best one reps that artist once it's artist vs artist (from the Round of 16 in a 16 × 4 bracket). Artists are seeded too, so the top two can only meet in the final. In review you can reorder, remove or add artists and their songs, or paste your own list as `Artist - Song - Album`. Compare adds artist standings, counting only wins over other artists.
- **Pick** – one matchup at a time. Each song shows its cover art: tap it (or press 1 / 2) to hear a 30-second preview without leaving the page. Spotify / YouTube / Apple Music links are there for the full song, along with progress by round and who the winner plays next. Click your pick again (or press ⌫) to clear it and leave the match undecided. Private notes on each song, also shown on the Bracket tab. A list of every match by song name shows which are still undecided. Use ← / → to pick and S to skip.
- **Champion** – your winner and the songs it beat, how many upsets you picked and your biggest one, plus a story-sized share card (1080×1920, with the cover art) for Messages, Instagram Stories and so on.
- **Bracket** – the full two-sided bracket, fit to the screen or at full size. *Save as image* turns it into one picture for the group chat. Once results are showing, the switcher opens friends' brackets and *the group's bracket* (each match goes to the song more of you sent through), with a dot on every match where your pick was different. Changing an early pick clears later picks that depended on it.
- **Compare** – a copyable invite link and who's done. Behind an eye button, so nothing gets spoiled: the group's champion vote, how closely each friend's picks match yours, who's most and least alike, group standings and the matchups where people disagreed, in any round. Results stay hidden until you choose to show them, and that choice is remembered per bracket.
- **The reveal** – *Start the reveal* in Compare is a slideshow for the call: the biggest debates (who picked which), who thinks most alike, then each person's champion one at a time with its preview playing, and finally the group's champion. Each slide waits for Space or a tap.

## Hosting it (free)

The site is static files on **GitHub Pages**. Accounts and shared data live in **Firebase** on its free Spark plan, which never asks for a card. Lineups come from your own Claude chat, so nothing here costs money. The free Firestore quota is tens of thousands of reads and writes a day, far more than a group of friends uses.

One-time setup, about 10 minutes:

1. **Create a Firebase project.** Go to [console.firebase.google.com](https://console.firebase.google.com), click *Create a project*, and skip Google Analytics.
2. **Add a web app.** In *Project settings > General > Your apps*, click the `</>` icon, register an app (no Firebase Hosting needed), and copy the `firebaseConfig` values into [`config.js`](config.js) in place of `firebase: null`.
3. **Turn on sign-in.** *Security > Authentication* in the left menu (or [this link](https://console.firebase.google.com/project/_/authentication/providers)), then *Get started > Sign-in method*: enable **Google** and **Anonymous** (Anonymous is the "join with just your name" option).
4. **Allow your site's address.** *Authentication > Settings > Authorized domains*: add `erf4ngh.github.io`.
5. **Create the database.** *Databases & Storage > Firestore* (or [this link](https://console.firebase.google.com/project/_/firestore)), then *Create database*, pick a location near you, start in production mode. Then open the *Rules* tab, replace everything with the contents of [`firestore.rules`](firestore.rules) and click *Publish*.
6. **Turn on GitHub Pages.** In this repo's *Settings > Pages*, set *Source* to **GitHub Actions**. Every push to `main` then deploys through [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

If you change `firestore.rules` later, paste it into the console again, or run `npx firebase-tools deploy --only firestore:rules --project <your-project-id>`.

The Firebase config values in `config.js` are meant to be public. What protects the data is `firestore.rules`: everyone signed in can see brackets, picks and names; people can only change their own picks, notes and name; notes are readable only by their owner; only admins can make brackets; and whoever made a bracket (or an admin) can edit or delete it.

### Where the music comes from

Cover art and previews are looked up in the browser, with no keys or accounts: first Apple's [iTunes Search API](https://performance-partners.apple.com/search-api), then [Deezer](https://developers.deezer.com/api) for songs Apple's search leaves out (it skips songs that only exist in an explicit version). The only thing sent is the artist and song names. Results are cached in each person's browser. Previews are the 30-second clips those services publish; songs neither one has just show without a cover. Deezer's API is read with JSONP (a script tag), the way its docs describe for browsers.

### Who can make brackets

Admins are Google accounts listed as SHA-256 hashes of their lowercased email, so the addresses aren't published in this public repo. The list is in two places that must match: `admins` in [`config.js`](config.js) shows the *New bracket* button, and `isAdmin()` in [`firestore.rules`](firestore.rules) is what the database actually enforces. To add someone, hash their address and add it to both:

```bash
printf '%s' 'friend@gmail.com' | shasum -a 256
```

Gmail ignores dots, but the address Google reports keeps whichever form the account uses, so add both forms if unsure. Admins can also delete any bracket.

## How it's built

No build step. The site is these files:

| File | What it is |
| --- | --- |
| [`index.html`](index.html) | The whole app: HTML, CSS and JavaScript |
| [`config.js`](config.js) | Your Firebase settings (`firebase: null` keeps everything in the browser) |
| [`firestore.rules`](firestore.rules) | Who can read and write what |
| `og.png` | The preview image shown when the link is pasted into a chat |

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

A many-artist bracket uses the same shape. The color groups in `albums` are the artists, and each song carries its own album and year:

```jsonc
{
  "kind": "mix",
  "artist": "B-Tier Rappers",          // the bracket's name
  "theme": "B-tier rappers who still drop music",
  "size": 64, "per": 4, "solo": true,  // per = songs per artist
  "albums": [{ "name": "Pusha T", "year": null, "color": "#2F54EB" }],
  "songs": [{ "t": "If You Know You Know", "a": 0, "seed": 1, "al": "Daytona", "y": 2018 }], // seed = rank among that artist's songs
  "seeding": "grouped" | "shuffled"    // grouped: each artist's songs fill one block of `per` slots
}
```

After an edit, a bracket also has `rev` (bumped on each edit that changes a song), `updatedAt`, `updatedBy`, and on each song whose slot changed, `r`: the rev of that change. Picks saved with an older `rev` drop any pick from a match that involves a slot with a newer `r`. If the size changed, `reset` holds the rev, and older picks start over.

`picks/<userId>`

```jsonc
{ "b": { "<bracketId>": { "w": [0, 3, null, ...], "done": false, "updatedAt": 1759600000000, "rev": 0 } } }
```

`w` has `size - 1` entries. Matches are numbered round by round. Match `i` of round `r` is fed by matches `2i` and `2i+1` of round `r-1`. Each entry is the winning slot index, or `null` if that match hasn't been picked yet.

`notes/<userId>` (readable only by that person)

```jsonc
{ "b": { "<bracketId>": { "<song slot>": "Love the outro" } } }
```

`users/<userId>`

```jsonc
{ "name": "Alice", "avatarUrl": "https://…" } // avatarUrl is "" for name-only accounts
```

[`seed/travis-scott.json`](seed/travis-scott.json) is a sample Travis Scott bracket in this shape.
