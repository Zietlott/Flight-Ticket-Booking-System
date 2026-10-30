const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Cổng ${PORT} đang được sử dụng. Hãy đổi PORT hoặc tắt ứng dụng đang chạy.`);
  } else {
    console.error("Không thể khởi động server:", error.message);
  }
  process.exit(1);
});
