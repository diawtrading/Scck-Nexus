import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wallet, 
  Boxes, 
  UserCog, 
  Building2, 
  Truck, 
  TrendingUp, 
  FileText, 
  Settings,
  X,
  Leaf
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Producers', icon: Users, path: '/producers' },
  { name: 'Collections', icon: Package, path: '/collections' },
  { name: 'Finance', icon: Wallet, path: '/finance' },
  { name: 'Inventory', icon: Boxes, path: '/inventory' },
  { name: 'Employees', icon: UserCog, path: '/employees' },
  { name: 'Customers', icon: Building2, path: '/customers' },
  { name: 'Suppliers', icon: Truck, path: '/suppliers' },
  { name: 'Projects', icon: TrendingUp, path: '/projects' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

const mainNavItems = navItems.slice(0, 6)
const secondaryNavItems = navItems.slice(6)

export default function Sidebar({ onClose }) {
  return (
    <aside className="w-[280px] h-full bg-dark-card border-r border-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gradient">SCCK ERP</h1>
              <p className="text-xs text-gray-500">Nexus Platform</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Main Section */}
        <div className="mb-6">
          <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </h3>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Section */}
        <div>
          <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            More
          </h3>
          <ul className="space-y-1">
            {secondaryNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2">Cocoa Cooperative</p>
          <p className="text-sm font-medium text-white">SCCK NEXUS</p>
          <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  )
}
