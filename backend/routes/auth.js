const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db.js');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        if (email !== email.toLowerCase()) {
            return res.status(400).json({
                error: 'Email must be all lowercase'
            });
        }

        if (password.length() < 6) {
            return res.status(400).json({
                error: 'Minimal length of password is 6 characters'
            });
        }

        if (role !== 'paciente' && role !== 'medico' && role !== 'secretaria') {
            return res.status(400).json({
                error: 'Invalid role'
            })
        }

        const [existing] = await db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existing.length) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
            [name, email, passwordHash, role]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const [users] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (!users.length) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const user = users[0];

        const validPassword = await bcrypt.compare(
            password,
            user.senha
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                perfil: user.perfil
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        res.json({
            message: 'Authentication successful',
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// GET /api/auth/verify
router.get('/verify', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        res.json({
            authenticated: true,
            user: decoded
        });

    } catch (error) {
        res.status(401).json({
            authenticated: false,
            error: 'Invalid or expired token'
        });
    }
});

module.exports = router;