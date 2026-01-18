<div align="center">

# 🎬 ArianWatch

### Türkçe Altyazılı Anime Streaming Platformu

Modern, kullanıcı dostu ve tamamen ücretsiz anime izleme deneyimi.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)

[🚀 Özellikler](#-özellikler) • [📦 Kurulum](#-kurulum) • [🛠️ Teknolojiler](#️-teknolojiler) • [📸 Ekran Görüntüleri](#-ekran-görüntüleri)

</div>

---

## 🌟 Neden ArianWatch?

ArianWatch, anime severler için sıfırdan tasarlanmış, modern ve özgür bir streaming platformudur. Kendi sunucunuzda çalıştırabilir, istediğiniz gibi özelleştirebilir ve topluluğunuzla paylaşabilirsiniz.

### ✨ Öne Çıkan Özellikler

🎨 **Netflix Tarzı Modern Arayüz**
- Glassmorphism ve premium animasyonlar
- 3D hover efektleri
- Responsive ve mobile-friendly tasarım
- Karanlık tema

🤖 **AI Destekli Öneri Sistemi**
- Ollama/Llama entegrasyonu
- Kişiselleştirilmiş anime önerileri
- Doğal dil desteği

📺 **Gelişmiş Video Player**
- Özel tasarım video oynatıcı
- Intro atlama özelliği
- Hız kontrolü ve klavye kısayolları
- Bölüm geçişi

👥 **Sosyal Özellikler**
- Bölüm yorumları
- İzleme listesi
- Favoriler ve değerlendirme
- Kullanıcı profilleri

🛡️ **Admin Paneli**
- Anime ve bölüm yönetimi
- Hero slider düzenleme
- Kullanıcı yönetimi
- İstatistikler

---

## 🚀 Özellikler

### Kullanıcı Özellikleri
- [x] HD kalitede anime izleme
- [x] Gelişmiş arama ve filtreleme
- [x] Türlere göre kategorize edilmiş içerik
- [x] Haftalık yayın takvimi
- [x] İzleme listesi ve favoriler
- [x] Bölüm ilerlemesi takibi
- [x] Responsive tasarım (mobil, tablet, desktop)
- [x] Kullanıcı hesapları ve profiller

### Admin Özellikleri
- [x] Anime ekleme/düzenleme/silme
- [x] Bölüm yönetimi
- [x] Hero slider düzenleme
- [x] Kullanıcı rolleri (Admin, Moderator, User)
- [x] İstatistik ve analitik

### AI Özellikleri
- [x] Llama tabanlı öneri sistemi
- [x] İzleme geçmişine göre öneriler
- [x] Türkçe doğal dil desteği
- [x] Bağlamsal sohbet

---

## 📦 Hızlı Kurulum

### Gereksinimler

Sisteminizde şunların yüklü olması gerekiyor:
- **Node.js** 18 veya üzeri
- **npm** veya **yarn**
- **PostgreSQL** veya **SQLite** (SQLite öneriyoruz - kolay kurulum)

### ⚡ Otomatik Kurulum (Windows)

1. **Repoyu indirin**
```bash
git clone https://github.com/siyahsaclihoe/arianwatch.git
cd arianwatch
```

2. **Kurulum script'ini çalıştırın**
```bash
start_ArianWatch.bat
```

Bu komut otomatik olarak:
- Backend ve frontend bağımlılıklarını yükler
- Veritabanını oluşturur
- Gerekli yapılandırmayı yapar
- Uygulamayı başlatır

### 🔧 Manuel Kurulum

#### 1. Repoyu Klonlayın
```bash
git clone https://github.com/siyahsaclihoe/arianwatch.git
cd arianwatch
```

#### 2. Backend Bağımlılıklarını Yükleyin
```bash
npm install
```

#### 3. Frontend Bağımlılıklarını Yükleyin
```bash
cd frontend
npm install
cd ..
```

#### 4. Ortam Değişkenlerini Ayarlayın

Kök dizinde `.env` dosyası oluşturun:

```env
# Veritabanı (SQLite - kolay kurulum)
DATABASE_URL="file:./dev.db"

# PostgreSQL kullanmak isterseniz:
# DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/arianwatch"

# JWT Secret Keys (güvenli değerler kullanın!)
JWT_ACCESS_SECRET="super-gizli-anahtar-buraya-yazin-min-32-karakter"
JWT_REFRESH_SECRET="baska-gizli-refresh-anahtar-buraya-yazin"

# Port
PORT=4000

# AI Öneri Sistemi (Opsiyonel - Ollama gerektirir)
# OLLAMA_API_URL="http://localhost:11434"
```

#### 5. Veritabanını Hazırlayın
```bash
npx prisma generate
npx prisma db push
```

#### 6. Uygulamayı Başlatın

**İki terminal açın:**

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 7. Tarayıcıda Açın
```
Frontend: http://localhost:3000
Backend API: http://localhost:4000
```

---

## 🎮 İlk Kullanım

### Admin Hesabı Oluşturma

1. Normal bir kullanıcı kaydı yapın
2. Prisma Studio'yu açın:
```bash
npx prisma studio
```
3. `User` tablosunda oluşturduğunuz kullanıcıyı bulun
4. `role` alanını `ADMIN` olarak değiştirin
5. Sayfayı yenileyin - artık admin paneline erişebilirsiniz!

### AI Öneri Sistemini Aktifleştirme (Opsiyonel)

1. **Ollama'yı yükleyin**: https://ollama.ai/download
2. **Llama modelini indirin**:
```bash
ollama pull llama3.2
```
3. `.env` dosyasındaki AI ayarlarını aktif edin
4. Backend'i yeniden başlatın

---

## 🛠️ Teknolojiler

### Frontend
| Teknoloji | Açıklama |
|-----------|----------|
| **Next.js 16** | React framework (Turbopack) |
| **TypeScript** | Type-safe geliştirme |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide Icons** | Modern icon seti |
| **Axios** | HTTP client |

### Backend
| Teknoloji | Açıklama |
|-----------|----------|
| **Express.js** | Node.js web framework |
| **Prisma ORM** | Modern database toolkit |
| **PostgreSQL/SQLite** | Veritabanı |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |

### AI (Opsiyonel)
| Teknoloji | Açıklama |
|-----------|----------|
| **Ollama** | Local AI runtime |
| **Llama 3.2** | Language model |

---

## 📁 Proje Yapısı

```
arianwatch/
├── 📂 frontend/              # Next.js Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/    # React componentleri
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── AnimeCard.tsx
│   │   │   └── ...
│   │   ├── 📂 pages/         # Next.js sayfaları
│   │   │   ├── index.tsx     # Ana sayfa
│   │   │   ├── anime/[id].tsx
│   │   │   ├── admin.tsx
│   │   │   └── ...
│   │   ├── 📂 styles/        # CSS dosyaları
│   │   └── 📂 context/       # React Context
│   └── 📂 public/            # Statik dosyalar
│
├── 📂 src/                   # Express Backend
│   ├── 📂 routes/            # API route'ları
│   │   ├── animeRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── aiRoutes.ts
│   │   └── ...
│   ├── 📂 middleware/        # Express middleware
│   └── server.ts             # Ana sunucu dosyası
│
├── 📂 prisma/                # Prisma ORM
│   └── schema.prisma         # Veritabanı şeması
│
├── 📄 package.json
├── 📄 .env                   # Ortam değişkenleri
├── 📄 README.md
└── 📄 LICENSE
```

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register     # Kayıt ol
POST   /api/auth/login        # Giriş yap
POST   /api/auth/reset-password  # Şifre sıfırla
```

### Anime
```
GET    /api/anime             # Tüm animeler
GET    /api/anime/:id         # Anime detay
POST   /api/anime             # Anime ekle (Admin)
PUT    /api/anime/:id         # Anime düzenle (Admin)
DELETE /api/anime/:id         # Anime sil (Admin)
```

### Episodes
```
GET    /api/anime/:id/episodes  # Anime bölümleri
POST   /api/episodes            # Bölüm ekle (Admin)
```

### AI Recommendations
```
POST   /api/ai/recommend      # AI öneri al
GET    /api/ai/status         # AI durumu
```

---

## 🎨 Tasarım Özellikleri

- **Glassmorphism**: Modern cam efektli kartlar
- **3D Tilt Effects**: Mouse takipli anime kartları
- **Smooth Animations**: 60 FPS akıcı animasyonlar
- **Floating Particles**: Dinamik arka plan efektleri
- **Netflix-Style Carousel**: Otomatik geçişli slider
- **Horizontal Scrolling**: Kategori bazlı kaydırma
- **Skeleton Loading**: Shimmer efektli yükleme

---

## 🔐 Güvenlik

- JWT tabanlı authentication
- bcrypt ile şifre hashleme
- Role-based access control (RBAC)
- SQL injection koruması (Prisma)
- XSS koruması
- CORS yapılandırması

---

## 🚧 Geliştirme Planları

- [ ] Video upload sistemi
- [ ] Çoklu dil desteği
- [ ] Mobil uygulama
- [ ] Email bildirimleri
- [ ] Social login (Google, Discord)
- [ ] Watchlist senkronizasyonu
- [ ] Offline izleme desteği
- [ ] Subtitle editor

---

## 📸 Ekran Görüntüleri

> Not: Ekran görüntüleri yakında eklenecek!

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! İşte nasıl katkıda bulunabilirsiniz:

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

### Katkı Rehberi
- Kod standartlarına uyun
- Commit mesajlarını açıklayıcı yazın
- Büyük değişiklikler için önce issue açın
- Test ekleyin (yakında)

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**siyahsaclihoe**
- GitHub: [@siyahsaclihoe](https://github.com/siyahsaclihoe)

---

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! ⭐ vermeyi unutmayın!

---

<div align="center">

**Made with ❤️ in Turkey**

🇹🇷

[⬆ Başa Dön](#-arianwatch)

</div>
