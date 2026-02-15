const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    // Generate financial report
    router.get('/financial', async (req, res) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            let transactions, summary;

            if (isSupabase) {
                let query = db.getSupabaseClient().from('transactions').select('*').order('date', { ascending: false });
                if (startDate) {
                    query = query.gte('date', startDate);
                }
                if (endDate) {
                    query = query.lte('date', endDate);
                }
                const { data } = await query;
                transactions = data || [];

                const income = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
                const expense = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
                summary = {
                    totalIncome: income,
                    totalExpense: expense,
                    netIncome: income - expense
                };
            } else {
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

                transactions = db.all(query + ' ORDER BY date DESC', params);
                summary = db.get(`
                    SELECT 
                        SUM(credit) as totalIncome,
                        SUM(debit) as totalExpense,
                        SUM(credit) - SUM(debit) as netIncome
                    FROM transactions
                    WHERE 1=1 ${startDate ? 'AND date >= ?' : ''} ${endDate ? 'AND date <= ?' : ''}
                `, params);
            }

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
    router.get('/production', async (req, res) => {
        try {
            const startDate = req.query.startDate || '2020-01-01';
            const endDate = req.query.endDate || new Date().toISOString();

            let stats;

            if (isSupabase) {
                const { data: producers } = await db.getSupabaseClient()
                    .from('producers')
                    .select('id,zone');
                const { data: collections } = await db.getSupabaseClient()
                    .from('collections')
                    .select('producer_id,date,quantite,total,prix_unitaire');
                
                const filteredCollections = (collections || []).filter(c => {
                    if (!c.date) return false;
                    return c.date >= startDate && c.date <= endDate;
                });

                const zoneMap = {};
                producers?.forEach(p => {
                    if (!zoneMap[p.zone]) {
                        zoneMap[p.zone] = { zone: p.zone, totalProducers: 0, totalCollections: 0, totalQuantity: 0, totalValue: 0, avgPrice: 0 };
                    }
                    zoneMap[p.zone].totalProducers++;
                });

                const zoneCollections = {};
                filteredCollections.forEach(c => {
                    const producer = producers?.find(p => p.id === c.producer_id);
                    if (producer) {
                        if (!zoneCollections[producer.zone]) {
                            zoneCollections[producer.zone] = { values: [], quantities: [] };
                        }
                        zoneCollections[producer.zone].values.push(c.total || 0);
                        zoneCollections[producer.zone].quantities.push(c.quantite || 0);
                    }
                });

                Object.keys(zoneMap).forEach(zone => {
                    if (zoneCollections[zone]) {
                        zoneMap[zone].totalCollections = zoneCollections[zone].values.length;
                        zoneMap[zone].totalQuantity = zoneCollections[zone].quantities.reduce((a, b) => a + b, 0);
                        zoneMap[zone].totalValue = zoneCollections[zone].values.reduce((a, b) => a + b, 0);
                        zoneMap[zone].avgPrice = zoneCollections[zone].quantities.length > 0
                            ? zoneCollections[zone].values.reduce((a, b) => a + b, 0) / zoneCollections[zone].quantities.length
                            : 0;
                    }
                });

                stats = Object.values(zoneMap);
            } else {
                stats = db.all(`
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
                `, [startDate, endDate]);
            }

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
    router.get('/hr', async (req, res) => {
        try {
            let stats, totalPayroll;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('employees')
                    .select('*')
                    .eq('statut', 'Active');
                
                const deptMap = {};
                data?.forEach(emp => {
                    if (!deptMap[emp.departement]) {
                        deptMap[emp.departement] = { 
                            departement: emp.departement, 
                            count: 0, 
                            totalSalary: 0, 
                            avgSalary: 0, 
                            fullTime: 0, 
                            partTime: 0 
                        };
                    }
                    deptMap[emp.departement].count++;
                    deptMap[emp.departement].totalSalary += emp.salaire || 0;
                    if (emp.contrat === 'Full-time') deptMap[emp.departement].fullTime++;
                    if (emp.contrat === 'Part-time') deptMap[emp.departement].partTime++;
                });

                Object.values(deptMap).forEach(d => {
                    d.avgSalary = d.count > 0 ? d.totalSalary / d.count : 0;
                });

                stats = Object.values(deptMap);
                totalPayroll = { total: data?.reduce((sum, e) => sum + (e.salaire || 0), 0) || 0 };
            } else {
                stats = db.all(`
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

                totalPayroll = db.get('SELECT SUM(salaire) as total FROM employees WHERE statut = "Active"');
            }

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
    router.get('/inventory', async (req, res) => {
        try {
            let lowStock, overStock, total;

            if (isSupabase) {
                const { data } = await db.getSupabaseClient()
                    .from('inventory')
                    .select('*');
                
                lowStock = (data || []).filter(item => item.quantite <= item.min_stock);
                overStock = (data || []).filter(item => item.quantite >= item.max_stock);
                total = { 
                    count: data?.length || 0, 
                    total: data?.reduce((sum, item) => sum + (item.valeur || 0), 0) || 0 
                };
            } else {
                lowStock = db.all('SELECT * FROM inventory WHERE quantite <= min_stock');
                overStock = db.all('SELECT * FROM inventory WHERE quantite >= max_stock');
                total = db.get('SELECT COUNT(*) as count, SUM(valeur) as total FROM inventory');
            }

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
    router.get('/export/:format', async (req, res) => {
        try {
            const { format } = req.params;
            const table = req.query.table;

            let data = [];
            if (table === 'producers') {
                if (isSupabase) {
                    const { data: result } = await db.getSupabaseClient().from('producers').select('*');
                    data = result || [];
                } else {
                    data = db.all('SELECT * FROM producers');
                }
            } else if (table === 'collections') {
                if (isSupabase) {
                    const { data: result } = await db.getSupabaseClient().from('collections').select('*');
                    data = result || [];
                } else {
                    data = db.all('SELECT * FROM collections');
                }
            } else if (table === 'transactions') {
                if (isSupabase) {
                    const { data: result } = await db.getSupabaseClient().from('transactions').select('*');
                    data = result || [];
                } else {
                    data = db.all('SELECT * FROM transactions');
                }
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
