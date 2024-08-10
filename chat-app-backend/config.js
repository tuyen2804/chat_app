module.exports = {
    db: {
        host: 'localhost',        // Địa chỉ máy chủ cơ sở dữ liệu
        user: 'root',             // Tài khoản MySQL
        password: '1234',         // Mật khẩu tài khoản MySQL
        database: 'chat_app',     // Tên cơ sở dữ liệu
        connectionLimit: 10       // Số lượng kết nối tối đa trong pool
    },
    server: {
        port: 3000                // Cổng mà server Express sẽ lắng nghe
    }
};
