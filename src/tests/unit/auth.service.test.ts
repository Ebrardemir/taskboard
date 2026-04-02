import { describe, expect, it } from "vitest";

import { registerUser } from "../../modules/auth/auth.service";

describe("authService", () => {
  it("creates a user after register", async () => {
    const uniqueEmail = `user-${Date.now()}@example.com`;
    const result = await registerUser({
      username: "testuser",
      email: uniqueEmail,
      password: "secret123",
    });

    expect(result.email).toBe(uniqueEmail);
    expect(result.username).toBe("testuser");
  });
});
