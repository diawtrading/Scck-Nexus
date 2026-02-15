const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

    const projectSchema = Joi.object({
        nom: Joi.string().required(),
        description: Joi.string(),
        budget: Joi.number().required(),
        statut: Joi.string().valid('Planned', 'In Progress', 'Completed'),
        date_debut: Joi.date(),
        date_fin: Joi.date()
    });

    // Get all projects
    router.get('/', (req, res) => {
        try {
            const statut = req.query.statut;
            let query = 'SELECT * FROM projects';
            const params = [];

            if (statut) {
                query += ' WHERE statut = ?';
                params.push(statut);
            }

            const projects = db.all(query + ' ORDER BY date_debut DESC', params);
            res.json({ success: true, data: projects });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create project
    router.post('/', (req, res) => {
        try {
            const { error, value } = projectSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM projects');
            const id = `PROJ-${String(existing.length + 1).padStart(4, '0')}`;

            db.run(
                `INSERT INTO projects 
                (id, nom, description, budget, statut, date_debut, date_fin)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [id, value.nom, value.description, value.budget, value.statut || 'Planned', value.date_debut, value.date_fin]
            );

            res.status(201).json({ success: true, message: 'Project created', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Update project progress
    router.post('/:id/progress', (req, res) => {
        try {
            const { progression, depense } = req.body;

            db.run(
                'UPDATE projects SET progression = ?, depense = ?, updated_at = ? WHERE id = ?',
                [progression, depense, new Date().toISOString(), req.params.id]
            );

            res.json({ success: true, message: 'Project progress updated' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get project statistics
    router.get('/stats/overview', (req, res) => {
        try {
            const total = db.get('SELECT COUNT(*) as count, SUM(budget) as totalBudget, SUM(depense) as totalSpent FROM projects');
            const byStatus = db.all('SELECT statut, COUNT(*) as count, SUM(budget) as budget FROM projects GROUP BY statut');

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
