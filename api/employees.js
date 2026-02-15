const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    const employeeSchema = Joi.object({
        nom: Joi.string().required(),
        poste: Joi.string().required(),
        departement: Joi.string().required(),
        contrat: Joi.string(),
        salaire: Joi.number(),
        date_embauche: Joi.date()
    });

    // Get all employees
    router.get('/', async (req, res) => {
        try {
            const departement = req.query.departement;
            let employees;

            if (isSupabase) {
                let query = db.getSupabaseClient().from('employees').select('*');
                if (departement) {
                    query = query.eq('departement', departement);
                }
                const { data } = await query.order('nom');
                employees = data || [];
            } else {
                let query = 'SELECT * FROM employees';
                const params = [];

                if (departement) {
                    query += ' WHERE departement = ?';
                    params.push(departement);
                }

                employees = db.all(query + ' ORDER BY nom', params);
            }
            res.json({ success: true, data: employees });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create employee
    router.post('/', async (req, res) => {
        try {
            const { error, value } = employeeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('employees').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM employees');
            }
            const id = `EMP-${String(existing.length + 1).padStart(4, '0')}`;

            if (isSupabase) {
                await db.getSupabaseClient().from('employees').insert({
                    id,
                    nom: value.nom,
                    poste: value.poste,
                    departement: value.departement,
                    contrat: value.contrat,
                    salaire: value.salaire,
                    date_embauche: value.date_embauche,
                    statut: 'Active'
                });
            } else {
                db.run(
                    `INSERT INTO employees 
                    (id, nom, poste, departement, contrat, salaire, date_embauche, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.nom, value.poste, value.departement, value.contrat, value.salaire, value.date_embauche, 'Active']
                );
            }

            res.status(201).json({ success: true, message: 'Employee added', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get payroll summary
    router.get('/payroll/summary', async (req, res) => {
        try {
            let total, byDept;

            if (isSupabase) {
                const { data: activeData } = await db.getSupabaseClient()
                    .from('employees')
                    .select('*')
                    .eq('statut', 'Active');
                
                const count = activeData?.length || 0;
                const sum = activeData?.reduce((s, e) => s + (e.salaire || 0), 0) || 0;
                total = { count, total: sum };

                const deptMap = {};
                activeData?.forEach(emp => {
                    if (!deptMap[emp.departement]) {
                        deptMap[emp.departement] = { departement: emp.departement, count: 0, total: 0 };
                    }
                    deptMap[emp.departement].count++;
                    deptMap[emp.departement].total += emp.salaire || 0;
                });
                byDept = Object.values(deptMap);
            } else {
                total = db.get('SELECT COUNT(*) as count, SUM(salaire) as total FROM employees WHERE statut = "Active"');
                byDept = db.all('SELECT departement, COUNT(*) as count, SUM(salaire) as total FROM employees GROUP BY departement');
            }

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
