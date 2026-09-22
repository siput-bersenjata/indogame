# 🥊 IndoGame - 16-Bit Pixel Art Arcade Fighting Game

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsiput-bersenjata%2Findogame)

**IndoGame** adalah game pertarungan (fighting) bergaya retro arcade 16-bit pixel art dengan mekanika pertarungan 60 FPS, procedural chiptune audio synthesizer, pertarungan melawan Bot AI (4 tingkat kesulitan), dan mode **Real-Time Online Multiplayer P2P** berbasis WebRTC tanpa beban biaya server!

---

---

## 📖 Tentang IndoGame (About the Project)

### 💡 Latar Belakang & Konsep
**IndoGame** lahir dari inspirasi masa keemasan game pertarungan arcade klasik era 1990-an (seperti *Street Fighter II*, *Mortal Kombat*, dan *King of Fighters*), namun diramu dengan sentuhan satir pop-kultur dan dinamika figur publik Indonesia yang unik dan menghibur.

Setiap karakter, animasi gerakan (*sprite frames*), hingga efek jurus dirancang dengan ketelitian seni piksel 16-bit (*pixel art*), menghadirkan pengalaman visual retro nostalgia yang dipadukan dengan performa modern 60 FPS pada peramban web modern tanpa perlu instalasi emulator atau aplikasi pihak ketiga.

### 🌟 Fitur Unggulan Sistem
* **Performa 60 FPS Canvas Penuh:** Menggunakan mesin render HTML5 Canvas 2D dengan akselerasi perangkat keras GPU.
* **Procedural Chiptune Audio Synthesizer:** Seluruh musik latar (BGM) retro dan efek suara pukulan (SFX) disintesis secara dinamis via Web Audio API tanpa berkas audio MP3/WAV eksternal yang berat.
* **Kecerdasan Buatan Bot AI Multi-Tingkat:** Sistem algoritma AI prediktif dengan 4 level kesulitan (*Easy*, *Medium*, *Hard*, *Expert*) yang dapat membaca pola serangan, menangkis secara adaptif, dan melancarkan kombo balasan.
* **Real-Time Multiplayer P2P (WebRTC):** Fitur pertarungan online antar-pemain secara langsung (*Peer-to-Peer*) melalui sambungan WebRTC DataChannel, sehingga menghasilkan latensi ultra-rendah (<25ms) tanpa membebani biaya server terpusat.
* **Dukungan Touchscreen Mobile Penuh:** Kontrol Gamepad virtual responsif di layar sentuh ponsel pintar (*Android & iOS*) dengan deteksi multitouch presisi.
* **Arsitektur Stack Bersih & Ringan:** Dibangun murni menggunakan **Vanilla JavaScript (ES Modules)**, **HTML5**, **CSS3**, dan di-bundle secara efisien menggunakan **Vite**.

---

## 🎮 Roster Karakter & Jurus Spesial

### 1. Mama Gufron *(The Mystical Speaker)*
* **Pukulan Normal (J):** Hantaman mikrofon & tamparan bertenaga.
* **Tendangan Normal (K):** Sapuan kaki bawah (*Low sweep kick*).
* **Jurus Khusus 1 (U) - Babi Hutan Charge:** Mama Gufron memanggil dan menunggangi babi hutan bertaring menerobos arena dengan kepulan debu tebal, mementalkan lawan.
* **Ultimate Skill (I) - Jurus Semut Gaib:** Bersuara ke mikrofon memicu ledakan tanah ("ERUPT!"), dan ribuan semut mengerubungi musuh ("GNAW GNAW GNAW") dengan banner kemenangan ikonik: **"K.O. BY SWARM"**.

### 2. Bahlil *(The Smiling Minister / Brawler)*
* **Pukulan Normal (J):** Tamparan berkas dokumen & jab eksekutif kilat.
* **Tendangan Normal (K):** Tendangan formal memutar (*High roundhouse kick*).
* **Jurus Khusus 1 (U) - Hot Ethanol Splash:** Menyiram cairan kimia etanol membara yang membakar tubuh lawan ("FIRE!").
* **Ultimate Skill (I) - Earth Oil Eruption:** Menyentuh tanah membangkitkan semburan geyser minyak mentah hitam yang menenggelamkan musuh dalam kubangan lengket ("TRAP").

