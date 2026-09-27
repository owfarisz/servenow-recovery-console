# Demo ServeNow — sekitar tiga menit

## Tampilan sederhana: jalur utama baru

1. Pilih **Tiket menumpuk** (TokoCepat), lalu **Setuju, mulai pemulihan**.
2. **Periksa gangguan** → **Pulihkan layanan** → **Proses 10 tiket**. Proses berjalan otomatis; tombol Jeda tersedia.
3. Saat satu tiket belum pasti, klik **Pastikan hasil tiket**. Lalu **Perbarui laporan** → **Lanjut ke hasil**.
4. **Siapkan hasil pemeriksaan** → keputusan pelanggan **Hasil sudah sesuai** atau **Minta diperbaiki**.
5. **Lanjut ke keputusan** → **Lanjutkan kerja sama** atau **Bicarakan dulu**. Ringkasan dapat diunduh.

Untuk Bank, tambahkan contoh catatan dan pemeriksaan tambahan secara eksplisit. Untuk TeleNusa, laporan awal gagal; pilih **Perbaiki dan coba lagi**. Penjelasan teknis ada di **Apa yang terjadi?** dan **Buka tampilan lengkap**.

Panduan di bawah menjelaskan tampilan lengkap.

Sebelum presentasi: buka Overview, pilih S1 (TokoCepat). Gunakan Reset semua melalui footer bila ingin menghapus seluruh keputusan sebelumnya. Reset Run hanya membuat run baru; evidence lama menjadi historis, ledger tetap. Tekan ikon Mode presentasi untuk menyembunyikan sidebar.

## S1 — perjalanan utama

1. **0:00–0:25 · Kebutuhan pelanggan.** Tunjukkan lima akun dan ARR dalam risiko (bukan saved ARR). Pilih TokoCepat. Klik Mulai demo terpandu, baca tiga kriteria covenant lalu Sepakati covenant v1.
2. **0:25–0:50 · Core.** Buka Stabilize the Core. Injeksi insiden → Tetapkan Rafi → Periksa temuan → Terapkan query / connection control → Verifikasi service & integritas. Worker baru dapat berjalan setelah dependency terverifikasi sehat.
3. **0:50–1:25 · Integrasi.** Buka Streamline the Flow. Kirim 10 pembaruan contoh. Tunjukkan accepted bukan completed. Tekan Start (opsional 4×) atau Jalankan 5 detik teknis beberapa kali hingga sekitar 40s. Pause. Satu transient job sudah retry aman; job terakhir needs_verification. Klik Verifikasi remote: acknowledgment hilang tetapi remote telah commit, sehingga tidak ada resend atau efek ganda. Klik operation untuk audit trail.
4. **1:25–1:45 · Data.** Tab Pipeline data → Run next batch → Proses 3 detik. Checkpoint 103, dua baris terbaru, delete diterapkan, watermark diperbarui. Refresh tampilan saja tidak memajukan watermark.
5. **1:45–2:15 · Bukti.** Restore Customer Trust → Trust Console → Kumpulkan bukti → Validasi bukti. Klik kriteria untuk account/run/window/covenant/source. TokoCepat tidak membutuhkan fixture tujuh hari untuk kriteria cohort demo.
6. **2:15–2:40 · Review.** Ubah perspektif menjadi Customer reviewer. Klik Terima bukti. Alternatif Minta perbaikan menghasilkan gap ber-owner. Technical pass tidak menerima bukti otomatis.
7. **2:40–3:00 · Keputusan.** Renewal Decision → catat intent Ingin melanjutkan. Ubah perspektif Finance / decision owner; isi owner/catatan lalu Negosiasi dan Renewed · simulasi. Economics Control memperlihatkan Rp520 jt forecast / Rp230 jt headroom. Kembali Overview atau Ekspor sesi untuk JSON bertanda simulasi.

Jam demo dapat tetap paused selama narasi. Tombol Langkah berikutnya berpindah tahap penjelasan; keputusan manusia tidak dijalankan otomatis.

## S2 — recovery komponen Bank FinNusantara

- Pilih skenario S2. Sepakati covenant Bank pada Trust.
- Core: Siapkan standby & readiness check → Injeksi insiden → owner → diagnosis → failover → verifikasi service & integritas. Backup dan read replica adalah konsep terpisah.
- Sebelum readiness, failover tidak bisa dijalankan. Uji verifikasi gagal untuk mengembalikan insiden ke diagnosis.
- Trust Console: Muat periode bukti contoh → kumpulkan → validasi. Availability dapat lolos fixture tujuh hari; access/audit dan lokasi data tetap missing.
- Customer reviewer → Minta perbaikan. Tunjukkan gap. Opsional Muat review manual ilustratif kemudian kumpulkan/validasi lagi; ini tidak mengklaim sertifikasi nyata.

## S3 — pipeline TeleNusa

- Pilih S3. Trust → covenant → sepakati.
- Flow → Pipeline data → Run next batch → Proses 3 detik. Gate schema gagal; checkpoint tetap 100, watermark lama dan data lama tetap tampil.
- Refresh tampilan saja: freshness tidak pulih.
- Koreksi mapping → Run next batch → Proses 3 detik. Checkpoint 103; T-01 v2, T-02 v3 (late update), T-03 terhapus. Replay lagi tidak menambah baris.
- Trust → kumpulkan → validasi: freshness dan completeness bersumber dari run TeleNusa. Review pelanggan tetap eksplisit.

## Eksplorasi negatif

- Flow: local commit failure → tidak ada accepted job. Publisher failure → outbox tersimpan hingga publisher dipulihkan.
- Pilih permanent/exhausted fault → needs_attention, bukan retry tanpa batas. Koreksi & replay mempertahankan operation identity.
- Worker 4 diblokir oleh core/remote limit 2.
- Edit covenant setelah accepted → versi lama outdated, review baru dibutuhkan.
- Economics: goodwill Rp300 jt diblokir jika melebihi ceiling; kewajiban wajib tambahan tetap dicatat dan headroom negatif terlihat.
- Reload pada `/flow`: records sama, paused; tidak menggandakan efek remote atau biaya.
