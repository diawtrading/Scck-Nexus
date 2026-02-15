const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

    const generateId = (prefix, existing) => {
        const count = existing.length + 1;
        return `${prefix}-${String(count).padStart(5, '0')}`;
    };

    const collectionSchema = Joi.object({
        producer_id: Joi.string().required(),
        date: Joi.date().required(),
        quantite: Joi.number().required(),
        qualite: Joi.string(),
        prix_unitaire: Joi.number(),
        notes: Joi.string()
    });

    // Get all collections
    router.get('/', (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;
            const producer_id = req.query.producer_id;

            let query = 'SELECT * FROM collections';
            let countQuery = 'SELECT COUNT(*) as total FROM collections';
            const params = [];

            if (producer_id) {
                query += ' WHERE producer_id = ?';
                countQuery += ' WHERE producer_id = ?';
                params.push(producer_id);
            }

            const countResult = db.get(countQuery, params);
            query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
            const collections = db.all(query, [...params, limit, offset]);

            res.json({
                success: true,
                data: collections,
                pagination: { page, limit, total: countResult.total }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create collection
    router.post('/', (req, res) => {
        try {
            const { error, value } = collectionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM collections');
            const id = generateId('COLL', existing);

            const total = value.quantite * (value.prix_unitaire || 0);

            const result = db.run(
                `INSERT INTO collections 
                (id, producer_id, date, quantite, qualite, prix_unitaire, total, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, value.producer_id, value.date, value.quantite, value.qualite, value.prix_unitaire, total, 'Recorded']
            );

            res.status(201).json({
                success: true,
                message: 'Collection recorded successfully',
                data: { id, total, ...value }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Update collection
    router.put('/:id', (req, res) => {
        try {
            const { error, value } = collectionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const collection = db.get('SELECT * FROM collections WHERE id = ?', [req.params.id]);
            if (!collection) {
                return res.status(404).json({ success: false, error: 'Collection not found' });
            }

            const total = value.quantite * (value.prix_unitaire || 0);

            db.run(
                `UPDATE collections SET producer_id=?, date=?, quantite=?, qualite=?, prix_unitaire=?, total=?, updated_at=? WHERE id = ?`,
                [value.producer_id, value.date, value.quantite, value.qualite, value.prix_unitaire, total, new Date().toISOString(), req.params.id]
            );

            res.json({ success: true, message: 'Collection updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Delete collection
    router.delete('/:id', (req, res) => {
        try {
            db.run('DELETE FROM collections WHERE id = ?', [req.params.id]);
            res.json({ success: true, message: 'Collection deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get summary
    router.get('/stats/summary', (req, res) => {
        try {
            const total = db.get('SELECT COUNT(*) as count, SUM(quantite) as quantite, SUM(total) as revenue FROM collections');
            const byQuality = db.all('SELECT qualite, COUNT(*) as count, SUM(quantite) as quantite FROM collections GROUP BY qualite');

            res.json({
                success: true,
                data: { total, byQuality }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
