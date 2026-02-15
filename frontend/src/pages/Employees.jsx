import { motion } from 'framer-motion'
import { UserCog, Briefcase, Calendar, DollarSign } from 'lucide-react'

const employees = [
  { id: 'EMP-001', name: 'Diabate Henri', position: 'General Manager', department: 'Management', salary: 850000, status: 'Active', hireDate: '2020-03-15' },
  { id: 'EMP-002', name: 'Kone Aicha', position: 'Finance Director', department: 'Finance', salary: 720000, status: 'Active', hireDate: '2021-06-01' },
  { id: 'EMP-003', name: 'Soro Jean', position: 'Operations Manager', department: 'Operations', salary: 650000, status: 'Active', hireDate: '2021-09-10' },
  { id: 'EMP-004', name: 'Traore Mariam', position: 'HR Manager', department: 'Administration', salary: 550000, status: 'Active', hireDate: '2022-01-20' },
  { id: 'EMP-005', name: 'Balo Issiaka', position: 'Field Supervisor', department: 'Operations', salary: 420000, status: 'Active', hireDate: '2023-04-05' },
]

export default function Employees() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white">Employees</h1><p className="text-gray-500 text-sm mt-1">Human resources management</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-accent-cyan/10 mb-3"><UserCog className="w-5 h-5 text-accent-cyan" /></div><h3 className="text-gray-500 text-sm">Total Staff</h3><p className="font-display font-bold text-2xl text-white mt-1">48</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-green-500/10 mb-3"><Briefcase className="w-5 h-5 text-green-400" /></div><h3 className="text-gray-500 text-sm">Active</h3><p className="font-display font-bold text-2xl text-white mt-1">45</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-purple-500/10 mb-3"><Calendar className="w-5 h-5 text-purple-400" /></div><h3 className="text-gray-500 text-sm">Departments</h3><p className="font-display font-bold text-2xl text-white mt-1">6</p></div>
        <div className="glass rounded-xl p-5"><div className="p-2.5 rounded-xl bg-yellow-500/10 mb-3"><DollarSign className="w-5 h-5 text-yellow-400" /></div><h3 className="text-gray-500 text-sm">Monthly Payroll</h3><p className="font-display font-bold text-2xl text-white mt-1">18.5M</p></div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-dark-border">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Employee</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Position</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Department</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Salary</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Hire Date</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
          </tr></thead>
          <tbody>
            {employees.map((emp) => (<tr key={emp.id} className="border-b border-dark-border/50 hover:bg-white/5">
              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-purple-500/20 flex items-center justify-center"><span className="text-xs font-bold text-accent-cyan">{emp.name.split(' ').map(n => n[0]).join('')}</span></div><span className="text-white">{emp.name}</span></div></td>
              <td className="px-6 py-4 text-gray-300">{emp.position}</td>
              <td className="px-6 py-4 text-gray-300">{emp.department}</td>
              <td className="px-6 py-4 text-white">{emp.salary.toLocaleString()} CFA</td>
              <td className="px-6 py-4 text-gray-400">{emp.hireDate}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">{emp.status}</span></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
