# Animasi alur data

Paket bergerak sepanjang jalur SVG, berhenti sebelum penghalang saat gangguan, dan mengalir pada jalur yang pulih. Balasan yang belum pasti memakai jalur kembali, tanpa menggambarkan pengiriman ulang. Tahap yang menunggu tidak mengirim paket.

Gerakan ilustrasi tidak mengubah jam, jumlah tiket, atau hasil simulasi. Kontrol Jeda/Putar tersedia; menjeda saat proses berjalan juga menjeda simulasi. Tab tersembunyi menghentikan pratinjau. Pengaturan reduced motion menampilkan ilustrasi statis.

Validasi: build produksi, 16 unit test, 12 pengujian Chrome. Pengujian animasi memeriksa perubahan posisi paket, jalur berhenti sebelum penghalang, posisi yang tetap saat dijeda, jam simulasi tidak berubah saat pratinjau, serta mode reduced motion dan lebar layar 390 px. Screenshot desktop dan HP tersedia di artifacts/data-motion-*.png.

## Animasi khusus per kasus

- TokoCepat: tiket masuk dari beberapa arah, menumpuk saat layanan lambat; setelah pemulihan, beban dibagi ke dua jalur. Saat memproses, tiket bergerak bergiliran. Balasan yang belum pasti tetap memakai ilustrasi balasan terpisah.
- Bank FinNusantara: permintaan tidak mendapat balasan; setelah diagnosis, jalur utama terlihat putus. Setelah pemulihan, paket mengikuti jalur bawah menuju penyimpanan pengganti, tanpa menggambarkan jalur utama sudah diperbaiki.
- TeleNusa: kartu data dengan bentuk berbeda diperiksa terhadap format yang diharapkan. Data yang tidak cocok ditandai; laporan lama tetap tersedia. Laporan baru hanya tampil setelah status pipeline published.

Validasi revisi: build produksi, 16 unit test, 14 pengujian browser. Pengujian baru memeriksa gerakan permintaan bank dan perpindahan rutenya, gerakan penolakan format data, serta perubahan laporan lama menjadi terbaru. Pemeriksaan screenshot mencakup desktop dan HP.
