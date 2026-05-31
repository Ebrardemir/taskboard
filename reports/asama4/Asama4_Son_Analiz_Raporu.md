---
title: "YZM 404 — Yazılım Kalite Güvencesi | Aşama 4: Son Statik Analiz Raporu"
---

&nbsp;

&nbsp;

&nbsp;

# YZM 404 — Yazılım Kalite Güvencesi

&nbsp;

# Dönem Projesi — Aşama 4
# Son Statik Analiz Raporu

&nbsp;

## **Task Board (Görev Yönetim Uygulaması)**

&nbsp;

*Mayıs 2026*
https://github.com/Ebrardemir/taskboard

&nbsp;

| Öğrenci Adı | Öğrenci No |
|---|---|
| İrem Bengü Bal | 220229030 |
| Zeynep Ebrar Demir | 210229029 |
| Gizem Zor | 210229060 |
| Oya Ilgın Akyıldız | 220229047 |
| Mehmet Vasfi Türkmen | 210229032 |

&nbsp;

*Task Board — YazilimKaliteGuvencesiTaskboard*

---

&nbsp;

## 1. Giriş

Bu rapor, YZM 404 Yazılım Kalite Güvencesi dersi kapsamında geliştirilen Task Board (Görev Yönetim Uygulaması) projesinin Aşama 4 gerekliliklerini karşılamak üzere hazırlanmıştır.

Raporun amacı, Aşama 3'te gerçekleştirilen kod güncellemeleri sonrasında projenin SonarQube ve ESLint araçlarıyla yürütülen **son statik analizinin** bulgularını sistematik biçimde ortaya koymak ve Aşama 2'deki ilk analiz sonuçlarıyla karşılaştırarak elde edilen kalite iyileştirmesini ölçmektir.

Analiz edilen proje; Node.js/Express tabanlı bir backend, React/Vite tabanlı bir frontend ve SQLite veritabanından oluşan full-stack bir görev yönetim uygulamasıdır.
Proje bağlantısı: https://github.com/Ebrardemir/taskboard

---

## 2. Kullanılan Araçlar ve Yapılandırma

### 2.1 SonarQube

| Özellik | Değer |
|---|---|
| **Versiyon** | SonarQube Community Edition v9.9.8 (Docker) |
| **Proje Anahtarı** | YazilimKaliteGuvencesiTaskboard |
| **Analiz Kapsamı** | Projeye ait tüm kaynak dosyalar (client/ + src/) |
| **Issue Türleri** | BUG, CODE\_SMELL |
| **Severity Seviyeleri** | BLOCKER / CRITICAL / MAJOR / MINOR / INFO |
| **API Çıktısı** | reports/asama4/sonarqube-issues.json, reports/asama4/sonarqube-measures.json |

### 2.2 ESLint

| Özellik | Değer |
|---|---|
| **Versiyon** | ESLint v10.2.0 (Flat Config) |
| **Kural Seti** | @eslint/js (recommended), @typescript-eslint (recommended), eslint-plugin-react (recommended), eslint-plugin-react-hooks, eslint-plugin-react-refresh, no-empty, no-unused-vars |
| **Konfigürasyon Dosyaları** | eslint.config.mts (backend+test), client/eslint.config.js (frontend) |
| **Rapor Formatı** | JSON (--format json) |
| **API Çıktısı** | reports/asama4/eslint.json |
| **Analiz Kapsamı** | Tüm .ts ve .tsx kaynak dosyaları |

> **Not:** Aşama 4 analizinde Aşama 2 ile birebir aynı araçlar, kural setleri ve yapılandırma dosyaları kullanılmıştır. Karşılaştırmanın tutarlı olması amacıyla herhangi bir kural eklenmemiş veya çıkarılmamıştır.

---

## 3. SonarQube Analiz Sonuçları

### 3.1 Issue Özeti

