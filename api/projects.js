const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    const projectSchema = Joi.object({
        nom: Joi.string().required(),
        description: Joi.string(),
        budget: Joi.number().required(),
        statut: Joi.string().valid('Planned', 'In Progress', 'Completed'),
        date_debut: Joi.date(),
        date_fin: Joi.date()
    });

    // Get all projects
    router.get('/', async (req, res) => {
        try {
            const statut = req.query.statut;
            let projects;

            if (isSupabase) {
                let query = db.getSupabaseClient().from('projects').select('*');
                if (statut) {
                    query = query.eq('statut', statut);
                }
                const { data } = await query.order('date_debut', { ascending: false });
                projects = data || [];
            } else {
                let query = 'SELECT * FROM projects';
                const params = [];

                if (statut) {
                    query += ' WHERE statut = ?';
                    params.push(statut);
                }

                projects = db.all(query + ' ORDER BY date_debut DESC', params);
            }
            res.json({ success: true, data: projects });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create project
    router.post('/', async (req, res) => {
        try {
            const { error, value } = projectSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('projects').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM projects');
            }
            const id = `PROJ-${String(existing.length + 1).padStart(4, '0')}`;

            if (isSupabase) {
                await db.getSupabaseClient().from('projects').insert({
                    id,
                    nom: value.nom,
                    description: value.description,
                    budget: value.budget,
                    statut: value.statut || 'Planned',
                    date_debut: value.date_debut,
                    date_fin: value.date_fin
                });
            } else {
                db.run(
                    `INSERT INTO projects 
                    (id, nom, description, budget, statut, date_debut, date_fin)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.nom, value.description, value.budget, value.statut || 'Planned', value.date_debut, value.date_fin]
                );
            }

            res.status(201).json({ success: true, message: 'Project created', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Update project progress
    router.post('/:id/progress', async (req, res) => {
        try {
            const { progression, depense } = req.body;

            if (isSupabase) {
                await db.getSupabaseClient().from('projects').update({
                    progression,
                    depense,
                    updated_at: new Date().toISOString()
                }).eq('id', req.params.id);
            } else {
                db.run(
                    'UPDATE projects SET progression = ?, depense = ?, updated_at = ? WHERE id = ?',
                    [progression, depense, new Date().toISOString(), req.params.id]
                );
            }

            res.json({ success: true, message: 'Project progress updated' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get project statistics
    router.get('/stats/overview', async (req, res) => {
        try {
            let total, byStatus;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('projects')
                    .select('*');
                
                const count = data?.length || 0;
                const totalBudget = data?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
                const totalSpent = data?.reduce((sum, p) => sum + (p.depense || 0), 0) || 0;
                total = { count, totalBudget, totalSpent };

                const statusMap = {};
                data?.forEach(project => {
                    if (!statusMap[project.statut]) {
                        statusMap[project.statut] = { statut: project.statut, count: 0, budget: 0 };
                    }
                    statusMap[project.statut].count++;
                    statusMap[project.statut].budget += project.budget || 0;
                });
                byStatus = Object.values(statusMap);
            } else {
                total = db.get('SELECT COUNT(*) as count, SUM(budget) as totalBudget, SUM(depense) as totalSpent FROM projects');
                byStatus = db.all('SELECT statut, COUNT(*) as count, SUM(budget) as budget FROM projects GROUP BY statut');
            }

            res.json({
                success: true,
                data: {
                    total: total.count,
                    totalBudget: total.totalBudget || 0,
                    totalSpent: total.totalSpent || 0,
                    byStatus
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
