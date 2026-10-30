const request = require("supertest");
const fs = require("fs");
const os = require("os");
const path = require("path");

const testDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "lab08-auth-tests-")
);

const previousUsersFile = process.env.USERS_FILE;
process.env.USERS_FILE = path.join(testDirectory, "users.json");

const app = require("../app");

const validUser = {
  username: "testuser",
  password: "Password123"
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
    await request(app)
      .post("/api/auth/register")
      .send(validUser);

    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe("USERNAME_TAKEN");
  });

  test("TC03 - Login successfully", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(validUser);

    const response = await request(app)
      .post("/api/auth/login")
      .send(validUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.username).toBe("testuser");
  });

  test("TC04 - Reject incorrect password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(validUser);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "WrongPassword123"
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("INVALID_CREDENTIALS");
  });

  test("TC05 - Reject short password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        password: "123"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("PASSWORD_TOO_SHORT");
  });

  test("TC06 - Reject empty username", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "",
        password: "Password123"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("EMPTY_FIELD");
  });

  test("TC07 - Reject missing password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("INVALID_TYPE");
  });
});
