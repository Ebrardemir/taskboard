import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Smoke Tests - Critical Application Flows", () => {
  let authToken = "";
  let adminToken = "";
  let taskId = 0;

  
  const timestamp = Date.now();
  const testUserEmail = `smoketest${timestamp}@example.com`;

  // 1. Register (kayıt) → 201
  it("1. Register should create a new user with 201 status", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: `smokeuser${timestamp}`,
        email: testUserEmail,
        password: "SecurePass123!",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("username");
    expect(response.body.data).toHaveProperty("email", testUserEmail);
    expect(response.body.data).toHaveProperty("role", "user");
  });

  // 2. Login (giriş) → 200 (token oluşumu doğrulanır)
  it("2. Login should return 200 with JWT token", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUserEmail,
        password: "SecurePass123!",
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("id");
    expect(typeof response.body.data.token).toBe("string");
    
    authToken = response.body.data.token;
  });

  // 3. Auth gerekli endpoint: login olmadan → 401
  it("3. Accessing protected endpoint without token should return 401", async () => {
    const response = await request(app)
      .get("/api/tasks");

    expect(response.status).toBe(401);
  });

  // 4. Ana varlık oluşturma (Create) (POST /tasks) → 201
  it("4. Create task should return 201 with task details", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Smoke Task",
        description: "This is a smoke test task",
        status: "todo",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title", "Test Smoke Task");
    expect(response.body).toHaveProperty("status", "todo");
    
    taskId = response.body.id;
  });

  // 5. Ana varlık listeleme (Read-list) (GET /tasks) → 200
  it("5. List tasks should return 200 with tasks array", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Check if created task is in list
    const createdTask = response.body.find((t: any) => t.id === taskId);
    expect(createdTask).toBeDefined();
  });

  // 6. Ana varlık okuma (Read-single) (GET /tasks/:id) → 200
  it("6. Get single task should return 200 with task details", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", taskId);
    expect(response.body).toHaveProperty("title", "Test Smoke Task");
  });

  // 7. Ana varlık güncelleme (Update) (PATCH /tasks/:id) → 200
  it("7. Update task should return 200 and update the field", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Smoke Task Title",
        status: "in_progress",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Smoke Task Title");
    expect(response.body).toHaveProperty("status", "in_progress");
  });

  // 8. Ana varlık silme (Delete) (DELETE /tasks/:id) → 204
  it("8a. Delete task should return 204", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(204);
  });

  it("8b. Getting deleted task should return 404", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(404);
  });

  // 9. Validation (hatalı istek): geçersiz veri → 400
  it("9. Create task with invalid data should return 400", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "", // Empty title should fail validation
        status: "todo",
      });

    expect(response.status).toBe(400);
  });

  // 10a. Admin-only endpoint: user ile → 403
  it("10a. Access admin endpoint as regular user should return 403", async () => {
    const response = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(403);
  });

  // 10b. Admin-only endpoint: admin ile → 200
  it("10b. Access admin endpoint as admin should return 200", async () => {
    // Use seed admin user (admin@example.com / admin1)
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin1",
      });

    expect(loginResponse.status).toBe(200);
    adminToken = loginResponse.body.data.token;

    const response = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });

  // Additional test: Login with wrong password
  it("Login with wrong password should return error", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUserEmail,
        password: "WrongPassword123!",
      });

    expect([400, 401]).toContain(response.status);
  });

  // Additional test: Logout
  it("Logout should return 200", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });
});