SonarQube analizi tamamlandığında projede hiçbir BUG, VULNERABILITY ve **CODE\_SMELL** tespit edilmemiştir. `reports/asama4/sonarqube-issues.json` dosyasında toplam issue sayısı **0** olarak raporlanmıştır. Bu sonuç, Aşama 2'de tespit edilen 1 adet MINOR seviyeli Code Smell'in (`src/tests/unit/business-rules.test.ts` dosyasındaki kullanılmayan `z` importu) Aşama 3'te başarıyla giderildiğini doğrulamaktadır.

| Issue Türü | Sayı | Durum |
|---|---|---|
| BUG | 0 | ✓ Temiz |
| CODE\_SMELL | 0 | ✓ Temiz |
| VULNERABILITY | 0 | ✓ Temiz |

### 3.2 Metrik Sonuçları

Aşağıdaki tablo, `reports/asama4/sonarqube-measures.json` dosyasından alınan tüm metrikleri içermektedir:

| Metrik | Değer | En İyi? | Açıklama |
|---|---|---|---|
| bugs | **0** | ✓ En iyi | Tespit edilen hata sayısı 0 = mükemmel. |
| code\_smells | **0** | ✓ En iyi | Code smell sıfıra indirildi. |
| duplicated\_lines\_density | **%0.0** | ✓ En iyi | Kod tekrarı yüzdesi. 0 = kopya satır yok. |
| ncloc | **1135** | — | Net kod satır sayısı (yorum ve boş satırlar hariç). |
| complexity | **151** | — | Siklomatik karmaşıklık (toplam karar noktası sayısı). |
| cognitive\_complexity | **103** | — | Bilişsel karmaşıklık. |
| reliability\_rating | **A (1.0)** | ✓ En iyi | Güvenilirlik notu. A = en yüksek seviye. |
| sqale\_rating | **A (1.0)** | ✓ En iyi | Teknik borç notu. A = sürdürülebilir kod. |
| security\_rating | **A (1.0)** | ✓ En iyi | Güvenlik notu. A = güvenlik açığı yok. |
| vulnerabilities | **0** | ✓ En iyi | Güvenlik açığı sayısı 0 = temiz. |
| security\_hotspots | **7** | — | Güvenlik sıcak noktaları. Manuel inceleme gerektirir. |
| sqale\_index | **0 dk** | ✓ En iyi | Teknik borç süresi. 0 = mükemmel. |
| sqale\_debt\_ratio | **%0.0** | ✓ En iyi | Teknik borç oranı. %0 = mükemmel. |

### 3.3 Dikkat Gerektiren Metrikler

Tüm kritik metrikler en iyi değerdedir. Aşağıdaki tek metrik hâlâ izlenmeye devam etmelidir:

- **security\_hotspots: 7** — Aşama 2'de 12 olan güvenlik sıcak noktası sayısı 7'ye düşürülmüştür. Kalan 7 hotspot, JWT işleme ve bcrypt şifre yönetimi gibi kasıtlı olarak güvenli biçimde tasarlanmış yapılara işaret etmektedir. Bu noktalar SonarQube arayüzünden "Safe / Reviewed" olarak işaretlenmiş durumdadır.

---

## 4. ESLint Analiz Sonuçları

### 4.1 Genel Özet

ESLint analizi toplam **59 dosyayı** kapsayan proje genelinde **0 hata ve 0 uyarı** tespit etmiştir. Aşama 2'de 12 farklı dosyada yoğunlaşan 32 hata tamamen giderilmiştir.

| Metrik | Değer |
|---|---|
| Analiz Edilen Dosya Sayısı | **59** |
| Hata İçeren Dosya Sayısı | **0** |
| Toplam Hata (Error) | **0** |
| Toplam Uyarı (Warning) | **0** |
| Otomatik Düzeltilebilir Hata | 0 |

### 4.2 Giderilen Hatalar

Aşama 3'te gerçekleştirilen kod güncellemeleri kapsamında Aşama 2'de raporlanan tüm ESLint hataları aşağıdaki şekilde giderilmiştir:

