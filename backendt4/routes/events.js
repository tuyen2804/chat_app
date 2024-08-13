const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const authenticateToken = require('../middleware/auth');

const pool = mysql.createPool(config.db);

// Đảm bảo thư mục upload tồn tại
const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Endpoint để upload tệp
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Không có tệp nào được tải lên.');
    }
    res.status(200).json(req.file);
});

// Thêm sự kiện mới
router.post('/add', authenticateToken, (req, res) => {
    const { name, start_time, end_time, location, description, background_image_url } = req.body;

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
router.get('/', authenticateToken, (req, res) => {
    pool.query('SELECT * FROM events', (err, results) => {
        if (err) return res.status(500).send('Lỗi trên máy chủ.');
        res.status(200).json(results);
    });
});

module.exports = router;
