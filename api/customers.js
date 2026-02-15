const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    const customerSchema = Joi.object({
        nom: Joi.string().required(),
        contact: Joi.string(),
        telephone: Joi.string(),
        email: Joi.string().email(),
        adresse: Joi.string(),
        ca: Joi.number(),
        pays: Joi.string()
    });

    // Get all customers
    router.get('/', async (req, res) => {
        try {
            let customers;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('customers')
                    .select('*')
                    .eq('statut', 'Active')
                    .order('ca', { ascending: false });
                customers = data || [];
            } else {
                customers = db.all('SELECT * FROM customers WHERE statut = "Active" ORDER BY ca DESC');
            }
            res.json({ success: true, data: customers });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create customer
    router.post('/', async (req, res) => {
        try {
            const { error, value } = customerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('customers').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM customers');
            }
            const id = `CUST-${String(existing.length + 1).padStart(4, '0')}`;

            if (isSupabase) {
                await db.getSupabaseClient().from('customers').insert({
                    id,
                    nom: value.nom,
                    contact: value.contact,
                    telephone: value.telephone,
                    email: value.email,
                    adresse: value.adresse,
                    ca: value.ca,
                    pays: value.pays,
                    statut: 'Active'
                });
            } else {
                db.run(
                    `INSERT INTO customers 
                    (id, nom, contact, telephone, email, adresse, ca, pays, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.nom, value.contact, value.telephone, value.email, value.adresse, value.ca, value.pays, 'Active']
                );
            }

            res.status(201).json({ success: true, message: 'Customer added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get customer statistics
    router.get('/stats/overview', async (req, res) => {
        try {
            let total, totalRevenue, topCustomers;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('customers')
                    .select('*')
                    .order('ca', { ascending: false });
                
                total = { count: data?.length || 0 };
                totalRevenue = { total: data?.reduce((sum, c) => sum + (c.ca || 0), 0) || 0 };
                topCustomers = (data || []).slice(0, 5);
            } else {
                total = db.get('SELECT COUNT(*) as count FROM customers');
                totalRevenue = db.get('SELECT SUM(ca) as total FROM customers');
                topCustomers = db.all('SELECT * FROM customers ORDER BY ca DESC LIMIT 5');
            }

            res.json({
                success: true,
                data: {
                    totalCustomers: total.count,
                    totalRevenue: totalRevenue.total || 0,
                    topCustomers
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
