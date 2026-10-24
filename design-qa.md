# ClaimMe frontend verification

Review date: 24 October 2026. Scope: Evidence Atlas frontend with synthetic records. This report does not certify a live insurance service or backend security.

## Visual truth and evidence

- Selected source: `.local-design/concepts/evidence-atlas.png`, 897 × 1752 pixels. The image service did not deliver the requested native 1440px width.
- Implementation: production server at http://127.0.0.1:3200. Desktop CSS viewport 1440 × 1024, density approximately 1. Full capture: `verification/landing-desktop-final.png`, 1440 × 4158 pixels, made as one full-page CDP capture.
- Full comparison: `verification/design-comparison-final.png`. Source and implementation normalized to equal 720px widths, padded below the shorter source rather than stretched. Extra translation, policy and final-action sections are explicitly part of the approved implementation scope.
- Focused hero comparison: `verification/hero-comparison-final.png`. Corresponding top 1440px regions at the same normalized width were opened together and inspected for typography, spacing, color, artwork and copy. Focused inspection was necessary because the full-page view makes inspector text too small.
- Additional evidence: `verification/home-desktop-final.png`, `verification/evidence-desktop.png`, `verification/evidence-tablet.png`, `verification/settlement-desktop.png`, `verification/landing-3d-final.png`, `verification/landing-mobile-final.png` and `verification/home-mobile.png`.
- Reference state: light theme, initial date mismatch selected, synthetic CM-1024. Source text is original demo wording rather than an asserted live insurer statement.

## Findings and comparison history

1. Initial desktop comparison: the headline was undersized, an additional eyebrow displaced it vertically, and the evidence stage was too short. Increased desktop headline size to 92px, removed the extra eyebrow, and expanded the stage to 650px. The final focused comparison confirms the stronger hierarchy and proportions.
2. Initial 3D implementation: DOM labels in independent renderer roots caused React unmount warnings and inconsistent label visibility. Replaced them with source-label textures on functional document meshes and kept the equivalent HTML source controls. Corrected paper bevel thickness so labels are not occluded. Production 3D selection updates the inspector; subsequent console checks show no application errors.
3. Mobile inspection: hidden navigation remained exposed to keyboard/accessibility traversal, and line-break removal joined words in account headings. Closed drawers now use visibility hiding; open drawers support Escape, focus containment and focus return. Heading spaces are preserved. The final mobile view and navigation checks confirm the fixes.
4. Source navigation could preserve a stale comparison state across query changes. Document view state now remounts by source-query identity. Original source records and correction history remain separate.
5. A fixed desktop 3D camera could crop documents on small screens. Camera framing now responds to the canvas width. All four documents fit the tested 390px viewport; equivalent text controls and the contextual inspector remain visible.

No remaining actionable P0/P1/P2 findings were identified in the reviewed frontend scope.

## Intentional adaptations

Essential labels, citations and document controls are HTML rather than baked into artwork. The selected illustration establishes the default appearance; opt-in 3D provides actual raycast selection and constrained camera inspection. The settlement waterfall is a deterministic, selectable data visualization rather than a decorative raster chart. Missing privacy/security integrations are described honestly instead of repeating unsupported promises from a generated mockup.

Both generated assets are installed under `public/assets/`. No image placeholders remain. Geist fonts are served through Next.js font optimization; Phosphor supplies standard icons. The warm neutral/orange system is shared across the public site and workspace.

## Functional verification

- Loaded all 25 primary routes directly: global workspace surfaces, claim tabs, policy detail, settings, onboarding and account screens.
- Completed onboarding into the synthetic workspace. Account forms remain explicit demonstrations without credential transmission.
- Verified claim filtering and an empty search state; replay event selection and next-event navigation; early-event evidence isolation; policy answers with sources and the unavailable-answer path.
- Compared documents, entered a correction with native date/text controls, saved it, reloaded, and confirmed the corrected extraction alongside the unchanged source. Audit records preserve previous values and reasons.
- Selected deductions and checked the visible calculation. Exported and inspected a draft pack containing two supported questions, ten synthetic evidence entries, four communications, history and the 7,650,000-paise settlement. Customer statements and missing evidence remain labeled; no external submission occurred.
- Verified action review changes the shared navigation count. Reset the test edits through Settings and confirmed zero corrections/audit entries after reload. The handoff starts with clean synthetic data.
- Exercised 3D source selection through both actual mesh clicks and equivalent HTML controls. Back-to-artwork navigation works. Checked the final production console: no application errors observed.

## Responsive and accessibility checks

Tested 390px, 768px and 1440px CSS viewports. Main views fit without document-level horizontal overflow; claim tabs and document selectors use deliberate internal scrolling where appropriate. Inspected mobile home and landing layouts plus tablet comparison.

