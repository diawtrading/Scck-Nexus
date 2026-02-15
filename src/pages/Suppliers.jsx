import { motion } from 'framer-motion'
import { Truck, Package, Phone, CreditCard } from 'lucide-react'

const suppliers = [
  { id: 'SUP-001', name: 'AgroPlus International', specialty: 'Engrais', contact: '+225 0123456789', payment: 'Net 30', status: 'Active' },
  { id: 'SUP-002', name: 'FarmEquip Co', specialty: 'Équipement', contact: '+225 0234567890', payment: 'Net 45', status: 'Active' },
  { id: 'SUP-003', name: 'Organic Solutions Pesticides SA', specialty: 'Pesticides', contact: '+225 0345678901', payment: 'Net 30', status: 'Active' },
  { id: 'SUP-004', name: 'Packaging Plus', specialty: 'Emballage', contact: '+225 0456789012', payment: 'Immédiat', status: 'Active' },
  { id: 'SUP-005', name: 'Seed Masters Ltd', specialty: 'Semences', contact: '+225 0567890123', payment: 'Net 60', status: 'Inactive' },
]

export { default } from '../../frontend/src/pages/Suppliers.jsx'
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Fournisseurs</h1><p className="text-gray-500 text-sm mt-1">Gestion des fournisseurs et prestataires</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-accent-cyan/10 mb-3"><Truck className="w-5 h-5 text-accent-cyan" /></div><h3 className="text-gray-500 text-sm">Total Fournisseurs</h3><p className="font-display font-bold text-2xl text-white mt-1">18</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-green-500/10 mb-3"><Package className="w-5 h-5 text-green-400" /></div><h3 className="text-gray-500 text-sm">Actifs</h3><p className="font-display font-bold text-2xl text-white mt-1">15</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-purple-500/10 mb-3"><CreditCard className="w-5 h-5 text-purple-400" /></div><h3 className="text-gray-500 text-sm">Ce Mois</h3><p className="font-display font-bold text-2xl text-white mt-1">4.2M CFA</p></div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-dark-border">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Fournisseur</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Spécialité</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Contact</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Conditions de Paiement</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Statut</th>
          </tr></thead>
          <tbody>
            {suppliers.map((sup) => (<tr key={sup.id} className="border-b border-dark-border/50 hover:bg-white/5">
              <td className="px-6 py-4 text-white">{sup.name}</td>
              <td className="px-6 py-4 text-gray-300">{sup.specialty}</td>
              <td className="px-6 py-4 text-gray-300">{sup.contact}</td>
              <td className="px-6 py-4 text-gray-300">{sup.payment}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${sup.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{sup.status}</span></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
