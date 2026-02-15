import { motion } from 'framer-motion'
import { Boxes, AlertTriangle, Package, ArrowUpRight } from 'lucide-react'

const inventory = [
  { id: 'INV-001', name: 'Cocoa Beans (Grade A)', quantity: 2500, unit: 'kg', value: 3750000, location: 'Warehouse A', status: 'In Stock' },
  { id: 'INV-002', name: 'Cocoa Beans (Grade B)', quantity: 1800, unit: 'kg', value: 2160000, location: 'Warehouse A', status: 'In Stock' },
  { id: 'INV-003', name: 'NPK Fertilizer', quantity: 150, unit: 'bags', value: 2250000, location: 'Storage B', status: 'Low Stock' },
  { id: 'INV-004', name: 'Pesticide - Organic', quantity: 80, unit: 'liters', value: 640000, location: 'Storage B', status: 'In Stock' },
  { id: 'INV-005', name: 'Harvesting Tools Set', quantity: 45, unit: 'sets', value: 337500, location: 'Equipment Room', status: 'In Stock' },
]

export default function Inventory() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage stock and supplies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-accent-cyan/10"><Boxes className="w-5 h-5 text-accent-cyan" /></div>
          </div>
          <h3 className="text-gray-500 text-sm">Total Items</h3>
          <p className="font-display font-bold text-2xl text-white mt-1">342</p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-green-500/10"><Package className="w-5 h-5 text-green-400" /></div>
          </div>
          <h3 className="text-gray-500 text-sm">In Stock</h3>
          <p className="font-display font-bold text-2xl text-white mt-1">298</p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/10"><AlertTriangle className="w-5 h-5 text-yellow-400" /></div>
            <span className="text-yellow-400 text-sm">Needs attention</span>
          </div>
          <h3 className="text-gray-500 text-sm">Low Stock</h3>
          <p className="font-display font-bold text-2xl text-white mt-1">44</p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Item</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Quantity</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Value</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Location</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-dark-border/50 hover:bg-white/5">
                <td className="px-6 py-4 text-white">{item.name}</td>
                <td className="px-6 py-4 text-gray-300">{item.quantity} {item.unit}</td>
                <td className="px-6 py-4 text-gray-300">{item.value.toLocaleString()} CFA</td>
                <td className="px-6 py-4 text-gray-400">{item.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
