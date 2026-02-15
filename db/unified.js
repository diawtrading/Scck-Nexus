const { createClient } = require('@supabase/supabase-js');

class UnifiedDatabase {
    constructor() {
        this.sqliteDb = null;
        this.supabase = null;
        this.isSupabase = false;
    }

    initialize() {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            console.log('Initializing Supabase connection...');
            return this.initSupabase();
        } else {
            console.log('Initializing SQLite connection...');
            return this.initSqlite();
        }
    }

    initSqlite() {
        const Database = require('better-sqlite3');
        const path = require('path');
        const fs = require('fs');

        this.dbPath = process.env.DB_PATH || path.join(__dirname, '../data/scck_erp.db');
        const dataDir = path.dirname(this.dbPath);
        
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        this.sqliteDb = new Database(this.dbPath);
        this.sqliteDb.pragma('journal_mode = WAL');
        
        this.createTables();
        console.log('SQLite database initialized successfully');
        
        return this;
    }

    initSupabase() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials not found. Falling back to SQLite...');
            return this.initSqlite();
        }

        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true
            }
        });
        
        this.isSupabase = true;
        console.log('Supabase connected successfully');
        
        return this;
    }

    createTables() {
        if (!this.sqliteDb) return;

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
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

        this.sqliteDb.exec(`
            CREATE INDEX IF NOT EXISTS idx_producers_zone ON producers(zone);
            CREATE INDEX IF NOT EXISTS idx_producers_statut ON producers(statut);
            CREATE INDEX IF NOT EXISTS idx_collections_producer ON collections(producer_id);
            CREATE INDEX IF NOT EXISTS idx_collections_date ON collections(date);
            CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
            CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
            CREATE INDEX IF NOT EXISTS idx_employees_departement ON employees(departement);
            CREATE INDEX IF NOT EXISTS idx_customers_pays ON customers(pays);
        `);

        console.log('SQLite tables created successfully');
    }

    // SQLite-compatible sync methods that work with Supabase via Promises
    run(sql, params = []) {
        if (this.isSupabase) {
            throw new Error('Use async runAsync() for Supabase');
        }
        try {
            const stmt = this.sqliteDb.prepare(sql);
            return stmt.run(...params);
        } catch (error) {
            console.error('Database run error:', error);
            throw error;
        }
    }

    get(sql, params = []) {
        if (this.isSupabase) {
            throw new Error('Use async getAsync() for Supabase');
        }
        try {
            const stmt = this.sqliteDb.prepare(sql);
            return stmt.get(...params);
        } catch (error) {
            console.error('Database get error:', error);
            throw error;
        }
    }

    all(sql, params = []) {
        if (this.isSupabase) {
            throw new Error('Use async allAsync() for Supabase');
        }
        try {
            const stmt = this.sqliteDb.prepare(sql);
            return stmt.all(...params);
        } catch (error) {
            console.error('Database all error:', error);
            throw error;
        }
    }

    // Async methods for Supabase (also work with SQLite)
    async runAsync(table, data) {
        if (this.isSupabase) {
            const { data: result, error } = await this.supabase
                .from(table)
                .insert(data)
                .select()
                .single();
            
            if (error) throw error;
            return { lastInsertRowid: result?.id, ...result };
        } else {
            const columns = Object.keys(data).join(', ');
            const placeholders = Object.keys(data).map(() => '?').join(', ');
            const values = Object.values(data);
            
            const stmt = this.sqliteDb.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);
            return stmt.run(...values);
        }
    }

    async getAsync(table, conditions = {}, select = '*') {
        if (this.isSupabase) {
            let query = this.supabase.from(table).select(select);
            
            if (typeof conditions === 'string') {
                query = query.eq('id', conditions);
            } else if (typeof conditions === 'object' && conditions !== null) {
                Object.keys(conditions).forEach(key => {
                    if (conditions[key] !== undefined && conditions[key] !== null) {
                        query = query.eq(key, conditions[key]);
                    }
                });
            }
            
            const { data, error } = await query.single();
            
            if (error) {
                if (error.code === 'PGRST116') return null;
                throw error;
            }
            
            return data;
        } else {
            const conditionsStr = Object.entries(conditions)
                .map(([key, value]) => `${key} = '${value}'`)
                .join(' AND ');
            const sql = `SELECT ${select} FROM ${table} WHERE ${conditionsStr} LIMIT 1`;
            
            const stmt = this.sqliteDb.prepare(sql);
            return stmt.get();
        }
    }

    async allAsync(table, conditions = {}, options = {}) {
        if (this.isSupabase) {
            let query = this.supabase.from(table).select(options.select || '*');
            
            if (conditions && Object.keys(conditions).length > 0) {
                Object.keys(conditions).forEach(key => {
                    if (conditions[key] !== undefined && conditions[key] !== null) {
                        query = query.eq(key, conditions[key]);
                    }
                });
            }
            
            if (options.order) {
                const orderField = options.order.replace(/ DESC/i, '').trim();
                const descending = options.order.toLowerCase().includes('desc');
                query = query.order(orderField, { ascending: !descending });
            }
            
            if (options.limit) {
                query = query.limit(options.limit);
            }
            
            if (options.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return data || [];
        } else {
            let sql = `SELECT * FROM ${table}`;
            const params = [];
            
            if (conditions && Object.keys(conditions).length > 0) {
                const whereClauses = Object.entries(conditions)
                    .filter(([_, value]) => value !== undefined && value !== null)
                    .map(([key, value]) => {
                        params.push(value);
                        return `${key} = ?`;
                    });
                
                if (whereClauses.length > 0) {
                    sql += ' WHERE ' + whereClauses.join(' AND ');
                }
            }
            
            if (options.order) {
                sql += ` ORDER BY ${options.order}`;
            }
            
            if (options.limit) {
                sql += ` LIMIT ${options.limit}`;
            }
            
            if (options.offset) {
                sql += ` OFFSET ${options.offset}`;
            }
            
            const stmt = this.sqliteDb.prepare(sql);
            return stmt.all(...params);
        }
    }

    async updateAsync(table, id, data) {
        if (this.isSupabase) {
            const { data: result, error } = await this.supabase
                .from(table)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return result;
        } else {
            const updateFields = Object.keys(data)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = [...Object.values(data), id];
            
            const stmt = this.sqliteDb.prepare(`UPDATE ${table} SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
            return stmt.run(...values);
        }
    }

    async deleteAsync(table, id) {
        if (this.isSupabase) {
            const { error } = await this.supabase
                .from(table)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { success: true };
        } else {
            const stmt = this.sqliteDb.prepare(`DELETE FROM ${table} WHERE id = ?`);
            return stmt.run(id);
        }
    }

    async countAsync(table, conditions = {}) {
        if (this.isSupabase) {
            let query = this.supabase.from(table).select('*', { count: 'exact', head: true });
            
            Object.keys(conditions).forEach(key => {
                if (conditions[key] !== undefined && conditions[key] !== null) {
                    query = query.eq(key, conditions[key]);
                }
            });
            
            const { count, error } = await query;
            
            if (error) throw error;
            return count || 0;
        } else {
            let sql = `SELECT COUNT(*) as count FROM ${table}`;
            const params = [];
            
            if (conditions && Object.keys(conditions).length > 0) {
                const whereClauses = Object.entries(conditions)
                    .filter(([_, value]) => value !== undefined && value !== null)
                    .map(([key, value]) => {
                        params.push(value);
                        return `${key} = ?`;
                    });
                
                if (whereClauses.length > 0) {
                    sql += ' WHERE ' + whereClauses.join(' AND ');
                }
            }
            
            const stmt = this.sqliteDb.prepare(sql);
            return stmt.get(...params).count;
        }
    }

    async rawAsync(sql) {
        if (this.isSupabase) {
            console.warn('Raw SQL not fully supported in Supabase mode');
            return null;
        }
        
        const stmt = this.sqliteDb.prepare(sql);
        return stmt.all();
    }

    transaction(fn) {
        if (this.isSupabase) {
            console.warn('Transactions not supported in Supabase');
            return fn(this);
        }
        const t = this.sqliteDb.transaction(fn);
        return t();
    }

    close() {
        if (this.isSupabase) {
            this.supabase = null;
            this.isSupabase = false;
        } else if (this.sqliteDb) {
            this.sqliteDb.close();
        }
        console.log('Database connection closed');
    }

    isUsingSupabase() {
        return this.isSupabase;
    }

    getSupabaseClient() {
        return this.supabase;
    }
}

module.exports = UnifiedDatabase;
