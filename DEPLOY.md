# warriorintelligenceproject.org: how this site is built and shipped

## What lives where

| Thing | Where |
|---|---|
| Source of truth for the site | **This folder.** `index.html`, `values.html`, `wip_site_images/`, `wip_site_video/`, `robots.txt`, `sitemap.xml` |
| Live host | **Netlify.** `www` CNAMEs to `comforting-melba-5055cf.netlify.app`; apex resolves to Netlify (75.2.60.5) |
| Change log | **Git**, in this folder |
| Source of truth for every published number | `wip-source-of-truth-figures.md` in the Strategic Communications project |

`wip-site.vercel.app` is a **separate, older copy** deployed from `github.com/JayAces/wip-site`. It is not what the domain serves. Do not treat it as current.

## How this folder came to be the source

Before September 6, 2026 the live site existed only as a Netlify deployment. It was not in any repo and not on this machine. The GitHub repo held an older, different version. The first commit here captures the live production HTML exactly as it was being served, so that from this point forward the folder, the log, and the live site cannot drift apart again.

## The update loop

1. Edit `index.html` / `values.html` in this folder.
2. `git add -A && git commit -m "what changed and why"`
3. Ship to Netlify (see below).

Never edit the live site through a host UI. If it happens, pull the served HTML back into this folder and commit it before making further changes, or the next deploy silently reverts it.

## Shipping

Pick one and stay with it.

**A. Connect Netlify to GitHub (recommended).** Push this repo, then in Netlify: Site configuration, Build & deploy, link the repository. Publish directory `.`, no build command. After that, `git push` is the deploy, and every live change has a commit behind it.

**B. Netlify CLI from this folder.**
```
npm i -g netlify-cli
netlify login
netlify link          # once, to the existing site
netlify deploy --prod --dir=.
```

**C. Manual upload.** Drag this folder onto the Netlify deploys page. Works, but nothing enforces that what you dragged matches what is committed.

## Before every deploy

- [ ] Numbers match `wip-source-of-truth-figures.md`
- [ ] `grep -c "—" index.html values.html` returns 0 on both, and `grep -c "&mdash;"` too
- [ ] Every Warrior quote is verbatim from the tracker's "Comments or concerns" field
- [ ] `wip_site_images/og-image.jpg` still exists. It is referenced by Open Graph and Twitter tags, and it was missing from the repo once already
- [ ] `/values` still resolves

## Refreshing the figures

The tracker is live data, so the numbers move. To refresh: export the Crisis Tracker, recompute, update both HTML files and `wip-source-of-truth-figures.md` together, commit, deploy.

Geography is derived from two signals and nothing else, because submissions are anonymous: the hospital a Warrior names, and the area code or country code of the number they give for check-ins. Neither alone is sufficient. Take the union.
