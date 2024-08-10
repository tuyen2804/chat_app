const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const config = require('./config'); // Import cấu hình từ file config.js
const app = express();

// Cấu hình kết nối MySQL từ config
const connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306 // Cổng mặc định của MySQL
});

// Kết nối tới cơ sở dữ liệu
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Khởi động server
app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
    console.log(`Access the server at http://localhost:${config.server.port}`);
});
