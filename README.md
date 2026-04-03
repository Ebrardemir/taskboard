# TaskBoard API

Bu proje, Yazilim Kalite Guvencesi dersi icin gelistirilen katmanli (layered architecture) bir backend API projesidir.
Teknoloji yiginimiz su an:
- Node.js
- Express
- TypeScript
- SQLite
- JWT


## Mevcut Durum

Su an calisan kisimlar:
- SQLite baglantisi var
- Schema init var
- Manuel seed komutu var
- Register calisiyor
- Login calisiyor
- JWT token uretiliyor
- Logout blacklist mantigi ile calisiyor
- Admin / user rol kontrolu calisiyor
- Admin tum kullanicilari gorebiliyor

  ### 1. Kapsamlı Hata Yönetimi (Error Handling)
Task varlığı için geliştirilen `task.controller.ts` içerisindeki tüm CRUD operasyonları asenkron mimariye uygun olarak `try/catch` blokları ile sarmalanmıştır. Bu geliştirme ile:
- Sunucu çökmeleri engellenerek hataların güvenli bir şekilde yönetilmesi sağlanmıştır.
- Zod üzerinden dönen doğrulama (validation) hataları ve eksik veriler yakalanıp istemciye **400 Bad Request** olarak dönülmektedir.
- Olmayan veya silinmiş bir göreve erişilmeye çalışıldığında servis katmanından fırlatılan özel hatalar yakalanarak **404 Not Found** koduyla sunulmaktadır.
- Beklenmeyen tüm hatalar projenin global hata yakalayıcısına (`errorMiddleware`) yönlendirilerek güvenli hata akışı tamamlanmıştır.

### 2. Birim Testleri (Unit Tests)
Uygulamanın çekirdek iş kurallarını (business logic) güvenceye almak amacıyla `task.service.ts` için **Vitest** kullanılarak 10 adet birim (unit) testi yazılmıştır.
- Testlerin izole bir şekilde, veritabanına ve ağa bağlanmadan çok hızlı çalışabilmesi için `task.repository.ts` mock'lanmıştır (davranışları taklit edilmiştir).
- Başarılı oluşturma, okuma, listeleme, güncelleme ve silme senaryoları doğrulanmıştır.
- "Görev veritabanında bulunamadı" (Olmayan ID) ve "Başkasının görevini değiştirme/silme denemesi" (Yetki Hatası) gibi kritik sınır durumları (edge cases) test edilerek sistemin açıkları kapatılmıştır.

Birim testlerini çalıştırmak için şu komutu kullanabilirsiniz:
```bash
npm run test:unit

## Klasor Yapisi

- `src/app.ts`
  Express uygulamasinin ana giris dosyasi. Router'lar burada baglanir.

- `src/server.ts`
  Uygulamayi ayaga kaldirir. Database schema init burada calisir.

- `src/config/`
  Ortam degiskenleri ve SQLite baglantisi burada tutulur.

- `src/db/`
  Schema, seed ve manuel seed komutu burada bulunur.

- `src/modules/auth/`
  Register, login, logout akisi burada bulunur.
  - `auth.routes.ts`: endpoint tanimlari
  - `auth.controller.ts`: request/response handling
  - `auth.service.ts`: is kurallari
  - `auth.validation.ts`: input validation

- `src/modules/admin/`
  Admin-only endpointler burada bulunur.

- `src/modules/tasks/`
  Task CRUD akisinin yazilacagi ana domain modulu.

- `src/repositories/`
  Veritabani sorgulari burada bulunur.
  - `user.repository.ts`: users tablosu islemleri
  - `task.repository.ts`: tasks tablosu islemleri
  - `revoked-token.repository.ts`: logout blacklist islemleri

- `src/middleware/`
  Auth, role ve global error middleware burada bulunur.

- `src/types/`
  Auth ve task ile ilgili ortak TypeScript tipleri burada tutulur.

- `src/utils/`
  Hash, JWT, token hash ve ortak error sinifi gibi yardimci yapilar burada bulunur.

## Auth Mantigi

- Register:
  Yeni kullanici olusturur.
  Sifre bcrypt ile hashlenir.
  Register response'u token donmez, sadece kullanici bilgisini doner.

- Login:
  Email ve sifre kontrol edilir.
  Basariliysa JWT token doner.

- Logout:
  JWT token dogrudan iptal edilemedigi icin token'in SHA-256 hash'i `revoked_tokens` tablosuna yazilir.
  Auth middleware gelen token'i dogruladiktan sonra bu blacklist tablosunda kontrol eder.
  Hash varsa `401 Unauthorized` doner.

## Seed Kullanicilar

`npm run seed` komutu su kullanicilari ekler:
- `ebrar@example.com / ebrar1`
- `bengu@example.com / bengu1`
- `gizem@example.com / gizem1`
- `oya@example.com / oya1`
- `admin@example.com / admin1`

Not:
- Seed veri silmez
- Kullanici zaten varsa tekrar eklemez

## Calistirma

1. Projeyi bilgisayarina cek:
   `git clone <repo-url>`
2. Proje klasorune gir:
   `cd note-api`
3. Bagimliliklari yukle:
   `npm install`
4. Ilk kurulum icin seed bas:
   `npm run seed`
5. Uygulamayi gelistirme modunda calistir:
   `npm run dev`

