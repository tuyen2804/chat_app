const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config');

const connection = mysql.createConnection(config.db);

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send('User registered successfully.');
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).send('Error on the server.');
        if (results.length === 0) return res.status(404).send('No user found or incorrect password.');

        const user = results[0];
        res.status(200).send({ auth: true, user });
    });
});

module.exports = router;
