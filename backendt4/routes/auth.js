const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Cấu hình pool kết nối MySQL từ config
const pool = mysql.createPool(config.db);

// Đăng ký người dùng
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Thiếu thông tin đăng ký.');
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Lỗi khi đăng ký:', err);
            return res.status(500).send('Lỗi trên máy chủ.');
        }
        res.status(201).send('Người dùng đã được đăng ký thành công.');
    });
});

// Đăng nhập người dùng
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra xem username và password có bị thiếu không
    if (!username || !password) {
        return res.status(400).send({ auth: false, token: null, message: 'Thiếu thông tin đăng nhập.' });
    }

    // Tìm người dùng trong cơ sở dữ liệu
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Lỗi khi đăng nhập:', err);
            return res.status(500).send({ auth: false, token: null, message: 'Lỗi trên máy chủ.' });
        }

        // Kiểm tra xem có người dùng không
        if (results.length === 0) {
            return res.status(404).send({ auth: false, token: null, message: 'Không tìm thấy người dùng.' });
        }

        const user = results[0];

        // So sánh mật khẩu
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null, message: 'Mật khẩu không đúng.' });
        }

        // Tạo token
        const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: 86400 });

        res.status(200).send({ auth: true, token: token });
    });
});


module.exports = router;
