import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  Search, 
  Calendar, 
  User, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react'

const CollectionManagement = ({ user }) => {
  const [collections, setCollections] = useState([
    {
      id: 'COL-001',
      date: '2024-01-15',
      collector: 'أحمد محمد',
      customer: 'شركة البناء الحديث',
      invoiceId: 'INV-001',
      amount: 5000,
      method: 'cash',
      reference: 'CASH-001',
      status: 'completed',
      notes: 'دفعة مقدمة'
    },
    {
      id: 'COL-002',
      date: '2024-01-14',
      collector: 'محمد علي',
      customer: 'مؤسسة الإنشاءات',
      invoiceId: 'INV-002',
      amount: 4500,
      method: 'bank',
      reference: 'TRF-001',
      status: 'completed',
      notes: 'دفع كامل'
    },
    {
      id: 'COL-003',
      date: '2024-01-13',
      collector: 'سعد أحمد',
      customer: 'شركة التطوير العقاري',
      invoiceId: 'INV-003',
      amount: 2500,
      method: 'check',
      reference: 'CHK-001',
      status: 'pending',
      notes: 'شيك مؤجل'
    },
    {
      id: 'COL-004',
      date: '2024-01-12',
      collector: 'علي حسن',
      customer: 'مقاولات الخليج',
      invoiceId: 'INV-004',
      amount: 8000,
      method: 'wallet',
      reference: 'WAL-001',
      status: 'completed',
      notes: 'محفظة إلكترونية'
    }
  ])

  const [filteredCollections, setFilteredCollections] = useState(collections)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    let filtered = collections

    if (searchTerm) {
      filtered = filtered.filter(collection => 
        collection.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.collector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(collection => collection.status === statusFilter)
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(collection => collection.method === methodFilter)
    }

    if (dateFilter !== 'all') {
      const today = new Date()
      let filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setDate(today.getDate())
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          break
        default:
          filterDate = null
      }
      
      if (filterDate) {
        filtered = filtered.filter(collection => 
          new Date(collection.date) >= filterDate
        )
      }
    }

    setFilteredCollections(filtered)
  }, [collections, searchTerm, statusFilter, methodFilter, dateFilter])

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'مكتمل', variant: 'success', icon: CheckCircle },
      pending: { label: 'في الانتظار', variant: 'secondary', icon: Clock },
      failed: { label: 'فشل', variant: 'destructive', icon: AlertCircle }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getMethodBadge = (method) => {
    const methodConfig = {
      cash: { label: 'نقدي', color: 'bg-green-100 text-green-800' },
      bank: { label: 'تحويل بنكي', color: 'bg-blue-100 text-blue-800' },
      check: { label: 'شيك', color: 'bg-purple-100 text-purple-800' },
      wallet: { label: 'محفظة إلكترونية', color: 'bg-orange-100 text-orange-800' }
    }
    
    const config = methodConfig[method] || methodConfig.cash
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getCollectionStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)
    const thisMonth = new Date()
    thisMonth.setMonth(thisMonth.getMonth() - 1)

    return {
      total: collections.reduce((sum, col) => sum + col.amount, 0),
      today: collections
        .filter(col => col.date === today && col.status === 'completed')
        .reduce((sum, col) => sum + col.amount, 0),
      thisWeek: collections
        .filter(col => new Date(col.date) >= thisWeek && col.status === 'completed')
        .reduce((sum, col) => sum + col.amount, 0),
      thisMonth: collections
        .filter(col => new Date(col.date) >= thisMonth && col.status === 'completed')
        .reduce((sum, col) => sum + col.amount, 0),
      pending: collections
        .filter(col => col.status === 'pending')
        .reduce((sum, col) => sum + col.amount, 0),
      completed: collections.filter(col => col.status === 'completed').length,
      pendingCount: collections.filter(col => col.status === 'pending').length
    }
  }

  const getTopCollectors = () => {
    const collectorStats = {}
    
    collections
      .filter(col => col.status === 'completed')
      .forEach(col => {
        if (!collectorStats[col.collector]) {
          collectorStats[col.collector] = { amount: 0, count: 0 }
        }
        collectorStats[col.collector].amount += col.amount
        collectorStats[col.collector].count += 1
      })

    return Object.entries(collectorStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }

  const getMethodStats = () => {
    const methodStats = {}
    
    collections
      .filter(col => col.status === 'completed')
      .forEach(col => {
        if (!methodStats[col.method]) {
          methodStats[col.method] = { amount: 0, count: 0 }
        }
        methodStats[col.method].amount += col.amount
        methodStats[col.method].count += 1
      })

    return methodStats
  }

  const stats = getCollectionStats()
  const topCollectors = getTopCollectors()
  const methodStats = getMethodStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة التحصيلات</h1>
          <p className="text-gray-600">متابعة تحصيلات المندوبين والمدفوعات</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التحصيلات</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تحصيلات اليوم</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.today)}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تحصيلات الأسبوع</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.thisWeek)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pending)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Collectors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              أفضل المحصلين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCollectors.map((collector, index) => (
                <div key={collector.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{collector.name}</p>
                      <p className="text-sm text-gray-600">{collector.count} تحصيل</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{formatCurrency(collector.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              طرق الدفع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(methodStats).map(([method, stats]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getMethodBadge(method)}
                    <span className="text-sm text-gray-600">{stats.count} عملية</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{formatCurrency(stats.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تحصيلات مكتملة</span>
                <span className="font-bold text-green-600">{stats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">في الانتظار</span>
                <span className="font-bold text-orange-600">{stats.pendingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تحصيلات الشهر</span>
                <span className="font-bold text-blue-600">{formatCurrency(stats.thisMonth)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">متوسط التحصيل</span>
                <span className="font-bold text-purple-600">
                  {formatCurrency(stats.completed > 0 ? stats.total / stats.completed : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالعميل أو المحصل أو رقم الفاتورة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطرق</SelectItem>
                  <SelectItem value="cash">نقدي</SelectItem>
                  <SelectItem value="bank">تحويل بنكي</SelectItem>
                  <SelectItem value="check">شيك</SelectItem>
                  <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الفترة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفترات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collections List */}
      <Card>
        <CardHeader>
          <CardTitle>سجل التحصيلات</CardTitle>
          <CardDescription>جميع عمليات التحصيل والمدفوعات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCollections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{collection.id}</h3>
                      {getStatusBadge(collection.status)}
                    </div>
                    <p className="text-sm text-gray-600">{collection.customer}</p>
                    <p className="text-xs text-gray-500">فاتورة: {collection.invoiceId}</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{collection.collector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{collection.date}</span>
                  </div>
                </div>

                <div className="text-center">
                  {getMethodBadge(collection.method)}
                  {collection.reference && (
                    <p className="text-xs text-gray-500 mt-1">{collection.reference}</p>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(collection.amount)}</p>
                  {collection.notes && (
                    <p className="text-xs text-gray-500">{collection.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تحصيلات</h3>
              <p className="text-gray-500">لم يتم العثور على تحصيلات تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CollectionManagement

