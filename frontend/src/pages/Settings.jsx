import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Database } from 'lucide-react'
import { Link } from 'react-router-dom'

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: User, description: 'Manage your account' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Email and push notifications' },
  { id: 'security', name: 'Security', icon: Shield, description: 'Password and 2FA' },
  { id: 'appearance', name: 'Appearance', icon: Palette, description: 'Theme and display' },
  { id: 'language', name: 'Language', icon: Globe, description: 'Language and region' },
  { id: 'data', name: 'Data Management', icon: Database, description: 'Backup and exports' },
]

export default function Settings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Settings</h1><p className="text-gray-500 text-sm mt-1">Configure system preferences</p></div>
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
        <h3 className="font-display font-semibold text-lg text-white mb-6">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-gray-500 text-sm mb-1">Version</p><p className="text-white font-mono">v1.0.0</p></div>
          <div><p className="text-gray-500 text-sm mb-1">Environment</p><p className="text-white font-mono">Production</p></div>
          <div><p className="text-gray-500 text-sm mb-1">Database</p><p className="text-white font-mono">SQLite 3.40.0</p></div>
          <div><p className="text-gray-500 text-sm mb-1">Last Updated</p><p className="text-white font-mono">2026-02-15</p></div>
        </div>
      </div>
    </motion.div>
  )
}