| Kural | Aşama 2 Hata Sayısı | Aşama 4 Hata Sayısı | Çözüm Yöntemi |
|---|---|---|---|
| @typescript-eslint/no-explicit-any | 20 | 0 | `any` tipleri `unknown` veya özgün tipler ile değiştirildi |
| no-empty | 4 | 0 | Boş catch bloklarına `console.error` veya yorum eklendi |
| react-hooks/rules-of-hooks | 1 | 0 | `useEffect` koşullu çağrımı if bloğu dışına taşındı |
| react-refresh/only-export-components | 2 | 0 | `eslint-disable-next-line` direktifi ile bastırıldı |
| @typescript-eslint/no-unused-vars | 1 | 0 | `eslint-disable-next-line` direktifi ile bastırıldı |
| @typescript-eslint/no-empty-object-type | 2 | 0 | Boş interface'ler `type alias`'a dönüştürüldü |
| react-hooks/set-state-in-effect | 2 | 0 | `useEffect` içi state güncellemeleri yeniden düzenlendi |
| **Toplam** | **32** | **0** | |

### 4.3 Suppressed (Bastırılan) Mesajlar

Aşama 4 raporunda bazı mesajlar `eslint-disable-next-line` direktifi ile bastırılmış olup `suppressedMessages` alanında görünmektedir. Bu mesajlar aktif hata sayımına dahil edilmemekte, ancak raporda şeffaflık adına kayıt altına alınmaktadır:

- **`error.middleware.ts`** — `@typescript-eslint/no-unused-vars`: Express 4 parametreli hata işleme middleware'inde `_next` parametresi, framework gereği imzada bulunmak zorunda olduğundan `eslint-disable` ile bastırılmıştır.
- **`AuthContext.tsx`** — `react-refresh/only-export-components`: `useAuth` hook'u aynı dosyadan dışa aktarıldığından, context mimarisini bozmamak adına kural bastırılmıştır.
- **`ThemeContext.tsx`** — `react-refresh/only-export-components`: `useTheme` hook'u için aynı gerekçeyle kural bastırılmıştır.

---

## 5. İlk ve Son Statik Analiz Karşılaştırması

### 5.1 SonarQube Karşılaştırması

| Metrik | Aşama 2 (İlk) | Aşama 4 (Son) | Değişim |
|---|---|---|---|
| bugs | 0 | 0 | — |
| code\_smells | **1** | **0** | ✓ -1 |
| sqale\_index | **2 dk** | **0 dk** | ✓ -2 dk |
| sqale\_debt\_ratio | %0.0 | %0.0 | — |
| vulnerabilities | 0 | 0 | — |
| security\_hotspots | **12** | **7** | ✓ -5 |
| reliability\_rating | A (1.0) | A (1.0) | — |
| security\_rating | A (1.0) | A (1.0) | — |
| sqale\_rating | A (1.0) | A (1.0) | — |
| duplicated\_lines\_density | %0.0 | %0.0 | — |
| ncloc | 1484 | 1135 | -349 (refactoring) |
| complexity | 193 | 151 | ✓ -42 |
| cognitive\_complexity | 102 | 103 | ≈ aynı |

### 5.2 ESLint Karşılaştırması

| Metrik | Aşama 2 (İlk) | Aşama 4 (Son) | Değişim |
|---|---|---|---|
| Analiz Edilen Dosya Sayısı | 63 | 59 | -4 |
| Hata İçeren Dosya Sayısı | **12** | **0** | ✓ -12 |
| Toplam Hata (Error) | **32** | **0** | ✓ -32 |
| Toplam Uyarı (Warning) | 0 | 0 | — |

### 5.3 Kural Bazlı ESLint Karşılaştırması

| Kural | Aşama 2 | Aşama 4 |
|---|---|---|
| @typescript-eslint/no-explicit-any | 20 | **0** |
| no-empty | 4 | **0** |
| react-hooks/rules-of-hooks | 1 | **0** |
| react-refresh/only-export-components | 2 | **0** |
| @typescript-eslint/no-unused-vars | 1 | **0** |
| @typescript-eslint/no-empty-object-type | 2 | **0** |
| react-hooks/set-state-in-effect | 2 | **0** |

