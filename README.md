# ServeNow Recovery Console

Demonstrator interaktif berbahasa Indonesia untuk proposal recovery ServeNow. Seluruh data sintetis. Tidak membutuhkan backend, API key, akun, atau layanan enterprise.

## Menjalankan

Node.js >=22.12 (pengerjaan diverifikasi dengan Node 26), npm.

```sh
npm ci
npm run dev
```

Buka http://localhost:5173. Instalasi dependensi hanya diperlukan sekali. Runtime tidak memanggil API eksternal atau mengambil font/gambar dari jaringan.

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run preview
```

Browser test memakai Google Chrome lokal melalui Playwright. Bila Chrome tidak tersedia, sesuaikan `channel` pada `playwright.config.ts` atau install browser Playwright. Pengujian browser memerlukan server dev di port 5173. Screenshot dan contoh ekspor berada di `artifacts/`.

## Fitur

- `/`: lima pelanggan, peta recovery terhubung, konteks aksi, baseline/target, budget dan audit trail.
- `/core`: topologi simulasi, diagnosis/owner, runbook bersyarat, standby/backup terpisah, verifikasi service dan integritas.
- `/flow`: selective sync/async, atomic outbox, job detail, bounded retry, remote reconciliation, versi/idempotensi dan incremental pipeline.
- `/trust`: account router, covenant berversi, evidence matrix dan sumber, customer review, keputusan renewal eksplisit, shared ledger, refund dan goodwill.
- S1 TokoCepat, S2 Bank FinNusantara, S3 TeleNusa, guided/exploration, presentasi, export JSON, reset run dan reset seluruh sesi.
- Animasi indikator dan aliran mengikuti running state; reduced-motion mematikannya. Animasi tidak mengubah hasil domain.

## Arsitektur

React + TypeScript + Vite, React Router, Lucide. CSS konsisten dengan token PRD digunakan sebagai equivalent Tailwind supaya styling visual tetap ringkas tanpa dependency tambahan. `src/domain/engine.ts` merupakan reducer deterministik yang tidak bergantung React. Semua halaman membaca state yang sama; tidak ada angka acak saat render. `src/main.tsx` mengikat UI, satu clock aplikasi, persistence dan router. Tests domain berada di `src/tests/`; workflow browser di `e2e/`.

LocalStorage `servenow-v1` menyimpan schema version, account/covenant, run, arsip, outbox/jobs, remote ledger, pipeline, evidence, fixture, keputusan, budget dan audit events. Reload selalu paused. Kegagalan akses storage menggunakan memori; export tetap tersedia. Data rusak tidak langsung ditimpa dan UI menyediakan reset eksplisit. Reset run mengarsipkan fixture/remote/jobs dan mempertahankan keputusan, evidence dan shared ledger.

Clock hanya bertambah melalui tick simulasi atau tombol step teknis. Tab tersembunyi mem-pause clock. Technical run, fixture tujuh hari dan horizon program 60 hari adalah tiga ukuran waktu yang berbeda. Tombol Langkah berikutnya hanya memindahkan narasi dan halaman, tidak menyetujui covenant / acceptance / renewal secara otomatis.

## Asumsi dan batas simulasi

- Monetary ledger memakai juta IDR. Seed forecast Rp520 jt; ceiling Rp750 jt; headroom Rp230 jt; recurring setelah program Rp40 jt/bulan. Reserve dan forecast bukan spent.
- Refund awal Rp75 jt mengasumsikan fee ARR/12, seluruh akun eligible satu bulan, remedy 15%. Input refund per akun memperbarui bagian akun tersebut tanpa menghapus akun lain. Eligibility tidak disimpulkan dari baseline atau fixture tujuh hari.
- S1 memakai 10 operasi, remote response 4 detik, dua workers, core concurrency 2, maximum dispatch 2 per detik, 3 attempts, delay 2/4/8 detik. Scheduler memprioritaskan attempt rendah lalu acceptedAt; bukan simulasi penuh penjadwalan multi-tenant produksi.
- Pipeline memakai batch atomik berlatensi tiga detik demo dan sumber CRM/ERP sintetis, checkpoint 100→103, update/late-update/delete. Ini bukan benchmark pipeline 15 menit; asumsi desain 5+7+1+2 menit dijelaskan di drawer.
- Fixture tujuh hari: 604800 observed seconds, 240 unavailable seconds, 1000 request, 5 (atau 15) errors, 500000 total response ms. Tidak memperpanjang jam run atau membuktikan monthly SLA.
- Review akses, lokasi data, dan workflow medis hanya dapat diisi fixture manual ilustratif; bukan audit atau sertifikasi nyata. Deployment demo tidak membuktikan residensi produksi Indonesia.
- Role switcher adalah perspektif demo, bukan autentikasi/RBAC. Renewal hanya catatan keputusan simulasi, bukan kontrak tertandatangani. Export selalu `simulation: true`.
- Semua framework/dependency dipin oleh `package-lock.json`. React components dan domain sengaja disimpan dalam sedikit modul agar demonstrator mudah dipindahkan; tidak ada service RabbitMQ/Celery nyata.

## Deployment Vercel

1. Push folder proyek ini sebagai repository atau pilih folder ini sebagai Root Directory.
2. Import repository di Vercel, framework Vite.
3. Build `npm run build`, output `dist`, install `npm ci`. Tidak ada environment variables wajib.
4. `vercel.json` menyediakan SPA fallback agar `/core`, `/flow`, `/trust` dapat dimuat langsung.
5. Deploy melalui akun milik Anda. Proyek ini disiapkan tetapi tidak dipublish otomatis.

Rujukan setup: [Vite guide](https://vite.dev/guide/) dan [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite). `prompt.md` dan `prd.md` dipertahankan sebagai dokumen handoff asli.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` memverifikasi TypeScript, menjalankan unit tests, dan membangun aset pada base path repository sebelum publikasi ke Pages. Pada GitHub Pages router memakai hash (`/#/core`) agar refresh/deep-link selalu bekerja tanpa konfigurasi server. Vercel dan development tetap memakai route `/core` biasa. Push ke branch `main` memperbarui website otomatis.

Runtime/dependency `.runtime.nosync` hanya workaround lokal untuk folder iCloud macOS yang sempat mengubah file menjadi cloud-only. Folder tersebut tidak masuk repository dan tidak dibutuhkan pada GitHub Actions atau instalasi normal `npm ci`.

## Verifikasi

Lihat `TEST_REPORT.md` untuk pemeriksaan yang benar-benar dijalankan dan batasnya. Setiap perangkat memiliki sesi simulasi sendiri di localStorage; URL publik membuka aplikasi yang sama tetapi tidak menyinkronkan keputusan antarperangkat.
