---
description: Add a new app/game tile to the homepage #apps section
argument-hint: <app name> <live URL> [short description]
allowed-tools: Bash(git:*), Bash(npm:*), Bash(curl:*)
---

Add a new project tile to the `#apps` section of `index.html`.
$ARGUMENTS should contain the app name, its live URL, and optionally a short
description — ask (AskUserQuestion) for anything missing or unclear.

1. Confirm the current branch is `dev`; if not, stop and tell the user.
2. Read the existing `<article class="tile">` blocks in the `#apps` section
   of index.html and copy their structure exactly — same classes, same
   element order, same button markup.
3. Write the tile copy in the site's existing voice (playful, retro-70s
   science — read the neighboring tiles first and match their tone and
   length). Point the Launch button `href` at the live URL. If the URL's
   domain differs from docmayscience.com, add `target="_blank"
   rel="noopener noreferrer"` so it opens in a new tab.
4. Run `npm run check` — it must pass.
5. Remind the user to eyeball it at http://localhost:5500 (live-reload
   server), and wait for their go-ahead if they want tweaks.
6. Commit on dev with a message like "Add <name> tile to apps". Do NOT
   release — the user ships with /ship when ready.
