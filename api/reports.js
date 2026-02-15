const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Generate financial report
    router.get('/financial', (req, res) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            let query = 'SELECT * FROM transactions WHERE 1=1';
            const params = [];

            if (startDate) {
                query += ' AND date >= ?';
                params.push(startDate);
            }
            if (endDate) {
                query += ' AND date <= ?';
                params.push(endDate);
            }

            const transactions = db.all(query + ' ORDER BY date DESC', params);
            const summary = db.get(`
                SELECT 
                    SUM(credit) as totalIncome,
                    SUM(debit) as totalExpense,
                    SUM(credit) - SUM(debit) as netIncome
                FROM transactions
                WHERE 1=1 ${startDate ? 'AND date >= ?' : ''} ${endDate ? 'AND date <= ?' : ''}
            `, params);

            res.json({
                success: true,
                data: {
                    transactions,
                    summary,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Generate production report
    router.get('/production', (req, res) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            const stats = db.all(`
                SELECT 
                    p.zone,
                    COUNT(DISTINCT p.id) as totalProducers,
                    COUNT(c.id) as totalCollections,
                    SUM(c.quantite) as totalQuantity,
                    SUM(c.total) as totalValue,
                    AVG(c.prix_unitaire) as avgPrice
                FROM producers p
                LEFT JOIN collections c ON p.id = c.producer_id
                WHERE (c.date IS NULL OR c.date BETWEEN ? AND ?)
                GROUP BY p.zone
            `, [startDate || '2020-01-01', endDate || new Date().toISOString()]);

            res.json({
                success: true,
                data: {
                    stats,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Generate HR report
    router.get('/hr', (req, res) => {
        try {
            const stats = db.all(`
                SELECT 
                    departement,
                    COUNT(*) as count,
                    SUM(salaire) as totalSalary,
                    AVG(salaire) as avgSalary,
                    COUNT(CASE WHEN contrat = 'Full-time' THEN 1 END) as fullTime,
                    COUNT(CASE WHEN contrat = 'Part-time' THEN 1 END) as partTime
                FROM employees
                WHERE statut = 'Active'
                GROUP BY departement
            `);

            const totalPayroll = db.get('SELECT SUM(salaire) as total FROM employees WHERE statut = "Active"');

            res.json({
                success: true,
                data: {
                    byDepartment: stats,
                    totalPayroll: totalPayroll.total || 0,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Generate inventory report
    router.get('/inventory', (req, res) => {
        try {
            const lowStock = db.all('SELECT * FROM inventory WHERE quantite <= min_stock');
            const overStock = db.all('SELECT * FROM inventory WHERE quantite >= max_stock');
            const total = db.get('SELECT COUNT(*) as count, SUM(valeur) as total FROM inventory');

            res.json({
                success: true,
                data: {
                    total: total.count,
                    totalValue: total.total || 0,
                    lowStock,
                    overStock,
                    generatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Export data
    router.get('/export/:format', (req, res) => {
        try {
            const { format } = req.params;
            const table = req.query.table;

            let data = [];
            if (table === 'producers') {
                data = db.all('SELECT * FROM producers');
            } else if (table === 'collections') {
                data = db.all('SELECT * FROM collections');
            } else if (table === 'transactions') {
                data = db.all('SELECT * FROM transactions');
            }

            if (format === 'csv') {
                if (!data.length) {
                    return res.status(400).json({ success: false, error: 'No data to export' });
                }

                const headers = Object.keys(data[0]);
                const csv = [headers.join(','), ...data.map(row =>
                    headers.map(h => JSON.stringify(row[h])).join(',')
                )].join('\n');

                res.set('Content-Type', 'text/csv');
                res.set('Content-Disposition', `attachment; filename=export_${table}.csv`);
                res.send(csv);
            } else {
                res.json({ success: true, data, format });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
