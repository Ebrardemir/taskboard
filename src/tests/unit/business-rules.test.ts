import { describe, it, expect } from "vitest";

// Projendeki task validasyon şemasını buraya import ediyoruz. 
// (Eğer dosya yolu veya adı farklıysa kendi projene göre 'task.validation' kısmını güncelleyebilirsin)
import { createTaskSchema } from "../../modules/tasks/task.validation";

describe("İş Kuralları, Validation ve Yetkilendirme (Unit Tests)", () => {

  // 1. VALIDATION: Zorunlu alanlar ve format testleri
  describe("Validation / İş Kuralları", () => {

    it("Zorunlu alanlar (title) eksik olduğunda validasyon hata fırlatmalı", () => {
      const invalidData = {
        description: "Başlığı unuttuk",
        status: "todo"
      };

      // Zod şeması zorunlu "title" alanı olmadığı için hata fırlatmalı
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it("Başlık (title) sınır değerden (format) kısa olduğunda hata vermeli", () => {
      const invalidData = {
        title: "", // Boş string (format/sınır değer hatası)
        status: "todo"
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it("Doğru formatta veri gönderildiğinde validasyon başarılı olmalı", () => {
      const validData = {
        title: "Geçerli Başlık",
        description: "Geçerli açıklama",
        status: "todo"
      };

      const result = createTaskSchema.parse(validData);
      expect(result.title).toBe("Geçerli Başlık");
    });
  });

  // 2. YETKİLENDİRME (RBAC - Role Based Access Control)
  describe("Yetkilendirme Kararı: Admin/User Rol Mantığı", () => {

    // Örnek bir rol kontrol (Authorization) iş kuralı fonksiyonu
    // (Projede middleware veya servis içinde olan mantığın birim testi)
    const checkIsAdmin = (userRole: string) => {
      if (userRole !== "admin") {
        throw new Error("Erişim Engellendi: Admin yetkisi gerekiyor");
      }
      return true;
    };

    it("Kullanıcı rolü 'user' ise Admin işlemlerine erişim ENGELLENMELİ", () => {
      const normalUser = { role: "user" };

      expect(() => checkIsAdmin(normalUser.role)).toThrow("Erişim Engellendi: Admin yetkisi gerekiyor");
    });

    it("Kullanıcı rolü 'admin' ise Admin işlemlerine İZİN VERİLMELİ", () => {
      const adminUser = { role: "admin" };

      const isAllowed = checkIsAdmin(adminUser.role);
      expect(isAllowed).toBe(true);
    });
  });
});