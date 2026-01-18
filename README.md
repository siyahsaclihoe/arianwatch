<div align="center">

# 🎌 ArianWatch

### Modern Türkçe Anime Streaming Platformu

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-Latest-black.svg)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Kendi sunucunuzda çalıştırabileceğiniz, modern ve kullanıcı dostu anime streaming platformu**

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [Teknolojiler](#-teknolojiler) • [Katkıda Bulunma](#-katkıda-bulunma)

---

</div>

## 📋 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🎯 Öne Çıkan Yetenekler](#-öne-çıkan-yetenekler)
- [🚀 Kurulum](#-kurulum)
  - [Gereksinimler](#gereksinimler)
  - [Hızlı Başlangıç](#hızlı-başlangıç)
  - [Detaylı Kurulum](#detaylı-kurulum)
  - [Windows Kullanıcıları İçin](#windows-kullanıcıları-için)
- [💻 Kullanım](#-kullanım)
- [🛠️ Teknolojiler](#️-teknolojiler)
- [📁 Proje Yapısı](#-proje-yapısı)
- [⚙️ Konfigürasyon](#️-konfigürasyon)
- [👨‍💼 Admin Paneli](#-admin-paneli)
- [🤖 AI Önerileri (Opsiyonel)](#-ai-önerileri-opsiyonel)
- [🔐 Güvenlik](#-güvenlik)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)
- [📞 İletişim](#-iletişim)

---

## ✨ Özellikler

### 🎬 Video & İzleme
- **HD Kalitede Anime İzleme** - Kesintisiz streaming deneyimi
- **Özel Video Oynatıcı** - Gömülü intro atla butonu
- **Çoklu Altyazı Desteği** - Farklı çevirmenler ve versiyonlar
- **Intro Atlama** - Otomatik veya manuel intro skip özelliği
- **İzleme Geçmişi** - Kaldığınız yerden devam edin

### 📱 Kullanıcı Deneyimi
- **Modern ve Responsive Tasarım** - Her cihazda mükemmel görünüm
- **Gelişmiş Arama ve Filtreleme** - Türe, yıla, popülerliğe göre filtrele
- **Karanlık/Aydınlık Tema** - Göz sağlığınız için tema seçenekleri
- **Kişiselleştirilmiş Profiller** - Avatar, kapak fotoğrafı ve bio
- **XP ve Seviye Sistemi** - İzledikçe seviye atlayın

### 📅 İçerik Yönetimi
- **Haftalık Yayın Takvimi** - Yeni bölümleri kaçırmayın
- **İzleme Listeleri** - İzliyorum, İzleyeceğim, Tamamlandı, Bırakıldı
- **Favori Sistemı** - En sevdiğiniz animeleri kaydedin
- **Anime Puanlama** - 1-10 arası puan verin

### 💬 Sosyal Özellikler
- **Bölüm Yorumları** - Topluluk ile etkileşim
- **Spoiler Koruması** - Spoiler içeren yorumlar gizli
- **Upvote/Downvote Sistemi** - En iyi yorumlar üstte
- **Bildirim Sistemi** - Yanıtlar ve sistem bildirimleri

### 🤖 Yapay Zeka
- **AI Destekli Anime Önerileri** - Ollama/Llama 3.2 ile akıllı öneriler
- **Kişiselleştirilmiş Öneri Motoru** - İzleme geçmişinize göre öneriler
- **Arkadaş Canlısı AI Asistanı** - Doğal dil ile anime arama

### 🛡️ Yönetim & Güvenlik
- **Kapsamlı Admin Paneli** - Anime, bölüm, kullanıcı yönetimi
- **Role-Based Access Control** - Admin, Moderator, Translator rolleri
- **JWT Authentication** - Güvenli kimlik doğrulama
- **Rate Limiting** - API koruma ve spam önleme
- **Helmet.js** - Gelişmiş güvenlik başlıkları

---

## 🎯 Öne Çıkan Yetenekler

| Özellik | Açıklama | Durum |
|---------|----------|-------|
| 🎥 **Custom Video Player** | Intro skip, klavye kısayolları, oynatma hızı kontrolü | ✅ Aktif |
| 🤖 **AI Recommendations** | Llama 3.2 tabanlı akıllı anime önerileri | ✅ Aktif |
| 📱 **Progressive Web App** | Mobil cihazlara yüklenebilir | 🚧 Yakında |
| 🌐 **Multi-Language Support** | Çoklu dil desteği | 🚧 Yakında |
| 📊 **Analytics Dashboard** | İstatistik ve raporlama | 🚧 Yakında |
| 🔔 **Push Notifications** | Yeni bölüm bildirimleri | 🚧 Yakında |

---

## 🚀 Kurulum

### Gereksinimler

Sisteminizde aşağıdaki yazılımların yüklü olması gerekmektedir:

- **Node.js** `18.x` veya üzeri ([İndir](https://nodejs.org/))
- **npm** `9.x` veya üzeri (Node.js ile birlikte gelir)
- **Git** ([İndir](https://git-scm.com/))
- **SQLite** (opsiyonel, varsayılan olarak kullanılır)
- **PostgreSQL** (opsiyonel, production için önerilir)

### Hızlı Başlangıç

```bash
# 1. Projeyi klonla
git clone https://github.com/siyahsaclihoe/arianwatch.git
cd arianwatch

# 2. Bağımlılıkları yükle
npm install
cd frontend && npm install && cd ..

# 3. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle

# 4. Veritabanını hazırla
npx prisma generate
npx prisma db push

# 5. Uygulamayı başlat (2 terminal gerekli)
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**Tarayıcıda açın:** `http://localhost:3000`

---

### Detaylı Kurulum

#### 1️⃣ **Projeyi İndirin**

```bash
git clone https://github.com/siyahsaclihoe/arianwatch.git
cd arianwatch
```

#### 2️⃣ **Backend Bağımlılıklarını Yükleyin**

```bash
npm install
```

Bu komut şu paketleri yükleyecektir:
- Express.js - Backend framework
- Prisma - ORM (Object-Relational Mapping)
- JWT - Token bazlı kimlik doğrulama
- bcryptjs - Şifre hashleme
- Axios - HTTP client
- Winston - Logging
- Helmet - Güvenlik middleware'i

#### 3️⃣ **Frontend Bağımlılıklarını Yükleyin**

```bash
cd frontend
npm install
cd ..
```

Bu komut şu paketleri yükleyecektir:
- Next.js - React framework
- React & React DOM - UI library
- Tailwind CSS - CSS framework
- Lucide React - Icon library
- TypeScript - Type safety

#### 4️⃣ **Ortam Değişkenlerini Ayarlayın**

Kök dizinde `.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="file:./dev.db"
# Production için PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/arianwatch?schema=public"

# JWT Secrets (ÖNEMLİ: Bunları değiştirin!)
JWT_ACCESS_SECRET="gizli-bir-anahtar-yaz-buraya-minimum-32-karakter"
JWT_REFRESH_SECRET="baska-gizli-anahtar-yaz-buraya-minimum-32-karakter"

# Server
PORT=4000
NODE_ENV=development

# AI (Opsiyonel)
OLLAMA_API_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
```

> **⚠️ Güvenlik Uyarısı:** `JWT_ACCESS_SECRET` ve `JWT_REFRESH_SECRET` değerlerini mutlaka değiştirin! Production ortamında güçlü, rastgele anahtarlar kullanın.

#### 5️⃣ **Veritabanını Hazırlayın**

```bash
# Prisma client'ı oluştur
npx prisma generate

# Veritabanı şemasını uygula
npx prisma db push

# (Opsiyonel) Prisma Studio ile veritabanını görüntüle
npx prisma studio
```

#### 6️⃣ **Uygulamayı Başlatın**

İki farklı terminal penceresi açın:

**Terminal 1 - Backend:**
```bash
npm run dev
```
✅ Backend `http://localhost:4000` adresinde çalışacak

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend `http://localhost:3000` adresinde çalışacak

#### 7️⃣ **Tarayıcıda Açın**

Tarayıcınızda şu adresi açın:
```
http://localhost:3000
```

---

### Windows Kullanıcıları İçin

Windows kullanıcıları için otomatik başlatma script'i mevcuttur:

**`start_ArianWatch.bat`** dosyasına çift tıklayın.

Bu script:
- ✅ Gerekli bağımlılıkları kontrol eder
- ✅ Backend ve Frontend'i otomatik başlatır
- ✅ Tarayıcıda otomatik açar
- ✅ Her şeyi tek tıkla halleder!

---

## 💻 Kullanım

### İlk Kullanıcı Kaydı

1. Ana sayfada **"Kayıt Ol"** butonuna tıklayın
2. Kullanıcı adı, email ve şifre girin
3. Kayıt olduktan sonra otomatik giriş yapılacak

### Admin Hesabı Oluşturma

İlk kullanıcıyı admin yapmak için:

**Yöntem 1: Prisma Studio**
```bash
npx prisma studio
```
- `User` tablosuna gidin
- İlgili kullanıcının `role` alanını `ADMIN` yapın

**Yöntem 2: Script ile**
```bash
npx ts-node make-admin.ts
```
- Kullanıcı adını girin
- Admin yetkisi otomatik verilecek

### Admin Panel

Admin hesabıyla giriş yaptıktan sonra:
- Navbar'da profil dropdown menüsünden **"Admin Panel"** seçin
- Veya direkt `http://localhost:3000/admin` adresine gidin

**Admin Panelinde Yapabilecekleriniz:**
- 📺 **Anime Yönetimi:** Yeni anime ekle, düzenle, sil
- 🎬 **Bölüm Yönetimi:** Bölüm ekle/düzenle, intro zamanlarını ayarla
- 👥 **Kullanıcı Yönetimi:** Kullanıcıları göster, rol değiştir
- 🎨 **Hero Slider:** Ana sayfa slider'ını yönet
- 💬 **Yorum Moderasyonu:** Yorumları gizle/göster

### Anime Ekleme

1. Admin Panel > Anime Yönetimi > Yeni Anime Ekle
2. Gerekli bilgileri doldurun:
   - **Başlık:** Anime adı
   - **Slug:** URL-friendly isim (örn: `attack-on-titan`)
   - **Synopsis:** Kısa açıklama
   - **Türler:** Virgülle ayrılmış (örn: `Aksiyon, Macera, Drama`)
   - **Yıl:** 2024
   - **Poster URL:** Anime görseli
   - **Yayın Günü:** Pazartesi=0, Salı=1, ..., Pazar=6
   - **Yayın Saati:** `14:30` formatında
3. Kaydet

### Bölüm Ekleme

1. Admin Panel > Anime Yönetimi > Animenin yanındaki **"Bölümler"** butonu
2. Yeni Bölüm Ekle
3. Bilgileri doldurun:
   - **Bölüm Numarası:** 1, 2, 3, ...
   - **Başlık:** (Opsiyonel) Bölüm başlığı
   - **Embed URL:** Video URL'i
   - **Intro Başlangıç:** `1:30` formatında (dakika:saniye)
   - **Intro Bitiş:** `3:00` formatında
4. Kaydet

---

## 🛠️ Teknolojiler

### Frontend Stack

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Next.js** | Latest | React framework, SSR desteği |
| **React** | 18+ | UI library |
| **TypeScript** | 5.0 | Type safety |
| **Tailwind CSS** | 3.0 | Utility-first CSS |
| **Lucide React** | Latest | Modern icon kütüphanesi |
| **Axios** | 1.0+ | HTTP client |

### Backend Stack

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Express.js** | 4.18+ | Web framework |
| **TypeScript** | 5.0 | Type safety |
| **Prisma** | 5.0+ | ORM (Object-Relational Mapping) |
| **SQLite** | - | Development veritabanı |
| **PostgreSQL** | - | Production veritabanı (opsiyonel) |
| **JWT** | 9.0+ | Token-based authentication |
| **bcryptjs** | 2.4+ | Password hashing |
| **Winston** | 3.0+ | Logging library |
| **Helmet** | 8.1+ | Security middleware |
| **Express Rate Limit** | 8.2+ | API rate limiting |

### AI & External Services

| Servis | Açıklama |
|--------|----------|
| **Ollama** | Local AI inference engine |
| **Llama 3.2** | Meta'nın language model'i |

---

## 📁 Proje Yapısı

```
arianwatch/
│
├── 📂 frontend/                 # Next.js Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/       # React bileşenleri
│   │   │   ├── Navbar.tsx       # Navigation bar
│   │   │   ├── Sidebar.tsx      # Sidebar menu
│   │   │   ├── AnimeCard.tsx    # Anime kartı
│   │   │   ├── VideoPlayer.tsx  # Custom video player
│   │   │   ├── AIRecommend.tsx  # AI öneri bileşeni
│   │   │   └── ...
│   │   ├── 📂 pages/            # Next.js sayfaları
│   │   │   ├── index.tsx        # Ana sayfa
│   │   │   ├── anime/
│   │   │   │   └── [id].tsx     # Anime detay sayfası
│   │   │   ├── admin.tsx        # Admin panel
│   │   │   ├── schedule.tsx     # Yayın takvimi
│   │   │   ├── settings.tsx     # Ayarlar
│   │   │   └── ...
│   │   ├── 📂 context/          # React context'ler
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── 📂 styles/           # CSS dosyaları
│   │   │   └── globals.css      # Global stiller
│   │   └── 📂 utils/            # Yardımcı fonksiyonlar
│   ├── 📂 public/               # Static dosyalar
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── 📂 src/                      # Express Backend
│   ├── 📂 routes/               # API route'ları
│   │   ├── authRoutes.ts        # Kimlik doğrulama
│   │   ├── animeRoutes.ts       # Anime CRUD
│   │   ├── episodeRoutes.ts     # Bölüm CRUD
│   │   ├── userRoutes.ts        # Kullanıcı işlemleri
│   │   ├── commentRoutes.ts     # Yorum sistemi
│   │   └── ...
│   ├── 📂 middleware/           # Express middleware'ler
│   │   ├── auth.ts              # JWT doğrulama
│   │   └── roleCheck.ts         # Role-based access
│   ├── 📂 utils/                # Yardımcı fonksiyonlar
│   │   └── logger.ts            # Winston logger
│   └── server.ts                # Ana server dosyası
│
├── 📂 prisma/                   # Prisma ORM
│   ├── schema.prisma            # Veritabanı şeması
│   └── dev.db                   # SQLite veritabanı (git'te yok)
│
├── 📄 .env                      # Ortam değişkenleri (git'te yok)
├── 📄 .env.example              # Örnek .env dosyası
├── 📄 .gitignore                # Git ignore kuralları
├── 📄 LICENSE                   # MIT Lisansı
├── 📄 README.md                 # Bu dosya
├── 📄 package.json              # Backend dependencies
├── 📄 tsconfig.json             # TypeScript config
├── 📄 make-admin.ts             # Admin yapma script'i
└── 📄 start_ArianWatch.bat      # Windows başlatma script'i
```

---

## ⚙️ Konfigürasyon

### Database Configuration

**SQLite (Development):**
```env
DATABASE_URL="file:./dev.db"
```

**PostgreSQL (Production):**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/arianwatch?schema=public"
```

Veritabanını değiştirdikten sonra:
```bash
npx prisma db push
npx prisma generate
```

### JWT Configuration

`.env` dosyasında:
```env
JWT_ACCESS_SECRET="minimum-32-karakter-uzunlugunda-rastgele-string"
JWT_REFRESH_SECRET="baska-minimum-32-karakter-uzunlugunda-rastgele-string"
```

Güvenli anahtar oluşturmak için:
```bash
# Node.js REPL'de
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS Configuration

`src/server.ts` dosyasında:
```typescript
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL'i
  credentials: true
}));
```

Production için:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

---

## 👨‍💼 Admin Paneli

### Admin Rolü Verme

**Script ile:**
```bash
npx ts-node make-admin.ts
```

**Manuel olarak (Prisma Studio):**
```bash
npx prisma studio
```
- User tablosunda kullanıcıyı bulun
- `role` alanını `ADMIN` yapın

### Admin Panel Özellikleri

#### 📺 Anime Yönetimi
- Yeni anime ekleme
- Mevcut anime düzenleme
- Anime silme
- Bölüm listesi görüntüleme

#### 🎬 Bölüm Yönetimi
- Bölüm ekleme
- Embed URL güncelleme
- Intro zamanlarını ayarlama (format: `1:30`)
- Altyazı varyantları ekleme

#### 👥 Kullanıcı Yönetimi
- Tüm kullanıcıları görüntüleme
- Kullanıcı rollerini değiştirme
  - `USER` - Normal kullanıcı
  - `MODERATOR` - Moderatör
  - `TRANSLATOR` - Çevirmen
  - `ADMIN` - Yönetici

#### 🎨 Hero Slider Yönetimi
- Ana sayfa slider'ına yeni slide ekleme
- Mevcut slide'ları düzenleme
- Sıralama ayarlama
- Aktif/Pasif yapma

#### 💬 Yorum Moderasyonu
- Tüm yorumları görüntüleme
- İstenmeyen yorumları gizleme
- Spoiler işaretleme

---

## 🤖 AI Önerileri (Opsiyonel)

ArianWatch, Ollama ve Llama 3.2 kullanarak akıllı anime önerileri sunar.

### Ollama Kurulumu

1. **Ollama'yı İndirin**
   - [Ollama.ai](https://ollama.ai/) adresinden indirin
   - Windows, macOS veya Linux için kurulum yapın

2. **Llama 3.2 Modelini İndirin**
   ```bash
   ollama pull llama3.2
   ```

3. **Ollama'yı Başlatın**
   ```bash
   ollama serve
   ```
   Varsayılan olarak `http://localhost:11434` adresinde çalışır

4. **`.env` Dosyasını Güncelleyin**
   ```env
   OLLAMA_API_URL="http://localhost:11434"
   OLLAMA_MODEL="llama3.2"
   ```

### AI Özelliklerini Test Etme

1. Uygulamayı başlatın
2. Arama çubuğundaki **AI** butonuna tıklayın
3. "Aksiyon animeleri öner" gibi bir şey yazın
4. AI sizin için kişiselleştirilmiş öneriler sunacak

AI Asistanı:
- ✅ İzleme geçmişinizi analiz eder
- ✅ İzleme listenizdeki animeleri dikkate alır
- ✅ Tercihlerinize göre öneriler sunar
- ✅ Arkadaş canlısı ve saygılı bir dil kullanır

---

## 🔐 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **JWT Authentication** - Token bazlı güvenli kimlik doğrulama
- ✅ **bcrypt Password Hashing** - Şifreler hashlenmiş olarak saklanır
- ✅ **Helmet.js** - HTTP güvenlik başlıkları
- ✅ **CORS Protection** - Cross-Origin istekleri kontrol edilir
- ✅ **Rate Limiting** - API abuse önleme
- ✅ **Input Validation** - SQL injection önleme
- ✅ **Role-Based Access Control** - Yetki bazlı erişim

### Güvenlik En İyi Pratikleri

1. **`.env` Dosyasını Asla Paylaşmayın**
   - JWT secret'larınızı güvende tutun
   - Production ortamında güçlü anahtarlar kullanın

2. **Düzenli Güncellemeler**
   ```bash
   npm audit
   npm audit fix
   ```

3. **HTTPS Kullanın**
   - Production ortamında mutlaka HTTPS kullanın
   - SSL sertifikası edinin (Let's Encrypt ücretsiz)

4. **Veritabanı Yedekleme**
   - Düzenli olarak veritabanı yedekleri alın
   - Yedeklerinizi güvenli yerlerde saklayın

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! 🎉

### Nasıl Katkıda Bulunulur?

1. **Fork Edin**
   ```bash
   # GitHub'da "Fork" butonuna tıklayın
   ```

2. **Klonlayın**
   ```bash
   git clone https://github.com/KULLANICI-ADINIZ/arianwatch.git
   cd arianwatch
   ```

3. **Yeni Branch Oluşturun**
   ```bash
   git checkout -b feature/harika-ozellik
   ```

4. **Değişikliklerinizi Yapın**
   - Kod yazın
   - Test edin
   - Commit edin
   ```bash
   git add .
   git commit -m "✨ Harika özellik eklendi"
   ```

5. **Push Edin**
   ```bash
   git push origin feature/harika-ozellik
   ```

6. **Pull Request Açın**
   - GitHub'da repository'nize gidin
   - "New Pull Request" butonuna tıklayın
   - Değişikliklerinizi açıklayın

### Commit Mesajı Kuralları

Commit mesajlarınızda emoji kullanın:

- ✨ `:sparkles:` - Yeni özellik
- 🐛 `:bug:` - Bug fix
- 📝 `:memo:` - Dokümantasyon
- 🎨 `:art:` - UI/UX iyileştirme
- ⚡ `:zap:` - Performans iyileştirme
- 🔒 `:lock:` - Güvenlik fix
- ♻️ `:recycle:` - Refactoring

Örnek:
```bash
git commit -m "✨ AI öneri sistemi eklendi"
git commit -m "🐛 Video player bug'ı düzeltildi"
git commit -m "📝 README güncellendi"
```

### Kod Standartları

- TypeScript kullanın
- ESLint kurallarına uyun
- Anlamlı değişken isimleri kullanın
- Kodunuzu yorum satırları ile açıklayın
- Her PR için test yazın (gelecekte)

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.

```
MIT License

Copyright (c) 2024 ArianWatch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

### Geliştirici

**GitHub:** [@siyahsaclihoe](https://github.com/siyahsaclihoe)

### Destek & Sorular

- 🐛 **Bug Bildirimi:** [GitHub Issues](https://github.com/siyahsaclihoe/arianwatch/issues)
- 💡 **Özellik Önerisi:** [GitHub Discussions](https://github.com/siyahsaclihoe/arianwatch/discussions)
- 📧 **Email:** Proje sahibiyle iletişim için GitHub profili

### Topluluk

- ⭐ Bu projeyi beğendiyseniz **GitHub'da yıldız** verin!
- 🔄 **Fork** edin ve kendi versiyonunuzu oluşturun!
- 🤝 **Katkıda bulunun** ve topluluğa katılın!

---

<div align="center">

### 🌟 ArianWatch ile anime izlemenin keyfini çıkarın! 🌟

**Made with ❤️ in Turkey 🇹🇷**

[![GitHub Stars](https://img.shields.io/github/stars/siyahsaclihoe/arianwatch?style=social)](https://github.com/siyahsaclihoe/arianwatch)
[![GitHub Forks](https://img.shields.io/github/forks/siyahsaclihoe/arianwatch?style=social)](https://github.com/siyahsaclihoe/arianwatch/fork)
[![GitHub Issues](https://img.shields.io/github/issues/siyahsaclihoe/arianwatch)](https://github.com/siyahsaclihoe/arianwatch/issues)

**[⬆ Yukarı Çık](#-arianwatch)**

</div>
