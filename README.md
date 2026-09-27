# ServeNow Recovery Console

**Website publik:** https://owfarisz.github.io/servenow-recovery-console/  
**Repository:** https://github.com/owfarisz/servenow-recovery-console

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

## Satu tampilan untuk seluruh perjalanan

Seluruh aplikasi memakai antarmuka ramah lansia: pilih kebutuhan, pulihkan layanan, periksa hasil, dan putuskan bersama. Tidak ada tombol atau mode tampilan teknis terpisah. Lima pelanggan dapat dipilih; ketiganya memiliki skenario utama, sementara LogistikGo dan MedikaCare memiliki alur bukti yang sesuai kebutuhannya.

Tindakan utama tetap menonjol. Bagian yang bisa dibuka pada halaman yang sama menyediakan pengaturan ukuran keberhasilan, penanganan layanan bertahap, daftar dan contoh pekerjaan, isi laporan, bukti beserta kekurangan, riwayat, serta pengaturan biaya. Huruf besar, kontrol minimal 52px, dan mode gerakan dikurangi tetap tersedia.

- Kesepakatan dapat diedit dan memerlukan pemeriksaan ulang.
- Gangguan, antrean, balasan yang belum pasti, dan laporan gagal memiliki penanganan nyata dalam simulasi.
- Pemeriksaan medis/keamanan tetap terpisah; pelanggan menerima hasil secara eksplisit.
- Keinginan pelanggan terpisah dari keputusan melanjutkan, membicarakan, atau tidak melanjutkan kerja sama.
- Anggaran bersama, pengembalian biaya, kewajiban wajib, dan bantuan opsional dapat diatur.
- Ringkasan teks yang mudah dibaca dan data lengkap JSON dapat diunduh. Mulai contoh baru mempertahankan riwayat; menghapus semua memerlukan konfirmasi di aplikasi.

Tautan lama `/core`, `/flow`, `/trust` (atau hash pada GitHub Pages) masuk ke tahap yang sesuai dalam antarmuka ini. `?detail=1` tetap menampilkan antarmuka yang sama.

## Arsitektur

React + TypeScript + Vite, Lucide. CSS konsisten dengan token PRD digunakan sebagai equivalent Tailwind supaya styling visual tetap ringkas tanpa dependency tambahan. `src/domain/engine.ts` merupakan reducer deterministik yang tidak bergantung React. Semua halaman membaca state yang sama; tidak ada angka acak saat render. `src/main.tsx` mengikat UI, satu clock aplikasi, persistence dan ekspor. Tests domain berada di `src/tests/`; workflow browser di `e2e/`.

LocalStorage `servenow-v1` menyimpan schema version, account/covenant, run, arsip, outbox/jobs, remote ledger, pipeline, evidence, fixture, keputusan, budget dan audit events. Reload selalu paused. Kegagalan akses storage menggunakan memori; export tetap tersedia. Data rusak tidak langsung ditimpa dan UI menyediakan reset eksplisit. Reset run mengarsipkan fixture/remote/jobs dan mempertahankan keputusan, evidence dan shared ledger.

Clock hanya bertambah melalui tick simulasi atau tombol step teknis. Tab tersembunyi mem-pause clock. Technical run, fixture tujuh hari dan horizon program 60 hari adalah tiga ukuran waktu yang berbeda. Navigasi langkah hanya memindahkan tahap, tidak menyetujui covenant / acceptance / renewal secara otomatis.

## Asumsi dan batas simulasi

- Monetary ledger memakai juta IDR. Seed forecast Rp520 jt; ceiling Rp750 jt; headroom Rp230 jt; recurring setelah program Rp40 jt/bulan. Reserve dan forecast bukan spent.
- Refund awal Rp75 jt mengasumsikan fee ARR/12, seluruh akun eligible satu bulan, remedy 15%. Input refund per akun memperbarui bagian akun tersebut tanpa menghapus akun lain. Eligibility tidak disimpulkan dari baseline atau fixture tujuh hari.
- S1 memakai 10 operasi, remote response 4 detik, dua workers, core concurrency 2, maximum dispatch 2 per detik, 3 attempts, delay 2/4/8 detik. Scheduler memprioritaskan attempt rendah lalu acceptedAt; bukan simulasi penuh penjadwalan multi-tenant produksi.
- Pipeline memakai batch atomik berlatensi tiga detik demo dan sumber CRM/ERP sintetis, checkpoint 100→103, update/late-update/delete. Ini bukan benchmark pipeline 15 menit; asumsi desain 5+7+1+2 menit tetap merupakan konteks proposal.
- Fixture tujuh hari: 604800 observed seconds, 240 unavailable seconds, 1000 request, 5 (atau 15) errors, 500000 total response ms. Tidak memperpanjang jam run atau membuktikan monthly SLA.
- Review akses, lokasi data, dan workflow medis hanya dapat diisi fixture manual ilustratif; bukan audit atau sertifikasi nyata. Deployment demo tidak membuktikan residensi produksi Indonesia.
- Tindakan pelanggan dan penanggung jawab menggunakan perspektif demo, bukan autentikasi/RBAC. Renewal hanya catatan keputusan simulasi, bukan kontrak tertandatangani. Export selalu `simulation: true`.
- Semua framework/dependency dipin oleh `package-lock.json`. React components dan domain sengaja disimpan dalam sedikit modul agar demonstrator mudah dipindahkan; tidak ada service RabbitMQ/Celery nyata.

## Deployment Vercel

1. Push folder proyek ini sebagai repository atau pilih folder ini sebagai Root Directory.
2. Import repository di Vercel, framework Vite.
3. Build `npm run build`, output `dist`, install `npm ci`. Tidak ada environment variables wajib.
4. `vercel.json` menyediakan SPA fallback agar `/core`, `/flow`, `/trust` dapat dimuat langsung.
5. Deploy melalui akun milik Anda. Publikasi yang digunakan saat ini adalah GitHub Pages; Vercel merupakan alternatif.

Rujukan setup: [Vite guide](https://vite.dev/guide/) dan [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite). `prompt.md` dan `prd.md` dipertahankan sebagai dokumen handoff asli.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` memverifikasi TypeScript, menjalankan unit tests, dan membangun aset pada base path repository sebelum publikasi ke Pages. Tautan lama berbentuk hash (`/#/core`) tetap dibaca untuk membuka tahap pemulihan tanpa konfigurasi server. Vercel dan development juga menerima `/core` biasa. Navigasi baru memakai empat langkah di dalam satu antarmuka. Push ke branch `main` memperbarui website otomatis.

Runtime/dependency `.runtime.nosync` hanya workaround lokal untuk folder iCloud macOS yang sempat mengubah file menjadi cloud-only. Folder tersebut tidak masuk repository dan tidak dibutuhkan pada GitHub Actions atau instalasi normal `npm ci`.

## Verifikasi

Lihat `TEST_REPORT.md` untuk pemeriksaan yang benar-benar dijalankan dan batasnya. Setiap perangkat memiliki sesi simulasi sendiri di localStorage; URL publik membuka aplikasi yang sama tetapi tidak menyinkronkan keputusan antarperangkat.

Pemeriksaan langsung pada website publik: `npm run test:e2e -- --config=playwright.public.config.ts`. Test ini memeriksa HTTP 200, aset, hash deep-link/reload, skenario pipeline, dan mobile overflow.
