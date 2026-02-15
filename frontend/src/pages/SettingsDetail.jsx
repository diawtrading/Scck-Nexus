import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SettingsDetail() {
  const { section } = useParams()
  const title = (section || 'General').charAt(0).toUpperCase() + (section || 'General').slice(1)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Settings: {title}</h2>
      <p className="text-gray-400">This is a placeholder detail view for the {title} settings. Implement detailed controls here.</p>
    </motion.div>
  )
}
