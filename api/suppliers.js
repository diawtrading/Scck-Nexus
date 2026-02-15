const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    const supplierSchema = Joi.object({
        nom: Joi.string().required(),
        contact: Joi.string(),
        telephone: Joi.string(),
        email: Joi.string().email(),
        specialite: Joi.string(),
        paiement: Joi.string()
    });

    // Get all suppliers
    router.get('/', async (req, res) => {
        try {
            const specialite = req.query.specialite;
            let suppliers;

            if (isSupabase) {
                let query = db.getSupabaseClient()
                    .from('suppliers')
                    .select('*')
                    .eq('statut', 'Active');
                if (specialite) {
                    query = query.eq('specialite', specialite);
                }
                const { data } = await query.order('nom');
                suppliers = data || [];
            } else {
                let query = 'SELECT * FROM suppliers WHERE statut = "Active"';
                const params = [];

                if (specialite) {
                    query += ' AND specialite = ?';
                    params.push(specialite);
                }

                suppliers = db.all(query + ' ORDER BY nom', params);
            }
            res.json({ success: true, data: suppliers });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create supplier
    router.post('/', async (req, res) => {
        try {
            const { error, value } = supplierSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('suppliers').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM suppliers');
            }
            const id = `SUPP-${String(existing.length + 1).padStart(4, '0')}`;

            if (isSupabase) {
                await db.getSupabaseClient().from('suppliers').insert({
                    id,
                    nom: value.nom,
                    contact: value.contact,
                    telephone: value.telephone,
                    email: value.email,
                    specialite: value.specialite,
                    paiement: value.paiement,
                    statut: 'Active'
                });
            } else {
                db.run(
                    `INSERT INTO suppliers 
                    (id, nom, contact, telephone, email, specialite, paiement, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.nom, value.contact, value.telephone, value.email, value.specialite, value.paiement, 'Active']
                );
            }

            res.status(201).json({ success: true, message: 'Supplier added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get supplier statistics
    router.get('/stats/overview', async (req, res) => {
        try {
            let total, bySpecialty;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('suppliers')
                    .select('*');
                
                total = { count: data?.length || 0 };

                const specMap = {};
                data?.forEach(supplier => {
                    if (!specMap[supplier.specialite]) {
                        specMap[supplier.specialite] = { specialite: supplier.specialite, count: 0 };
                    }
                    specMap[supplier.specialite].count++;
                });
                bySpecialty = Object.values(specMap);
            } else {
                total = db.get('SELECT COUNT(*) as count FROM suppliers');
                bySpecialty = db.all('SELECT specialite, COUNT(*) as count FROM suppliers GROUP BY specialite');
            }

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
