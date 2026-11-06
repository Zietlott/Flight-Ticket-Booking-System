const request = require("supertest");
const fs = require("fs");
const os = require("os");
const path = require("path");

const testDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "lab08-auth-tests-"),
);

const previousUsersFile = process.env.USERS_FILE;
process.env.USERS_FILE = path.join(testDirectory, "users.json");

const app = require("../app");

const validUser = {
  username: "testuser",
  password: "Password123",
};

beforeEach(() => {
  fs.rmSync(process.env.USERS_FILE, { force: true });
});

afterAll(() => {
  if (previousUsersFile === undefined) {
    delete process.env.USERS_FILE;
  } else {
    process.env.USERS_FILE = previousUsersFile;
  }

  fs.rmSync(testDirectory, { recursive: true, force: true });
});

describe("Authentication API", () => {
  test("TC01 - Register successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.username).toBe("testuser");
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user).not.toHaveProperty("passwordHash");
  });

  test("TC02 - Reject duplicate username", async () => {
    await request(app).post("/api/auth/register").send(validUser);

    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe("USERNAME_TAKEN");
  });

  test("TC03 - Login successfully", async () => {
    await request(app).post("/api/auth/register").send(validUser);

    const response = await request(app).post("/api/auth/login").send(validUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.username).toBe("testuser");
  });

  test("TC04 - Reject incorrect password", async () => {
    await request(app).post("/api/auth/register").send(validUser);

    const response = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "WrongPassword123",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("INVALID_CREDENTIALS");
  });

  test("TC05 - Reject short password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("PASSWORD_TOO_SHORT");
  });

  test("TC06 - Reject empty username", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "",
      password: "Password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("EMPTY_FIELD");
  });

  test("TC07 - Reject missing password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("INVALID_TYPE");
  });

  test("TC08 - Reject username containing only spaces", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "   ",
      password: "Password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe("EMPTY_FIELD");
  });

  test("TC09 - Normalize username whitespace and letter case", async () => {
    const registration = await request(app)
      .post("/api/auth/register")
      .send({ username: " TestUser ", password: "Password123" });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ username: "TESTUSER", password: "Password123" });

    expect(registration.body.user.username).toBe("testuser");
    expect(login.statusCode).toBe(200);
  });

  test("TC10 - Reject registration without a username", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ password: "Password123" });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("INVALID_TYPE");
  });

  test("TC11 - Reject credentials with an invalid data type", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: ["testuser"], password: "Password123" });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("INVALID_TYPE");
  });

  test("TC12 - Reject login for a username that does not exist", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "unknown", password: "Password123" });

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("INVALID_CREDENTIALS");
  });

  test("TC13 - Reject malformed JSON", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"username":');

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("INVALID_JSON");
  });

  test("TC14 - Reject a request body larger than 10 KB", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "x".repeat(11 * 1024) });

    expect(response.statusCode).toBe(413);
    expect(response.body.code).toBe("PAYLOAD_TOO_LARGE");
  });

  test("TC15 - Return not found for an unknown endpoint", async () => {
    const response = await request(app).get("/api/unknown");

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toBe("NOT_FOUND");
  });
});
