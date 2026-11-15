# model bkt

Model empat parameter dilatih dengan maximum likelihood menggunakan SciPy L-BFGS-B.
Lima inisialisasi dipilih berdasarkan log loss validasi. Siswa pada train,
validation, dan test berbeda. Prediksi tiap jawaban dihitung sebelum pembaruan
penguasaan dari jawaban tersebut.

```powershell
uv run --group training python -m training.train_bkt --download
```

Dataset berasal dari salinan ASSISTments pada repositori riset CAHLR.
URL dipatok ke commit tertentu dan SHA-256 diperiksa sebelum training.
Pengolahan memilih `Pythagorean Theorem`, soal utama (`original=1`), jawaban
biner, menghapus duplikasi siswa/order_id, mengurutkan order_id, dan memakai
siswa dengan sedikitnya dua respons. Teks jawaban serta identitas siswa
tidak masuk artefak yang di-commit.

- Sumber salinan data: https://github.com/CAHLR/pyBKT-examples
- Deskripsi dataset dan kolom: https://sites.google.com/site/assistmentsdata/home/2009-2010-assistment-data

`bkt.json` menyimpan parameter, jumlah siswa dan respons, metrik setiap split,
baseline probabilitas konstan dari data train, sumber, checksum, dan batasan.
Label penguasaan memakai ambang produk 0,5 dan 0,85 serta minimum tiga jawaban.
Ambang ini perlu diuji dan dikalibrasi dengan pengguna nyata.

Pemetaan skill aktif hanya `math.pythagorean-theorem` pada materi contoh
Pythagoras yang ditulis dan ditinjau di repo. Materi unggahan AI mendapat
`skill_id=null` sampai pemetaan kontennya ditinjau. Fotosintesis memakai
hasil latihan dan aturan rekomendasi dengan estimasi penguasaan kosong.

Evaluasi mengukur prediksi pada dataset publik. Penggunaan dalam materi
Indonesia dan klaim dampak belajar memerlukan evaluasi pengguna lanjutan.
