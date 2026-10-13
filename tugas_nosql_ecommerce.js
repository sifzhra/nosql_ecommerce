/*
 * ==========================================================================
 *  TUGAS INDIVIDU - PRAKTIKUM BIG DATA PERTEMUAN 4
 *  Studi kasus : Katalog Produk E-Commerce
 *  Database    : bigdata_p4_ecommerce
 *  Collection  : produk
 *
 *  Cara menjalankan (pilih salah satu):
 *   1) Salin-tempel per bagian ke mongosh (disarankan agar bisa di-screenshot).
 *   2) Jalankan sekaligus:
 *        mongosh "<connection-string-atlas>" --file tugas_nosql_ecommerce.js
 *
 *  Catatan: file ini hanya untuk database latihan. Tidak ada deleteMany({}).
 * ==========================================================================
 */

// Pilih database (cara ini bekerja di mongosh interaktif maupun --file)
db = db.getSiblingDB("bigdata_p4_ecommerce");

// Fungsi bantu untuk mencetak judul dan hasil query agar rapi
const tampil = (judul, hasil) => {
  print("\n=== " + judul + " ===");
  printjson(hasil);
};

/* ------------------------------------------------------------------
 * BAGIAN 0. PERSIAPAN: membuat collection dari awal
 * ------------------------------------------------------------------ */
db.produk.drop(); // hapus collection lama agar skrip bisa diulang
db.createCollection("produk");
tampil("Daftar collection", db.getCollectionNames());

/* ------------------------------------------------------------------
 * BAGIAN 1. CREATE: memasukkan 12 dokumen contoh
 * Struktur dokumen:
 *   sku (string), nama (string), kategori (string), merek (string),
 *   harga (number), stok (number), rating (number),
 *   tag (array of string), spesifikasi (object bersarang),
 *   tanggalRilis (date)
 * ------------------------------------------------------------------ */
db.produk.insertMany([
  { sku: "P001", nama: "Laptop Vivobook 14", kategori: "Elektronik", merek: "Asus",
    harga: 7500000, stok: 15, rating: 4.5, tag: ["laptop", "kuliah"],
    spesifikasi: { ram: "8GB", penyimpanan: "512GB SSD" },
    tanggalRilis: new Date("2025-03-10") },

  { sku: "P002", nama: "Smartphone Galaxy A55", kategori: "Elektronik", merek: "Samsung",
    harga: 5800000, stok: 30, rating: 4.6, tag: ["hp", "android"],
    spesifikasi: { ram: "8GB", penyimpanan: "256GB" },
    tanggalRilis: new Date("2025-05-21") },

  { sku: "P003", nama: "Headphone Wireless WH-CH520", kategori: "Elektronik", merek: "Sony",
    harga: 750000, stok: 50, rating: 4.4, tag: ["audio", "wireless"],
    spesifikasi: { baterai: "50 jam", koneksi: "Bluetooth" },
    tanggalRilis: new Date("2024-11-02") },

  { sku: "P004", nama: "Kaos Polos Cotton Combed", kategori: "Fashion", merek: "Oblong",
    harga: 85000, stok: 120, rating: 4.3, tag: ["kaos", "harian"],
    spesifikasi: { bahan: "Cotton Combed 30s", ukuran: ["S", "M", "L", "XL"] },
    tanggalRilis: new Date("2025-01-15") },

  { sku: "P005", nama: "Sepatu Sneakers Urban", kategori: "Fashion", merek: "KasualCo",
    harga: 350000, stok: 45, rating: 4.2, tag: ["sepatu", "sneakers"],
    spesifikasi: { bahan: "Kanvas", ukuran: ["40", "41", "42", "43"] },
    tanggalRilis: new Date("2025-02-08") },

  { sku: "P006", nama: "Jaket Hoodie Fleece", kategori: "Fashion", merek: "Oblong",
    harga: 220000, stok: 60, rating: 4.5, tag: ["jaket", "hoodie"],
    spesifikasi: { bahan: "Fleece", ukuran: ["M", "L", "XL"] },
    tanggalRilis: new Date("2025-06-30") },

  { sku: "P007", nama: "Blender 2 Liter", kategori: "Rumah Tangga", merek: "Miyako",
    harga: 350000, stok: 40, rating: 4.2, tag: ["dapur", "blender"],
    spesifikasi: { daya: "350 Watt", kapasitas: "2 Liter" },
    tanggalRilis: new Date("2024-09-12") },

  { sku: "P008", nama: "Rice Cooker 1.8 Liter", kategori: "Rumah Tangga", merek: "Cosmos",
    harga: 450000, stok: 25, rating: 4.4, tag: ["dapur", "nasi"],
    spesifikasi: { daya: "400 Watt", kapasitas: "1.8 Liter" },
    tanggalRilis: new Date("2024-12-20") },

  { sku: "P009", nama: "Buku Pemrograman Python Dasar", kategori: "Buku", merek: "Penerbit Informatika",
    harga: 120000, stok: 80, rating: 4.8, tag: ["pemrograman", "kuliah"],
    spesifikasi: { halaman: 320, bahasa: "Indonesia" },
    tanggalRilis: new Date("2025-04-05") },

  { sku: "P010", nama: "Buku Big Data untuk Pemula", kategori: "Buku", merek: "Penerbit Informatika",
    harga: 135000, stok: 5, rating: 4.7, tag: ["big data", "kuliah"],
    spesifikasi: { halaman: 280, bahasa: "Indonesia" },
    tanggalRilis: new Date("2025-07-18") },

  { sku: "P011", nama: "Mouse Wireless M185", kategori: "Elektronik", merek: "Logitech",
    harga: 250000, stok: 100, rating: 4.6, tag: ["aksesori", "kerja"],
    spesifikasi: { koneksi: "USB Receiver 2.4GHz", baterai: "12 bulan" },
    tanggalRilis: new Date("2024-08-01") },

  { sku: "P012", nama: "Panci Set Anti Lengket", kategori: "Rumah Tangga", merek: "Maxim",
    harga: 300000, stok: 18, rating: 4.1, tag: ["dapur", "panci"],
    spesifikasi: { isi: "5 buah", material: "Aluminium" },
    tanggalRilis: new Date("2024-10-10") }
]);

