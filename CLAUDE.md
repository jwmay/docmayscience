# CLAUDE.md

Guidance for Claude Code working in this repo. For full project structure,
editing conventions, and the release workflow, read **[README.md](README.md)** —
it is the source of truth and this file does not repeat it.

## What this is

Personal static site for Dr. Joseph May (@docmayscience) — one `index.html`,
shared `css/styles.css`, a little `js/main.js`. No framework, no build step.
Deployed to **docmayscience.com** via GitHub Pages.

## Guardrails

- **Never commit directly to `main`.** `main` is production and auto-deploys.
  Work on `dev`; ship via a PR (`/ship`, or `npm run release`).
- **Keep asset/link paths relative** (no leading `/`) so the site works at both
  `jwmay.github.io/docmayscience/` and the custom domain root.
- **Run `npm run lint` before finishing** any HTML change (CI runs `npm run check`
  = lint + link-check on every PR).
- **Design tokens live in `:root`** at the top of `css/styles.css` — change a
  color there, not inline.
- Prefer the project slash commands over raw git: `/ship`, `/wip`, `/sitrep`,
  `/add-app` (see the table in the README).

## Icons — Font Awesome Kit (read before adding any icon)

Icons come from a Font Awesome **Kit** (ID `2128c059e7`), loaded once via a
script tag in the `<head>` of each page:

```html
<script src="https://kit.fontawesome.com/2128c059e7.js" crossorigin="anonymous"></script>
```

**This kit serves ONE family: Slab Duo.** Every icon must use the `fa-slab-duo`
prefix and nothing else:

```html
<i class="fa-slab-duo fa-envelope" aria-hidden="true"></i>
```

- Use `fa-slab-duo` **alone** — do **not** add a weight class (`fa-solid`,
  `fa-regular`); it's redundant here.
- Any other prefix — `fa-solid`, `fa-regular`, `fa-brands`, plain `fa-slab`, or
  `fa-duo fa-slab` — renders as an **empty square** (Font Awesome's missing-icon
  placeholder), because those styles aren't in the kit. **An empty box in place
  of an icon means the class prefix is wrong**, not that the kit failed to load.
- **Slab Duo covers only a subset of the icon library.** An icon name the family
  lacks (e.g. `fa-shuffle`, `fa-dice`, even `fa-atom`) renders as **invisible
  blank space** — correct width, no glyph, not even the placeholder square.
  Known-good names in use: `fa-envelope`, `fa-arrows-rotate`. Verify any new
  icon name in a rendered browser (see below) before shipping it.
- Decorative icons: add `aria-hidden="true"`. Meaningful icons: give them a
  visible or visually-hidden text label.
- Browse icon names at fontawesome.com/icons (filter the style to **Slab Duo**).
- Kit domain allowlist currently authorizes `localhost:5500` (dev) and
  `docmayscience.com` (prod). `www.docmayscience.com` is **not** yet authorized —
  add it in the Kit settings if `www` ever serves pages directly.

## Verifying a rendered icon

The kit renders client-side, so `html-validate` can't confirm an icon shows.
To actually see it: `npm run dev:quiet`, then load `http://localhost:5500/`
(that origin is kit-authorized). A headless screenshot works too — render
against `localhost:5500`, not a `file://` path, or the kit's origin check fails.
Headless Chrome must also **spoof a normal user-agent** (`--user-agent="Mozilla/5.0
(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)
Chrome/126.0.0.0 Safari/537.36"`) — with the default `HeadlessChrome` UA the kit
script never runs and every icon is invisible blank space.

**Use `localhost`, not `127.0.0.1`.** They are different origins to the kit, and
only `localhost:5500` is on the allowlist — loading `http://127.0.0.1:5500/`
returns 403 for the kit and **all icons silently vanish** (no box, nothing).
The `dev`/`dev:quiet` scripts are pinned to `--host=localhost` for this reason;
if you reach the site via `127.0.0.1`, add it to the kit's authorized domains.
