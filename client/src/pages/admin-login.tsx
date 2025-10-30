import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';
import { ADMIN_CREDENTIALS } from '@shared/schema';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const setAdmin = useAuthStore(state => state.setAdmin);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.username === ADMIN_CREDENTIALS.username &&
      formData.password === ADMIN_CREDENTIALS.password
    ) {
      setAdmin(true);
      toast({
        title: 'تم تسجيل الدخول كمدير',
        description: 'مرحباً بك في لوحة التحكم',
      });
      setLocation('/admin');
    } else {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">تسجيل دخول المدير</CardTitle>
            <CardDescription>
              لوحة التحكم - إدارة المنتجات والطلبات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Zakarya"
                  required
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="829823812Zz"
                  required
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-login">
                تسجيل الدخول
              </Button>
            </form>
            <div className="mt-4 text-xs text-center text-muted-foreground">
              <p>اسم المستخدم: admin</p>
              <p>كلمة المرور: admin123</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