tampil("Jumlah dokumen setelah insert (harus 12)", db.produk.countDocuments());

/* ------------------------------------------------------------------
 * BAGIAN 2. READ: query pencarian dan penyaringan
 * ------------------------------------------------------------------ */

// 2.1 Satu produk berdasarkan SKU
tampil("2.1 findOne SKU P002", db.produk.findOne({ sku: "P002" }));

// 2.2 Semua produk kategori Elektronik (hasil: 4 dokumen)
tampil("2.2 Kategori Elektronik",
  db.produk.find({ kategori: "Elektronik" }, { _id: 0, sku: 1, nama: 1, harga: 1 }).toArray());

// 2.3 Harga minimal Rp500.000 dengan $gte (hasil: P001, P002, P003)
tampil("2.3 Harga >= 500000",
  db.produk.find({ harga: { $gte: 500000 } }, { _id: 0, nama: 1, harga: 1 }).toArray());

// 2.4 Latihan modul: harga di bawah Rp100.000 dengan $lt (hasil: P004)
tampil("2.4 Harga < 100000",
  db.produk.find({ harga: { $lt: 100000 } }, { _id: 0, nama: 1, harga: 1 }).toArray());

// 2.5 Operator $in: kategori Fashion atau Buku (hasil: 5 dokumen)
tampil("2.5 Kategori Fashion atau Buku",
  db.produk.find({ kategori: { $in: ["Fashion", "Buku"] } }, { _id: 0, nama: 1, kategori: 1 }).toArray());

// 2.6 Mencari di dalam array: tag "kuliah" (hasil: P001, P009, P010)
tampil("2.6 Tag kuliah",
  db.produk.find({ tag: "kuliah" }, { _id: 0, nama: 1, tag: 1 }).toArray());

// 2.7 Mencari di objek bersarang: RAM 8GB (hasil: P001, P002)
tampil("2.7 Spesifikasi RAM 8GB",
  db.produk.find({ "spesifikasi.ram": "8GB" }, { _id: 0, nama: 1, spesifikasi: 1 }).toArray());

// 2.8 Kondisi gabungan: Elektronik DAN harga < 1 juta (hasil: P003, P011)
tampil("2.8 Elektronik murah",
  db.produk.find({ $and: [{ kategori: "Elektronik" }, { harga: { $lt: 1000000 } }] },
                 { _id: 0, nama: 1, harga: 1 }).toArray());

// 2.9 Rating tinggi: rating >= 4.6 (hasil: P002, P009, P010, P011)
tampil("2.9 Rating >= 4.6",
  db.produk.find({ rating: { $gte: 4.6 } }, { _id: 0, nama: 1, rating: 1 }).toArray());

// 2.10 Mengurutkan harga tertinggi, ambil 3 teratas (P001, P002, P003)
tampil("2.10 Top 3 termahal",
  db.produk.find({}, { _id: 0, nama: 1, harga: 1 }).sort({ harga: -1 }).limit(3).toArray());

// 2.11 Stok hampir habis: stok < 20 (hasil: P001, P010, P012)
tampil("2.11 Stok < 20",
  db.produk.find({ stok: { $lt: 20 } }, { _id: 0, nama: 1, stok: 1 }).toArray());

/* ------------------------------------------------------------------
 * BAGIAN 3. UPDATE: mengubah data
 * ------------------------------------------------------------------ */

// 3.1 $set: turunkan harga Laptop menjadi 7.250.000
db.produk.updateOne({ sku: "P001" }, { $set: { harga: 7250000 } });
tampil("3.1 Harga P001 setelah update", db.produk.findOne({ sku: "P001" }, { _id: 0, nama: 1, harga: 1 }));

