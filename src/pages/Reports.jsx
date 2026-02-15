import { motion } from 'framer-motion'
import { FileText, Download, BarChart, PieChart, Table } from 'lucide-react'

const reports = [
  { id: 1, name: 'Rapport Financier', description: 'Revenus, dépenses et analyse des bénéfices', type: 'Finance', format: 'PDF', lastGenerated: '2026-02-15' },
  { id: 2, name: 'Rapport de Production', description: 'Collecte de cacao et métriques de qualité', type: 'Production', format: 'PDF', lastGenerated: '2026-02-14' },
  { id: 3, name: 'Rapport RH', description: 'Masse salariale et présence des employés', type: 'HR', format: 'Excel', lastGenerated: '2026-02-10' },
  { id: 4, name: "Rapport d'Inventaire", description: 'Niveaux de stock et évaluation', type: 'Inventory', format: 'Excel', lastGenerated: '2026-02-12' },
  { id: 5, name: 'Rapport Producteurs', description: 'Statistiques et zones des producteurs', type: 'Producers', format: 'PDF', lastGenerated: '2026-02-13' },
  { id: 6, name: 'Rapport Clients', description: 'Revenus et démographie des acheteurs', type: 'Customers', format: 'Excel', lastGenerated: '2026-02-11' },
]

const reportTypes = ['Tous', 'Finance', 'Production', 'RH', 'Inventaire', 'Producteurs', 'Clients']

export default function Reports() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Rapports</h1><p className="text-gray-500 text-sm mt-1">Générer et exporter les rapports d'entreprise</p></div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reportTypes.map((type) => (<button key={type} className="px-4 py-2 bg-white/5 border border-dark-border rounded-lg text-sm text-gray-300 hover:bg-white/10 whitespace-nowrap">{type}</button>))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="glass rounded-xl p-5 hover:border-accent-cyan/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-accent-cyan/10"><FileText className="w-5 h-5 text-accent-cyan" /></div>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">{report.format}</span>
            </div>
            <h3 className="font-semibold text-white mb-1">{report.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-dark-border">
              <span className="text-xs text-gray-500">{report.lastGenerated}</span>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-bg text-xs font-semibold rounded-lg hover:opacity-90">
                <Download className="w-3.5 h-3.5" /> Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
