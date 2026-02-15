const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    const generateId = (prefix, existing) => {
        const count = existing.length + 1;
        return `${prefix}-${String(count).padStart(4, '0')}`;
    };

    const producerSchema = Joi.object({
        nom: Joi.string().required(),
        zone: Joi.string().required(),
        superficie: Joi.number(),
        statut: Joi.string().valid('Active', 'Inactive', 'Suspended'),
        telephone: Joi.string(),
        email: Joi.string().email(),
        adresse: Joi.string()
    });

    router.get('/', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;
            const zone = req.query.zone;
            const statut = req.query.statut;

            let producers, countResult;
            
            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('producers')
                    .select('*', { count: 'exact' });
                
                let filtered = data || [];
                if (zone) filtered = filtered.filter(p => p.zone === zone);
                if (statut) filtered = filtered.filter(p => p.statut === statut);
                
                producers = filtered.slice(offset, offset + limit);
                countResult = { total: filtered.length };
            } else {
                let query = 'SELECT * FROM producers';
                let countQuery = 'SELECT COUNT(*) as total FROM producers';
                const params = [];

                if (zone) {
                    query += ' WHERE zone = ?';
                    countQuery += ' WHERE zone = ?';
                    params.push(zone);
                }
                if (statut) {
                    if (zone) {
                        query += ' AND statut = ?';
                        countQuery += ' AND statut = ?';
                    } else {
                        query += ' WHERE statut = ?';
                        countQuery += ' WHERE statut = ?';
                    }
                    params.push(statut);
                }

                countResult = db.get(countQuery, params);
                query += ' ORDER BY date_inscription DESC LIMIT ? OFFSET ?';
                producers = db.all(query, [...params, limit, offset]);
            }

            res.json({
                success: true,
                data: producers,
                pagination: {
                    page,
                    limit,
                    total: countResult.total,
                    totalPages: Math.ceil(countResult.total / limit)
                }
            });
        } catch (error) {
            console.error('Get producers error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            let producer;
            if (isSupabase) {
                producer = await db.getAsync('producers', { id: req.params.id });
            } else {
                producer = db.get('SELECT * FROM producers WHERE id = ?', [req.params.id]);
            }
            
            if (!producer) {
                return res.status(404).json({ success: false, error: 'Producer not found' });
            }

            res.json({ success: true, data: producer });
        } catch (error) {
            console.error('Get producer error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { error, value } = producerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('producers').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM producers');
            }
            
            const id = generateId('PROD', existing);

            if (isSupabase) {
                await db.runAsync('producers', {
                    id,
                    nom: value.nom,
                    zone: value.zone,
                    superficie: value.superficie || 0,
                    statut: value.statut || 'Active',
                    telephone: value.telephone || '',
                    email: value.email || '',
                    adresse: value.adresse || '',
                    date_inscription: new Date().toISOString(),
                    created_at: new Date().toISOString()
                });
            } else {
                db.run(
                    `INSERT INTO producers 
                    (id, nom, zone, superficie, statut, telephone, email, adresse, date_inscription)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,
                        value.nom,
                        value.zone,
                        value.superficie || 0,
                        value.statut || 'Active',
                        value.telephone || '',
                        value.email || '',
                        value.adresse || '',
                        new Date().toISOString()
                    ]
                );
            }

            res.status(201).json({
                success: true,
                message: 'Producer created successfully',
                data: { id, ...value }
            });
        } catch (error) {
            console.error('Create producer error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { error, value } = producerSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let producer;
            if (isSupabase) {
                producer = await db.getAsync('producers', { id: req.params.id });
            } else {
                producer = db.get('SELECT * FROM producers WHERE id = ?', [req.params.id]);
            }
            
            if (!producer) {
                return res.status(404).json({ success: false, error: 'Producer not found' });
            }

            if (isSupabase) {
                await db.updateAsync('producers', req.params.id, value);
            } else {
                const updateFields = Object.keys(value)
                    .map(key => `${key} = ?`)
                    .join(', ');
                const updateValues = [...Object.values(value), new Date().toISOString(), req.params.id];
                db.run(
                    `UPDATE producers SET ${updateFields}, updated_at = ? WHERE id = ?`,
                    updateValues
                );
            }

            res.json({
                success: true,
                message: 'Producer updated successfully',
                data: { id: req.params.id, ...value }
            });
        } catch (error) {
            console.error('Update producer error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            let producer;
            if (isSupabase) {
                producer = await db.getAsync('producers', { id: req.params.id });
            } else {
                producer = db.get('SELECT * FROM producers WHERE id = ?', [req.params.id]);
            }
            
            if (!producer) {
                return res.status(404).json({ success: false, error: 'Producer not found' });
            }

            if (isSupabase) {
                await db.deleteAsync('producers', req.params.id);
            } else {
                db.run('DELETE FROM producers WHERE id = ?', [req.params.id]);
            }

            res.json({
                success: true,
                message: 'Producer deleted successfully'
            });
        } catch (error) {
            console.error('Delete producer error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    router.get('/stats/overview', async (req, res) => {
        try {
            let total, active, byZone;
            
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('producers').select('*');
                total = { count: data?.length || 0 };
                active = { count: data?.filter(p => p.statut === 'Active').length || 0 };
                
                const zoneGroups = {};
                data?.forEach(p => {
                    zoneGroups[p.zone] = (zoneGroups[p.zone] || 0) + 1;
                });
                byZone = Object.entries(zoneGroups).map(([zone, count]) => ({ zone, count }));
            } else {
                total = db.get('SELECT COUNT(*) as count FROM producers');
                active = db.get('SELECT COUNT(*) as count FROM producers WHERE statut = "Active"');
                byZone = db.all('SELECT zone, COUNT(*) as count FROM producers GROUP BY zone');
            }

            res.json({
                success: true,
                data: {
                    total: total.count,
                    active: active.count,
                    byZone
                }
            });
        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });

    return router;
};
