# WORKFLOW.md

A quick "coming back after a while" cheat-sheet for **docmayscience.com**.
For the full story — project structure, editing conventions, icon rules —
[README.md](README.md) is the source of truth; this file just jogs the memory.

---

## The one rule

**Never commit to `main`.** `main` is production and auto-deploys to
docmayscience.com. Do all work on **`dev`** and ship via a pull request.

```bash
git checkout dev     # always work here
```

---

## The daily loop

1. **Edit** on `dev`.
2. **Preview** live: `npm run dev` → open **http://localhost:5500/**
   (use `localhost`, *not* `127.0.0.1` — the icon kit only authorizes
   `localhost`, and on the wrong origin every icon silently vanishes).
3. **Check** before you stop: `npm run lint` (or `npm run check` for lint +
   links). CI runs the same on every PR.
4. **Checkpoint** anytime: `/wip` — commits everything on `dev` and pushes.
   No PR, no deploy. A safe "save my place" button.
5. **Release** when a batch is ready: `/ship` — the whole pipeline.

---

## Slash commands (type in Claude Code, opened in this folder)

| Command | Args | What it does |
|---|---|---|
| `/ship` | `[title] [auto]` | Full release: check → commit → PR → CI → merge (asks first unless `auto`) → sync → verify live |
| `/wip` | `[message]` | Commit + push a checkpoint to `dev` — **no** PR, **no** deploy |
| `/sitrep` | — | Status report: branch, unshipped work, open PRs, CI, latest deploy, is the site up |
| `/add-app` | `<name> <url> [desc]` | Scaffold a new app tile in `#apps`, matching the existing markup + voice |

**Away for a while? Start with `/sitrep`** to see where things stand.

Generally useful (not project-specific):
- `/code-review [low\|medium\|high]` — review the current diff for bugs +
  cleanups. `/code-review ultra` is a deep multi-agent cloud review (billed,
  you trigger it — I can't).
- `/verify` or `/run` — drive the site in a browser to confirm a change works.

---

## npm scripts

```bash
npm run dev        # live-reload server at http://localhost:5500 (opens a tab)
npm run dev:quiet  # same, no auto-open
npm run lint       # html-validate on *.html + */index.html
npm run links      # linkinator — catches broken internal links/images
npm run check      # lint + links (what CI runs)
npm run release    # open the dev → main PR (gh pr create --fill)
npm run sync       # after a PR merges: pull main into dev, push
```

---

## Releasing by hand (if not using `/ship`)

```bash
npm run check      # must pass
git add -A && git commit -m "..."   # on dev
git push
npm run release    # opens the PR
# → merge on GitHub with "Create a merge commit"; DON'T delete dev
npm run sync       # catch local branches up to the merge
```

`main` merging triggers `.github/workflows/deploy.yml` → live on
docmayscience.com in a minute or two.

---

## Gotchas that bite

- **Relative paths only** (no leading `/`) so the site works at both the
  GitHub Pages path and the custom domain root.
- **Colors live in `:root`** at the top of `css/styles.css` — change tokens
  there, never inline.
- **Icons = Font Awesome Slab Duo only.** Every icon is `fa-slab-duo fa-...`
  and nothing else.
  - An **empty box** = wrong prefix (used `fa-solid`/`fa-regular`/etc.).
  - **Invisible blank space** = that icon name isn't in the Slab Duo family;
    pick another. Always eyeball new icons in the browser on `localhost`.
- `www.docmayscience.com` is **not** kit-authorized (only the apex + localhost).

---

## Adding content (the common tasks)

- **App / game tile** → `/add-app <name> <url>`, or copy an
  `<article class="tile">` in `index.html` `#apps`.
- **Cover art** → copy an `<article class="art-plate">` in
  `cover-art/index.html`; put the image in `assets/cover-art/` (optimized
  display JPEG as the `<img>` src + a full-res original for the download link).
  See the README "Cover art" bullet.
- **Web design** → copy an `<article class="site-plate">` in
  `web-design/index.html`; screenshot the live site into `assets/web-design/`
  (headless Chrome at `1440×900`, then `sips -Z 1240` to an ~80%-quality JPEG).
  See the README "Web design" bullet.
- **Teaching resource** → swap a `#resources` `res-card` badge for an
  "Open in Drive" button when its Drive folder is shared.
