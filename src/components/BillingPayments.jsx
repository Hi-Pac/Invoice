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
  FileText, 
  DollarSign, 
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'

const BillingPayments = ({ user }) => {
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      orderId: 'ORD-001',
      customer: 'شركة البناء الحديث',
      customerPhone: '0501234567',
      amount: 10500,
      paidAmount: 5000,
      paymentStatus: 'partial',
      paymentMethod: 'cash',
      dueDate: '2024-01-25',
      issueDate: '2024-01-15',
      items: [
        { name: 'دهان داخلي أبيض', quantity: 50, price: 120, total: 6000 },
        { name: 'دهان خارجي رمادي', quantity: 30, price: 150, total: 4500 }
      ],
      notes: 'دفعة مقدمة 5000 ريال، الباقي عند التسليم',
      payments: [
        { date: '2024-01-15', amount: 5000, method: 'cash', reference: 'CASH-001' }
      ]
    },
    {
      id: 'INV-002',
      orderId: 'ORD-002',
      customer: 'مؤسسة الإنشاءات',
      customerPhone: '0507654321',
      amount: 4500,
      paidAmount: 4500,
      paymentStatus: 'paid',
      paymentMethod: 'bank',
      dueDate: '2024-01-20',
      issueDate: '2024-01-14',
      items: [
        { name: 'دهان معادن أزرق', quantity: 25, price: 180, total: 4500 }
      ],
      notes: 'دفع كامل بالتحويل البنكي',
      payments: [
        { date: '2024-01-14', amount: 4500, method: 'bank', reference: 'TRF-001' }
      ]
    },
    {
      id: 'INV-003',
      orderId: 'ORD-003',
      customer: 'شركة التطوير العقاري',
      customerPhone: '0509876543',
      amount: 5700,
      paidAmount: 0,
      paymentStatus: 'overdue',
      paymentMethod: 'cash',
      dueDate: '2024-01-18',
      issueDate: '2024-01-13',
      items: [
        { name: 'دهان داخلي بيج', quantity: 40, price: 130, total: 5200 },
        { name: 'مواد مساعدة', quantity: 10, price: 50, total: 500 }
      ],
      notes: 'فاتورة متأخرة - يرجى المتابعة',
      payments: []
    }
  ])

  const [filteredInvoices, setFilteredInvoices] = useState(invoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false)

  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: 'cash',
    reference: '',
    notes: ''
  })

  useEffect(() => {
    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.paymentStatus === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

  const getPaymentStatusBadge = (status, dueDate) => {
    const today = new Date().toISOString().split('T')[0]
    
    if (status === 'paid') {
      return { label: 'مدفوع بالكامل', variant: 'success', icon: CheckCircle }
    } else if (status === 'partial') {
      return { label: 'دفع جزئي', variant: 'secondary', icon: Clock }
    } else if (status === 'overdue' || (status === 'unpaid' && dueDate < today)) {
      return { label: 'متأخر', variant: 'destructive', icon: AlertCircle }
    } else {
      return { label: 'غير مدفوع', variant: 'outline', icon: Clock }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateTotalRevenue = () => {
    return invoices.reduce((total, invoice) => total + invoice.paidAmount, 0)
  }

  const calculatePendingAmount = () => {
    return invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidAmount), 0)
  }

  const getOverdueInvoices = () => {
    const today = new Date().toISOString().split('T')[0]
    return invoices.filter(invoice => 
      invoice.paymentStatus !== 'paid' && invoice.dueDate < today
    ).length
  }

  const handleAddPayment = () => {
    if (!newPayment.amount || newPayment.amount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى إدخال مبلغ صحيح'
      })
      return
    }

    const remainingAmount = selectedInvoice.amount - selectedInvoice.paidAmount
    if (newPayment.amount > remainingAmount) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: `المبلغ المدخل أكبر من المبلغ المستحق (${formatCurrency(remainingAmount)})`
      })
      return
    }

    const payment = {
      date: new Date().toISOString().split('T')[0],
      amount: newPayment.amount,
      method: newPayment.method,
      reference: newPayment.reference || `PAY-${Date.now()}`,
      notes: newPayment.notes
    }

    const updatedPaidAmount = selectedInvoice.paidAmount + newPayment.amount
    const newStatus = updatedPaidAmount >= selectedInvoice.amount ? 'paid' : 'partial'

    setInvoices(invoices.map(invoice => 
      invoice.id === selectedInvoice.id 
        ? { 
            ...invoice, 
            paidAmount: updatedPaidAmount,
            paymentStatus: newStatus,
            payments: [...invoice.payments, payment]
          }
        : invoice
    ))

    setNewPayment({
      amount: 0,
      method: 'cash',
      reference: '',
      notes: ''
    })
    setShowPaymentDialog(false)
    setSelectedInvoice(null)

    Swal.fire({
      icon: 'success',
      title: 'تم تسجيل الدفعة بنجاح',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF()
    
    // Add Arabic font support (simplified)
    doc.setFont('helvetica')
    doc.setFontSize(20)
    doc.text('HCP ERP - Invoice', 20, 30)
    
    doc.setFontSize(12)
    doc.text(`Invoice ID: ${invoice.id}`, 20, 50)
    doc.text(`Order ID: ${invoice.orderId}`, 20, 60)
    doc.text(`Customer: ${invoice.customer}`, 20, 70)
    doc.text(`Issue Date: ${invoice.issueDate}`, 20, 80)
    doc.text(`Due Date: ${invoice.dueDate}`, 20, 90)
    
    // Items
    let yPos = 110
    doc.text('Items:', 20, yPos)
    yPos += 10
    
    invoice.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - Qty: ${item.quantity} - Price: ${formatCurrency(item.price)} - Total: ${formatCurrency(item.total)}`, 20, yPos)
      yPos += 10
    })
    
    yPos += 10
    doc.text(`Total Amount: ${formatCurrency(invoice.amount)}`, 20, yPos)
    doc.text(`Paid Amount: ${formatCurrency(invoice.paidAmount)}`, 20, yPos + 10)
    doc.text(`Remaining: ${formatCurrency(invoice.amount - invoice.paidAmount)}`, 20, yPos + 20)
    
    doc.save(`invoice-${invoice.id}.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفواتير والمدفوعات</h1>
          <p className="text-gray-600">إدارة الفواتير ومتابعة المدفوعات</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotalRevenue())}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مبالغ معلقة</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculatePendingAmount())}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">فواتير متأخرة</p>
                <p className="text-2xl font-bold text-gray-900">{getOverdueInvoices()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الفواتير</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
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
                  placeholder="البحث بالعميل أو رقم الفاتورة..."
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
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="partial">دفع جزئي</SelectItem>
                  <SelectItem value="unpaid">غير مدفوع</SelectItem>
                  <SelectItem value="overdue">متأخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="grid gap-6">
        {filteredInvoices.map((invoice) => {
          const statusConfig = getPaymentStatusBadge(invoice.paymentStatus, invoice.dueDate)
          const StatusIcon = statusConfig.icon
          
          return (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
                      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{invoice.customer}</p>
                    <p className="text-sm text-gray-500">رقم الطلب: {invoice.orderId}</p>
                    <p className="text-sm text-gray-500">تاريخ الإصدار: {invoice.issueDate}</p>
                    <p className="text-sm text-gray-500">تاريخ الاستحقاق: {invoice.dueDate}</p>
                  </div>

                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                    <p className="text-sm text-green-600">مدفوع: {formatCurrency(invoice.paidAmount)}</p>
                    {invoice.amount > invoice.paidAmount && (
                      <p className="text-sm text-red-600">
                        متبقي: {formatCurrency(invoice.amount - invoice.paidAmount)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(invoice)
                        setShowInvoiceDetails(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateInvoicePDF(invoice)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    {user.role !== 'Viewer' && invoice.paymentStatus !== 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedInvoice(invoice)
                          setNewPayment({
                            amount: invoice.amount - invoice.paidAmount,
                            method: 'cash',
                            reference: '',
                            notes: ''
                          })
                          setShowPaymentDialog(true)
                        }}
                      >
                        <CreditCard className="w-4 h-4 ml-1" />
                        تسجيل دفعة
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h3>
            <p className="text-gray-500">لم يتم العثور على فواتير تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
            <DialogDescription>
              فاتورة رقم: {selectedInvoice?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>إجمالي الفاتورة:</span>
                  <span className="font-bold">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>المدفوع:</span>
                  <span className="text-green-600">{formatCurrency(selectedInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>المتبقي:</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(selectedInvoice.amount - selectedInvoice.paidAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ المدفوع</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                  max={selectedInvoice.amount - selectedInvoice.paidAmount}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">طريقة الدفع</Label>
                <Select value={newPayment.method} onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
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
                <Label htmlFor="reference">رقم المرجع (اختياري)</Label>
                <Input
                  id="reference"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                  placeholder="رقم الشيك أو التحويل..."
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="notes"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  placeholder="ملاحظات إضافية..."
                  className="text-right"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddPayment}>
                  تسجيل الدفعة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الفاتورة {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الفاتورة</Label>
                  <p className="font-medium">{selectedInvoice.id}</p>
                </div>
                <div>
                  <Label>رقم الطلب</Label>
                  <p className="font-medium">{selectedInvoice.orderId}</p>
                </div>
                <div>
                  <Label>العميل</Label>
                  <p className="font-medium">{selectedInvoice.customer}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p className="font-medium">{selectedInvoice.customerPhone}</p>
                </div>
                <div>
                  <Label>تاريخ الإصدار</Label>
                  <p className="font-medium">{selectedInvoice.issueDate}</p>
                </div>
                <div>
                  <Label>تاريخ الاستحقاق</Label>
                  <p className="font-medium">{selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div>
                <Label>البنود</Label>
                <div className="mt-2 space-y-2">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} للوحدة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                <span>الإجمالي:</span>
                <span>{formatCurrency(selectedInvoice.amount)}</span>
              </div>

              {selectedInvoice.payments.length > 0 && (
                <div>
                  <Label>سجل المدفوعات</Label>
                  <div className="mt-2 space-y-2">
                    {selectedInvoice.payments.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">{payment.date}</p>
                          <p className="text-sm text-gray-600">{payment.method} - {payment.reference}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInvoice.notes && (
                <div>
                  <Label>ملاحظات</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BillingPayments

