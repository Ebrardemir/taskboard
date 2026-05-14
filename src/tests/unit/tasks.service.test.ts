import { describe, it, expect, vi, beforeEach } from "vitest";
import { taskService } from "../../modules/tasks/task.service";
import { taskRepository } from "../../repositories/task.repository";
import type { AuthUser } from "../../types/auth.types";

// Veritabanına gerçekten gitmemek için Repository'i mock'luyoruz
vi.mock("../../repositories/task.repository", () => ({
  taskRepository: {
    findAllByOwnerId: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Task Service Unit Tests", () => {
  // 1. DÜZELTME: "username" alanlarını ekledik ve proper typing yaptık
  const mockUser: AuthUser = { id: 1, email: "user1@example.com", username: "user1", role: "user" };
  const mockOtherUser: AuthUser = { id: 2, email: "user2@example.com", username: "user2", role: "user" };
  const mockTask = { id: 1, title: "Test", description: "Test desc", status: "todo" as const, ownerId: 1 };

  // Her testten önce mock'ları temizle
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Başarılı listeleme
  it("list() -> kullanıcının kendi görevlerini getirmeli", async () => {
    vi.mocked(taskRepository.findAllByOwnerId).mockResolvedValue([mockTask]);
    const tasks = await taskService.list(mockUser);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(1);
  });

  // 2. Başarılı tekil okuma
  it("getById() -> görev kullanıcıya aitse başarıyla getirmeli", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);
    const task = await taskService.getById(mockUser, 1);
    expect(task.title).toBe("Test");
  });

  // 3. Bulunamama hatası (Olmayan ID)
  it("getById() -> görev veritabanında yoksa 'Task not found' hatası fırlatmalı", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(undefined);
    await expect(taskService.getById(mockUser, 999)).rejects.toThrow("Task not found");
  });

  // 4. Yetki hatası (Başkasının görevi)
  it("getById() -> görev başkasına aitse 'Task not found' hatası fırlatmalı", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);
    await expect(taskService.getById(mockOtherUser, 1)).rejects.toThrow("Task not found");
  });

  // 5. Başarılı oluşturma
  it("create() -> yeni bir görev oluşturmalı", async () => {
    const input = { title: "Yeni", description: "Yeni desc" };
    vi.mocked(taskRepository.create).mockResolvedValue({ ...mockTask, ...input });
    const task = await taskService.create(mockUser, input);
    expect(task.title).toBe("Yeni");
    expect(taskRepository.create).toHaveBeenCalledWith(1, input);
  });

  // 6. Başarılı güncelleme
  it("update() -> görev kullanıcıya aitse başarıyla güncellemeli", async () => {
    const input = { status: "done" as const };
    vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);
    vi.mocked(taskRepository.update).mockResolvedValue({ ...mockTask, ...input });

    const task = await taskService.update(mockUser, 1, input);

    // 2. DÜZELTME: task?.status diyerek (optional chaining) TypeScript'i rahatlattık
    expect(task?.status).toBe("done");
  });

  // 7. Güncelleme bulamama hatası
  it("update() -> güncellenecek görev yoksa 'Task not found' hatası fırlatmalı", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(undefined);
    await expect(taskService.update(mockUser, 999, {})).rejects.toThrow("Task not found");
  });

  // 8. Güncelleme yetki hatası
  it("update() -> başkasının görevini güncellerken 'Task not found' hatası fırlatmalı", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);
    await expect(taskService.update(mockOtherUser, 1, {})).rejects.toThrow("Task not found");
  });

  // 9. Başarılı silme
  it("remove() -> görev kullanıcıya aitse silme işlemini veritabanına iletmeli", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);
    vi.mocked(taskRepository.delete).mockResolvedValue(true);

    await taskService.remove(mockUser, 1);
    expect(taskRepository.delete).toHaveBeenCalledWith(1);
  });

  // 10. Silme yetki hatası
  it("remove() -> başkasının görevini silerken 'Task not found' hatası fırlatmalı", async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);
    await expect(taskService.remove(mockOtherUser, 1)).rejects.toThrow("Task not found");
  });
});