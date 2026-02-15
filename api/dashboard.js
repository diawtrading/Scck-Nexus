const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    // Get dashboard KPIs
    router.get('/kpis', async (req, res) => {
        try {
            let producers, collections, transactions, employees;

            if (isSupabase) {
                const { data: prodData } = await db.getSupabaseClient()
                    .from('producers')
                    .select('id', { count: 'exact' })
                    .eq('statut', 'Active');
                producers = { count: prodData?.length || 0 };

                const { data: collData } = await db.getSupabaseClient()
                    .from('collections')
                    .select('quantite,total');
                const totalQuantite = collData?.reduce((sum, c) => sum + (c.quantite || 0), 0) || 0;
                const totalRevenue = collData?.reduce((sum, c) => sum + (c.total || 0), 0) || 0;
                collections = { total: totalQuantite, revenue: totalRevenue };

                const { data: transData } = await db.getSupabaseClient()
                    .from('transactions')
                    .select('credit,debit');
                const income = transData?.reduce((sum, t) => sum + (t.credit || 0), 0) || 0;
                const expense = transData?.reduce((sum, t) => sum + (t.debit || 0), 0) || 0;
                transactions = { income, expense };

                const { data: empData } = await db.getSupabaseClient()
                    .from('employees')
                    .select('id', { count: 'exact' })
                    .eq('statut', 'Active');
                employees = { count: empData?.length || 0 };
            } else {
                producers = db.get('SELECT COUNT(*) as count FROM producers WHERE statut = "Active"');
                collections = db.get('SELECT SUM(quantite) as total, SUM(total) as revenue FROM collections');
                transactions = db.get('SELECT SUM(credit) as income, SUM(debit) as expense FROM transactions');
                employees = db.get('SELECT COUNT(*) as count FROM employees WHERE statut = "Active"');
            }

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
    router.get('/revenue-trend', async (req, res) => {
        try {
            let trend;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('collections')
                    .select('date,total');
                
                const monthlyMap = {};
                data?.forEach(row => {
                    if (!row.date) return;
                    const month = row.date.substring(0, 7);
                    if (!monthlyMap[month]) {
                        monthlyMap[month] = { month, revenue: 0, collections: 0 };
                    }
                    monthlyMap[month].revenue += row.total || 0;
                    monthlyMap[month].collections++;
                });
                
                trend = Object.values(monthlyMap)
                    .sort((a, b) => b.month.localeCompare(a.month))
                    .slice(0, 12);
            } else {
                trend = db.all(`
                    SELECT 
                        strftime('%Y-%m', date) as month,
                        SUM(total) as revenue,
                        COUNT(*) as collections
                    FROM collections
                    GROUP BY strftime('%Y-%m', date)
                    ORDER BY month DESC
                    LIMIT 12
                `);
            }

            res.json({ success: true, data: trend });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get zone performance
    router.get('/zone-performance', async (req, res) => {
        try {
            let zones;

            if (isSupabase) {
                const { data: producers } = await db.getSupabaseClient()
                    .from('producers')
                    .select('id,zone');
                const { data: collections } = await db.getSupabaseClient()
                    .from('collections')
                    .select('producer_id,quantite,total');
                
                const zoneMap = {};
                producers?.forEach(p => {
                    if (!zoneMap[p.zone]) {
                        zoneMap[p.zone] = { zone: p.zone, producers: 0, collections: 0, quantite: 0, revenue: 0 };
                    }
                    zoneMap[p.zone].producers++;
                });
                
                collections?.forEach(c => {
                    const producer = producers?.find(p => p.id === c.producer_id);
                    if (producer && zoneMap[producer.zone]) {
                        zoneMap[producer.zone].collections++;
                        zoneMap[producer.zone].quantite += c.quantite || 0;
                        zoneMap[producer.zone].revenue += c.total || 0;
                    }
                });
                
                zones = Object.values(zoneMap).sort((a, b) => b.revenue - a.revenue);
            } else {
                zones = db.all(`
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
            }

            res.json({ success: true, data: zones });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get quality distribution
    router.get('/quality-distribution', async (req, res) => {
        try {
            let quality;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('collections')
                    .select('qualite,quantite,prix_unitaire');
                
                const qualityMap = {};
                data?.forEach(row => {
                    const q = row.qualite || 'Unknown';
                    if (!qualityMap[q]) {
                        qualityMap[q] = { qualite: q, count: 0, total_quantite: 0, avg_price: 0 };
                    }
                    qualityMap[q].count++;
                    qualityMap[q].total_quantite += row.quantite || 0;
                });
                
                quality = Object.values(qualityMap).map(q => ({
                    ...q,
                    avg_price: data?.filter(d => d.qualite === q.qualite)
                        .reduce((sum, d, _, arr) => sum + (d.prix_unitaire || 0) / arr.length, 0) || 0
                }));
            } else {
                quality = db.all(`
                    SELECT 
                        qualite,
                        COUNT(*) as count,
                        SUM(quantite) as total_quantite,
                        AVG(prix_unitaire) as avg_price
                    FROM collections
                    GROUP BY qualite
                `);
            }

            res.json({ success: true, data: quality });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get recent activity
    router.get('/recent-activity', async (req, res) => {
        try {
            let activities;

            if (isSupabase) {
                const { data: collections } = await db.getSupabaseClient()
                    .from('collections')
                    .select('id,date,quantite,producer_id')
                    .order('date', { ascending: false })
                    .limit(20);
                const { data: producers } = await db.getSupabaseClient()
                    .from('producers')
                    .select('id,nom');
                
                const { data: transactions } = await db.getSupabaseClient()
                    .from('transactions')
                    .select('id,date,description,credit,debit')
                    .order('date', { ascending: false })
                    .limit(20);
                
                const collActivities = (collections || []).map(c => ({
                    type: 'collection',
                    id: c.id,
                    entity: producers?.find(p => p.id === c.producer_id)?.nom || c.producer_id,
                    date: c.date,
                    value: c.quantite
                }));
                
                const transActivities = (transactions || []).map(t => ({
                    type: 'transaction',
                    id: t.id,
                    entity: t.description,
                    date: t.date,
                    value: t.credit || t.debit
                }));
                
                activities = [...collActivities, ...transActivities]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 20);
            } else {
                activities = db.all(`
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
            }

            res.json({ success: true, data: activities });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