---

## 6. Genel Değerlendirme

### 6.1 Güçlü Yönler

- **ESLint'te tam temizlik:** Aşama 2'de 32 olan toplam hata sayısı Aşama 4'te **0**'a indirilmiştir. 12 farklı dosyada yoğunlaşan tüm ihlaller giderilmiştir.
- **SonarQube Code Smell sıfırlandı:** Aşama 2'de tespit edilen 1 adet MINOR seviyeli Code Smell (`business-rules.test.ts` dosyasındaki kullanılmayan `z` importu) temizlenmiştir.
- **Teknik borç sıfırlandı:** `sqale_index` 2 dakikadan **0 dakikaya** düşürülmüştür.
- **Tüm kalite notları A seviyesini korudu:** Güvenilirlik, güvenlik ve sürdürülebilirlik metrikleri en yüksek seviye olan A notundadır.
- **Sıfır kod tekrarı korundu:** `duplicated_lines_density` %0.0 olarak kalmıştır.
- **Siklomatik karmaşıklık azaldı:** `complexity` metriki 193'ten **151**'e gerilemiştir. Bu, Aşama 3'te gerçekleştirilen refactoring çalışmalarının olumlu bir sonucudur.
- **Güvenlik hotspot sayısı azaldı:** 12'den **7**'ye düşen security_hotspots, güvenlik açısından hassas alanların incelendiğini ve kısmen temizlendiğini göstermektedir.

### 6.2 Gözlemler

- **cognitive\_complexity (103):** Aşama 2'de 102 olan bilişsel karmaşıklık, Aşama 4'te 103 olarak ölçülmüştür. Bu marginal artış, Aşama 3'te eklenen yeni özellikler (admin modülü, token revocation gibi) ile açıklanabilir; mevcut 1135 satır kod için kabul edilebilir bir aralıktadır.
- **ncloc (1135 vs 1484):** Net kod satır sayısının 1484'ten 1135'e düşmesi, `any` tiplerinin özgün tipler ile değiştirilmesi ve gereksiz kod kalıntılarının temizlenmesiyle sağlanan kod yoğunluğu artışını yansıtmaktadır.

---

## 7. Sonuç

Task Board projesi, son statik analiz aşamasında Aşama 2 ile kıyaslandığında **önemli bir kalite iyileştirmesi** sergilemektedir. ESLint hata sayısı **32'den 0'a**, SonarQube Code Smell sayısı **1'den 0'a** ve teknik borç **2 dakikadan 0 dakikaya** indirilmiştir. Güvenlik hotspot sayısı ise 12'den 7'ye gerilemiştir.

Aşama 2'de planlanan 12 aksiyon maddesinin tamamı başarıyla hayata geçirilmiştir:

- `@typescript-eslint/no-explicit-any` ihlalleri özgün TypeScript tipleri ile giderilmiş, tip güvencesi artırılmıştır.
- React Hook kuralı ihlalleri (`rules-of-hooks`, `set-state-in-effect`) düzeltilerek üretim ortamındaki potansiyel tutarsızlıklar önlenmiştir.
- Boş catch blokları anlamlı hata yönetimi ile güncellenmiş, `debugging` süreci kolaylaştırılmıştır.
- Güvenlik sıcak noktaları manuel olarak incelenmiş ve uygun şekilde sınıflandırılmıştır.

Tüm SonarQube kalite notları (güvenilirlik, güvenlik, sürdürülebilirlik) A seviyesini korumakta; kod tekrarı ve güvenlik açığı sayısı sıfır düzeyinde bulunmaktadır. Bu sonuçlar, uygulanan kalite güvencesi sürecinin başarılı biçimde tamamlandığını ortaya koymaktadır.

&nbsp;

*Mayıs 2026 — YZM 404 Yazılım Kalite Güvencesi*

---

*Task Board — YazilimKaliteGuvencesiTaskboard*
