# Tampilan sederhana — 27 September 2026

Tampilan bawaan diganti dengan alur empat langkah untuk pengguna yang memerlukan antarmuka lebih mudah dibaca:

1. Pilih kebutuhan.
2. Pulihkan layanan.
3. Periksa hasil.
4. Putuskan bersama.

Perubahan utama: teks 17–18px untuk isi utama, tombol minimal 52px, satu tindakan utama per tahap, bahasa sehari-hari, progres yang terlihat, tombol mulai tetap terlihat di ponsel, dan rincian teknis tertutup secara default. Tidak ada label usia pada antarmuka. Tampilan lengkap tetap dapat dibuka dan menggunakan state yang sama.

Tindakan teknis rutin dapat dikelompokkan dalam satu klik, tetapi kesepakatan, customer acceptance, review tambahan Bank, dan keputusan kerja sama tetap tindakan eksplisit. Job ambigu tetap harus diperiksa tanpa kirim ulang; pipeline gagal tidak memajukan checkpoint. Animasi mengikuti clock yang sama dan menghormati reduced motion.

## Verifikasi yang dijalankan

- TypeScript: lulus.
- 13 tes logika domain: lulus.
- 8 tes browser Chrome: lulus, termasuk tiga alur sederhana baru serta lima workflow tampilan lengkap.
- Build produksi Vite: lulus.
- Screenshot diperiksa pada 1440×900, 1280×720, dan 390×844.
- Alur S1 sederhana diuji dari kesepakatan hingga renewal; S3 mobile diuji gagal/perbaikan/review; S2 tetap memerlukan contoh pemeriksaan manual secara eksplisit.

Bukti visual: `artifacts/simple-desktop.png`, `simple-1280.png`, `simple-mobile.png`, `simple-mobile-repair.png`, dan `simple-review.png`.

Pemeriksaan ini bukan studi usability dengan partisipan lansia; Safari/Firefox belum diuji terpisah. Preferensi reduced motion mengikuti pengaturan perangkat. Semua data tetap simulasi dan tersimpan per perangkat.
