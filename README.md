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
│   └── main.js         Parallax scroll effects (respects prefers-reduced-motion)
└── assets/
    ├── favicon.svg     Browser tab icon (dms monogram)
    └── logo/
        ├── dms-logo.svg          Vector master — scales to any size
        ├── dms-logo-512.png      Transparent PNG for watermarks/overlays
        └── dms-profile-800.png   Square profile picture for social accounts
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

## Deploying

Hosted on GitHub Pages, deployed from the `main` branch root.

```bash
git add .
git commit -m "Describe the change"
git push
```

Changes go live at the custom domain about a minute after pushing.

## Local preview

Just open `index.html` in a browser — no build step, no dependencies.
For a proper local server (better mirrors production paths):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
