# Verification report — ServeNow Recovery Console

Verified locally on 27 September 2026 with Node 26, TypeScript, Vitest and Playwright / Google Chrome.

## Executed checks

- `npm run typecheck`: passed.
- `npm test`: 13 domain tests passed.
- `npm run build`: passed, static output in `dist/`.
- `npm run test:e2e`: five browser workflows passed; screenshots and JSON export saved under `artifacts/`.

Domain checks cover atomic acceptance/outbox, publisher recovery, bounded retry, ambiguous outcome verification, remote idempotency/version guards, S1 completion and explicit customer/renewal decisions, S2 readiness and compliance gaps, S3 failed checkpoint preservation and replay, account isolation, covenant invalidation, strict error thresholds, missing/insufficient evidence, fixture/live-window separation, budget limits and mandatory liability, refund account isolation, unique evidence identities, reload-paused persistence and simulation-marked export.

Browser workflows cover:

1. S1: covenant → incident/diagnosis/recovery → 10 jobs → remote verification → pipeline → evidence review → explicit renewal → reload → JSON download. No page errors observed.
2. S3: failed validation leaves checkpoint 100; correction and replay produce checkpoint 103; deep-route reload preserves data and paused state.
3. Animation: running enables animation, Pause stops it, reduced-motion disables it.
4. S2: failover is blocked before readiness; failed verification returns to diagnosis; successful recovery does not clear two manual compliance gaps; customer correction creates a follow-up.
5. Keyboard dialog Escape, form value persistence across clock ticks, mobile job submission and no document-level horizontal overflow.

## Visual inspection

Inspected actual screenshots at 1440×900 desktop, 1280×720 presentation, and 390×844 mobile. Corrected mobile form overflow and reduced presentation layout height so the connected Core / Flow / Trust map is visible above the persistent control bar. Mobile map uses ordered vertical cards; tables scroll within their panels.

Files: `artifacts/overview-desktop.png`, `overview-presentation.png`, `overview-mobile.png`, `flow-mobile.png`, `core-recovery.png`, `trust-evidence.png`. These are full-page screenshots captured at the listed viewport sizes; fixed toolbars appear at the viewport boundary.

## Boundaries

Tests verify the deterministic frontend demonstrator, not real infrastructure throughput, contractual validity, compliance, disaster recovery or Indonesian production data residency. Browser verification uses Chrome; Safari/Firefox have not been separately exercised. LocalStorage is per-browser/per-device; published hosting does not synchronize simulation sessions across devices.

## Published deployment

GitHub Pages: https://owfarisz.github.io/servenow-recovery-console/

GitHub Actions build and deploy completed successfully (run 36263700639). Clean Linux runner independently passed npm ci, typecheck, 13 unit tests, and the Pages-base production build. Public Chrome smoke test passed: HTTP 200, static assets, hash route navigation/reload, S3 failure/replay (checkpoint 100→103), mobile layout without document overflow, and no page errors. Screenshot: `artifacts/published-mobile.png`.

## Revisi antarmuka tunggal ramah lansia

Tampilan teknis terpisah dihapus dari entry point. Seluruh fungsi utama dipindahkan ke empat langkah dan rincian yang dapat dibuka pada halaman yang sama. Lima pelanggan memiliki perjalanan bukti masing-masing; dua unit test baru memeriksa kepemilikan dan arsip saat memulai/reset perjalanan pelanggan.

Build produksi dan 18 unit test lulus. Suite browser diperbarui untuk antarmuka tunggal: navigasi tautan lama, kelima pelanggan, pemulihan bank bertahap dan kegagalan verifikasi, pencatatan pekerjaan gagal, balasan ambigu, input saat clock berjalan, pipeline gagal/replay, perubahan kesepakatan, anggaran, refund, ekspor, data lokal rusak, dialog dan responsif. Animasi khusus kasus tetap diuji.

Hasil akhir lokal: 17 tes browser lulus (45,1 detik), 18 unit test lulus, build produksi lulus. Screenshot aktual diperiksa pada desktop 1440×900, tampilan 1280×720, dan HP 390×844. Tidak ada overflow horizontal pada pengujian HP. Ringkasan teks dan ekspor JSON berhasil diunduh.