### 3. Wowo *(The Safari Commander)*
* **Pukulan Normal (J):** Pukulan safari bertenaga & dorongan telapak ganda.
* **Tendangan Normal (K):** Tendangan lurus sepatu lars safari.
* **Jurus Khusus 1 (U) - Tray Makan Racun:** Melempar nampan makan bersekat berisi makanan & susu yang menciptakan genangan racun hijau berbuih ("POISONED!").
* **Ultimate Skill (I) - Megaphone "HIDUP JOKOWI":** Meneriakkan *"HIDUP JOKOWI"* lewat megafon bergelombang sonik raksasa yang menyetun musuh di tempat ("STUNNED!").

---

## 🏛️ Arena Pertarungan (Stages)

1. **Istana Garuda IKN (Nusantara Palace):** Pemandangan megah monumen Sayap Burung Garuda raksasa di IKN Kalimantan Timur dengan langit biru tropis, awan bergerak, dan teras marmer istana.
2. **Kebakaran Hutan Gambut:** Lanskap dramatis lahan gambut terbakar dengan partikel bara api melayang, asap kabut merah membara, dan batang pohon hangus.
3. **Tengah Hutan Kebun Sawit:** Jalur tanah perkebunan kelapa sawit dengan deretan pohon sawit berbuah tandan merah-oranye segar dan dedaunan lebat.

---

## 🕹️ Panduan Kontrol

### 🖥️ Desktop / Laptop (Keyboard)
| Aksi | Tombol Keyboard |
| :--- | :--- |
| **Gerak Kiri / Kanan** | `A` / `D` atau Tombol Panah `◀` / `▶` |
| **Lompat** | `W` atau `Space` atau Panah `▲` |
| **Jongkok / Tangkis (Guard)** | `S` atau Panah `▼` *(Tahan mundur untuk tangkis)* |
| **Pukulan Normal (Punch)** | `J` atau `Z` |
| **Tendangan Normal (Kick)** | `K` atau `X` |
| **Jurus Khusus 1 (SP 1)** | `U` atau `C` *(Babi / Ethanol / Tray)* |
| **Ultimate Skill (ULT)** | `I` atau `V` *(Semut / Oil / Megaphone)* |

### 📱 Smartphone / Tablet (Touchscreen Gamepad)
* **D-Pad Virtual (Kiri Bawah):** Tombol arah digital untuk gerak, lompat, dan jongkok/tangkis.
* **Tombol Aksi (Kanan Bawah):**
  * `[PUNCH]` (Merah)
  * `[KICK]` (Biru)
  * `[SP 1]` (Kuning - Jurus 1)
  * `[ULT]` (Ungu - Ultimate Skill)

---

## 🌐 Mode Permainan

1. **Singleplayer vs Bot:**
   * Pilihan 4 tingkat kecerdasan AI: **EASY**, **MEDIUM**, **HARD**, dan **EXPERT**.
2. **Online Multiplayer P2P (WebRTC):**
   * Pemain 1 klik **"Buat Ruang"** dan mendapatkan 4 digit Room Code (misal: `IKN8`).
   * Pemain 2 dari HP atau laptop lain memasukkan kode tersebut dan klik **"Gabung"**.
   * Kedua pemain terhubung langsung secara Peer-to-Peer dengan latensi sangat rendah (<25ms).
3. **Live Active Online Players:**
   * Widget counter aktif di sudut layar menampilkan jumlah penantang arcade yang sedang online secara real-time.
4. **Profil & Statistik Pemain:**
   * Simpan profil via Email/Guest, lengkap dengan statistik Menang, Kalah, Winrate (%), dan Rekor Kombo Tertinggi.

---

## 💻 Instalasi & Menjalankan di Lokal

### Prasyarat:
* Node.js versi 18 atau lebih baru (`node -v`)

### Langkah Menjalankan:
```bash
# 1. Clone repositori
git clone https://github.com/siput-bersenjata/indogame.git
cd indogame

# 2. Install dependencies
npm install

# 3. Jalankan server development lokal
npm run dev
```
Akses game di browser melalui: `http://localhost:3000`

---

## 🚀 Langkah Deploy ke Vercel

Proyek ini sudah dilengkapi konfigurasi `vercel.json` dan bundler Vite sehingga siap di-deploy langsung tanpa error:

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New Project"** > **"Import Git Repository"**.
3. Pilih repository: `siput-bersenjata/indogame`.
4. Pengaturan Framework Preset akan otomatis terdeteksi sebagai **Vite**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Klik tombol **Deploy**.
6. Website game fighting 16-bit Anda akan langsung live dalam beberapa detik dengan URL gratis dari Vercel (misal: `https://indogame.vercel.app`)!

---

## 📦 Repositori GitHub
* URL Repository: [https://github.com/siput-bersenjata/indogame](https://github.com/siput-bersenjata/indogame)
