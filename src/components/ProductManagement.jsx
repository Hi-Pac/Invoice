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
  Palette,
  Layers,
  DollarSign
} from 'lucide-react'
import Swal from 'sweetalert2'

const ProductManagement = ({ user }) => {
  const [products, setProducts] = useState([
    {
      id: 'PRD-001',
      name: 'دهان داخلي أبيض',
      category: 'دهانات داخلية',
      color: 'أبيض',
      size: '4 لتر',
      unit: 'جالون',
      price: 120,
      stock: 150,
      minStock: 20,
      supplier: 'مصنع الدهانات الحديث',
      description: 'دهان داخلي عالي الجودة مقاوم للرطوبة',
      createdAt: '2024-01-10'
    },
    {
      id: 'PRD-002',
      name: 'دهان خارجي رمادي',
      category: 'دهانات خارجية',
      color: 'رمادي',
      size: '4 لتر',
      unit: 'جالون',
      price: 150,
      stock: 80,
      minStock: 15,
      supplier: 'مصنع الدهانات الحديث',
      description: 'دهان خارجي مقاوم للعوامل الجوية',
      createdAt: '2024-01-08'
    },
    {
      id: 'PRD-003',
      name: 'دهان معادن أزرق',
      category: 'دهانات معادن',
      color: 'أزرق',
      size: '1 لتر',
      unit: 'علبة',
      price: 180,
      stock: 45,
      minStock: 10,
      supplier: 'مصنع الدهانات المتخصص',
      description: 'دهان معادن مضاد للصدأ',
      createdAt: '2024-01-05'
    },
    {
      id: 'PRD-004',
      name: 'مواد مساعدة - فرش',
      category: 'مواد مساعدة',
      color: '-',
      size: 'متنوع',
      unit: 'قطعة',
      price: 25,
      stock: 200,
      minStock: 50,
      supplier: 'مورد الأدوات',
      description: 'فرش دهان بأحجام مختلفة',
      createdAt: '2024-01-03'
    }
  ])

  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showNewProductDialog, setShowNewProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    color: '',
    size: '',
    unit: 'جالون',
    price: 0,
    stock: 0,
    minStock: 0,
    supplier: '',
    description: ''
  })

  const categories = [
    'دهانات داخلية',
    'دهانات خارجية',
    'دهانات معادن',
    'مواد مساعدة'
  ]

  const units = [
    'جالون',
    'علبة',
    'كيس',
    'قطعة',
    'لتر'
  ]

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, categoryFilter])

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) {
      return { label: 'نفد المخزون', variant: 'destructive' }
    } else if (stock <= minStock) {
      return { label: 'مخزون منخفض', variant: 'secondary' }
    } else {
      return { label: 'متوفر', variant: 'success' }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleSubmitProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة'
      })
      return
    }

    if (editMode) {
      setProducts(products.map(product => 
        product.id === selectedProduct.id ? { ...selectedProduct, ...newProduct } : product
      ))
      setEditMode(false)
      setSelectedProduct(null)
    } else {
      const product = {
        id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
        ...newProduct,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProducts([...products, product])
    }

    setNewProduct({
      name: '',
      category: '',
      color: '',
      size: '',
      unit: 'جالون',
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: '',
      description: ''
    })
    setShowNewProductDialog(false)

    Swal.fire({
      icon: 'success',
      title: editMode ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      color: product.color,
      size: product.size,
      unit: product.unit,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      supplier: product.supplier,
      description: product.description
    })
    setEditMode(true)
    setShowNewProductDialog(true)
  }

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: 'حذف المنتج',
      text: 'هل أنت متأكد من حذف هذا المنتج؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts(products.filter(product => product.id !== productId))
        Swal.fire({
          icon: 'success',
          title: 'تم حذف المنتج',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleUpdateStock = (productId, newStock) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, stock: newStock } : product
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
          <p className="text-gray-600">إدارة كتالوج المنتجات والمخزون</p>
        </div>
        
        <Dialog open={showNewProductDialog} onOpenChange={(open) => {
          setShowNewProductDialog(open)
          if (!open) {
            setEditMode(false)
            setSelectedProduct(null)
            setNewProduct({
              name: '',
              category: '',
              color: '',
              size: '',
              unit: 'جالون',
              price: 0,
              stock: 0,
              minStock: 0,
              supplier: '',
              description: ''
            })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'تعديل تفاصيل المنتج' : 'أدخل تفاصيل المنتج الجديد'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المنتج *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="اسم المنتج"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">اللون</Label>
                  <Input
                    id="color"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    placeholder="اللون"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">الحجم</Label>
                  <Input
                    id="size"
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                    placeholder="الحجم"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">الوحدة</Label>
                  <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">المخزون الحالي</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">الحد الأدنى للمخزون</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">المورد</Label>
                <Input
                  id="supplier"
                  value={newProduct.supplier}
                  onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                  placeholder="اسم المورد"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="وصف المنتج..."
                  className="text-right"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewProductDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmitProduct}>
                  {editMode ? 'تحديث المنتج' : 'إضافة المنتج'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الفئات</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Layers className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock <= p.minStock && p.stock > 0).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-red-500" />
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
                  placeholder="البحث بالاسم أو الرقم أو الفئة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="فلترة حسب الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.minStock)
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.id}</p>
                    <Badge variant="outline" className="mt-1">{product.category}</Badge>
                  </div>
                  <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {product.color && product.color !== '-' && (
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.color}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{product.size} - {product.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatCurrency(product.price)} / {product.unit}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">المخزون:</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-20 h-8 text-center"
                      min="0"
                      disabled={user.role === 'Viewer'}
                    />
                    <span className="text-sm text-gray-600">{product.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowProductDetails(true)
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                  
                  {user.role !== 'Viewer' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لم يتم العثور على منتجات تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المنتج</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>اسم المنتج</Label>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label>رقم المنتج</Label>
                  <p className="font-medium">{selectedProduct.id}</p>
                </div>
                <div>
                  <Label>الفئة</Label>
                  <p className="font-medium">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label>اللون</Label>
                  <p className="font-medium">{selectedProduct.color || '-'}</p>
                </div>
                <div>
                  <Label>الحجم</Label>
                  <p className="font-medium">{selectedProduct.size}</p>
                </div>
                <div>
                  <Label>الوحدة</Label>
                  <p className="font-medium">{selectedProduct.unit}</p>
                </div>
                <div>
                  <Label>السعر</Label>
                  <p className="font-medium">{formatCurrency(selectedProduct.price)}</p>
                </div>
                <div>
                  <Label>المخزون الحالي</Label>
                  <p className="font-medium">{selectedProduct.stock} {selectedProduct.unit}</p>
                </div>
                <div>
                  <Label>الحد الأدنى للمخزون</Label>
                  <p className="font-medium">{selectedProduct.minStock} {selectedProduct.unit}</p>
                </div>
                <div>
                  <Label>المورد</Label>
                  <p className="font-medium">{selectedProduct.supplier || '-'}</p>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <Label>الوصف</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedProduct.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                <span>تاريخ الإضافة: {selectedProduct.createdAt}</span>
                <Badge variant={getStockStatus(selectedProduct.stock, selectedProduct.minStock).variant}>
                  {getStockStatus(selectedProduct.stock, selectedProduct.minStock).label}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductManagement

