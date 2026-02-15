const { createClient } = require('@supabase/supabase-js');

class SupabaseDatabase {
    constructor() {
        this.supabase = null;
        this.isConnected = false;
    }

    initialize() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials not found. Using SQLite fallback.');
            const Database = require('./database');
            const sqliteDb = new Database();
            sqliteDb.initialize();
            return sqliteDb;
        }

        try {
            this.supabase = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true
                }
            });
            this.isConnected = true;
            console.log('Supabase connected successfully');
            return this;
        } catch (error) {
            console.error('Supabase connection error:', error);
            console.warn('Falling back to SQLite...');
            const Database = require('./database');
            const sqliteDb = new Database();
            sqliteDb.initialize();
            return sqliteDb;
        }
    }

    async get(table, conditions = {}, select = '*') {
        try {
            let query = this.supabase.from(table).select(select);
            
            if (typeof conditions === 'string') {
                query = query.eq('id', conditions);
            } else {
                Object.keys(conditions).forEach(key => {
                    query = query.eq(key, conditions[key]);
                });
            }
            
            const { data, error } = await query.single();
            
            if (error) {
                if (error.code === 'PGRST116') return null;
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error(`Supabase get error (${table}):`, error);
            throw error;
        }
    }

    async all(table, conditions = {}, options = {}) {
        try {
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
        } catch (error) {
            console.error(`Supabase all error (${table}):`, error);
            throw error;
        }
    }

    async run(table, data) {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .insert(data)
                .select()
                .single();
            
            if (error) throw error;
            
            return { lastInsertRowid: result?.id, ...result };
        } catch (error) {
            console.error(`Supabase run error (${table}):`, error);
            throw error;
        }
    }

    async update(table, id, data) {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            
            return result;
        } catch (error) {
            console.error(`Supabase update error (${table}):`, error);
            throw error;
        }
    }

    async delete(table, id) {
        try {
            const { error } = await this.supabase
                .from(table)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error(`Supabase delete error (${table}):`, error);
            throw error;
        }
    }

    async count(table, conditions = {}) {
        try {
            let query = this.supabase.from(table).select('*', { count: 'exact', head: true });
            
            Object.keys(conditions).forEach(key => {
                if (conditions[key] !== undefined && conditions[key] !== null) {
                    query = query.eq(key, conditions[key]);
                }
            });
            
            const { count, error } = await query;
            
            if (error) throw error;
            
            return count || 0;
        } catch (error) {
            console.error(`Supabase count error (${table}):`, error);
            throw error;
        }
    }

    async raw(sql, params = []) {
        console.warn('Raw SQL queries not supported in Supabase mode. Use Supabase client methods instead.');
        return null;
    }

    async query(sql, params = []) {
        console.warn('Query method not fully supported in Supabase mode.');
        return null;
    }

    transaction(fn) {
        console.warn('Transactions not supported in Supabase mode. Use Supabase RPC if needed.');
        return fn(this);
    }

    async bulkInsert(table, records) {
        try {
            const { data, error } = await this.supabase
                .from(table)
                .insert(records)
                .select();
            
            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error(`Supabase bulk insert error (${table}):`, error);
            throw error;
        }
    }

    async upsert(table, records, options = { onConflict: 'id' }) {
        try {
            const { data, error } = await this.supabase
                .from(table)
                .upsert(records, { onConflict: options.onConflict })
                .select();
            
            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error(`Supabase upsert error (${table}):`, error);
            throw error;
        }
    }

    async aggregate(table, field, operation = 'sum', conditions = {}) {
        try {
            let query = this.supabase.from(table).select(field, { count: 'exact' });
            
            Object.keys(conditions).forEach(key => {
                if (conditions[key] !== undefined && conditions[key] !== null) {
                    query = query.eq(key, conditions[key]);
                }
            });
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            if (!data || data.length === 0) return null;
            
            const values = data.map(row => row[field]).filter(v => v != null);
            
            switch (operation) {
                case 'sum':
                    return values.reduce((a, b) => a + b, 0);
                case 'avg':
                    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                case 'count':
                    return values.length;
                case 'min':
                    return Math.min(...values);
                case 'max':
                    return Math.max(...values);
                default:
                    return null;
            }
        } catch (error) {
            console.error(`Supabase aggregate error (${table}):`, error);
            throw error;
        }
    }

    async join(table1, table2, conditions, select = '*') {
        try {
            const { data, error } = await this.supabase
                .from(table1)
                .select(select)
                .eq(conditions.from, conditions.on)
                .eq(conditions.to, conditions.match);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error(`Supabase join error:`, error);
            throw error;
        }
    }

    getClient() {
        return this.supabase;
    }

    close() {
        this.supabase = null;
        this.isConnected = false;
        console.log('Supabase connection closed');
    }

    isSupabase() {
        return this.isConnected;
    }

    seedInitialData() {
        console.log('Seeding initial data not needed - using Supabase');
    }
}

module.exports = SupabaseDatabase;
