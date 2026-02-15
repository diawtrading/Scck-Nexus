const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Get dashboard KPIs
    router.get('/kpis', (req, res) => {
        try {
            const producers = db.get('SELECT COUNT(*) as count FROM producers WHERE statut = "Active"');
            const collections = db.get('SELECT SUM(quantite) as total, SUM(total) as revenue FROM collections');
            const transactions = db.get('SELECT SUM(credit) as income, SUM(debit) as expense FROM transactions');
            const employees = db.get('SELECT COUNT(*) as count FROM employees WHERE statut = "Active"');

            res.json({
                success: true,
                data: {
                    activeProducers: producers.count || 0,
                    tonsCollected: collections.total || 0,
                    revenue: collections.revenue || 0,
                    income: transactions.income || 0,
                    expense: transactions.expense || 0,
                    activeEmployees: employees.count || 0
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get revenue trend
    router.get('/revenue-trend', (req, res) => {
        try {
            // Monthly revenue trend
            const trend = db.all(`
                SELECT 
                    strftime('%Y-%m', date) as month,
                    SUM(total) as revenue,
                    COUNT(*) as collections
                FROM collections
                GROUP BY strftime('%Y-%m', date)
                ORDER BY month DESC
                LIMIT 12
            `);

            res.json({ success: true, data: trend });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get zone performance
    router.get('/zone-performance', (req, res) => {
        try {
            const zones = db.all(`
                SELECT 
                    p.zone,
                    COUNT(DISTINCT p.id) as producers,
                    COUNT(c.id) as collections,
                    SUM(c.quantite) as quantite,
                    SUM(c.total) as revenue
                FROM producers p
                LEFT JOIN collections c ON p.id = c.producer_id
                GROUP BY p.zone
                ORDER BY revenue DESC
            `);

            res.json({ success: true, data: zones });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get quality distribution
    router.get('/quality-distribution', (req, res) => {
        try {
            const quality = db.all(`
                SELECT 
                    qualite,
                    COUNT(*) as count,
                    SUM(quantite) as total_quantite,
                    AVG(prix_unitaire) as avg_price
                FROM collections
                GROUP BY qualite
            `);

            res.json({ success: true, data: quality });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get recent activity
    router.get('/recent-activity', (req, res) => {
        try {
            const activities = db.all(`
                SELECT 
                    'collection' as type,
                    c.id,
                    p.nom as entity,
                    c.date,
                    c.quantite as value
                FROM collections c
                JOIN producers p ON c.producer_id = p.id
                UNION ALL
                SELECT 
                    'transaction' as type,
                    id,
                    description as entity,
                    date,
                    COALESCE(credit, debit) as value
                FROM transactions
                ORDER BY date DESC
                LIMIT 20
            `);

            res.json({ success: true, data: activities });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
