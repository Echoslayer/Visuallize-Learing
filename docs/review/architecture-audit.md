# Architecture Audit

Date: 2026-06-19

Scope: repo-wide scan for over-complexity, duplicate components, unused files, and reinvented wheels. This is not a correctness or security review.

## Summary

The architecture is mostly lean. The engine/content split is doing real work, the route layer is intentionally minimal, and the small assert-based checks match ADR-0010. The main cleanup opportunities are stale assets/data and one unused dependency.

## Findings

1. `delete:` Remove `three-bvh-csg` from `package.json` until code imports it. It appears only in docs/package metadata, not in `src/`; reinstall when a part actually needs CSG. [`package.json`](../../package.json)

2. `delete:` Drop legacy `explode.vector` from content JSON. ADR-0014 and `explodeOffset()` use automatic radial direction; 35 stale vectors remain across content files. Replacement: keep only `explode.magnitude`. [`src/content`](../../src/content)

3. `delete:` Remove unused Vite/template assets. `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, and `public/icons.svg` are unreferenced. Replacement: nothing. [`src/assets`](../../src/assets)

4. `delete:` Remove unused `src/App.css`. It is not imported; current app styling is inline plus `src/index.css`. Replacement: nothing. [`src/App.css`](../../src/App.css)

5. `delete:` Remove duplicate GLB copy in `docs/assets/Airplane.glb`. It is byte-identical to runtime asset `public/models/airplane.glb`; keep attribution/source notes in markdown, not a second binary. [`docs/assets/Airplane.glb`](../assets/Airplane.glb)

6. `shrink:` Merge the duplicated scene shell in `App.tsx` and `Gallery.tsx` only if it changes again. Both render `SceneRoot + Scene + Credits + DevHandle`; current duplication is tiny, so defer until the third route or another repeated edit. [`src/App.tsx`](../../src/App.tsx), [`src/gallery/Gallery.tsx`](../../src/gallery/Gallery.tsx)

7. `shrink:` Keep `DevHandle` as the single DEV harness handle. `Gallery` still exposes `window.__selection` separately for old specs; prefer `window.__view.selection` and delete the older alias after specs/tools stop naming it. [`src/gallery/Gallery.tsx`](../../src/gallery/Gallery.tsx), [`src/ui/DevHandle.tsx`](../../src/ui/DevHandle.tsx)

## Not Over-Engineered

- `zustand` stores are justified: R3F, DOM controls, hotkeys, and Playwright harness all touch shared runtime state.
- `leva` is justified by ADR-0009 and remains DEV-only through lazy loading.
- `parse-links.ts` is a small deliberate CSV parser with a named ceiling; no CSV dependency needed for the current data contract.
- `expand.ts` and `flow-dwell.ts` are pure functions with minimal assert checks; this follows the repo testing policy.

## Net

Possible cleanup: about -280 source/doc asset lines, -1 runtime dependency, and -4 unused/duplicate asset files. Biggest win is deleting stale `explode.vector` fields and unused template assets.
