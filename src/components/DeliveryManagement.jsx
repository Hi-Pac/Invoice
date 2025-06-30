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
  Truck, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  User, 
  Phone,
  Calendar,
  Package,
  AlertCircle
} from 'lucide-react'
import Swal from 'sweetalert2'

const DeliveryManagement = ({ user }) => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-001',
      orderId: 'ORD-001',
      customer: 'شركة البناء الحديث',
      customerPhone: '0501234567',
      address: 'الرياض - حي النرجس - شارع الأمير محمد بن عبدالعزيز',
      deliveryDate: '2024-01-20',
      deliveryTime: '09:00',
      status: 'assigned',
      driverName: 'أحمد محمد',
      driverPhone: '0551234567',
      vehicleNumber: 'أ ب ج 1234',
      notes: 'يرجى التسليم في الصباح الباكر',
      assignedAt: '2024-01-18',
      deliveredAt: null,
      items: [
        { name: 'دهان داخلي أبيض', quantity: 50 },
        { name: 'دهان خارجي رمادي', quantity: 30 }
      ]
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-002',
      customer: 'مؤسسة الإنشاءات',
      customerPhone: '0507654321',
      address: 'جدة - حي الزهراء - طريق الملك عبدالعزيز',
      deliveryDate: '2024-01-18',
      deliveryTime: '14:00',
      status: 'delivered',
      driverName: 'محمد علي',
      driverPhone: '0559876543',
      vehicleNumber: 'د هـ و 5678',
      notes: 'تم التسليم بنجاح',
      assignedAt: '2024-01-17',
      deliveredAt: '2024-01-18 14:30',
      items: [
        { name: 'دهان معادن أزرق', quantity: 25 }
      ]
    },
    {
      id: 'DEL-003',
      orderId: 'ORD-003',
      customer: 'شركة التطوير العقاري',
      customerPhone: '0509876543',
      address: 'الدمام - حي الفيصلية - شارع الخليج العربي',
      deliveryDate: '2024-01-19',
      deliveryTime: '11:00',
      status: 'in_transit',
      driverName: 'سعد أحمد',
      driverPhone: '0556789012',
      vehicleNumber: 'ز ح ط 9012',
      notes: 'في الطريق للتسليم',
      assignedAt: '2024-01-18',
      deliveredAt: null,
      items: [
        { name: 'دهان داخلي بيج', quantity: 40 },
        { name: 'مواد مساعدة', quantity: 10 }
      ]
    }
  ])

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'أحمد محمد', phone: '0551234567', vehicleNumber: 'أ ب ج 1234', available: false },
    { id: 2, name: 'محمد علي', phone: '0559876543', vehicleNumber: 'د هـ و 5678', available: true },
    { id: 3, name: 'سعد أحمد', phone: '0556789012', vehicleNumber: 'ز ح ط 9012', available: false },
    { id: 4, name: 'علي حسن', phone: '0554567890', vehicleNumber: 'ي ك ل 3456', available: true }
  ])

  const [filteredDeliveries, setFilteredDeliveries] = useState(deliveries)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false)

  const [assignmentData, setAssignmentData] = useState({
    driverId: '',
    deliveryDate: '',
    deliveryTime: '',
    notes: ''
  })

  useEffect(() => {
    let filtered = deliveries

    if (searchTerm) {
      filtered = filtered.filter(delivery => 
        delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter)
    }

    setFilteredDeliveries(filtered)
  }, [deliveries, searchTerm, statusFilter])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', variant: 'secondary', icon: Clock },
      assigned: { label: 'تم التخصيص', variant: 'default', icon: User },
      in_transit: { label: 'في الطريق', variant: 'default', icon: Truck },
      delivered: { label: 'تم التسليم', variant: 'success', icon: CheckCircle },
      failed: { label: 'فشل التسليم', variant: 'destructive', icon: AlertCircle }
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

  const handleAssignDelivery = () => {
    if (!assignmentData.driverId || !assignmentData.deliveryDate || !assignmentData.deliveryTime) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة'
      })
      return
    }

    const selectedDriver = drivers.find(d => d.id === parseInt(assignmentData.driverId))
    
    setDeliveries(deliveries.map(delivery => 
      delivery.id === selectedDelivery.id 
        ? { 
            ...delivery, 
            status: 'assigned',
            driverName: selectedDriver.name,
            driverPhone: selectedDriver.phone,
            vehicleNumber: selectedDriver.vehicleNumber,
            deliveryDate: assignmentData.deliveryDate,
            deliveryTime: assignmentData.deliveryTime,
            notes: assignmentData.notes,
            assignedAt: new Date().toISOString().split('T')[0]
          }
        : delivery
    ))

    setDrivers(drivers.map(driver => 
      driver.id === parseInt(assignmentData.driverId)
        ? { ...driver, available: false }
        : driver
    ))

    setAssignmentData({
      driverId: '',
      deliveryDate: '',
      deliveryTime: '',
      notes: ''
    })
    setShowAssignDialog(false)
    setSelectedDelivery(null)

    Swal.fire({
      icon: 'success',
      title: 'تم تخصيص التوصيل بنجاح',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleUpdateDeliveryStatus = (deliveryId, newStatus) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId 
        ? { 
            ...d, 
            status: newStatus,
            deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : null
          }
        : d
    ))

    // If delivery is completed or failed, make driver available again
    if (newStatus === 'delivered' || newStatus === 'failed') {
      setDrivers(drivers.map(driver => 
        driver.name === delivery.driverName
          ? { ...driver, available: true }
          : driver
      ))
    }

    Swal.fire({
      icon: 'success',
      title: 'تم تحديث حالة التوصيل',
      timer: 1500,
      showConfirmButton: false
    })
  }

  const getDeliveryStats = () => {
    return {
      total: deliveries.length,
      pending: deliveries.filter(d => d.status === 'pending').length,
      assigned: deliveries.filter(d => d.status === 'assigned').length,
      inTransit: deliveries.filter(d => d.status === 'in_transit').length,
      delivered: deliveries.filter(d => d.status === 'delivered').length,
      failed: deliveries.filter(d => d.status === 'failed').length
    }
  }

  const stats = getDeliveryStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة التوصيل</h1>
          <p className="text-gray-600">متابعة عمليات التوصيل وإدارة المندوبين</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">إجمالي</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">في الانتظار</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
              <p className="text-sm text-gray-600">مخصص</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
              <p className="text-sm text-gray-600">في الطريق</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              <p className="text-sm text-gray-600">تم التسليم</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-sm text-gray-600">فشل</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالعميل أو رقم التوصيل أو المندوب..."
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
                  <SelectItem value="assigned">مخصص</SelectItem>
                  <SelectItem value="in_transit">في الطريق</SelectItem>
                  <SelectItem value="delivered">تم التسليم</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries List */}
      <div className="grid gap-6">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{delivery.id}</h3>
                    {getStatusBadge(delivery.status)}
                  </div>
                  <p className="text-gray-600 mb-1">{delivery.customer}</p>
                  <p className="text-sm text-gray-500 mb-1">رقم الطلب: {delivery.orderId}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{delivery.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{delivery.deliveryDate} - {delivery.deliveryTime}</span>
                  </div>
                </div>

                {delivery.driverName && (
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{delivery.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{delivery.driverPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{delivery.vehicleNumber}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDelivery(delivery)
                      setShowDeliveryDetails(true)
                    }}
                  >
                    عرض التفاصيل
                  </Button>
                  
                  {user.role !== 'Viewer' && (
                    <>
                      {delivery.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedDelivery(delivery)
                            setAssignmentData({
                              driverId: '',
                              deliveryDate: delivery.deliveryDate || '',
                              deliveryTime: delivery.deliveryTime || '',
                              notes: delivery.notes || ''
                            })
                            setShowAssignDialog(true)
                          }}
                        >
                          تخصيص مندوب
                        </Button>
                      )}
                      
                      {(delivery.status === 'assigned' || delivery.status === 'in_transit') && (
                        <Select
                          value={delivery.status}
                          onValueChange={(value) => handleUpdateDeliveryStatus(delivery.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assigned">مخصص</SelectItem>
                            <SelectItem value="in_transit">في الطريق</SelectItem>
                            <SelectItem value="delivered">تم التسليم</SelectItem>
                            <SelectItem value="failed">فشل</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عمليات توصيل</h3>
            <p className="text-gray-500">لم يتم العثور على عمليات توصيل تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تخصيص مندوب توصيل</DialogTitle>
            <DialogDescription>
              توصيل رقم: {selectedDelivery?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driver">المندوب</Label>
              <Select value={assignmentData.driverId} onValueChange={(value) => setAssignmentData({ ...assignmentData, driverId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المندوب" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.filter(driver => driver.available).map((driver) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      <div className="text-right">
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.vehicleNumber} - {driver.phone}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">تاريخ التسليم</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={assignmentData.deliveryDate}
                  onChange={(e) => setAssignmentData({ ...assignmentData, deliveryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTime">وقت التسليم</Label>
                <Input
                  id="deliveryTime"
                  type="time"
                  value={assignmentData.deliveryTime}
                  onChange={(e) => setAssignmentData({ ...assignmentData, deliveryTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={assignmentData.notes}
                onChange={(e) => setAssignmentData({ ...assignmentData, notes: e.target.value })}
                placeholder="ملاحظات للمندوب..."
                className="text-right"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAssignDelivery}>
                تخصيص المندوب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delivery Details Dialog */}
      <Dialog open={showDeliveryDetails} onOpenChange={setShowDeliveryDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل التوصيل {selectedDelivery?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم التوصيل</Label>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <Label>رقم الطلب</Label>
                  <p className="font-medium">{selectedDelivery.orderId}</p>
                </div>
                <div>
                  <Label>العميل</Label>
                  <p className="font-medium">{selectedDelivery.customer}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p className="font-medium">{selectedDelivery.customerPhone}</p>
                </div>
              </div>

              <div>
                <Label>عنوان التسليم</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedDelivery.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ التسليم</Label>
                  <p className="font-medium">{selectedDelivery.deliveryDate}</p>
                </div>
                <div>
                  <Label>وقت التسليم</Label>
                  <p className="font-medium">{selectedDelivery.deliveryTime}</p>
                </div>
              </div>

              {selectedDelivery.driverName && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>المندوب</Label>
                    <p className="font-medium">{selectedDelivery.driverName}</p>
                  </div>
                  <div>
                    <Label>رقم الهاتف</Label>
                    <p className="font-medium">{selectedDelivery.driverPhone}</p>
                  </div>
                  <div>
                    <Label>رقم المركبة</Label>
                    <p className="font-medium">{selectedDelivery.vehicleNumber}</p>
                  </div>
                </div>
              )}

              <div>
                <Label>البنود</Label>
                <div className="mt-2 space-y-2">
                  {selectedDelivery.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600">الكمية: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDelivery.notes && (
                <div>
                  <Label>ملاحظات</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedDelivery.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                <div>
                  <span>تاريخ التخصيص: {selectedDelivery.assignedAt}</span>
                </div>
                <div>
                  {getStatusBadge(selectedDelivery.status)}
                </div>
              </div>

              {selectedDelivery.deliveredAt && (
                <div className="text-sm text-gray-500">
                  <span>تاريخ التسليم: {selectedDelivery.deliveredAt}</span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeliveryManagement

