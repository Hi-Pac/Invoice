import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users,
  FileText,
  BarChart3
} from 'lucide-react'
import jsPDF from 'jspdf'

const Reports = ({ user }) => {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-01-31'
  })

  // Sample data for charts
  const salesData = [
    { month: 'يناير', sales: 180000, orders: 45, customers: 12 },
    { month: 'فبراير', sales: 220000, orders: 52, customers: 15 },
    { month: 'مارس', sales: 195000, orders: 48, customers: 13 },
    { month: 'أبريل', sales: 240000, orders: 58, customers: 18 },
    { month: 'مايو', sales: 280000, orders: 65, customers: 22 },
    { month: 'يونيو', sales: 320000, orders: 72, customers: 25 }
  ]

  const productCategoryData = [
    { name: 'دهانات داخلية', value: 35, sales: 450000, color: '#4F46E5' },
    { name: 'دهانات خارجية', value: 28, sales: 380000, color: '#7C3AED' },
    { name: 'دهانات معادن', value: 20, sales: 280000, color: '#10B981' },
    { name: 'مواد مساعدة', value: 17, sales: 190000, color: '#F59E0B' }
  ]

  const paymentMethodData = [
    { method: 'نقدي', amount: 450000, percentage: 45, color: '#10B981' },
    { method: 'تحويل بنكي', amount: 350000, percentage: 35, color: '#4F46E5' },
    { method: 'شيك', amount: 150000, percentage: 15, color: '#7C3AED' },
    { method: 'محفظة إلكترونية', amount: 50000, percentage: 5, color: '#F59E0B' }
  ]

  const customerAnalysisData = [
    { segment: 'عملاء مميزون', count: 8, revenue: 650000, avgOrder: 81250 },
    { segment: 'عملاء منتظمون', count: 15, revenue: 420000, avgOrder: 28000 },
    { segment: 'عملاء جدد', count: 22, revenue: 180000, avgOrder: 8182 }
  ]

  const dailySalesData = [
    { date: '01/01', sales: 12000, orders: 3 },
    { date: '02/01', sales: 18000, orders: 4 },
    { date: '03/01', sales: 15000, orders: 2 },
    { date: '04/01', sales: 22000, orders: 5 },
    { date: '05/01', sales: 25000, orders: 6 },
    { date: '06/01', sales: 19000, orders: 4 },
    { date: '07/01', sales: 28000, orders: 7 }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const generatePDFReport = (reportType) => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text(`HCP ERP - ${reportType} Report`, 20, 30)
    
    // Add date range
    doc.setFontSize(12)
    doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 20, 50)
    
    let yPos = 70
    
    if (reportType === 'Sales') {
      doc.text('Sales Summary:', 20, yPos)
      yPos += 20
      
      salesData.forEach((item, index) => {
        doc.text(`${item.month}: ${formatCurrency(item.sales)} (${item.orders} orders)`, 20, yPos)
        yPos += 10
      })
    } else if (reportType === 'Products') {
      doc.text('Product Category Analysis:', 20, yPos)
      yPos += 20
      
      productCategoryData.forEach((item, index) => {
        doc.text(`${item.name}: ${item.value}% (${formatCurrency(item.sales)})`, 20, yPos)
        yPos += 10
      })
    }
    
    doc.save(`${reportType.toLowerCase()}-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <p className={`text-sm ${colorClasses[color]} flex items-center gap-1 mt-1`}>
                  <TrendingUp className="w-4 h-4" />
                  {trend}
                </p>
              )}
            </div>
            <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والتحليلات</h1>
          <p className="text-gray-600">تحليل شامل لأداء الأعمال والمبيعات</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="from">من:</Label>
            <Input
              id="from"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="to">إلى:</Label>
            <Input
              id="to"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-40"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المبيعات"
          value={formatCurrency(1250000)}
          icon={DollarSign}
          trend="+12.5% من الشهر الماضي"
          color="green"
        />
        <StatCard
          title="إجمالي الطلبات"
          value="340"
          icon={Package}
          trend="+8.2% من الشهر الماضي"
          color="blue"
        />
        <StatCard
          title="العملاء النشطين"
          value="45"
          icon={Users}
          trend="+5.1% من الشهر الماضي"
          color="purple"
        />
        <StatCard
          title="متوسط قيمة الطلب"
          value={formatCurrency(3676)}
          icon={TrendingUp}
          trend="+3.8% من الشهر الماضي"
          color="orange"
        />
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">تقرير المبيعات</TabsTrigger>
          <TabsTrigger value="products">تحليل المنتجات</TabsTrigger>
          <TabsTrigger value="customers">تحليل العملاء</TabsTrigger>
          <TabsTrigger value="financial">التقرير المالي</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">تقرير المبيعات</h2>
            <Button onClick={() => generatePDFReport('Sales')} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Sales Chart */}
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

            {/* Daily Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>اتجاه المبيعات اليومية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="sales" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص المبيعات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">الشهر</th>
                      <th className="text-right p-2">المبيعات</th>
                      <th className="text-right p-2">عدد الطلبات</th>
                      <th className="text-right p-2">عدد العملاء</th>
                      <th className="text-right p-2">متوسط الطلب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{item.month}</td>
                        <td className="p-2">{formatCurrency(item.sales)}</td>
                        <td className="p-2">{item.orders}</td>
                        <td className="p-2">{item.customers}</td>
                        <td className="p-2">{formatCurrency(item.sales / item.orders)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">تحليل المنتجات</h2>
            <Button onClick={() => generatePDFReport('Products')} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Categories Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع المبيعات حسب فئة المنتج</CardTitle>
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

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle>أداء فئات المنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productCategoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatCurrency(category.sales)}</p>
                        <p className="text-sm text-gray-600">{category.value}% من المبيعات</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">تحليل العملاء</h2>
            <Button onClick={() => generatePDFReport('Customers')} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle>تصنيف العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerAnalysisData.map((segment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{segment.segment}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">عدد العملاء</p>
                          <p className="font-bold text-xl">{segment.count}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">إجمالي الإيرادات</p>
                          <p className="font-bold text-xl">{formatCurrency(segment.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">متوسط الطلب</p>
                          <p className="font-bold text-xl">{formatCurrency(segment.avgOrder)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Growth */}
            <Card>
              <CardHeader>
                <CardTitle>نمو قاعدة العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="customers" stroke="#7C3AED" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">التقرير المالي</h2>
            <Button onClick={() => generatePDFReport('Financial')} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع طرق الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="percentage"
                      label={({ method, percentage }) => `${method}: ${percentage}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>الملخص المالي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">إجمالي الإيرادات</span>
                    <span className="font-bold text-green-600">{formatCurrency(1250000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">المبالغ المحصلة</span>
                    <span className="font-bold text-blue-600">{formatCurrency(1100000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">المبالغ المعلقة</span>
                    <span className="font-bold text-orange-600">{formatCurrency(150000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">معدل التحصيل</span>
                    <span className="font-bold text-gray-600">88%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods Details */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل طرق الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">طريقة الدفع</th>
                      <th className="text-right p-2">المبلغ</th>
                      <th className="text-right p-2">النسبة</th>
                      <th className="text-right p-2">عدد المعاملات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethodData.map((method, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{method.method}</td>
                        <td className="p-2">{formatCurrency(method.amount)}</td>
                        <td className="p-2">{method.percentage}%</td>
                        <td className="p-2">{Math.floor(method.amount / 10000)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports

