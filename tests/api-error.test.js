
const request = require("supertest");

jest.mock("../services/authService", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const authService = require("../services/authService");
const app = require("../app");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Lab09 - API Error Testing (TV3)", () => {
  test("API01 - Reject malformed JSON", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send('{"username": "testuser",');

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      code: "INVALID_JSON",
      message: "Dữ liệu gửi lên không đúng định dạng JSON",
    });
    expect(authService.register).not.toHaveBeenCalled();
  });

  test("API02 - Reject request body larger than 10 KB", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "a".repeat(11 * 1024),
        password: "Password123",
      });

    expect(response.statusCode).toBe(413);
    expect(response.body).toEqual({
      success: false,
      code: "PAYLOAD_TOO_LARGE",
      message: "Dữ liệu gửi lên quá lớn",
    });
    expect(authService.register).not.toHaveBeenCalled();
  });

  test("API03 - Return 404 for unknown endpoint", async () => {
    const response = await request(app)
      .get("/api/unknown-endpoint");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      success: false,
      code: "NOT_FOUND",
      message: "Không tìm thấy đường dẫn yêu cầu",
    });
  });

  test("API04 - Handle unexpected service error", async () => {
    authService.register.mockRejectedValueOnce(
      new Error("Simulated database failure"),
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "testuser",
          password: "Password123",
        });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        success: false,
        code: "SERVER_ERROR",
        message: "Lỗi hệ thống, vui lòng thử lại sau",
      });
      expect(authService.register).toHaveBeenCalledTimes(1);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
