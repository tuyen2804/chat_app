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

// Endpoint để upload ảnh bằng Base64
router.post('/uploadBase64', (req, res) => {
    const base64Data = req.body.image;

    if (!base64Data) {
        return res.status(400).send('Không có dữ liệu ảnh được gửi.');
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(uploadDir, `uploaded_image_${Date.now()}.jpg`);

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Lỗi khi lưu ảnh:', err);
            return res.status(500).send('Lỗi khi lưu ảnh.');
        }
        res.status(200).json({ path: `/images/${path.basename(filePath)}` });
    });
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
