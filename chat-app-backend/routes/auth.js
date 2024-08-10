const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config');

// Tạo pool kết nối
const pool = mysql.createPool(config.db);

// Đăng ký người dùng
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
        if (err) return res.status(500).send('Lỗi trên máy chủ.');
        res.status(200).send('Người dùng đã được đăng ký thành công.');
    });
});

// Đăng nhập người dùng
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).send('Lỗi trên máy chủ.');
        if (results.length === 0) return res.status(404).send('Không tìm thấy người dùng hoặc mật khẩu không chính xác.');

        const user = results[0];
        res.status(200).send({ auth: true, user });
    });
});

module.exports = router;
