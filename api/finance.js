const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();
    const isSupabase = db.isUsingSupabase();

    const transactionSchema = Joi.object({
        date: Joi.date().required(),
        compte: Joi.string().required(),
        description: Joi.string().required(),
        debit: Joi.number().default(0),
        credit: Joi.number().default(0),
        type: Joi.string(),
        reference_id: Joi.string()
    });

    // Get all transactions
    router.get('/transactions', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;

            let transactions, countResult;

            if (isSupabase) {
                const { data, count } = await db.getSupabaseClient()
                    .from('transactions')
                    .select('*', { count: 'exact' })
                    .order('date', { ascending: false })
                    .range(offset, offset + limit - 1);
                transactions = data || [];
                countResult = { total: count || 0 };
            } else {
                countResult = db.get('SELECT COUNT(*) as total FROM transactions');
                transactions = db.all(
                    'SELECT * FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?',
                    [limit, offset]
                );
            }

            res.json({
                success: true,
                data: transactions,
                pagination: { page, limit, total: countResult.total }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Create transaction
    router.post('/transactions', async (req, res) => {
        try {
            const { error, value } = transactionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            let existing;
            if (isSupabase) {
                const { data } = await db.getSupabaseClient().from('transactions').select('id');
                existing = data || [];
            } else {
                existing = db.all('SELECT id FROM transactions');
            }
            const id = `TXN-${String(existing.length + 1).padStart(5, '0')}`;

            if (isSupabase) {
                await db.getSupabaseClient().from('transactions').insert({
                    id,
                    date: value.date,
                    compte: value.compte,
                    description: value.description,
                    debit: value.debit,
                    credit: value.credit,
                    type: value.type,
                    reference_id: value.reference_id,
                    created_at: new Date().toISOString()
                });
            } else {
                db.run(
                    `INSERT INTO transactions 
                    (id, date, compte, description, debit, credit, type, reference_id, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, value.date, value.compte, value.description, value.debit, value.credit, value.type, value.reference_id, new Date().toISOString()]
                );
            }

            res.status(201).json({ success: true, message: 'Transaction created', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get financial report
    router.get('/report', async (req, res) => {
        try {
            let totalDebit, totalCredit, byAccount;

            if (isSupabase) {
                const { data: debitData } = await db.getSupabaseClient()
                    .from('transactions')
                    .select('debit');
                const { data: creditData } = await db.getSupabaseClient()
                    .from('transactions')
                    .select('credit');
                
                totalDebit = { total: debitData?.reduce((sum, row) => sum + (row.debit || 0), 0) || 0 };
                totalCredit = { total: creditData?.reduce((sum, row) => sum + (row.credit || 0), 0) || 0 };

                const { data: accountData } = await db.getSupabaseClient()
                    .from('transactions')
                    .select('compte,debit,credit');
                
                const accountMap = {};
                accountData?.forEach(row => {
                    if (!accountMap[row.compte]) {
                        accountMap[row.compte] = { compte: row.compte, debit: 0, credit: 0 };
                    }
                    accountMap[row.compte].debit += row.debit || 0;
                    accountMap[row.compte].credit += row.credit || 0;
                });
                byAccount = Object.values(accountMap);
            } else {
                totalDebit = db.get('SELECT SUM(debit) as total FROM transactions');
                totalCredit = db.get('SELECT SUM(credit) as total FROM transactions');
                byAccount = db.all('SELECT compte, SUM(debit) as debit, SUM(credit) as credit FROM transactions GROUP BY compte');
            }

            res.json({
                success: true,
                data: {
                    totalIncome: totalCredit.total || 0,
                    totalExpense: totalDebit.total || 0,
                    netPosition: (totalCredit.total || 0) - (totalDebit.total || 0),
                    byAccount
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
