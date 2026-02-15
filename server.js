require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Database initialization
const Database = require('./db/database');
const db = new Database();

// Initialize database
db.initialize();

// Static files
app.use(express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.use('/api/auth', require('./api/auth')(db));
app.use('/api/producers', require('./api/producers')(db));
app.use('/api/collections', require('./api/collections')(db));
app.use('/api/finance', require('./api/finance')(db));
app.use('/api/inventory', require('./api/inventory')(db));
app.use('/api/employees', require('./api/employees')(db));
app.use('/api/customers', require('./api/customers')(db));
app.use('/api/suppliers', require('./api/suppliers')(db));
app.use('/api/projects', require('./api/projects')(db));
app.use('/api/dashboard', require('./api/dashboard')(db));
app.use('/api/reports', require('./api/reports')(db));

// Frontend routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(status).json({
        success: false,
        error: {
            status,
            message,
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SCCK ERP NEXUS Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    db.close();
    process.exit(0);
});

module.exports = app;
