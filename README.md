# docmayscience.com

Personal site for Dr. Joseph May (@docmayscience) — high school chemistry teacher,
computational chemistry PhD, and builder of classroom apps and games.

Retro 70s science aesthetic: grape purple, harvest gold, burnt orange, aged paper,
slab buttons, and a Bohr-atom hero.

## Project structure

```
docmayscience/
├── index.html          Homepage (hero, apps, resources, about)
├── css/
│   └── styles.css      All site styles — design tokens live in :root at the top
├── js/
│   ├── main.js         Parallax scroll, random Bohr-atom hero, periodic table modal (respects prefers-reduced-motion)
│   └── elements.js     Periodic table data, all 118 elements — generated from Bowserinator/Periodic-Table-JSON (CC BY-SA 3.0); regenerate rather than hand-edit
├── assets/
│   ├── favicon.svg     Browser tab icon (dms monogram)
│   └── logo/
│       ├── dms-logo.svg          Vector master — scales to any size
│       ├── dms-logo-512.png      Transparent PNG for watermarks/overlays
│       └── dms-profile-800.png   Square profile picture for social accounts
├── scripts/
│   └── gen-elements.js Regenerates js/elements.js from its upstream dataset (node scripts/gen-elements.js)
├── package.json        npm scripts: dev server + lint/link checks
├── .htmlvalidate.json  HTML validation config
├── .vscode/tasks.json  Auto-starts dev server on folder open
└── .github/workflows/
    ├── deploy.yml      Deploys main to GitHub Pages on push
    └── ci.yml          HTML + link checks on every pull request
```

## Editing the site

- **Colors**: every brand color is a CSS variable in `:root` at the top of
  `css/styles.css`. Change once, applies everywhere.
- **Apps & games**: each project is an `<article class="tile">` in the
  `#apps` section of `index.html`. Copy a tile to add a new one; point the
  Launch button `href` at the live URL.
- **Teaching resources**: each `res-card` in `#resources` has an
  "Open in Drive" button — set its `href` to a shared Google Drive link.
- **Contact**: swap the placeholder in the footer `mailto:` link.
- **Icons**: use Font Awesome — see [Icons](#icons) below.

## Icons

Icons come from a Font Awesome **Kit**, loaded once in the `<head>` of each page:

```html
<script src="https://kit.fontawesome.com/2128c059e7.js" crossorigin="anonymous"></script>
```

The kit serves a single family — **Slab Duo** — so every icon uses the
`fa-slab-duo` prefix and nothing else:

```html
<i class="fa-slab-duo fa-envelope" aria-hidden="true"></i>
```

- Use `fa-slab-duo` on its own; a weight class (`fa-solid`, `fa-regular`) is
  redundant here.
- Any other prefix renders as an **empty square** — Font Awesome's placeholder
  for an icon that isn't in the kit. A box where an icon should be means the
  prefix is wrong, not that the kit failed to load.
- Mark decorative icons `aria-hidden="true"`; give meaningful ones a text label.
- Browse names at [fontawesome.com/icons](https://fontawesome.com/icons) with the
  style filtered to **Slab Duo**.

The kit renders client-side, so `npm run lint` can't confirm an icon displays —
preview with `npm run dev` to check. Authorized domains are `localhost:5500`
(dev) and `docmayscience.com` (prod); add `www.docmayscience.com` in the kit
settings if the `www` host ever serves pages directly.

> **Preview on `localhost`, not `127.0.0.1`.** The kit treats them as different
> origins and only `localhost` is authorized — on `http://127.0.0.1:5500/` the
> kit is blocked and every icon silently disappears. `npm run dev` is pinned to
> `--host=localhost` so it opens the right origin automatically.

## Growing the site

As the portfolio expands, suggested conventions:

- New pages (e.g. `apps.html`, `resources.html`) go in the project root and
  share `css/styles.css`.
- Page-specific styles get their own file (e.g. `css/apps.css`) linked after
  the shared stylesheet.
- Images and downloads go under `assets/` in a folder per category
  (e.g. `assets/screenshots/`, `assets/downloads/`).
- Keep paths **relative** (no leading `/`) so the site works both at
  `jwmay.github.io/docmayscience/` and at the custom domain root.

## Development workflow

`main` is production — every push to it deploys to docmayscience.com via
GitHub Actions (`.github/workflows/deploy.yml`). Day-to-day work happens on
the `dev` branch:

```bash
git checkout dev          # work here, never directly on main
# ...edit, commit as often as you like...
git push                  # backs up dev to GitHub (does NOT deploy)
```

When a batch of work is ready to go live, open a pull request from `dev`
into `main`:

```bash
npm run release   # opens the PR (uses commit messages for title/body)
```

CI (`.github/workflows/ci.yml`) validates the HTML and checks internal
links on every PR. Merge the PR on GitHub (use "Create a merge commit",
and don't delete the dev branch) and the site deploys automatically.
After merging, sync your local branches:

```bash
npm run sync      # main: pull the merge; dev: catch up to main; push
```

Both are also VS Code tasks: **Terminal → Run Task → "Release: open PR"**
or **"Sync branches (after PR merge)"**.

### Claude Code slash commands

Project commands in `.claude/commands/` (type them in any Claude Code
session opened in this folder):

| Command | Does |
|---|---|
| `/ship [title] [auto]` | The whole release: check → commit → PR → CI → merge (asks first unless `auto`) → sync → verify live |
| `/wip [message]` | Commit + push a checkpoint to dev — no PR, no deploy |
| `/sitrep` | Status report: branches, unshipped work, PRs, CI, latest deploy, site up? |
| `/add-app <name> <url>` | Scaffold a new app tile in `#apps`, matching the existing markup and voice |

## Local preview (live reload)

One-time setup: `npm install`. Then:

```bash
npm run dev        # serve at http://localhost:5500, auto-reload on save
npm run dev:quiet  # same, but don't auto-open a browser tab
```

Opening the project in VS Code auto-starts the dev server
(`.vscode/tasks.json`, runs on folder open — VS Code asks once to
"Allow Automatic Tasks"). It's also the default build task
(**Cmd+Shift+B**).

## Quality checks

The same checks CI runs on PRs, runnable locally:

```bash
npm run lint    # html-validate on all root-level pages
npm run links   # linkinator: catches broken internal links/images
npm run check   # both
```

External (`https://…`) links are deliberately skipped so checks never fail
because someone else's site is down.
