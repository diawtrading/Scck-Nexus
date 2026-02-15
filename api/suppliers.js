const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

    const supplierSchema = Joi.object({
        nom: Joi.string().required(),
        contact: Joi.string(),
        telephone: Joi.string(),
        email: Joi.string().email(),
        specialite: Joi.string(),
        paiement: Joi.string()
    });

    // Get all suppliers
    router.get('/', (req, res) => {
        try {
            const specialite = req.query.specialite;
            let query = 'SELECT * FROM suppliers WHERE statut = "Active"';
            const params = [];

            if (specialite) {
                query += ' AND specialite = ?';
                params.push(specialite);
            }

            const suppliers = db.all(query + ' ORDER BY nom', params);
            res.json({ success: true, data: suppliers });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create supplier
    router.post('/', (req, res) => {
        try {
            const { error, value } = supplierSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM suppliers');
            const id = `SUPP-${String(existing.length + 1).padStart(4, '0')}`;

            db.run(
                `INSERT INTO suppliers 
                (id, nom, contact, telephone, email, specialite, paiement, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, value.nom, value.contact, value.telephone, value.email, value.specialite, value.paiement, 'Active']
            );

            res.status(201).json({ success: true, message: 'Supplier added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get supplier statistics
    router.get('/stats/overview', (req, res) => {
        try {
            const total = db.get('SELECT COUNT(*) as count FROM suppliers');
            const bySpecialty = db.all('SELECT specialite, COUNT(*) as count FROM suppliers GROUP BY specialite');

            res.json({
                success: true,
                data: {
                    totalSuppliers: total.count,
                    bySpecialty
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
