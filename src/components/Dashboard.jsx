import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalOrders: 156,
    totalRevenue: 2450000,
    totalProducts: 89,
    totalCustomers: 45,
    pendingOrders: 12,
    completedOrders: 144,
    overduePayments: 8,
    monthlyGrowth: 12.5
  })

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-001', customer: 'شركة البناء الحديث', amount: 15000, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'مؤسسة الإنشاءات', amount: 25000, status: 'completed', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'شركة التطوير العقاري', amount: 18000, status: 'processing', date: '2024-01-13' },
    { id: 'ORD-004', customer: 'مقاولات الخليج', amount: 32000, status: 'completed', date: '2024-01-12' },
    { id: 'ORD-005', customer: 'شركة الديكور الفاخر', amount: 12000, status: 'pending', date: '2024-01-11' }
  ])

  // Sample data for charts
  const salesData = [
    { month: 'يناير', sales: 180000 },
    { month: 'فبراير', sales: 220000 },
    { month: 'مارس', sales: 195000 },
    { month: 'أبريل', sales: 240000 },
    { month: 'مايو', sales: 280000 },
    { month: 'يونيو', sales: 320000 }
  ]

  const productCategoryData = [
    { name: 'دهانات داخلية', value: 35, color: '#4F46E5' },
    { name: 'دهانات خارجية', value: 28, color: '#7C3AED' },
    { name: 'دهانات معادن', value: 20, color: '#10B981' },
    { name: 'مواد مساعدة', value: 17, color: '#F59E0B' }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', variant: 'secondary' },
      processing: { label: 'قيد التنفيذ', variant: 'default' },
      completed: { label: 'مكتمل', variant: 'success' },
      cancelled: { label: 'ملغي', variant: 'destructive' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <div className="flex items-center mt-1">
                  {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                  )}
                  <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trendValue}%
                  </span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً، {user.name}</h1>
        <p className="text-blue-100">إليك نظرة عامة على أداء نشاطك التجاري اليوم</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend="up"
          trendValue="8.2"
          color="blue"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue={stats.monthlyGrowth}
          color="green"
        />
        <StatCard
          title="المنتجات"
          value={stats.totalProducts}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="العملاء"
          value={stats.totalCustomers}
          icon={Users}
          trend="up"
          trendValue="5.1"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>الإجراءات الأكثر استخداماً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Plus className="w-6 h-6" />
              <span>طلب جديد</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="w-6 h-6" />
              <span>إضافة منتج</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span>عميل جديد</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <DollarSign className="w-6 h-6" />
              <span>تسجيل دفعة</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>مبيعات الأشهر الستة الماضية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="sales" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Categories */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع المنتجات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات الأخيرة</CardTitle>
          <CardDescription>آخر 5 طلبات تم تسجيلها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-medium text-orange-900">طلبات في الانتظار</p>
                <p className="text-2xl font-bold text-orange-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-900">طلبات مكتملة</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-medium text-red-900">مدفوعات متأخرة</p>
                <p className="text-2xl font-bold text-red-900">{stats.overduePayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

