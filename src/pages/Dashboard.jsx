import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign, 
  Boxes,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { dashboardService } from '../services/api'

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
)

const kpiCards = [
  { title: 'Total Producers', value: '1,247', change: '+12%', trend: 'up', icon: Users },
  { title: 'Collections (MT)', value: '458.2', change: '+8.5%', trend: 'up', icon: Package },
  { title: 'Revenue (FCFA)', value: '2.4B', change: '+15.3%', trend: 'up', icon: DollarSign },
  { title: 'Inventory Items', value: '342', change: '-2.1%', trend: 'down', icon: Boxes },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getKPIs()
      setKpis(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Use mock data for demo
      setKpis({
        producers: 1247,
        collections: 458.2,
        revenue: 2400000000,
        inventory: 342
      })
    } finally {
      setLoading(false)
    }
  }

  // Revenue Chart Data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (FCFA)',
      data: [320000000, 380000000, 410000000, 390000000, 450000000, 520000000],
      borderColor: '#00f0ff',
      backgroundColor: 'rgba(0, 240, 255, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#00f0ff',
      pointBorderColor: '#00f0ff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00f0ff'
    }]
  }

  // Quality Distribution Chart
  const qualityChartData = {
    labels: ['Grade A', 'Grade B', 'Grade C', 'Rejected'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: ['#00ff88', '#00f0ff', '#ffaa00', '#ff3366'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  }

  // Collections by Zone Chart
  const zoneChartData = {
    labels: ['Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest', 'Zone Centre'],
    datasets: [{
      label: 'Collections (MT)',
      data: [120, 95, 80, 75, 88],
      backgroundColor: [
        'rgba(0, 240, 255, 0.8)',
        'rgba(112, 0, 255, 0.8)',
        'rgba(0, 255, 136, 0.8)',
        'rgba(255, 170, 0, 0.8)',
        'rgba(255, 51, 102, 0.8)'
      ],
      borderRadius: 8
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 5, 8, 0.9)',
        titleColor: '#fff',
        bodyColor: '#b0b0c0',
        borderColor: 'rgba(0, 240, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#b0b0c0' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#b0b0c0' }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#b0b0c0', padding: 20, usePointStyle: true }
      }
    },
    cutout: '70%'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your cooperative overview.</p>
        </div>
        <select className="px-4 py-2 bg-white/5 border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-accent-cyan/50">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass rounded-xl p-5 hover:border-accent-cyan/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-accent-cyan/10">
                <kpi.icon className="w-5 h-5 text-accent-cyan" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm">{kpi.title}</h3>
            <p className="font-display font-bold text-2xl text-white mt-1">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 glass rounded-xl p-6"
        >
          <h3 className="font-display font-semibold text-lg text-white mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Quality Distribution */}
        <motion.div variants={itemVariants} className="glass rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Quality Distribution</h3>
          <div className="h-[300px]">
            <Doughnut data={qualityChartData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Zone Performance */}
      <motion.div variants={itemVariants} className="glass rounded-xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Collections by Zone</h3>
        <div className="h-[300px]">
          <Bar data={zoneChartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="glass rounded-xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { title: 'New producer registered', time: '2 minutes ago', type: 'success' },
            { title: 'Collection recorded - Zone Nord', time: '15 minutes ago', type: 'info' },
            { title: 'Payment processed - $45,000', time: '1 hour ago', type: 'success' },
            { title: 'Low stock alert - Fertilizers', time: '2 hours ago', type: 'warning' },
            { title: 'New order from Buyer Corp', time: '3 hours ago', type: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-400' :
                activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-white">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
