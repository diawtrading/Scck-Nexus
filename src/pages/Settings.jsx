import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Database } from 'lucide-react'
import { Link } from 'react-router-dom'

const settingsSections = [
  { id: 'profile', name: 'Profil', icon: User, description: 'Gérer votre compte' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Notifications email et push' },
  { id: 'security', name: 'Sécurité', icon: Shield, description: 'Mot de passe et 2FA' },
  { id: 'appearance', name: 'Apparence', icon: Palette, description: 'Thème et affichage' },
  { id: 'language', name: 'Langue', icon: Globe, description: 'Langue et région' },
  { id: 'data', name: 'Gestion des Données', icon: Database, description: 'Sauvegarde et exports' },
]

export { default } from '../../frontend/src/pages/Settings.jsx'
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Paramètres</h1><p className="text-gray-500 text-sm mt-1">Configurer les préférences du système</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsSections.map((section) => (
          <Link key={section.id} to={`/settings/${section.id}`} className="glass rounded-xl p-6 text-left group block hover:border-accent-cyan/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/5 group-hover:bg-accent-cyan/10 transition-colors">
                <section.icon className="w-6 h-6 text-gray-400 group-hover:text-accent-cyan transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{section.name}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-6">Informations Système</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-gray-500 text-sm mb-1">Version</p><p className="text-white font-mono">v1.0.0</p></div>
          <div><p className="text-gray-500 text-sm mb-1">Environnement</p><p className="text-white font-mono">Production</p></div>
          <div><p className="text-gray-500 text-sm mb-1">Base de Données</p><p className="text-white font-mono">SQLite 3.40.0</p></div>
          <div><p className="text-gray-500 text-sm mb-1">Dernière Mise à Jour</p><p className="text-white font-mono">2026-02-15</p></div>
        </div>
      </div>
    </motion.div>
  )
}