Verified keyboard drawer dismissal and focus return, visible focus styling, explicit field labels, source/action names and non-color status labels. Reduced-motion emulation sets scroll behavior to `auto` and transition durations to `0s`. A 720px effective viewport checks reflow equivalent to a 1440px display at 200%; browser-toolbar zoom and physical assistive technologies were not certified.

Sample token contrast ratios: main text 16.99:1, white on primary orange 5.28:1, muted text 5.79:1, warning badge 6.34:1, success badge 6.89:1. These are token checks, not a comprehensive accessibility audit.

## Engineering checks and remaining coverage

Formatting, ESLint, TypeScript, nine domain tests and production build pass. Tests cover settlement boundaries, temporal states, immutable corrections, supported grievance questions and repository migration/recovery/reset. Browser fixtures and exports contain synthetic data only. No commit or deployment was made.

Remaining coverage: physical touch devices, non-Chromium engines, full screen-reader evaluation, actual browser-toolbar zoom, exhaustive per-element contrast sampling and forced GPU/context-loss recovery. The in-app browser did not support the attempted WebGL fault-injection method; the renderer error boundary and static-image fallback are implemented, but forced creation failure/context loss was not verified. Live auth, uploads, OCR, AI, insurer integrations and external grievance submission are intentionally outside this frontend phase.

## Evidence background refinement — 24 October 2026

Scope: evolve the existing selected Evidence Atlas direction with a quiet architectural evidence background. The revised visual reference is `.local-design/evidence-atlas-refined.png`; the generated background is `public/assets/evidence-grid.png`. Existing paper artwork, claim content, routes, and interactions are retained.

Compared the revised reference and actual desktop capture together in `verification/redesign-comparison.png`, normalized to 720px widths without distorting either image. Checked headline hierarchy, background density, margin links, workbench framing, readable inspector, spacing and orange emphasis. The existing document artwork remains authoritative for the interactive landscape. The implementation uses four functional margin links rather than the reference's decorative third right-hand explanation tile; the insurer boundary statement remains under the actions. No blocking visual or usability issues remained in this scoped review.

Inspected the production frontend at 390 × 844, 768 × 1024 and 1440 × 1024. No document-level horizontal overflow observed. Mobile hides margin navigation while preserving the complete source controls in the atlas; inspector and source controls reflow vertically. Checked document selection updating the inspector and the new date-verification link opening the actual side-by-side comparison route. Keyboard navigation shows the shared orange focus outline on the new links. Reduced-motion emulation reports zero transition duration for those links. The background is static and contains no essential text. Final application console check returned no errors.

Proof: `verification/redesign-desktop-final.png`, `verification/redesign-mobile.png`, and the combined reference comparison. Formatting, lint, TypeScript, all nine domain tests, and production build passed after this refinement. Previous device, assistive-technology and GPU-failure coverage limitations still apply. Preview remains running locally; no deployment occurred.

## Reference fidelity correction — 24 October 2026

The user's explicit image attachment is now the visual target, rather than a loose inspiration. Read it successfully from its native Windows path; `.local-design/evidence-atlas-refined.png` is the local copy. The preceding review accepted differences that the user wanted corrected.

Replaced the landscape and hero background with reference-derived assets (`evidence-landscape-v2.png` and `evidence-grid-v2.png`). Matched the five margin nodes, more compact header, headline weight and spacing, stronger orange, double workbench boundary, toolbar, document scale and inspector alignment. Moved comparison and 3D controls into the source control row so the inspector follows the reference composition. Existing interactions remain available. Kept fixture-backed receipt dates and clause references instead of copying inconsistent generated mockup values.

Final comparison: `verification/fidelity-comparison.png`; focused typography comparison: `verification/fidelity-hero-detail.png`. Reference pixels are 1487 × 1058. The implementation was captured as a lossless 1440 × 1024 PNG at a 1440 × 1024 CSS viewport and approximately 1× density, then compared at equal 1440px widths, preserving aspect ratios. The workbench begins at 538.2 CSS pixels; the inspector is aligned 12px below the artwork's top and is approximately 415px tall. Inspected the combined comparison for spacing, typography, scale, borders, icons and alignment. Regenerated illustration geometry and individual path junctions retain minor raster differences; essential UI text and controls are semantic HTML. No blocking visual or interaction issues remained.

Verified source selection updates the inspector, the relocated 3D toggle enters/exits its view, and the responsive atlas fits at 390px and 768px. No document-level horizontal overflow observed. Checked orange keyboard focus on the margin links, zero transitions with reduced motion, and final application console with no errors. `verification/fidelity-mobile.png` records the mobile layout. Formatting, lint, type checking, nine domain tests and production build passed. Existing full-device and assistive-technology coverage limitations still apply. Local production preview remains open; no deployment occurred.

final result: passed
