# Analytics

Google Analytics 4 (GA4) reference for docmayscience.com — what's tracked, how,
and how to build the reports. All tracking lives in one file:
[js/analytics.js](../js/analytics.js), loaded **on the homepage only**
(`index.html`). The four app pages (`bohr/`, `pvd/`, `tscribe/`, `lewis-lab/`)
are intentionally **not** tracked.

## Property

| | |
|---|---|
| Measurement ID | `G-M1TZ9PBJRG` |
| Where it lives | [js/analytics.js](../js/analytics.js) — one place, top of the file |
| Scope | Homepage (`index.html`) only |

The Measurement ID is public by design (it ships in the client-side script).
To **turn tracking off**, set it back to the placeholder `G-XXXXXXXXXX` in
`js/analytics.js` — the file becomes a no-op (no network calls, no data).

## Events

Two custom events on top of GA4's automatic pageview:

| Event | Fires when | Parameters |
|---|---|---|
| `app_launch` | A **Launch** button in the `#apps` grid is clicked (fires on the homepage, before navigation — so it's captured even though the app pages aren't tracked) | `app_name` (tile heading, e.g. `Lewis:Lab`), `link_url` (full URL), `outbound` (`true` if the link leaves docmayscience.com — currently only Chem Cash) |
| `section_view` | A homepage `<section>` first scrolls into view (once per section per page view, via `IntersectionObserver`) | `section_name` — one of `apps`, `classroom`, `resources`, `about`, `publications` |

GA4 **Enhanced Measurement** is also on, so you get built-ins for free:
`page_view`, `scroll` (fires once at 90% page depth), outbound link clicks,
file downloads, etc.

## Custom dimensions

Event parameters don't appear in most reports until registered as custom
dimensions. Register these under **Admin → Data display → Custom definitions →
Create custom dimensions** (all **Event** scope):

| Dimension name | Event parameter | Purpose |
|---|---|---|
| `App name` | `app_name` | Break `app_launch` down by tool |
| `Section name` | `section_name` | Break `section_view` down by section |
| `Outbound` (optional) | `outbound` | Split app clicks into on-site vs. off-site |

⚠️ Custom dimensions are **not retroactive** — they only apply to data collected
after you save them.

## Report recipes

### Realtime sanity check (confirms it's working)

Open the live site, click a **Launch** button, scroll the homepage, then in
**Reports → Realtime** confirm `app_launch` and `section_view` appear (click
each to see its parameter value). Standard reports (Engagement → Events) lag a
few hours; Realtime is immediate.

### Free-form tables (Explore → Blank)

Set the filter by choosing the **Event name** dimension → *exactly matches* →
type the event value (works even before GA4 catalogues the event).

- **Scroll reach:** Rows = `Section name`, Values = `Total users`, filter
  `Event name = section_view`. Shows how many people reached each section.
- **App clicks:** Rows = `App name`, Values = `Event count`, filter
  `Event name = app_launch`. Shows which tools get opened.

### Section funnel (Explore → Funnel exploration)

Ordered drop-off from the top of the page to the bottom. Edit the steps
(pencil icon next to STEPS) and add five, each `section_view` with a
`section_name` parameter condition:

1. `apps` → 2. `classroom` → 3. `resources` → 4. `about` → 5. `publications`

Then toggle **Make open funnel ON**. This matters here: the homepage nav has
jump links (`#apps`, `#about`, …), so visitors can hit sections out of order —
an open funnel doesn't penalize that. For a plain "how many reached each
section" count, the Free-form table above is the more trustworthy number.

> The Funnel/Explore **event picker only lists events GA4 has already
> catalogued**, and that list refreshes ~once a day. A newly deployed event can
> show in Realtime immediately but not appear in the picker for up to ~24h. The
> Free-form table's typed filter sidesteps this.

## Changing what's tracked

Everything is in [js/analytics.js](../js/analytics.js):

- **Add/rename a section:** `section_view` auto-covers any `<section id="…">` on
  the homepage — the `section_name` is just the element's `id`.
- **New app tile:** `app_launch` auto-covers any `<a class="btn" href>` inside
  `#apps` — the `app_name` is read from the tile's `<h3>`.
- After editing, verify locally with `npm run dev` and ship via the normal
  dev → PR → main flow (see the [README](../README.md)).
