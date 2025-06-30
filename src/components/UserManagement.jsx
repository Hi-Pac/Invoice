import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Users, 
  Shield, 
  Eye, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react'
import Swal from 'sweetalert2'

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      name: 'مدير النظام',
      email: 'admin@hcp-erp.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
      createdAt: '2023-01-01'
    },
    {
      id: 2,
      username: 'manager1',
      name: 'أحمد محمد',
      email: 'ahmed@hcp-erp.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      createdAt: '2023-02-15'
    },
    {
      id: 3,
      username: 'employee1',
      name: 'محمد علي',
      email: 'mohammed@hcp-erp.com',
      role: 'Employee',
      status: 'active',
      lastLogin: '2024-01-14 14:20',
      createdAt: '2023-03-10'
    },
    {
      id: 4,
      username: 'viewer1',
      name: 'سعد أحمد',
      email: 'saad@hcp-erp.com',
      role: 'Viewer',
      status: 'inactive',
      lastLogin: '2024-01-10 09:15',
      createdAt: '2023-04-05'
    }
  ])

  const [filteredUsers, setFilteredUsers] = useState(users)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewUserDialog, setShowNewUserDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee'
  })

  const roles = [
    { value: 'Admin', label: 'مدير النظام', permissions: ['جميع الصلاحيات'] },
    { value: 'Manager', label: 'مدير', permissions: ['إدارة الطلبات', 'إدارة المنتجات', 'إدارة العملاء', 'التقارير'] },
    { value: 'Employee', label: 'موظف', permissions: ['إدارة الطلبات', 'إدارة المنتجات'] },
    { value: 'Viewer', label: 'مشاهد', permissions: ['عرض البيانات فقط'] }
  ]

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const getRoleBadge = (role) => {
    const roleConfig = {
      Admin: { label: 'مدير النظام', variant: 'destructive' },
      Manager: { label: 'مدير', variant: 'default' },
      Employee: { label: 'موظف', variant: 'secondary' },
      Viewer: { label: 'مشاهد', variant: 'outline' }
    }
    
    const config = roleConfig[role] || roleConfig.Employee
    return <Badge variant={config.variant}>{config.label}</Badge>
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

  const handleSubmitUser = () => {
    if (!newUser.username || !newUser.name || !newUser.email) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة'
      })
      return
    }

    if (!editMode && newUser.password !== newUser.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين'
      })
      return
    }

    if (editMode) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...newUser, password: undefined, confirmPassword: undefined }
          : u
      ))
    } else {
      const userExists = users.some(u => u.username === newUser.username || u.email === newUser.email)
      if (userExists) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل'
        })
        return
      }

      const user = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...newUser,
        password: undefined,
        confirmPassword: undefined,
        status: 'active',
        lastLogin: null,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, user])
    }

    resetForm()
    Swal.fire({
      icon: 'success',
      title: editMode ? 'تم تحديث المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const resetForm = () => {
    setNewUser({
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Employee'
    })
    setShowNewUserDialog(false)
    setEditMode(false)
    setSelectedUser(null)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditMode(true)
    setNewUser({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role
    })
    setShowNewUserDialog(true)
  }

  const handleDelete = (userId) => {
    if (userId === 1) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'لا يمكن حذف مدير النظام الرئيسي'
      })
      return
    }

    Swal.fire({
      title: 'حذف المستخدم',
      text: 'هل أنت متأكد من حذف هذا المستخدم؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter(user => user.id !== userId))
        Swal.fire({
          icon: 'success',
          title: 'تم حذف المستخدم',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleStatusChange = (userId, newStatus) => {
    if (userId === 1 && newStatus !== 'active') {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'لا يمكن تغيير حالة مدير النظام الرئيسي'
      })
      return
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))

    Swal.fire({
      icon: 'success',
      title: 'تم تحديث حالة المستخدم',
      timer: 1500,
      showConfirmButton: false
    })
  }

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      admins: users.filter(u => u.role === 'Admin').length,
      managers: users.filter(u => u.role === 'Manager').length,
      employees: users.filter(u => u.role === 'Employee').length,
      viewers: users.filter(u => u.role === 'Viewer').length
    }
  }

  const stats = getUserStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600">إدارة المستخدمين والأدوار والصلاحيات</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مستخدمين نشطين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مديرين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.admins + stats.managers}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">موظفين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.employees + stats.viewers}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
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
                placeholder="البحث بالاسم أو اسم المستخدم أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="Admin">مدير النظام</SelectItem>
                <SelectItem value="Manager">مدير</SelectItem>
                <SelectItem value="Employee">موظف</SelectItem>
                <SelectItem value="Viewer">مشاهد</SelectItem>
              </SelectContent>
            </Select>
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
        
        {user.role === 'Admin' && (
          <Dialog open={showNewUserDialog} onOpenChange={(open) => {
            setShowNewUserDialog(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                مستخدم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editMode ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="اسم المستخدم"
                    disabled={editMode}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="الاسم الكامل"
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">الدور</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!editMode && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="كلمة المرور"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        placeholder="تأكيد كلمة المرور"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewUserDialog(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSubmitUser}>
                    {editMode ? 'تحديث المستخدم' : 'إضافة المستخدم'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Users List */}
      <div className="grid gap-6">
        {filteredUsers.map((userItem) => (
          <Card key={userItem.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{userItem.name}</h3>
                    {getRoleBadge(userItem.role)}
                    {getStatusBadge(userItem.status)}
                  </div>
                  <p className="text-gray-600 mb-1">@{userItem.username}</p>
                  <p className="text-sm text-gray-500 mb-1">{userItem.email}</p>
                  <p className="text-xs text-gray-500">
                    آخر دخول: {userItem.lastLogin || 'لم يسجل دخول بعد'}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">عضو منذ</p>
                  <p className="font-medium">{userItem.createdAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(userItem)
                      setShowUserDetails(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {user.role === 'Admin' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(userItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Select
                        value={userItem.status}
                        onValueChange={(value) => handleStatusChange(userItem.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="inactive">غير نشط</SelectItem>
                          <SelectItem value="blocked">محظور</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {userItem.id !== 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(userItem.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستخدمين</h3>
            <p className="text-gray-500">لم يتم العثور على مستخدمين يطابقون معايير البحث</p>
          </CardContent>
        </Card>
      )}

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم الكامل</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>اسم المستخدم</Label>
                  <p className="font-medium">@{selectedUser.username}</p>
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>الدور</Label>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
              </div>

              <div>
                <Label>الصلاحيات</Label>
                <div className="mt-2">
                  {roles.find(r => r.value === selectedUser.role)?.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ الإنضمام</Label>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
                <div>
                  <Label>آخر دخول</Label>
                  <p className="font-medium">{selectedUser.lastLogin || 'لم يسجل دخول بعد'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <Label>الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagement

