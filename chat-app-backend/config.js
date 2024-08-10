module.exports = {
    db: {
        host: 'localhost',        // Địa chỉ máy chủ nơi MySQL đang chạy
        user: 'root',             // Tên người dùng MySQL
        password: '1234',         // Mật khẩu của người dùng MySQL
        database: 'chat_app'      // Tên cơ sở dữ liệu MySQL
    },
    server: {
        port: 3000                // Cổng mà server Express sẽ lắng nghe
    }
};
