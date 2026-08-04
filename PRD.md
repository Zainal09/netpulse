# PRD — Gaming Network Optimizer (Web App / PWA)

## 1. Latar Belakang & Masalah

Banyak aplikasi "penguat sinyal WiFi" di Play Store mengklaim bisa memperbesar
kekuatan sinyal WiFi secara ajaib lewat software. **Ini secara teknis tidak
mungkin** — kekuatan sinyal WiFi (dBm) ditentukan oleh hardware antena router,
jarak, daya pancar, dan halangan fisik (tembok, elektronik lain). Tidak ada
kode, aplikasi, atau algoritma di HP yang bisa menembus batasan fisika itu.

Yang sebenarnya dikeluhkan pengguna saat main game adalah **lag / ping tinggi
/ koneksi tidak stabil** — dan itu adalah masalah yang *bisa* didiagnosis dan
dikurangi lewat aplikasi, meski bukan dengan cara "boost sinyal".

**Keputusan produk:** Membangun aplikasi yang jujur — bukan "penguat sinyal
palsu", tapi **alat diagnosis & optimasi jaringan untuk gaming** yang benar-benar
membantu menurunkan lag.

## 2. Tujuan Produk

| Tujuan | Metrik Sukses |
|---|---|
| Membantu user memahami kualitas koneksi mereka saat ini | Menampilkan RTT, jenis koneksi, estimasi bandwidth |
| Membantu user memilih server/DNS/channel WiFi tercepat | Live latency test ke beberapa endpoint |
| Memberi rekomendasi actionable, bukan cuma angka | Tips kontekstual sesuai hasil tes |
| Bisa dipakai cepat, tanpa install dari Play Store | Berjalan sebagai PWA, bisa "Add to Home Screen" |

## 3. Target Pengguna

Mobile gamer casual–menengah (Mobile Legends, PUBGM, Free Fire, Valorant
Mobile) yang sering mengalami lag/ping tinggi dan ingin cara cepat mengecek
"kenapa" tanpa harus paham jaringan secara teknis.

## 4. Batasan Teknis (Penting — Kejujuran Produk)

Browser (dan karena itu web app/PWA) **tidak** punya akses ke:
- Kekuatan sinyal WiFi dalam dBm (ini API level OS, butuh app native + izin lokasi khusus di Android)
- Mengubah channel WiFi router
- Mem-boost daya pancar radio HP

Karena itu, semua fitur di bawah ini dirancang di sekitar apa yang **benar-benar
bisa** diukur/dilakukan dari browser.

## 5. Fitur (Scope v1)

### 5.1 Connection Snapshot
- Menampilkan jenis koneksi (4G/WiFi/dst), estimasi kecepatan unduh, dan RTT
  dasar dari `navigator.connection` (Chrome/Android; fallback pesan untuk
  Safari/iOS yang tidak mendukung API ini).

### 5.2 Live Ping Monitor
- Tes latensy real-time ke beberapa endpoint publik (Google, Cloudflare, dst)
  memakai teknik image-ping (tidak butuh server sendiri).
- Ditampilkan sebagai grafik waveform berjalan (seperti heart-rate monitor).
- Rata-rata, min, max, dan *jitter* (variasi ping — ini yang paling sering
  bikin karakter "nge-lag tiba-tiba" di game).

### 5.3 Multi-Endpoint Comparison
- Bandingkan latency ke beberapa titik sekaligus → user tahu titik mana yang
  paling responsif dari lokasi & jaringan mereka saat ini.

### 5.4 Status & Rekomendasi Otomatis
- Berdasar hasil ping & jitter, sistem memberi label (Excellent / Good /
  Playable / Laggy) + rekomendasi konkret, contoh:
  - Jitter tinggi → tutup aplikasi background yang download/upload.
  - RTT tinggi terus-menerus di WiFi → coba pindah ke 5GHz / dekatkan ke router.
  - 4G tidak stabil → pertimbangkan mode data saver / batasi app lain.

### 5.5 Checklist Optimasi Manual
- Daftar centang tindakan yang terbukti membantu menurunkan lag di HP:
  matikan auto-update app, aktifkan Game Mode / DND, tutup app background,
  gunakan WiFi 5GHz bila tersedia, dekatkan jarak ke router, dsb.

## 6. Di Luar Scope (v1)

- Tidak ada klaim "boost sinyal" dalam bentuk apa pun.
- Tidak mengubah pengaturan sistem/jaringan HP (butuh native app + izin khusus).
- Tidak menyimpan data pengguna ke server (semua proses di sisi klien/browser).

## 7. UX Principles

- Nada bicara: teknisi lapangan yang jujur, bukan iklan bombastis.
- Tidak ada angka yang dikarang — semua angka berasal dari pengukuran nyata.
- Tampilan seperti panel diagnostik (mirip radar/osiloskop), bukan tema
  gaming RGB generik.

## 8. Tech Stack

- Single-page HTML/CSS/JS (vanilla), tanpa dependency berat → ringan di HP.
- PWA: `manifest.json` + `service-worker.js` agar bisa "Add to Home Screen"
  dan tetap bisa dibuka (shell) saat offline.
- Tidak butuh backend — cocok untuk dijalankan dari static hosting apa pun
  (GitHub Pages, Netlify, atau langsung dibuka sebagai file lokal).

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| `navigator.connection` tidak didukung semua browser (khususnya iOS Safari) | Tampilkan fallback yang menjelaskan keterbatasan, tetap jalankan fitur ping test yang universal |
| User berharap "sinyal WiFi jadi kuat" | Onboarding singkat yang menjelaskan apa yang alat ini bisa & tidak bisa lakukan |
| Hasil ping bisa berbeda antar percobaan | Tampilkan sebagai rata-rata + jitter, bukan angka tunggal yang menyesatkan |

## 10. Roadmap Selanjutnya (v2+, opsional)

- Riwayat tes tersimpan lokal (localStorage) untuk lihat tren dari waktu ke waktu.
- Deteksi kongesti jam ramai (heuristik berdasar histori tes).
- Rekomendasi server game spesifik berdasarkan judul game yang dipilih user.
