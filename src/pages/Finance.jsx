import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const transactions = [
  { id: 'TXN-001', type: 'income', description: 'Cocoa Sale - Buyer Corp', amount: 2500000, balance: 12500000, date: '2026-02-15' },
  { id: 'TXN-002', type: 'expense', description: 'Fertilizer Purchase', amount: -450000, balance: 12050000, date: '2026-02-14' },
  { id: 'TXN-003', type: 'income', description: 'Cocoa Sale - Choco Ltd', amount: 1800000, balance: 13850000, date: '2026-02-13' },
  { id: 'TXN-004', type: 'expense', description: 'Staff Salaries', amount: -1200000, balance: 12650000, date: '2026-02-12' },
  { id: 'TXN-005', type: 'income', description: 'Certification Bonus', amount: 500000, balance: 13150000, date: '2026-02-11' },
]

export { default } from '../../frontend/src/pages/Finance.jsx'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Finance</h1>
        <p className="text-gray-500 text-sm mt-1">Gérer les transactions et les rapports financiers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" /> +15%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm">Total des Revenus</h3>
          <p className="font-display font-bold text-2xl text-white mt-1">14.2M CFA</p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <span className="flex items-center text-red-400 text-sm">
              <ArrowDownRight className="w-4 h-4" /> +8%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm">Total des Dépenses</h3>
          <p className="font-display font-bold text-2xl text-white mt-1">3.8M CFA</p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-accent-cyan/10">
              <Wallet className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Solde Actuel</h3>
          <p className="font-display font-bold text-2xl text-white mt-1">10.4M CFA</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-dark-border">
          <h3 className="font-display font-semibold text-lg text-white">Transactions Récentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Description</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Montant</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Solde</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-accent-cyan">{txn.id}</td>
                  <td className="px-6 py-4 text-white">{txn.description}</td>
                  <td className="px-6 py-4">
                    <span className={txn.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                      {txn.type === 'income' ? '+' : ''}{txn.amount.toLocaleString()} CFA
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{txn.balance.toLocaleString()} CFA</td>
                  <td className="px-6 py-4 text-gray-400">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
