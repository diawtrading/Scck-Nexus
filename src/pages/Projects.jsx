import { motion } from 'framer-motion'
import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react'

const projects = [
  { id: 'PRJ-001', name: 'Construction Nouvel Entrepôt', budget: 45000000, spent: 28500000, progress: 65, status: 'In Progress', startDate: '2025-09-01', endDate: '2026-06-30' },
  { id: 'PRJ-002', name: 'Système de Séchage Solaire', budget: 18000000, spent: 16200000, progress: 90, status: 'In Progress', startDate: '2025-11-15', endDate: '2026-02-28' },
  { id: 'PRJ-003', name: 'Certification Commerce Équitable', budget: 8000000, spent: 5500000, progress: 70, status: 'In Progress', startDate: '2025-10-01', endDate: '2026-03-31' },
  { id: 'PRJ-004', name: 'Programme Équipement Agricole', budget: 25000000, spent: 0, progress: 0, status: 'Planned', startDate: '2026-04-01', endDate: '2026-12-31' },
  { id: 'PRJ-005', name: 'Mise à Niveau Infrastructure IT', budget: 15000000, spent: 15000000, progress: 100, status: 'Completed', startDate: '2025-06-01', endDate: '2025-12-31' },
]

const getStatusText = (status) => {
  const statusMap = {
    'In Progress': 'En Cours',
    'Planned': 'Planifié',
    'Completed': 'Terminé'
  }
  return statusMap[status] || status
}

export default function Projects() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Projets</h1><p className="text-gray-500 text-sm mt-1">Gestion et suivi des projets</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-accent-cyan/10 mb-3"><TrendingUp className="w-5 h-5 text-accent-cyan" /></div><h3 className="text-gray-500 text-sm">Total Projets</h3><p className="font-display font-bold text-2xl text-white mt-1">5</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-green-500/10 mb-3"><Target className="w-5 h-5 text-green-400" /></div><h3 className="text-gray-500 text-sm">En Cours</h3><p className="font-display font-bold text-2xl text-white mt-1">3</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-purple-500/10 mb-3"><Calendar className="w-5 h-5 text-purple-400" /></div><h3 className="text-gray-500 text-sm">Planifiés</h3><p className="font-display font-bold text-2xl text-white mt-1">1</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-yellow-500/10 mb-3"><DollarSign className="w-5 h-5 text-yellow-400" /></div><h3 className="text-gray-500 text-sm">Budget Total</h3><p className="font-display font-bold text-2xl text-white mt-1">111M</p></div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-dark-border">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Projet</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Budget</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Dépensé</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Progression</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Échéancier</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Statut</th>
          </tr></thead>
          <tbody>
            {projects.map((proj) => (<tr key={proj.id} className="border-b border-dark-border/50 hover:bg-white/5">
              <td className="px-6 py-4 text-white">{proj.name}</td>
              <td className="px-6 py-4 text-gray-300">{proj.budget.toLocaleString()} CFA</td>
              <td className="px-6 py-4 text-gray-300">{proj.spent.toLocaleString()} CFA</td>
              <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple" style={{ width: `${proj.progress}%` }} /></div><span className="text-xs text-gray-400 w-8">{proj.progress}%</span></div></td>
              <td className="px-6 py-4 text-gray-400 text-sm">{proj.startDate} - {proj.endDate}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${proj.status === 'Completed' ? 'bg-green-500/20 text-green-400' : proj.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{getStatusText(proj.status)}</span></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
