# warriorintelligenceproject.org: how this site is built and shipped

## What lives where

| Thing | Where |
|---|---|
| Source of truth for the site | **This folder.** `index.html`, `values.html`, `warrior-er-guide.html`, `wip_site_images/`, `wip_site_video/`, `robots.txt`, `sitemap.xml` |
| Live host | **Netlify**, project `wipv1`, connected to GitHub repo `JayAces/wip-site` (branch `main`). Publish directory `.`, no build command. |
| Change log | **Git**, in this folder |
| Source of truth for every published number | `wip-source-of-truth-figures.md` in the Strategic Communications project |

`wip-site.vercel.app` is an older copy deployed from the same GitHub repo. It is not what the domain serves. Do not treat it as current.

## How shipping works

**`git push` to `main` is the deploy.** Netlify builds from GitHub, so anything that lands on `main` goes live on the domain, whichever tool or person pushed it. There is no separate deploy step, and `netlify deploy` is not needed.

Because of that:

- Read `wip-source-of-truth-figures.md` before changing any number.
- Do not let any tool push to `main` without reviewing its diff first.
- Never edit the live site through a host UI. If it happens, pull the served HTML back into this folder and commit it before making further changes, or the next push silently reverts it.

## The update loop

1. Edit the HTML in this folder.
2. Run the checks below.
3. `git add <the files you changed>` (avoid `git add -A`, which can sweep in secrets and line-ending noise)
4. `git commit -m "what changed and why"`
5. `git push`. Netlify publishes in about a minute.

If the push is rejected because the remote is ahead, fetch and read `git log main..origin/main` first. Do not force-push.

## Secrets

`.env.local` holds secrets. It is listed in `.gitignore` and must never be committed or pushed. Before every commit, `git status` must not list it. `.netlify/` (local link data) is ignored too.

## Before every push

- [ ] Numbers match `wip-source-of-truth-figures.md`, with numerator, denominator and snapshot date
- [ ] `grep -c "—" index.html values.html warrior-er-guide.html` returns 0 on each, and `grep -c "&mdash;"` too
- [ ] Every Warrior quote is verbatim from the tracker's "Comments or concerns" field
- [ ] `wip_site_images/og-image.jpg` still exists. It is referenced by the Open Graph and Twitter tags in `index.html`, and it was missing from the repo once already
- [ ] `wip_site_video/showreel-*` files exist and `SHOWREEL_YOUTUBE_ID` in `index.html` is `CIRMoSKTqUg`
- [ ] `/values` still resolves

## Refreshing the figures

The tracker is live data, so the numbers move. To refresh: export the Crisis Tracker, recompute, update `index.html`, `values.html`, `warrior-er-guide.html` and `wip-source-of-truth-figures.md` together, then commit and push. The stats strip, data cards, meta descriptions, FAQ JSON-LD and the "Figures as of" snapshot line all carry figures.

Geography is derived from two signals and nothing else, because submissions are anonymous: the hospital a Warrior names, and the area code or country code of the number they give for check-ins. Neither alone is sufficient. Take the union.

## Line endings

On Windows, Git may report `CLAUDE_CODE_HANDOFF.md`, `quick-er-card.html` and `vercel.json` as modified when only the line endings differ. That is noise. Leave them uncommitted.

## Internal documents

Internal planning documents (for example the Growth Blueprint, `game-plan-v2.html`) do not belong in this folder, because everything here is public once pushed. It was moved to `_archive/` on September 30, 2026, which is git-ignored.
