import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Users, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import Swal from 'sweetalert2'

const CRMSupplier = ({ user }) => {
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'شركة البناء الحديث',
      type: 'company',
      phone: '0501234567',
      email: 'info@modernbuild.com',
      address: 'الرياض - حي النرجس - شارع الأمير محمد بن عبدالعزيز',
      contactPerson: 'أحمد محمد',
      totalOrders: 15,
      totalSpent: 125000,
      lastOrderDate: '2024-01-15',
      status: 'active',
      notes: 'عميل مميز - دفع سريع',
      createdAt: '2023-06-15'
    },
    {
      id: 'CUST-002',
      name: 'مؤسسة الإنشاءات',
      type: 'company',
      phone: '0507654321',
      email: 'orders@construction.sa',
      address: 'جدة - حي الزهراء - طريق الملك عبدالعزيز',
      contactPerson: 'محمد علي',
      totalOrders: 8,
      totalSpent: 85000,
      lastOrderDate: '2024-01-14',
      status: 'active',
      notes: 'يفضل التسليم بعد الظهر',
      createdAt: '2023-08-20'
    },
    {
      id: 'CUST-003',
      name: 'خالد أحمد',
      type: 'individual',
      phone: '0509876543',
      email: 'khalid@gmail.com',
      address: 'الدمام - حي الفيصلية - شارع الخليج العربي',
      contactPerson: 'خالد أحمد',
      totalOrders: 3,
      totalSpent: 15000,
      lastOrderDate: '2024-01-10',
      status: 'active',
      notes: 'عميل جديد',
      createdAt: '2024-01-05'
    }
  ])

  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUPP-001',
      name: 'مصنع الدهانات الحديث',
      phone: '0112345678',
      email: 'sales@modernpaints.com',
      address: 'الرياض - المنطقة الصناعية الثانية',
      contactPerson: 'سعد المطيري',
      products: ['دهانات داخلية', 'دهانات خارجية'],
      totalPurchases: 450000,
      lastPurchaseDate: '2024-01-12',
      paymentTerms: '30 يوم',
      status: 'active',
      notes: 'مورد رئيسي - جودة عالية',
      createdAt: '2023-01-15'
    },
    {
      id: 'SUPP-002',
      name: 'مصنع الدهانات المتخصص',
      phone: '0113456789',
      email: 'info@specialpaints.sa',
      address: 'الرياض - المنطقة الصناعية الأولى',
      contactPerson: 'عبدالله الأحمد',
      products: ['دهانات معادن', 'مواد مساعدة'],
      totalPurchases: 180000,
      lastPurchaseDate: '2024-01-08',
      paymentTerms: '15 يوم',
      status: 'active',
      notes: 'متخصص في دهانات المعادن',
      createdAt: '2023-03-10'
    }
  ])

  const [activeTab, setActiveTab] = useState('customers')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    type: 'company',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
    notes: ''
  })

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
    products: '',
    paymentTerms: '',
    notes: ''
  })

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone.includes(searchTerm) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'success' },
      inactive: { label: 'غير نشط', variant: 'secondary' },
      blocked: { label: 'محظور', variant: 'destructive' }
    }
    
    const config = statusConfig[status] || statusConfig.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleSubmitCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء الحقول المطلوبة'
      })
      return
    }

    if (editMode) {
      setCustomers(customers.map(customer => 
        customer.id === selectedItem.id ? { ...selectedItem, ...newCustomer } : customer
      ))
    } else {
      const customer = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        ...newCustomer,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setCustomers([...customers, customer])
    }

    resetForm()
    Swal.fire({
      icon: 'success',
      title: editMode ? 'تم تحديث العميل بنجاح' : 'تم إضافة العميل بنجاح',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleSubmitSupplier = () => {
    if (!newSupplier.name || !newSupplier.phone) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء الحقول المطلوبة'
      })
      return
    }

    if (editMode) {
      setSuppliers(suppliers.map(supplier => 
        supplier.id === selectedItem.id ? { ...selectedItem, ...newSupplier, products: newSupplier.products.split(',').map(p => p.trim()) } : supplier
      ))
    } else {
      const supplier = {
        id: `SUPP-${String(suppliers.length + 1).padStart(3, '0')}`,
        ...newSupplier,
        products: newSupplier.products.split(',').map(p => p.trim()),
        totalPurchases: 0,
        lastPurchaseDate: null,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setSuppliers([...suppliers, supplier])
    }

    resetForm()
    Swal.fire({
      icon: 'success',
      title: editMode ? 'تم تحديث المورد بنجاح' : 'تم إضافة المورد بنجاح',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const resetForm = () => {
    setNewCustomer({
      name: '',
      type: 'company',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      notes: ''
    })
    setNewSupplier({
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      products: '',
      paymentTerms: '',
      notes: ''
    })
    setShowNewDialog(false)
    setEditMode(false)
    setSelectedItem(null)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setEditMode(true)
    
    if (activeTab === 'customers') {
      setNewCustomer({
        name: item.name,
        type: item.type,
        phone: item.phone,
        email: item.email,
        address: item.address,
        contactPerson: item.contactPerson,
        notes: item.notes
      })
    } else {
      setNewSupplier({
        name: item.name,
        phone: item.phone,
        email: item.email,
        address: item.address,
        contactPerson: item.contactPerson,
        products: item.products.join(', '),
        paymentTerms: item.paymentTerms,
        notes: item.notes
      })
    }
    setShowNewDialog(true)
  }

  const handleDelete = (id, type) => {
    Swal.fire({
      title: `حذف ${type === 'customer' ? 'العميل' : 'المورد'}`,
      text: `هل أنت متأكد من حذف هذا ${type === 'customer' ? 'العميل' : 'المورد'}؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === 'customer') {
          setCustomers(customers.filter(customer => customer.id !== id))
        } else {
          setSuppliers(suppliers.filter(supplier => supplier.id !== id))
        }
        Swal.fire({
          icon: 'success',
          title: `تم حذف ${type === 'customer' ? 'العميل' : 'المورد'}`,
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
          <h1 className="text-2xl font-bold text-gray-900">العملاء والموردين</h1>
          <p className="text-gray-600">إدارة قاعدة بيانات العملاء والموردين</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            العملاء
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            الموردين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                    <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">عملاء نشطين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {customers.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(customers.reduce((total, c) => total + c.totalSpent, 0))}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">متوسط قيمة العميل</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(customers.length > 0 ? customers.reduce((total, c) => total + c.totalSpent, 0) / customers.length : 0)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث بالاسم أو الهاتف أو البريد..."
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
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="blocked">محظور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Dialog open={showNewDialog} onOpenChange={(open) => {
              setShowNewDialog(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  عميل جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم *</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="اسم العميل"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">النوع</Label>
                      <Select value={newCustomer.type} onValueChange={(value) => setNewCustomer({ ...newCustomer, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">شركة</SelectItem>
                          <SelectItem value="individual">فرد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="05xxxxxxxx"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="email@example.com"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      placeholder="العنوان الكامل"
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                    <Input
                      id="contactPerson"
                      value={newCustomer.contactPerson}
                      onChange={(e) => setNewCustomer({ ...newCustomer, contactPerson: e.target.value })}
                      placeholder="اسم الشخص المسؤول"
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      placeholder="ملاحظات إضافية..."
                      className="text-right"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleSubmitCustomer}>
                      {editMode ? 'تحديث العميل' : 'إضافة العميل'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Customers List */}
          <div className="grid gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                        {getStatusBadge(customer.status)}
                        <Badge variant="outline">{customer.type === 'company' ? 'شركة' : 'فرد'}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{customer.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-sm text-gray-600">{customer.totalOrders} طلب</p>
                      {customer.lastOrderDate && (
                        <p className="text-xs text-gray-500">آخر طلب: {customer.lastOrderDate}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(customer)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {user.role !== 'Viewer' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(customer.id, 'customer')}
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
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          {/* Supplier Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الموردين</p>
                    <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
                  </div>
                  <Building className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">موردين نشطين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {suppliers.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المشتريات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(suppliers.reduce((total, s) => total + s.totalPurchases, 0))}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث بالاسم أو الهاتف أو البريد..."
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
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="blocked">محظور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Dialog open={showNewDialog} onOpenChange={(open) => {
              setShowNewDialog(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  مورد جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'تعديل المورد' : 'إضافة مورد جديد'}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المورد *</Label>
                      <Input
                        id="name"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                        placeholder="اسم المورد"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        value={newSupplier.phone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                        placeholder="011xxxxxxx"
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSupplier.email}
                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                        placeholder="email@example.com"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                      <Input
                        id="contactPerson"
                        value={newSupplier.contactPerson}
                        onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                        placeholder="اسم الشخص المسؤول"
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      placeholder="العنوان الكامل"
                      className="text-right"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="products">المنتجات (مفصولة بفاصلة)</Label>
                      <Input
                        id="products"
                        value={newSupplier.products}
                        onChange={(e) => setNewSupplier({ ...newSupplier, products: e.target.value })}
                        placeholder="دهانات داخلية, دهانات خارجية"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">شروط الدفع</Label>
                      <Input
                        id="paymentTerms"
                        value={newSupplier.paymentTerms}
                        onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                        placeholder="30 يوم"
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={newSupplier.notes}
                      onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                      placeholder="ملاحظات إضافية..."
                      className="text-right"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleSubmitSupplier}>
                      {editMode ? 'تحديث المورد' : 'إضافة المورد'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Suppliers List */}
          <div className="grid gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                        {getStatusBadge(supplier.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{supplier.phone}</span>
                        </div>
                        {supplier.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{supplier.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{supplier.products.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(supplier.totalPurchases)}</p>
                      <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                      {supplier.lastPurchaseDate && (
                        <p className="text-xs text-gray-500">آخر شراء: {supplier.lastPurchaseDate}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(supplier)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {user.role !== 'Viewer' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(supplier)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(supplier.id, 'supplier')}
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
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              تفاصيل {activeTab === 'customers' ? 'العميل' : 'المورد'}: {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <p className="font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p className="font-medium">{selectedItem.phone}</p>
                </div>
                {selectedItem.email && (
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <p className="font-medium">{selectedItem.email}</p>
                  </div>
                )}
                {selectedItem.contactPerson && (
                  <div>
                    <Label>الشخص المسؤول</Label>
                    <p className="font-medium">{selectedItem.contactPerson}</p>
                  </div>
                )}
              </div>

              {selectedItem.address && (
                <div>
                  <Label>العنوان</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedItem.address}</p>
                </div>
              )}

              {activeTab === 'customers' ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>النوع</Label>
                    <p className="font-medium">{selectedItem.type === 'company' ? 'شركة' : 'فرد'}</p>
                  </div>
                  <div>
                    <Label>إجمالي الطلبات</Label>
                    <p className="font-medium">{selectedItem.totalOrders}</p>
                  </div>
                  <div>
                    <Label>إجمالي المبلغ</Label>
                    <p className="font-medium">{formatCurrency(selectedItem.totalSpent)}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>المنتجات</Label>
                    <p className="font-medium">{selectedItem.products?.join(', ')}</p>
                  </div>
                  <div>
                    <Label>شروط الدفع</Label>
                    <p className="font-medium">{selectedItem.paymentTerms}</p>
                  </div>
                  <div>
                    <Label>إجمالي المشتريات</Label>
                    <p className="font-medium">{formatCurrency(selectedItem.totalPurchases)}</p>
                  </div>
                  <div>
                    <Label>آخر شراء</Label>
                    <p className="font-medium">{selectedItem.lastPurchaseDate || 'لا يوجد'}</p>
                  </div>
                </div>
              )}

              {selectedItem.notes && (
                <div>
                  <Label>ملاحظات</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedItem.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                <span>تاريخ الإضافة: {selectedItem.createdAt}</span>
                {getStatusBadge(selectedItem.status)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CRMSupplier

