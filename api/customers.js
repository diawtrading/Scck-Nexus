const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

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
    router.get('/', (req, res) => {
        try {
            const customers = db.all('SELECT * FROM customers WHERE statut = "Active" ORDER BY ca DESC');
            res.json({ success: true, data: customers });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create customer
    router.post('/', (req, res) => {
        try {
            const { error, value } = customerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM customers');
            const id = `CUST-${String(existing.length + 1).padStart(4, '0')}`;

            db.run(
                `INSERT INTO customers 
                (id, nom, contact, telephone, email, adresse, ca, pays, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, value.nom, value.contact, value.telephone, value.email, value.adresse, value.ca, value.pays, 'Active']
            );

            res.status(201).json({ success: true, message: 'Customer added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get customer statistics
    router.get('/stats/overview', (req, res) => {
        try {
            const total = db.get('SELECT COUNT(*) as count FROM customers');
            const totalRevenue = db.get('SELECT SUM(ca) as total FROM customers');
            const topCustomers = db.all('SELECT * FROM customers ORDER BY ca DESC LIMIT 5');

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
