import { motion } from 'framer-motion'
import { Building2, MapPin, DollarSign, Phone } from 'lucide-react'

const customers = [
  { id: 'CUS-001', name: 'Choco Delice SARL', contact: 'Jean-Marc Dubois', country: 'France', revenue: 45000000, status: 'Active' },
  { id: 'CUS-002', name: 'Cocoa Kings Ltd', contact: 'Michael Brown', country: 'Royaume-Uni', revenue: 38000000, status: 'Active' },
  { id: 'CUS-003', name: 'Belgian Chocolates NV', contact: 'Pieter Janssens', country: 'Belgique', revenue: 32000000, status: 'Active' },
  { id: 'CUS-004', name: 'Swiss Cocoa Co.', contact: 'Hans Mueller', country: 'Suisse', revenue: 28000000, status: 'Active' },
  { id: 'CUS-005', name: 'Nordic Sweets AB', contact: 'Anna Lindqvist', country: 'Suède', revenue: 15000000, status: 'Inactive' },
]

export default function Customers() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Clients</h1><p className="text-gray-500 text-sm mt-1">Gestion des acheteurs et clients</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-accent-cyan/10 mb-3"><Building2 className="w-5 h-5 text-accent-cyan" /></div><h3 className="text-gray-500 text-sm">Total Acheteurs</h3><p className="font-display font-bold text-2xl text-white mt-1">24</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-green-500/10 mb-3"><DollarSign className="w-5 h-5 text-green-400" /></div><h3 className="text-gray-500 text-sm">Revenu Total</h3><p className="font-display font-bold text-2xl text-white mt-1">158M CFA</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-purple-500/10 mb-3"><MapPin className="w-5 h-5 text-purple-400" /></div><h3 className="text-gray-500 text-sm">Pays</h3><p className="font-display font-bold text-2xl text-white mt-1">8</p></div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-dark-border">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Entreprise</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Contact</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Pays</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Revenu</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Statut</th>
          </tr></thead>
          <tbody>
            {customers.map((cus) => (<tr key={cus.id} className="border-b border-dark-border/50 hover:bg-white/5">
              <td className="px-6 py-4 text-white">{cus.name}</td>
              <td className="px-6 py-4 text-gray-300">{cus.contact}</td>
              <td className="px-6 py-4 text-gray-300">{cus.country}</td>
              <td className="px-6 py-4 text-white">{cus.revenue.toLocaleString()} CFA</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${cus.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{cus.status}</span></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
