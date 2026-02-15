const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class ERPDatabase {
    constructor() {
        this.dbPath = process.env.DB_PATH || path.join(__dirname, '../data/scck_erp.db');
        this.db = null;
    }

    initialize() {
        // Ensure data directory exists
        const dataDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        try {
            this.db = new Database(this.dbPath);
            this.db.pragma('journal_mode = WAL');
            this.createTables();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    createTables() {
        // Users table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                department TEXT,
                avatar TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Producers table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS producers (
                id TEXT PRIMARY KEY,
                nom TEXT NOT NULL,
                zone TEXT NOT NULL,
                superficie REAL,
                statut TEXT DEFAULT 'Active',
                telephone TEXT,
                email TEXT,
                adresse TEXT,
                date_inscription DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Collections table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS collections (
                id TEXT PRIMARY KEY,
                producer_id TEXT NOT NULL,
                date DATETIME NOT NULL,
                quantite REAL NOT NULL,
                qualite TEXT,
                prix_unitaire REAL,
                total REAL,
                statut TEXT DEFAULT 'Recorded',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(producer_id) REFERENCES producers(id)
            )
        `);

        // Finance/Transactions table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                date DATETIME NOT NULL,
                compte TEXT,
                description TEXT NOT NULL,
                debit REAL DEFAULT 0,
                credit REAL DEFAULT 0,
                balance REAL,
                type TEXT,
                reference_id TEXT,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // Inventory table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS inventory (
                id TEXT PRIMARY KEY,
                nom TEXT NOT NULL,
                quantite REAL NOT NULL,
                unite TEXT,
                valeur REAL,
                min_stock REAL,
                max_stock REAL,
                localisation TEXT,
                statut TEXT DEFAULT 'In Stock',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Employees table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY,
                nom TEXT NOT NULL,
                poste TEXT,
                departement TEXT,
                contrat TEXT,
                salaire REAL,
                date_embauche DATETIME,
                statut TEXT DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Customers table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                nom TEXT NOT NULL,
                contact TEXT,
                telephone TEXT,
                email TEXT,
                adresse TEXT,
                ca REAL,
                pays TEXT,
                statut TEXT DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Suppliers table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id TEXT PRIMARY KEY,
                nom TEXT NOT NULL,
                contact TEXT,
                telephone TEXT,
                email TEXT,
                specialite TEXT,
                paiement TEXT,
                statut TEXT DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Projects table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                nom TEXT NOT NULL,
                description TEXT,
                budget REAL,
                depense REAL DEFAULT 0,
                progression REAL DEFAULT 0,
                statut TEXT DEFAULT 'Planned',
                date_debut DATETIME,
                date_fin DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes for performance
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_producers_zone ON producers(zone);
            CREATE INDEX IF NOT EXISTS idx_producers_statut ON producers(statut);
            CREATE INDEX IF NOT EXISTS idx_collections_producer ON collections(producer_id);
            CREATE INDEX IF NOT EXISTS idx_collections_date ON collections(date);
            CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
            CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
            CREATE INDEX IF NOT EXISTS idx_employees_departement ON employees(departement);
            CREATE INDEX IF NOT EXISTS idx_customers_pays ON customers(pays);
        `);

        console.log('Database tables created successfully');
    }

    // Generic query methods
    run(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.run(...params);
        } catch (error) {
            console.error('Database run error:', error);
            throw error;
        }
    }

    get(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.get(...params);
        } catch (error) {
            console.error('Database get error:', error);
            throw error;
        }
    }

    all(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.all(...params);
        } catch (error) {
            console.error('Database all error:', error);
            throw error;
        }
    }

    transaction(fn) {
        const t = this.db.transaction(fn);
        return t();
    }

    close() {
        if (this.db) {
            this.db.close();
            console.log('Database connection closed');
        }
    }

    // Seed initial data
    seedInitialData() {
        console.log('Seeding initial data...');
        
        try {
            // Create default admin user
            const adminExists = this.get('SELECT id FROM users WHERE email = ?', ['admin@scck.com']);
            if (!adminExists) {
                const bcrypt = require('bcryptjs');
                const hashedPassword = bcrypt.hashSync('admin123', 10);
                
                this.run(
                    'INSERT INTO users (email, password, name, role, department) VALUES (?, ?, ?, ?, ?)',
                    ['admin@scck.com', hashedPassword, 'Admin User', 'Admin', 'Administration']
                );
            }

            console.log('Initial data seeded successfully');
        } catch (error) {
            console.error('Seeding error:', error);
        }
    }
}

module.exports = ERPDatabase;
