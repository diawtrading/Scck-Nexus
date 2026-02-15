const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

    const inventorySchema = Joi.object({
        nom: Joi.string().required(),
        quantite: Joi.number().required(),
        unite: Joi.string(),
        valeur: Joi.number(),
        min_stock: Joi.number(),
        max_stock: Joi.number(),
        localisation: Joi.string()
    });

    // Get all inventory
    router.get('/', (req, res) => {
        try {
            const inventory = db.all('SELECT * FROM inventory ORDER BY nom');
            res.json({ success: true, data: inventory });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create inventory item
    router.post('/', (req, res) => {
        try {
            const { error, value } = inventorySchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM inventory');
            const id = `INV-${String(existing.length + 1).padStart(4, '0')}`;

            db.run(
                `INSERT INTO inventory 
                (id, nom, quantite, unite, valeur, min_stock, max_stock, localisation, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, value.nom, value.quantite, value.unite, value.valeur, value.min_stock, value.max_stock, value.localisation, 'In Stock']
            );

            res.status(201).json({ success: true, message: 'Inventory item added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Update inventory
    router.put('/:id', (req, res) => {
        try {
            const { error, value } = inventorySchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            db.run(
                `UPDATE inventory SET nom=?, quantite=?, unite=?, valeur=?, min_stock=?, max_stock=?, localisation=?, updated_at=? WHERE id = ?`,
                [value.nom, value.quantite, value.unite, value.valeur, value.min_stock, value.max_stock, value.localisation, new Date().toISOString(), req.params.id]
            );

            res.json({ success: true, message: 'Inventory updated' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Delete inventory
    router.delete('/:id', (req, res) => {
        try {
            db.run('DELETE FROM inventory WHERE id = ?', [req.params.id]);
            res.json({ success: true, message: 'Inventory item deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get low stock items
    router.get('/alerts/low-stock', (req, res) => {
        try {
            const lowStock = db.all('SELECT * FROM inventory WHERE quantite < min_stock');
            res.json({ success: true, data: lowStock });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