// 3.2 $inc: ada penjualan 5 headphone, stok berkurang 5 (50 -> 45)
db.produk.updateOne({ sku: "P003" }, { $inc: { stok: -5 } });
tampil("3.2 Stok P003 setelah terjual 5", db.produk.findOne({ sku: "P003" }, { _id: 0, nama: 1, stok: 1 }));

// 3.3 $set menambah field baru: diskon 10% untuk semua Buku (2 dokumen)
db.produk.updateMany({ kategori: "Buku" }, { $set: { diskonPersen: 10 } });
tampil("3.3 Buku setelah diberi diskon",
  db.produk.find({ kategori: "Buku" }, { _id: 0, nama: 1, diskonPersen: 1 }).toArray());

// 3.4 $push: tambahkan tag "terlaris" pada buku Python
db.produk.updateOne({ sku: "P009" }, { $push: { tag: "terlaris" } });
tampil("3.4 Tag P009", db.produk.findOne({ sku: "P009" }, { _id: 0, nama: 1, tag: 1 }));

// 3.5 Restock: stok buku Big Data menjadi 25
db.produk.updateOne({ sku: "P010" }, { $set: { stok: 25 } });
tampil("3.5 Stok P010 setelah restock", db.produk.findOne({ sku: "P010" }, { _id: 0, nama: 1, stok: 1 }));

/* ------------------------------------------------------------------
 * BAGIAN 4. DELETE: menghapus data
 * ------------------------------------------------------------------ */

// Panci Set (P012) ditarik dari katalog. Filter memakai SKU yang unik.
tampil("4.0 Jumlah sebelum delete", db.produk.countDocuments());
db.produk.deleteOne({ sku: "P012" });
tampil("4.1 Jumlah sesudah delete (harus 11)", db.produk.countDocuments());
tampil("4.2 Cari P012 (harus kosong/null)", db.produk.findOne({ sku: "P012" }));

/* ------------------------------------------------------------------
 * BAGIAN 5. AGGREGATION: mengolah data
 * ------------------------------------------------------------------ */

// 5.1 Jumlah produk per kategori
// Hasil: Elektronik 4, Fashion 3, Rumah Tangga 2, Buku 2
tampil("5.1 Jumlah produk per kategori",
  db.produk.aggregate([
    { $group: { _id: "$kategori", jumlahProduk: { $sum: 1 } } },
    { $sort: { jumlahProduk: -1 } }
  ]).toArray());

// 5.2 Rata-rata harga per kategori (Elektronik = 3.512.500 setelah P001 diubah)
tampil("5.2 Rata-rata harga per kategori",
  db.produk.aggregate([
    { $group: { _id: "$kategori", rataRataHarga: { $avg: "$harga" } } },
    { $sort: { rataRataHarga: -1 } }
  ]).toArray());

// 5.3 Total stok dan nilai persediaan (harga x stok) per kategori
tampil("5.3 Total stok dan nilai persediaan per kategori",
  db.produk.aggregate([
    { $group: {
        _id: "$kategori",
        totalStok: { $sum: "$stok" },
        nilaiPersediaan: { $sum: { $multiply: ["$harga", "$stok"] } }
    } },
    { $sort: { nilaiPersediaan: -1 } }
  ]).toArray());

// 5.4 Pipeline lebih panjang: produk berating >= 4.4, dikelompokkan per merek,
//     lalu diurutkan dari rating rata-rata tertinggi
tampil("5.4 Rating rata-rata per merek (rating >= 4.4)",
  db.produk.aggregate([
    { $match: { rating: { $gte: 4.4 } } },
    { $group: { _id: "$merek", rataRating: { $avg: "$rating" }, jumlah: { $sum: 1 } } },
    { $sort: { rataRating: -1, _id: 1 } }
  ]).toArray());

/* ------------------------------------------------------------------
 * BAGIAN 6. INDEKS
 * ------------------------------------------------------------------ */

// 6.1 Indeks unik untuk SKU (mencegah SKU ganda)
db.produk.createIndex({ sku: 1 }, { unique: true });

// 6.2 Indeks gabungan untuk pola query "per kategori, urut harga"
db.produk.createIndex({ kategori: 1, harga: -1 });

tampil("6.3 Daftar indeks", db.produk.getIndexes());

// 6.4 Bukti indeks dipakai: lihat winningPlan -> stage IXSCAN
tampil("6.4 Explain pencarian SKU P005",
  db.produk.find({ sku: "P005" }).explain("executionStats").queryPlanner.winningPlan);

// 6.5 Uji indeks unik: insert SKU ganda HARUS gagal (error E11000 duplicate key)
try {
  db.produk.insertOne({ sku: "P005", nama: "Produk Duplikat", kategori: "Fashion", harga: 1, stok: 1 });
  print("PERINGATAN: insert ganda berhasil, indeks unik belum aktif");
} catch (e) {
  print("\n=== 6.5 Uji SKU ganda ditolak (sesuai harapan) ===");
  print(e.message);
}

print("\nSelesai. Total dokumen akhir: " + db.produk.countDocuments());
