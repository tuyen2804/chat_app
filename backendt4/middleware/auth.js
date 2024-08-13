const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Token không tồn tại.');

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.status(403).send('Token không hợp lệ.');
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
