# TaskBoard

Bu proje, Yazilim Kalite Guvencesi dersi icin gelistirilen katmanli (layered architecture) bir task yonetim uygulamasidir. Backend REST API ve React tabanli bir frontend arayuzunden olusmaktadir.

## Teknoloji Yigini

### Backend
- Node.js + Express 5
- TypeScript
- SQLite
- JWT (jsonwebtoken) + bcrypt
- Zod (validasyon)

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router v6
- Axios

---

## Mevcut Durum

### Backend
- SQLite baglantisi var
- Schema init var
- Manuel seed komutu var
- Register calisiyor
- Login calisiyor
- JWT token uretiliyor
- Logout blacklist mantigi ile calisiyor
- Admin / user rol kontrolu calisiyor
- Admin tum kullanicilari gorebiliyor
- Admin tum gorevleri gorebiliyor (`GET /api/admin/tasks`)
- Smoke testler (14/14) tamamlandi
- Unit testler (11/11) tamamlandi

### Frontend
- Giris (Login) ve Kayit (Register) sayfalari
- JWT token localStorage'da tutulmakta, her istege otomatik eklenmektedir
- Dashboard: istatistik kartlari + 3 sutunlu Kanban gorunumu
- Gorevler sayfasi: tablo gorunumu, durum filtresi, baslik arama
- Admin paneli: kullanici tablosu, kullanicilara ait gorev sayilari
- Acik / Koyu tema destegi (toggle butonu, tercih localStorage'a kaydedilir)
- Sadece admin rolundeki kullanicilar Admin Paneli'ne erisebilir

---

Kapsamlı Hata Yönetimi (Error Handling)
Task varlığı için geliştirilen `task.controller.ts` içerisindeki tüm CRUD operasyonları asenkron mimariye uygun olarak `try/catch` blokları ile sarmalanmıştır. Bu geliştirme ile:
- Sunucu çökmeleri engellenerek hataların güvenli bir şekilde yönetilmesi sağlanmıştır.
- Zod üzerinden dönen doğrulama (validation) hataları ve eksik veriler yakalanıp istemciye **400 Bad Request** olarak dönülmektedir.
- Olmayan veya silinmiş bir göreve erişilmeye çalışıldığında servis katmanından fırlatılan özel hatalar yakalanarak **404 Not Found** koduyla sunulmaktadır.
- Beklenmeyen tüm hatalar projenin global hata yakalayıcısına (`errorMiddleware`) yönlendirilerek güvenli hata akışı tamamlanmıştır.

Birim Testleri (Unit Tests)
Uygulamanın çekirdek iş kurallarını (business logic) güvenceye almak amacıyla `task.service.ts` için **Vitest** kullanılarak 10 adet birim (unit) testi yazılmıştır.
- Testlerin izole bir şekilde, veritabanına ve ağa bağlanmadan çok hızlı çalışabilmesi için `task.repository.ts` mock'lanmıştır (davranışları taklit edilmiştir).
- Başarılı oluşturma, okuma, listeleme, güncelleme ve silme senaryoları doğrulanmıştır.
- "Görev veritabanında bulunamadı" (Olmayan ID) ve "Başkasının görevini değiştirme/silme denemesi" (Yetki Hatası) gibi kritik sınır durumları (edge cases) test edilerek sistemin açıkları kapatılmıştır.

Birim testlerini çalıştırmak için şu komutu kullanabilirsiniz:
`npm run test:unit`  

## Klasor Yapisi

```
taskboard/
├── src/                        # Backend kaynak kodlari
│   ├── app.ts                  # Express uygulamasi, router baglantilari
│   ├── server.ts               # Sunucu baslangici, schema init
│   ├── config/                 # Ortam degiskenleri, SQLite baglantisi
│   ├── db/                     # Schema, seed, seed komutu
│   ├── modules/
│   │   ├── auth/               # Register, login, logout
│   │   ├── tasks/              # Task CRUD
│   │   └── admin/              # Admin-only endpointler
│   ├── repositories/           # Veritabani sorgulari
│   ├── middleware/             # Auth, role, error middleware
│   ├── types/                  # Ortak TypeScript tipleri
│   └── utils/                  # JWT, hash, hata sinifi
│
└── client/                     # Frontend kaynak kodlari
    └── src/
        ├── api/                # axios instance, auth/tasks/admin istekleri
        ├── context/            # AuthContext, ThemeContext
        ├── components/
        │   ├── layout/         # Sidebar, Header, Layout
        │   ├── ui/             # Avatar, Badge, StatCard
        │   └── tasks/          # TaskCard, KanbanColumn, TaskModal
        └── pages/              # LoginPage, RegisterPage, DashboardPage, TasksPage, AdminPage
```

---

## Testler

### Smoke Test
Smoke testler uygulamanin kritik fonksiyonlarinin calistigini kontrol eder. 14 adet smoke test var.

```bash
npm run test:smoke
```

Test edilen senaryolar:
- Kullanici kaydi
- Giris ve JWT token uretimi
- Yetkilendirme korumasi (token olmadan erisim)
- Gorev olusturma, listeleme, okuma, guncelleme, silme
- Validasyon kontrolleri
- Admin rol kontrolu
- Yanlis sifre girisi
- Cikis ve token blacklist

### Unit Test
Unit testler tek tek fonksiyonlarin dogru calistigini test eder. 11 adet unit test var.

```bash
npm run test:unit
```

Test edilen bilesenler:
- Auth service (kayit, giris, yetkilendirme)
- Task service (CRUD islemleri, yetkilendirme kontrolleri)

### Tum Testleri Calistir
```bash
npm run test
```

Beklenen sonuc:
```
Test Files  3 passed (3)
Tests  25 passed (25)
```

Test kapsamı:
- Smoke Tests: 14/14
- Unit Tests: 11/11
- Toplam: 25/25

---

## API Endpointleri

### Auth — `/api/auth`
| Method | Endpoint  | Aciklama                 |
| ------ | --------- | ------------------------ |
| POST   | /register | Yeni kullanici olustur   |
| POST   | /login    | Giris yap, JWT don       |
| POST   | /logout   | Token'i blacklist'e ekle |

### Tasks — `/api/tasks` (auth gerekli)
| Method | Endpoint | Aciklama                         |
| ------ | -------- | -------------------------------- |
| GET    | /        | Kullanicinin gorevlerini listele |
| GET    | /:id     | Tek gorev getir                  |
| POST   | /        | Yeni gorev olustur               |
| PATCH  | /:id     | Gorevi guncelle                  |
| DELETE | /:id     | Gorevi sil                       |

### Admin — `/api/admin` (auth + admin rol gerekli)
| Method | Endpoint   | Aciklama                  |
| ------ | ---------- | ------------------------- |
| GET    | /dashboard | Admin erisim kontrolu     |
| GET    | /users     | Tum kullanicilari listele |
| GET    | /tasks     | Tum gorevleri listele     |

---

## Auth Mantigi

- **Register:** Yeni kullanici olusturur. Sifre bcrypt ile hashlenir. Token donmez.
- **Login:** Email ve sifre kontrol edilir. Basariliysa JWT token doner.
- **Logout:** JWT dogrudan iptal edilemediginden token'in SHA-256 hash'i `revoked_tokens` tablosuna yazilir. Auth middleware gelen token'i bu blacklist'te kontrol eder; bulunursa `401` doner.

---

## Seed Kullanicilar

`npm run seed` komutu su kullanicilari ekler:

| Email                 | Sifre     | Rol   |
| --------------------- | --------- | ----- |
| ebrar@example.com     | ebrar1    | user  |
| bengu@example.com     | bengu1    | user  |
| gizem@example.com     | gizem1    | user  |
| oya@example.com       | oya1      | user  |
| mvturkmen@example.com | mvturkmen | user  |
| admin@example.com     | admin1    | admin |

> Seed veri silmez. Kullanici zaten varsa tekrar eklemez.

---

## Calistirma

### Bagimliliklari yukle

```bash
# Backend
npm install

# Frontend
cd client && npm install
```

### Seed verilerini yukle

```bash
npm run seed
```

### Gelistirme modunda calistir

**Backend ve frontend ayri terminallerde:**
```bash
# Terminal 1 — Backend (http://localhost:3000)
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

**Ya da ikisini birden:**
```bash
npm run dev:all
```
