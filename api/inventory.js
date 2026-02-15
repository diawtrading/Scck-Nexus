const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

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
    router.get('/', async (req, res) => {
        try {
            let inventory;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('inventory')
                    .select('*')
                    .order('nom');
                inventory = data || [];
            } else {
                inventory = db.all('SELECT * FROM inventory ORDER BY nom');
            }
            res.json({ success: true, data: inventory });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create inventory item
    router.post('/', async (req, res) => {
        try {
            const { error, value } = inventorySchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('inventory').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM inventory');
            }
            const id = `INV-${String(existing.length + 1).padStart(4, '0')}`;

            if (isSupabase) {
                await db.getSupabaseClient().from('inventory').insert({
                    id,
                    nom: value.nom,
                    quantite: value.quantite,
                    unite: value.unite,
                    valeur: value.valeur,
                    min_stock: value.min_stock,
                    max_stock: value.max_stock,
                    localisation: value.localisation,
                    statut: 'In Stock'
                });
            } else {
                db.run(
                    `INSERT INTO inventory 
                    (id, nom, quantite, unite, valeur, min_stock, max_stock, localisation, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.nom, value.quantite, value.unite, value.valeur, value.min_stock, value.max_stock, value.localisation, 'In Stock']
                );
            }

            res.status(201).json({ success: true, message: 'Inventory item added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Update inventory
    router.put('/:id', async (req, res) => {
        try {
            const { error, value } = inventorySchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            if (isSupabase) {
                await db.getSupabaseClient().from('inventory').update({
                    nom: value.nom,
                    quantite: value.quantite,
                    unite: value.unite,
                    valeur: value.valeur,
                    min_stock: value.min_stock,
                    max_stock: value.max_stock,
                    localisation: value.localisation,
                    updated_at: new Date().toISOString()
                }).eq('id', req.params.id);
            } else {
                db.run(
                    `UPDATE inventory SET nom=?, quantite=?, unite=?, valeur=?, min_stock=?, max_stock=?, localisation=?, updated_at=? WHERE id = ?`,
                    [value.nom, value.quantite, value.unite, value.valeur, value.min_stock, value.max_stock, value.localisation, new Date().toISOString(), req.params.id]
                );
            }

            res.json({ success: true, message: 'Inventory updated' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Delete inventory
    router.delete('/:id', async (req, res) => {
        try {
            if (isSupabase) {
                await db.getSupabaseClient().from('inventory').delete().eq('id', req.params.id);
            } else {
                db.run('DELETE FROM inventory WHERE id = ?', [req.params.id]);
            }
            res.json({ success: true, message: 'Inventory item deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get low stock items
    router.get('/alerts/low-stock', async (req, res) => {
        try {
            let lowStock;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('inventory')
                    .select('*');
                lowStock = (data || []).filter(item => item.quantite < item.min_stock);
            } else {
                lowStock = db.all('SELECT * FROM inventory WHERE quantite < min_stock');
            }
            res.json({ success: true, data: lowStock });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
