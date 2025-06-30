import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Building2, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Truck, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react'
import Swal from 'sweetalert2'

const Layout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم', roles: ['Admin', 'Accountant', 'Sales Rep', 'Viewer'] },
    { path: '/orders', icon: ShoppingCart, label: 'إدارة الطلبات', roles: ['Admin', 'Accountant', 'Sales Rep'] },
    { path: '/products', icon: Package, label: 'إدارة المنتجات', roles: ['Admin', 'Accountant'] },
    { path: '/billing', icon: CreditCard, label: 'الفواتير والمدفوعات', roles: ['Admin', 'Accountant'] },
    { path: '/delivery', icon: Truck, label: 'إدارة التوصيل', roles: ['Admin', 'Sales Rep'] },
    { path: '/crm', icon: Users, label: 'العملاء والموردين', roles: ['Admin', 'Accountant', 'Sales Rep'] },
    { path: '/collections', icon: DollarSign, label: 'إدارة التحصيلات', roles: ['Admin', 'Accountant', 'Sales Rep'] },
    { path: '/reports', icon: BarChart3, label: 'التقارير والتحليلات', roles: ['Admin', 'Accountant', 'Viewer'] },
    { path: '/users', icon: Settings, label: 'إدارة المستخدمين', roles: ['Admin'] }
  ]

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role))

  const handleLogout = () => {
    Swal.fire({
      title: 'تسجيل الخروج',
      text: 'هل أنت متأكد من تسجيل الخروج؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، تسجيل الخروج',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout()
        navigate('/login')
      }
    })
  }

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleLabel = (role) => {
    const roleLabels = {
      'Admin': 'مدير النظام',
      'Accountant': 'محاسب',
      'Sales Rep': 'مندوب مبيعات',
      'Viewer': 'مستخدم عادي'
    }
    return roleLabels[role] || role
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">HCP ERP</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 ml-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3 space-x-reverse mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:mr-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {filteredMenuItems.find(item => item.path === location.pathname)?.label || 'HCP ERP'}
            </h1>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            
            <div className="hidden sm:flex items-center space-x-3 space-x-reverse">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500">{getRoleLabel(user.role)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

