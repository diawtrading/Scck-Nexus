const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

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
    router.get('/', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;
            const producer_id = req.query.producer_id;

            let collections, countResult;

            if (isSupabase) {
                let query = db.getSupabaseClient().from('collections').select('*', { count: 'exact' });
                if (producer_id) {
                    query = query.eq('producer_id', producer_id);
                }
                const { data, count } = await query.order('date', { ascending: false }).range(offset, offset + limit - 1);
                collections = data || [];
                countResult = { total: count || 0 };
            } else {
                let query = 'SELECT * FROM collections';
                let countQuery = 'SELECT COUNT(*) as total FROM collections';
                const params = [];

                if (producer_id) {
                    query += ' WHERE producer_id = ?';
                    countQuery += ' WHERE producer_id = ?';
                    params.push(producer_id);
                }

                countResult = db.get(countQuery, params);
                query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
                collections = db.all(query, [...params, limit, offset]);
            }

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
    router.post('/', async (req, res) => {
        try {
            const { error, value } = collectionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('collections').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM collections');
            }
            const id = generateId('COLL', existing);

            const total = value.quantite * (value.prix_unitaire || 0);

            if (isSupabase) {
                await db.getSupabaseClient().from('collections').insert({
                    id,
                    producer_id: value.producer_id,
                    date: value.date,
                    quantite: value.quantite,
                    qualite: value.qualite,
                    prix_unitaire: value.prix_unitaire,
                    total,
                    statut: 'Recorded'
                });
            } else {
                db.run(
                    `INSERT INTO collections 
                    (id, producer_id, date, quantite, qualite, prix_unitaire, total, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.producer_id, value.date, value.quantite, value.qualite, value.prix_unitaire, total, 'Recorded']
                );
            }

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
    router.put('/:id', async (req, res) => {
        try {
            const { error, value } = collectionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let collection;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('collections').select('*').eq('id', req.params.id).single();
                collection = data;
            } else {
                collection = db.get('SELECT * FROM collections WHERE id = ?', [req.params.id]);
            }
            if (!collection) {
                return res.status(404).json({ success: false, error: 'Collection not found' });
            }

            const total = value.quantite * (value.prix_unitaire || 0);

            if (isSupabase) {
                await db.getSupabaseClient().from('collections').update({
                    producer_id: value.producer_id,
                    date: value.date,
                    quantite: value.quantite,
                    qualite: value.qualite,
                    prix_unitaire: value.prix_unitaire,
                    total,
                    updated_at: new Date().toISOString()
                }).eq('id', req.params.id);
            } else {
                db.run(
                    `UPDATE collections SET producer_id=?, date=?, quantite=?, qualite=?, prix_unitaire=?, total=?, updated_at=? WHERE id = ?`,
                    [value.producer_id, value.date, value.quantite, value.qualite, value.prix_unitaire, total, new Date().toISOString(), req.params.id]
                );
            }

            res.json({ success: true, message: 'Collection updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Delete collection
    router.delete('/:id', async (req, res) => {
        try {
            if (isSupabase) {
                await db.getSupabaseClient().from('collections').delete().eq('id', req.params.id);
            } else {
                db.run('DELETE FROM collections WHERE id = ?', [req.params.id]);
            }
            res.json({ success: true, message: 'Collection deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get summary
    router.get('/stats/summary', async (req, res) => {
        try {
            let total, byQuality;

            if (isSupabase) {
                const { data: totalData } = await db.getSupabaseClient()
                    .from('collections')
                    .select('*', { count: 'exact', head: true });
                const { data: sumData } = await db.getSupabaseClient()
                    .from('collections')
                    .select('quantite,total');
                
                const quantite = sumData?.reduce((sum, row) => sum + (row.quantite || 0), 0) || 0;
                const revenue = sumData?.reduce((sum, row) => sum + (row.total || 0), 0) || 0;
                total = { count: totalData?.length || 0, quantite, revenue };

                const { data: qualityData } = await db.getSupabaseClient()
                    .from('collections')
                    .select('qualite,quantite');
                
                const qualityMap = {};
                qualityData?.forEach(row => {
                    if (!qualityMap[row.qualite]) {
                        qualityMap[row.qualite] = { qualite: row.qualite, count: 0, quantite: 0 };
                    }
                    qualityMap[row.qualite].count++;
                    qualityMap[row.qualite].quantite += row.quantite || 0;
                });
                byQuality = Object.values(qualityMap);
            } else {
                total = db.get('SELECT COUNT(*) as count, SUM(quantite) as quantite, SUM(total) as revenue FROM collections');
                byQuality = db.all('SELECT qualite, COUNT(*) as count, SUM(quantite) as quantite FROM collections GROUP BY qualite');
            }

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
