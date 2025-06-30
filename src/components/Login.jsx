import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Swal from 'sweetalert2'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في تسجيل الدخول',
        text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      })
      return
    }

    setLoading(true)
    
    try {
      await signin(email, password)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'المستخدم غير موجود'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صحيح'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً'
      }
      
      Swal.fire({
        icon: 'error',
        title: 'خطأ في تسجيل الدخول',
        text: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">HCP ERP</CardTitle>
          <CardDescription>نظام إدارة الموارد المتكامل</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hcp.com"
                required
                disabled={loading}
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              مستخدم جديد؟{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                سجل الآن
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">حسابات تجريبية:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Admin: admin@hcp-erp.com / admin123</p>
              <p>Accountant: accountant@hcp.com / acc123</p>
              <p>Sales Rep: sales@hcp.com / sales123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

