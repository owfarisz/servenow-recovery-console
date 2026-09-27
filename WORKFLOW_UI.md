# Visualisasi titik gangguan

Layar pemulihan pada tampilan sederhana sekarang memakai alur layanan yang dapat diklik. Bagian yang diperiksa ditandai, kemudian ditampilkan lebih besar di bawahnya bersama penyebab dan dampak bagi pelanggan. Penanda berhenti menjelaskan bagian alur yang terhambat; warna disertai ikon dan teks.

- S1: gejala muncul pada proses layanan; diagnosis menunjukkan jalur penyimpanan terlalu penuh. Gangguan sementara dan balasan tiket ambigu kemudian ditunjukkan pada sistem pelanggan. Hasil ambigu tidak disebut pasti gagal.
- S2: pemeriksaan mengarahkan perhatian ke penyimpanan data yang tidak merespons; setelah pemulihan, jalur berubah hijau. Pemeriksaan keamanan tetap terpisah.
- S3: laporan awal masih memakai data lama; validasi yang gagal menyorot tahap Periksa data. Publikasi menunggu sampai perbaikan berhasil.

Pengguna dapat memilih bagian lain, lalu kembali ke titik yang ditangani. Gerakan fokus singkat hanya menjelaskan perubahan; reduced motion menonaktifkannya. Diagram mengambil status dari mesin simulasi yang sama, tanpa angka atau diagnosis tambahan yang dibuat oleh UI.

Verifikasi: 16 tes logika, 11 tes browser, typecheck, dan production build lulus. Screenshot desktop 1440×900, 1280×720 dan mobile 390×844 diperiksa. Tes baru memeriksa lokasi diagnosis, panel yang diperbesar, inspeksi node, hasil pulih, penjagaan checkpoint, dan reduced motion. Pengujian memakai Chrome; bukan studi pengguna lansia.
