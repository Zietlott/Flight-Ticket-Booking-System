const express = require("express");
const authService = require("./services/authService");

const app = express();

// Giới hạn kích thước body để tránh bị gửi dữ liệu quá lớn.
const MAX_BODY_SIZE = "10kb";

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500
};

/*
 * authService (TV1) KHÔNG ném lỗi do dữ liệu sai, mà trả về
 * { success, code, message, user? }. Các bảng dưới đây ánh xạ `code` -> mã HTTP.
 */
const REGISTER_ERROR_STATUS = {
  INVALID_TYPE: HTTP_STATUS.BAD_REQUEST,
  EMPTY_FIELD: HTTP_STATUS.BAD_REQUEST,
  PASSWORD_TOO_SHORT: HTTP_STATUS.BAD_REQUEST,
  USERNAME_TAKEN: HTTP_STATUS.CONFLICT
};

const LOGIN_ERROR_STATUS = {
  INVALID_TYPE: HTTP_STATUS.BAD_REQUEST,
  EMPTY_FIELD: HTTP_STATUS.BAD_REQUEST,
  INVALID_CREDENTIALS: HTTP_STATUS.UNAUTHORIZED
};

const REGISTER_SUCCESS_MESSAGE = "Đăng ký thành công";
const LOGIN_SUCCESS_MESSAGE = "Đăng nhập thành công";
const SERVER_ERROR_MESSAGE = "Lỗi hệ thống, vui lòng thử lại sau";
const INVALID_JSON_MESSAGE = "Dữ liệu gửi lên không đúng định dạng JSON";
const PAYLOAD_TOO_LARGE_MESSAGE = "Dữ liệu gửi lên quá lớn";
const NOT_FOUND_MESSAGE = "Không tìm thấy đường dẫn yêu cầu";

app.use(express.json({ limit: MAX_BODY_SIZE }));

/**
 * Chỉ giữ các trường an toàn của người dùng; loại bỏ password/passwordHash
 * phòng khi authService vô tình trả thêm.
 */
function removeSensitiveFields(user) {
  if (!user || typeof user !== "object") {
    return user;
  }

  const { passwordHash, password, ...safeUser } = user;
  return safeUser;
}

/** Phản hồi thành công thống nhất: { success: true, message, user }. */
function sendSuccess(res, status, message, user) {
  return res.status(status).json({
    success: true,
    message,
    user: removeSensitiveFields(user)
  });
}

/** Phản hồi lỗi thống nhất: { success: false, code, message }. */
function sendError(res, status, code, message) {
  return res.status(status).json({ success: false, code, message });
}

/** Lỗi hệ thống bất ngờ: ghi log nội bộ, chỉ trả thông báo chung cho client. */
function sendServerError(res, error) {
  console.error("Unexpected error:", error);
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "SERVER_ERROR",
    SERVER_ERROR_MESSAGE
  );
}

/**
 * Chuyển kết quả của authService thành phản hồi HTTP.
 * - result.success === true -> trả successStatus + message thành công + user.
 * - result.success === false -> tra mã HTTP theo result.code; code lạ -> 500.
 */
function sendServiceResult(res, result, successStatus, successMessage, errorStatusByCode) {
  if (result && result.success === true) {
    return sendSuccess(res, successStatus, successMessage, result.user);
  }

  const status = result && errorStatusByCode[result.code];
  if (!status) {
    return sendServerError(res, new Error("authService trả kết quả không xác định"));
  }

  return sendError(res, status, result.code, result.message);
}

/* API đăng ký tài khoản */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const result = await authService.register(username, password);

    return sendServiceResult(
      res,
      result,
      HTTP_STATUS.CREATED,
      REGISTER_SUCCESS_MESSAGE,
      REGISTER_ERROR_STATUS
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

/* API đăng nhập tài khoản */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const result = await authService.login(username, password);

    return sendServiceResult(
      res,
      result,
      HTTP_STATUS.OK,
      LOGIN_SUCCESS_MESSAGE,
      LOGIN_ERROR_STATUS
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

/* Đường dẫn không tồn tại */
app.use((req, res) => {
  sendError(res, HTTP_STATUS.NOT_FOUND, "NOT_FOUND", NOT_FOUND_MESSAGE);
});

/* Xử lý lỗi chung: JSON sai cú pháp, body quá lớn, lỗi không lường trước */
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, "INVALID_JSON", INVALID_JSON_MESSAGE);
  }

  if (error.type === "entity.too.large") {
    return sendError(
      res,
      HTTP_STATUS.PAYLOAD_TOO_LARGE,
      "PAYLOAD_TOO_LARGE",
      PAYLOAD_TOO_LARGE_MESSAGE
    );
  }

  return sendServerError(res, error);
});

module.exports = app;
