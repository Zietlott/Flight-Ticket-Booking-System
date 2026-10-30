'use strict';

/**
 * services/authService.js
 * Xử lý đăng ký / đăng nhập (TV1).
 *
 * Cách dùng (TV2):
 *   const { register, login } = require('./services/authService');
 *   const r = await register('An', 'matkhau123');
 *   if (!r.success) { ... r.code, r.message ... }
 *
 * Cả hai hàm đều là async và KHÔNG ném lỗi do dữ liệu sai;
 * luôn trả về { success, code, message, user? }.
 * `user` chỉ gồm { id, username, createdAt } – không có password/passwordHash.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;
const USERS_FILE = process.env.USERS_FILE || path.join(__dirname, '..', 'data', 'users.json');

// Hash giả để so sánh khi không tìm thấy user (tránh lộ tên đăng nhập qua thời gian phản hồi)
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', SALT_ROUNDS);

/* ---------- Lưu trữ (file JSON) ---------- */

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const data = raw.trim() ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

/* ---------- Tiện ích ---------- */

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function fail(code, message) {
  return { success: false, code, message };
}

/** Chỉ trả về thông tin an toàn, loại bỏ password/passwordHash. */
function toPublicUser(user) {
  return { id: user.id, username: user.username, createdAt: user.createdAt };
}

/** Kiểm tra dữ liệu đầu vào chung cho register/login. Trả về lỗi hoặc null. */
function validateInput(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return fail('INVALID_TYPE', 'Tên đăng nhập và mật khẩu phải là chuỗi.');
  }
  if (username.trim() === '' || password === '') {
    return fail('EMPTY_FIELD', 'Tên đăng nhập và mật khẩu không được để trống.');
  }
  return null;
}

/* ---------- register ---------- */

async function register(username, password) {
  const invalid = validateInput(username, password);
  if (invalid) return invalid;

  if (password.length < MIN_PASSWORD_LENGTH) {
    return fail('PASSWORD_TOO_SHORT', `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
  }

  const normalized = normalizeUsername(username);
  const users = readUsers();

  if (users.some((u) => u.username === normalized)) {
    return fail('USERNAME_TAKEN', 'Tên đăng nhập đã tồn tại.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Đọc lại sau khi băm (bất đồng bộ) để giảm nguy cơ trùng khi có nhiều request cùng lúc
  const latest = readUsers();
  if (latest.some((u) => u.username === normalized)) {
    return fail('USERNAME_TAKEN', 'Tên đăng nhập đã tồn tại.');
  }

  const newUser = {
    id: latest.length ? Math.max(...latest.map((u) => Number(u.id) || 0)) + 1 : 1,
    username: normalized,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  latest.push(newUser);
  writeUsers(latest);

  return { success: true, code: 'REGISTERED', message: 'Đăng ký thành công.', user: toPublicUser(newUser) };
}

/* ---------- login ---------- */

async function login(username, password) {
  const invalid = validateInput(username, password);
  if (invalid) return invalid;

  const normalized = normalizeUsername(username);
  const user = readUsers().find((u) => u.username === normalized);

  // Luôn gọi compare để thời gian xử lý tương đương dù user có tồn tại hay không
  const match = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

  if (!user || !match) {
    return fail('INVALID_CREDENTIALS', 'Tên đăng nhập hoặc mật khẩu không đúng.');
  }

  return { success: true, code: 'LOGGED_IN', message: 'Đăng nhập thành công.', user: toPublicUser(user) };
}

module.exports = { register, login };
