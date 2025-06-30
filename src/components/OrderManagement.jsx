import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  FileText
} from 'lucide-react'
import Swal from 'sweetalert2'

const OrderManagement = ({ user }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'شركة البناء الحديث',
      customerPhone: '0501234567',
      products: [
        { name: 'دهان داخلي أبيض', quantity: 50, price: 120, unit: 'جالون' },
        { name: 'دهان خارجي رمادي', quantity: 30, price: 150, unit: 'جالون' }
      ],
      totalAmount: 10500,
      status: 'pending',
      paymentMethod: 'cash',
      paymentStatus: 'partial',
      paidAmount: 5000,
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      notes: 'يرجى التسليم في الصباح الباكر'
    },
    {
      id: 'ORD-002',
      customer: 'مؤسسة الإنشاءات',
      customerPhone: '0507654321',
      products: [
        { name: 'دهان معادن أزرق', quantity: 25, price: 180, unit: 'جالون' }
      ],
      totalAmount: 4500,
      status: 'processing',
      paymentMethod: 'bank',
      paymentStatus: 'paid',
      paidAmount: 4500,
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-18',
      notes: ''
    },
    {
      id: 'ORD-003',
      customer: 'شركة التطوير العقاري',
      customerPhone: '0509876543',
      products: [
        { name: 'دهان داخلي بيج', quantity: 40, price: 130, unit: 'جالون' },
        { name: 'مواد مساعدة', quantity: 10, price: 50, unit: 'كيس' }
      ],
      totalAmount: 5700,
      status: 'completed',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      paidAmount: 5700,
      orderDate: '2024-01-13',
      deliveryDate: '2024-01-17',
      notes: 'تم التسليم بنجاح'
    }
  ])

  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const [newOrder, setNewOrder] = useState({
    customer: '',
    customerPhone: '',
    products: [{ name: '', quantity: 1, price: 0, unit: 'جالون' }],
    paymentMethod: 'cash',
    deliveryDate: '',
    notes: ''
  })

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', variant: 'secondary', icon: Clock },
      processing: { label: 'قيد التنفيذ', variant: 'default', icon: Package },
      completed: { label: 'مكتمل', variant: 'success', icon: CheckCircle },
      cancelled: { label: 'ملغي', variant: 'destructive', icon: XCircle }
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

  const getPaymentStatusBadge = (paymentStatus, paidAmount, totalAmount) => {
    if (paymentStatus === 'paid') {
      return <Badge variant="success">مدفوع بالكامل</Badge>
    } else if (paymentStatus === 'partial') {
      return <Badge variant="secondary">دفع جزئي ({((paidAmount / totalAmount) * 100).toFixed(0)}%)</Badge>
    } else {
      return <Badge variant="destructive">غير مدفوع</Badge>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { name: '', quantity: 1, price: 0, unit: 'جالون' }]
    })
  }

  const handleRemoveProduct = (index) => {
    const products = newOrder.products.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, products })
  }

  const handleProductChange = (index, field, value) => {
    const products = [...newOrder.products]
    products[index][field] = value
    setNewOrder({ ...newOrder, products })
  }

  const calculateTotal = () => {
    return newOrder.products.reduce((total, product) => {
      return total + (product.quantity * product.price)
    }, 0)
  }

  const handleSubmitOrder = () => {
    if (!newOrder.customer || !newOrder.customerPhone || newOrder.products.some(p => !p.name || !p.price)) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة'
      })
      return
    }

    const order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      totalAmount: calculateTotal(),
      status: 'pending',
      paymentStatus: 'unpaid',
      paidAmount: 0,
      orderDate: new Date().toISOString().split('T')[0]
    }

    setOrders([...orders, order])
    setNewOrder({
      customer: '',
      customerPhone: '',
      products: [{ name: '', quantity: 1, price: 0, unit: 'جالون' }],
      paymentMethod: 'cash',
      deliveryDate: '',
      notes: ''
    })
    setShowNewOrderDialog(false)

    Swal.fire({
      icon: 'success',
      title: 'تم إنشاء الطلب بنجاح',
      text: `رقم الطلب: ${order.id}`,
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))

    Swal.fire({
      icon: 'success',
      title: 'تم تحديث حالة الطلب',
      timer: 1500,
      showConfirmButton: false
    })
  }

  const handleDeleteOrder = (orderId) => {
    Swal.fire({
      title: 'حذف الطلب',
      text: 'هل أنت متأكد من حذف هذا الطلب؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.filter(order => order.id !== orderId))
        Swal.fire({
          icon: 'success',
          title: 'تم حذف الطلب',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-600">إدارة طلبات العملاء ومتابعة حالة التنفيذ</p>
        </div>
        
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء طلب جديد</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الطلب الجديد
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">اسم العميل</Label>
                  <Input
                    id="customer"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                    placeholder="اسم العميل أو الشركة"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">رقم الهاتف</Label>
                  <Input
                    id="customerPhone"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    className="text-right"
                  />
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>المنتجات</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddProduct}>
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة منتج
                  </Button>
                </div>
                
                {newOrder.products.map((product, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label>اسم المنتج</Label>
                      <Input
                        value={product.name}
                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                        placeholder="اسم المنتج"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label>الكمية</Label>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>السعر</Label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>الوحدة</Label>
                        <Select value={product.unit} onValueChange={(value) => handleProductChange(index, 'unit', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="جالون">جالون</SelectItem>
                            <SelectItem value="كيس">كيس</SelectItem>
                            <SelectItem value="علبة">علبة</SelectItem>
                            <SelectItem value="قطعة">قطعة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newOrder.products.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                  <Select value={newOrder.paymentMethod} onValueChange={(value) => setNewOrder({ ...newOrder, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">نقدي</SelectItem>
                      <SelectItem value="bank">تحويل بنكي</SelectItem>
                      <SelectItem value="check">شيك</SelectItem>
                      <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">تاريخ التسليم المتوقع</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={newOrder.deliveryDate}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="ملاحظات إضافية..."
                  className="text-right"
                />
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmitOrder}>
                  إنشاء الطلب
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالعميل أو رقم الطلب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="processing">قيد التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus, order.paidAmount, order.totalAmount)}
                  </div>
                  <p className="text-gray-600 mb-1">{order.customer}</p>
                  <p className="text-sm text-gray-500">تاريخ الطلب: {order.orderDate}</p>
                  <p className="text-sm text-gray-500">تاريخ التسليم: {order.deliveryDate}</p>
                </div>

                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                  {order.paymentStatus === 'partial' && (
                    <p className="text-sm text-gray-500">
                      مدفوع: {formatCurrency(order.paidAmount)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowOrderDetails(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {user.role !== 'Viewer' && (
                    <>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">في الانتظار</SelectItem>
                          <SelectItem value="processing">قيد التنفيذ</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500">لم يتم العثور على طلبات تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>العميل</Label>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <Label>تاريخ الطلب</Label>
                  <p className="font-medium">{selectedOrder.orderDate}</p>
                </div>
                <div>
                  <Label>تاريخ التسليم</Label>
                  <p className="font-medium">{selectedOrder.deliveryDate}</p>
                </div>
              </div>

              <div>
                <Label>المنتجات</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} {product.unit}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{formatCurrency(product.price * product.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(product.price)} / {product.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                <span>الإجمالي:</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label>ملاحظات</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderManagement

