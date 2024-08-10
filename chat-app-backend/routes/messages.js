const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config');

const connection = mysql.createConnection(config.db);

router.post('/send', (req, res) => {
    const { sender, receiver, message } = req.body;
    connection.query('INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)', [sender, receiver, message], (err, results) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send('Message sent successfully.');
    });
});

router.get('/get/:username', (req, res) => {
    const { username } = req.params;
    connection.query('SELECT * FROM messages WHERE receiver = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).json(results);
    });
});

module.exports = router;
