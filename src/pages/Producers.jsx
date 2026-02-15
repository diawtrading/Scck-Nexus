import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, MoreVertical, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react'
import { producersService } from '../services/api'

export { default } from '../../frontend/src/pages/Producers.jsx'
  const [producers, setProducers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchProducers()
  }, [])

  const fetchProducers = async () => {
    try {
      const response = await producersService.getAll()
      setProducers(response.data)
    } catch (error) {
      // Mock data for demo
      setProducers([
        { id: '1', nom: 'Konan Jean', zone: 'Zone Nord', superficie: 12.5, statut: 'Active', telephone: '+225 0123456789' },
        { id: '2', nom: 'Kouadio Paul', zone: 'Zone Sud', superficie: 8.0, statut: 'Active', telephone: '+225 0234567890' },
        { id: '3', nom: 'Traoré Amara', zone: 'Zone Est', superficie: 15.2, statut: 'Active', telephone: '+225 0345678901' },
        { id: '4', nom: 'Bamba Fatou', zone: 'Zone Ouest', superficie: 6.8, statut: 'Inactive', telephone: '+225 0456789012' },
        { id: '5', nom: 'Doumbia Mamadou', zone: 'Zone Centre', superficie: 10.0, statut: 'Active', telephone: '+225 0567890123' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducers = producers.filter(p => 
    p.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.zone?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const getStatusText = (status) => {
    return status === 'Active' ? 'Actif' : 'Inactif'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Producteurs</h1>
          <p className="text-gray-500 text-sm mt-1">Gérer les enregistrements des producteurs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-bg font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Ajouter Producteur
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher des producteurs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-dark-border rounded-xl text-gray-300 hover:bg-white/10 transition-colors">
          <Filter className="w-5 h-5" />
          Filtrer
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Producteur</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Zone</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Superficie (Ha)</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Contact</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Statut</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducers.map((producer, index) => (
                <tr key={producer.id} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-accent-cyan">
                          {producer.nom?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-white">{producer.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {producer.zone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{producer.superficie} ha</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {producer.telephone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(producer.statut)}`}>
                      {getStatusText(producer.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">Affichage de {filteredProducers.length} sur {producers.length} producteurs</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white/5 border border-dark-border rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
            Précédent
          </button>
          <button className="px-4 py-2 bg-white/5 border border-dark-border rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
            Suivant
          </button>
        </div>
      </div>
    </motion.div>
  )
}
