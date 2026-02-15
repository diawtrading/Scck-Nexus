const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const isSupabase = db.isUsingSupabase();

    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const registerSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().required(),
        role: Joi.string().valid('Admin', 'CEO', 'CFO', 'COO').required()
    });

    const generateToken = (user) => {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
    };

    const verifyToken = (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ success: false, error: 'Invalid token' });
        }
    };

    router.post('/login', async (req, res) => {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let user;
            if (isSupabase) {
                user = await db.getAsync('users', { email: value.email });
            } else {
                user = db.get('SELECT * FROM users WHERE email = ?', [value.email]);
            }
            
            if (!user) {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            const passwordValid = bcrypt.compareSync(value.password, user.password);
            
            if (!passwordValid) {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            const token = generateToken(user);
            
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    department: user.department,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.post('/register', verifyToken, async (req, res) => {
        try {
            if (req.user.role !== 'Admin') {
                return res.status(403).json({ success: false, error: 'Unauthorized' });
            }

            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existingUser;
            if (isSupabase) {
                existingUser = await db.getAsync('users', { email: value.email });
            } else {
                existingUser = db.get('SELECT id FROM users WHERE email = ?', [value.email]);
            }
            
            if (existingUser) {
                return res.status(400).json({ success: false, error: 'User already exists' });
            }

            const hashedPassword = bcrypt.hashSync(value.password, 10);
            const departmentValue = value.department || 'Administration';

            let result;
            if (isSupabase) {
                result = await db.runAsync('users', {
                    email: value.email,
                    password: hashedPassword,
                    name: value.name,
                    role: value.role,
                    department: departmentValue,
                    created_at: new Date().toISOString()
                });
            } else {
                result = db.run(
                    'INSERT INTO users (email, password, name, role, department) VALUES (?, ?, ?, ?, ?)',
                    [value.email, hashedPassword, value.name, value.role, departmentValue]
                );
            }

            res.json({
                success: true,
                message: 'User registered successfully',
                userId: result.lastInsertRowid
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.get('/verify', verifyToken, async (req, res) => {
        try {
            let user;
            if (isSupabase) {
                user = await db.getAsync('users', { id: req.user.id });
            } else {
                user = db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
            }
            
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    department: user.department,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error('Verify error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.post('/demo-login', (req, res) => {
        try {
            const demoAccounts = {
                'ceo@scck.com': { name: 'John Dupont', role: 'CEO', dept: 'Management' },
                'cfo@scck.com': { name: 'Marie Koné', role: 'CFO', dept: 'Finance' },
                'ops@scck.com': { name: 'Amadou Touré', role: 'COO', dept: 'Operations' }
            };

            const { email } = req.body;
            
            if (!demoAccounts[email]) {
                return res.status(401).json({ success: false, error: 'Invalid demo account' });
            }

            const demoUser = {
                id: Math.floor(Math.random() * 1000),
                email,
                ...demoAccounts[email]
            };

            const token = jwt.sign(
                { id: demoUser.id, email: demoUser.email, role: demoUser.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: demoUser.id,
                    email: demoUser.email,
                    name: demoUser.name,
                    role: demoUser.role,
                    department: demoUser.dept,
                    avatar: demoUser.name.split(' ').map(n => n[0]).join('')
                }
            });
        } catch (error) {
            console.error('Demo login error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    return router;
};
