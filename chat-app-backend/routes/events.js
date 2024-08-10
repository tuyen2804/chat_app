const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const config = require('../config');

// Tạo pool kết nối
const pool = mysql.createPool(config.db);

// Cấu hình multer để lưu trữ file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Thêm sự kiện mới
router.post('/add', upload.single('background_image'), (req, res) => {
    const { name, start_time, end_time, location, description } = req.body;
    const background_image_url = req.file ? `/images/${req.file.filename}` : null;

    pool.query(
        'INSERT INTO events (background_image_url, name, start_time, end_time, location, description) VALUES (?, ?, ?, ?, ?, ?)',
        [background_image_url, name, start_time, end_time, location, description],
        (err, results) => {
            if (err) return res.status(500).send('Lỗi trên máy chủ.');
            res.status(200).send('Sự kiện đã được thêm thành công.');
        }
    );
});

// Lấy danh sách sự kiện
router.get('/', (req, res) => {
    pool.query('SELECT * FROM events', (err, results) => {
        if (err) return res.status(500).send('Lỗi trên máy chủ.');
        res.status(200).json(results);
    });
});

module.exports = router;
