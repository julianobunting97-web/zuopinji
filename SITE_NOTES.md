# Light Portfolio Website

The working website remains in the repository root (React + Vite). The PDF
portfolio is separate and was not changed during the light-theme redesign.

- Theme tokens: `src/styles.css`; editorial theme: `src/light-theme.css`.
- Existing artwork, hero video, Anurati heading, full-resolution image viewer,
  project details, Bilibili embeds, and contact information are preserved.
- `scripts/prepare-web-previews.cjs` accepts a Sharp module path as its first
  argument. It creates WebP display copies without modifying original images.
- `scripts/check-light-site.cjs` accepts a Playwright module path as its first
  argument. It checks three viewport sizes and existing gallery interactions.
- Preview server: `node preview-server.cjs`, serving `dist` at port 4173.
  Run `npm run build` after edits. Do not open preview windows automatically.

## People's Park project

Added `2026-10-25` at `/projects/people-park`, with its card first in Featured
Projects. Content is in `src/data/peoplePark.js`: two final portrait boards,
26 design renderings, 13 plans/analysis images, and a 64-second local video.
The original source is `E:\桌面\作品集作品素材合集\人民公园`; reference-case
photos in its `临安人民公园` folder are excluded. Image display copies and
full-resolution WebP versions live in `public/portfolio/people-park`; the
source files are unchanged. `scripts/prepare-people-park.cjs` regenerates the
image assets and verifies source hashes and full-resolution pixel dimensions.
The video is H.264/AAC, 1920 × 1080, with fast-start metadata.

This addition updates the local website. Online publication requires the
user's confirmation under their external-action instructions.

## Interior project additions (2026-10-25)

- `/projects/single-apartment`: adds two full-frame white-model / AI-render
  comparisons before the existing gallery, plus four floor-plan/material
  diagrams. Its description follows the source `设计说明.txt`.
- `/projects/family-home`: adds nine floor-plan/material diagrams and the
  original presentation board after the gallery.
- The shared project cards link directly to the relevant new sections. Project
  anchors wait for fonts and React content before positioning the page.
- Data: `src/data/interiorUpdates.js`; comparison layout:
  `src/components/RenderProcess.jsx`. The images use the existing zoom viewer.
- `scripts/prepare-interior-updates.cjs` compares sources under
  `E:\桌面\作品集作品素材合集` to existing assets. All 14 existing renderings
  match their source hashes; 16 images were added. Copies match source hashes,
  full-size WebP dimensions are preserved, and source files are unchanged.
- These changes are local and have not been published online.

## Sites Publication

Use `.sites-release` as the isolated Sites checkout. Its manifest and Git history
belong to the private Site `appgprj_6ab38027664c8191b93fa378a6baab0e`.
Do not register another Site. Do not push the main repository to the Sites remote:
it contains unrelated PDF outputs, temporary files, and the original Git history.

Synchronize only website source, public assets, dependency manifests, entry HTML,
and Vite configuration into `.sites-release` before publishing. Its static
configuration enables SPA fallback for `/projects/...` links. Keep PDF assets,
review screenshots, dependencies, credentials, and temporary artifacts out of
the published source. Obtain temporary credentials through the Sites connector
and pass them only on stdin to the bundled workflow; never save them in files.

The mobile-optimized site was published privately on 2026-09-23:
https://cao-shuo-spatial-portfolio.julianobunting97.chatgpt.site
The published Sites source commit is `cc511e30d98086813bc8aea04924b321a752503f`.
Deployment `appgdep_6ab3a63f08bc8191bb3b3cf293e587fe` succeeded. Mobile checks
passed at 390, 360, and 320 CSS pixels; desktop and gallery interaction checks
also passed. Local preview remains available at http://localhost:4173/.

The 117 MB local archive upload timed out, so publication used the existing
remote source and Sites remote build. Keep `package-lock.json` resolved URLs on
the official npm registry; the mirror URLs caused a failed remote build. For
future updates, reuse the existing Site and release checkout, push the exact
source commit, then publish a new private version and verify deployment status.

## Sites synchronization (2026-10-27)

GitHub/Cloudflare and the GPT Sites publication use separate source repositories.
Pushing GitHub does not update the GPT Site. Retain the existing Sites project
and its current audience; the live access response on this date is public.

`node scripts/sync-sites-mobile.cjs .sites-release` now includes project videos,
native video posters and the Pages asset checker. It validates matching full-size
and preview images without assuming the old fixed total of 70 images. The latest
copy includes 128 full-size images, 129 previews, one project video and three
native posters. The 279-file Sites build passed size checks; its application
bundle matches the current root build. Existing artwork and profile updates,
People's Park, apartment AI-render comparisons and family-home analyses are included.

Sites source `829e4ae5c9c9f139623453e12a51081beebbb802` has the same tree as the
verified full update checkpoint. It was pushed in nine bounded batches after a
single large push exceeded the source server's receive-pack limit. Version 4
was saved with the matching local archive. The isolated checkout and prior source
bundle are preserved; the backup is under
`E:\CodexData\backups\portfolio-website\sites-sync-20261027`.
