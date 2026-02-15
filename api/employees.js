const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

    const employeeSchema = Joi.object({
        nom: Joi.string().required(),
        poste: Joi.string().required(),
        departement: Joi.string().required(),
        contrat: Joi.string(),
        salaire: Joi.number(),
        date_embauche: Joi.date()
    });

    // Get all employees
    router.get('/', (req, res) => {
        try {
            const departement = req.query.departement;
            let query = 'SELECT * FROM employees';
            const params = [];

            if (departement) {
                query += ' WHERE departement = ?';
                params.push(departement);
            }

            const employees = db.all(query + ' ORDER BY nom', params);
            res.json({ success: true, data: employees });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create employee
    router.post('/', (req, res) => {
        try {
            const { error, value } = employeeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM employees');
            const id = `EMP-${String(existing.length + 1).padStart(4, '0')}`;

            db.run(
                `INSERT INTO employees 
                (id, nom, poste, departement, contrat, salaire, date_embauche, statut)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, value.nom, value.poste, value.departement, value.contrat, value.salaire, value.date_embauche, 'Active']
            );

            res.status(201).json({ success: true, message: 'Employee added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get payroll summary
    router.get('/payroll/summary', (req, res) => {
        try {
            const total = db.get('SELECT COUNT(*) as count, SUM(salaire) as total FROM employees WHERE statut = "Active"');
            const byDept = db.all('SELECT departement, COUNT(*) as count, SUM(salaire) as total FROM employees GROUP BY departement');

            res.json({
                success: true,
                data: { total, byDepartement: byDept }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
