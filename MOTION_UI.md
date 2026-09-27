# Animasi alur data

Paket bergerak sepanjang jalur SVG, berhenti sebelum penghalang saat gangguan, dan mengalir pada jalur yang pulih. Balasan yang belum pasti memakai jalur kembali, tanpa menggambarkan pengiriman ulang. Tahap yang menunggu tidak mengirim paket.

Gerakan ilustrasi tidak mengubah jam, jumlah tiket, atau hasil simulasi. Kontrol Jeda/Putar tersedia; menjeda saat proses berjalan juga menjeda simulasi. Tab tersembunyi menghentikan pratinjau. Pengaturan reduced motion menampilkan ilustrasi statis.

Validasi: build produksi, 16 unit test, 12 pengujian Chrome. Pengujian animasi memeriksa perubahan posisi paket, jalur berhenti sebelum penghalang, posisi yang tetap saat dijeda, jam simulasi tidak berubah saat pratinjau, serta mode reduced motion dan lebar layar 390 px. Screenshot desktop dan HP tersedia di artifacts/data-motion-*.png.
