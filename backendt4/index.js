const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const config = require('./config');

const app = express();

// Cấu hình pool kết nối MySQL từ config
const pool = mysql.createPool(config.db);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const systemRoutes = require('./routes/system');  // Import route mới
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/system', systemRoutes);  // Sử dụng route mới

// Khởi động server
app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
    console.log(`Access the server at http://localhost:${config.server.port}`);
});
