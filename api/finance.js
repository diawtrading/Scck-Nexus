const express = require('express');
const Joi = require('joi');

module.exports = (db) => {
    const router = express.Router();

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
    router.get('/transactions', (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;

            const countResult = db.get('SELECT COUNT(*) as total FROM transactions');
            const transactions = db.all(
                'SELECT * FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );

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
    router.post('/transactions', (req, res) => {
        try {
            const { error, value } = transactionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: error.details[0].message });
            }

            const existing = db.all('SELECT id FROM transactions');
            const id = `TXN-${String(existing.length + 1).padStart(5, '0')}`;

            db.run(
                `INSERT INTO transactions 
                (id, date, compte, description, debit, credit, type, reference_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, value.date, value.compte, value.description, value.debit, value.credit, value.type, value.reference_id, new Date().toISOString()]
            );

            res.status(201).json({ success: true, message: 'Transaction created', data: { id, ...value } });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get financial report
    router.get('/report', (req, res) => {
        try {
            const totalDebit = db.get('SELECT SUM(debit) as total FROM transactions');
            const totalCredit = db.get('SELECT SUM(credit) as total FROM transactions');
            const byAccount = db.all('SELECT compte, SUM(debit) as debit, SUM(credit) as credit FROM transactions GROUP BY compte');

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
