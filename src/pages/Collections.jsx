import { motion } from 'framer-motion'
import { Package, TrendingUp, DollarSign, Calendar } from 'lucide-react'

const stats = [
  { label: 'Total Collectes', value: '458.2 MT', icon: Package, color: 'cyan' },
  { label: 'Ce Mois', value: '78.5 MT', icon: Calendar, color: 'purple' },
  { label: 'Prix Moyen', value: '1 250 CFA/kg', icon: DollarSign, color: 'green' },
  { label: 'Qualité Grade A', value: '45%', icon: TrendingUp, color: 'yellow' },
]

const collections = [
  { id: 'COL-001', producer: 'Konan Jean', zone: 'Zone Nord', quantity: 120, quality: 'Grade A', price: 150000, date: '2026-02-15' },
  { id: 'COL-002', producer: 'Kouadio Paul', zone: 'Zone Sud', quantity: 95, quality: 'Grade A', price: 118750, date: '2026-02-14' },
  { id: 'COL-003', producer: 'Traoré Amara', zone: 'Zone Est', quantity: 80, quality: 'Grade B', price: 96000, date: '2026-02-14' },
  { id: 'COL-004', producer: 'Bamba Fatou', zone: 'Zone Ouest', quantity: 65, quality: 'Grade B', price: 78000, date: '2026-02-13' },
  { id: 'COL-005', producer: 'Doumbia Mamadou', zone: 'Zone Centre', quantity: 110, quality: 'Grade A', price: 137500, date: '2026-02-12' },
]

export { default } from '../../frontend/src/pages/Collections.jsx'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Collectes</h1>
        <p className="text-gray-500 text-sm mt-1">Suivre les collectes de cacao des producteurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-accent-${stat.color}/10`}>
                <stat.icon className={`w-5 h-5 text-accent-${stat.color}`} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm">{stat.label}</h3>
            <p className="font-display font-bold text-2xl text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Producteur</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Zone</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Quantité (kg)</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Qualité</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Total (CFA)</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.id} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-accent-cyan">{col.id}</td>
                  <td className="px-6 py-4 text-white">{col.producer}</td>
                  <td className="px-6 py-4 text-gray-300">{col.zone}</td>
                  <td className="px-6 py-4 text-gray-300">{col.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      col.quality === 'Grade A' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {col.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{col.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-400">{col.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
