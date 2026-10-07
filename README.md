# Track Bracket

Pick an artist, get a seeded song bracket, fill it out song vs song, then compare everyone's picks on the call.

Live app: https://claude.ai/artifact/S14pj7wzFEC57eDLABTmv8 (private; share it from the page's Share menu and give friends edit access)

## What it does

- **Build** – type an artist and choose 16, 32 or 64 songs. Claude picks songs from across their albums and singles, ranks them, and seeds the bracket so #1 and #2 can only meet in the final. You can remove, swap, add or drag to reorder songs before it goes live, or paste your own list (`Song - Album`, one per line).
- **Pick** – one matchup at a time, with Spotify / YouTube / Apple Music links on each song, progress by round, who the winner plays next, and a grid to jump to any match. Use ← / → to pick and S to skip.
- **Bracket** – the full two-sided bracket, fit to the screen or at full size, with a switcher for friends' brackets. Changing an early pick clears later picks that depended on it.
- **Compare** – who's done, the group's champion vote, how closely each friend's picks match yours, group standings and the first-round matchups where people disagreed. Other people's picks stay hidden until you finish yours.
- **Listen** – the track list grouped by album, with a copy button for playlist importers like TuneMyMusic or Soundiiz.

## How it's built

The whole app is one file, [`index.html`](index.html): plain HTML, CSS and JavaScript with no build step. It's kept in Artifact source form, so there are no `<!doctype>`, `<html>`, `<head>` or `<body>` tags of its own. The Artifact publisher adds that shell, so don't add one here or the page ends up wrapped twice.

It runs as a claude.ai Artifact and uses these Artifact runtime capabilities:

| Capability | Used for |
| --- | --- |
| `db` | Shared brackets (`brackets/<id>`) and each person's picks (`picks/<userId>`) |
| `user` (`profile` scope) | Names and avatars in Compare |
| `sample` | Asking Claude to build the song lineup |

Database access rules: everyone can read, anyone with edit access can create brackets, and each person can only write their own `picks/<theirId>` doc:

```json
[
  { "path": "picks", "read": "view", "write": "owner" },
  { "path": "picks/{self}", "write": "interact" }
]
```

### Data shapes

`brackets/<id>`

```jsonc
{
  "artist": "Travis Scott",
  "size": 32,
  "albums": [{ "name": "Rodeo", "year": 2015, "color": "#1F2026" }],
  "songs": [{ "t": "Antidote", "a": 0, "seed": 4 }], // in slot order, top-left to bottom-right
  "seeding": "seeded" | "shuffled" | "custom",
  "source": "claude" | "manual" | "import",
  "createdBy": "<user id> | null",
  "createdAt": 1759600000000
}
```

`picks/<userId>`

```jsonc
{ "b": { "<bracketId>": { "w": [0, 3, null, ...], "done": false, "updatedAt": 1759600000000 } } }
```

`w` has `size - 1` entries. Matches are numbered round by round. Match `i` of round `r` is fed by matches `2i` and `2i+1` of round `r-1`. Each entry is the winning slot index, or `null` if that match hasn't been picked yet.

[`seed/travis-scott.json`](seed/travis-scott.json) is the original Travis Scott template, stored as `brackets/travis-scott`.

## Running it outside claude.ai

Open `index.html` in a browser. Without the Artifact runtime the app runs in local mode:

- Brackets and picks are saved in `localStorage` only.
- Nothing is shared.
- You build brackets by pasting a song list, since there's no Claude to generate one.
