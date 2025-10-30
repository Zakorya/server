import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { InsertOrder } from '@shared/schema';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const { customer } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: '',
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      return await apiRequest('POST', '/api/orders', data);
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'تم إرسال الطلب بنجاح!',
        description: 'شكراً لتسوقك معنا. سنتواصل معك قريباً',
      });
      setLocation('/orders');
    },
    onError: () => {
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من إتمام الطلب. حاول مرة أخرى',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'السلة فارغة',
        description: 'أضف منتجات إلى السلة أولاً',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: 'معلومات ناقصة',
        description: 'الرجاء ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    const orderData: InsertOrder = {
      customerId: customer?.id,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.qty,
      })),
      customer: {
        id: customer?.id,
        name: formData.name,
        email: formData.email || customer?.email,
        phone: formData.phone,
        address: formData.address,
      },
      total: getTotal(),
      status: 'قيد التحضير',
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">سلة التسوق والدفع</h1>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Cart Items */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  المنتجات ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">
                      السلة فارغة
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setLocation('/products')}
                      className="mt-4"
                      data-testid="button-continue-shopping"
                    >
                      تصفح المنتجات
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b pb-4 last:border-0"
                      data-testid={`cart-item-${item.id}`}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toFixed(2)} د.ل
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold" data-testid={`text-quantity-${item.id}`}>
                          {item.qty}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-left font-semibold">
                        {(item.price * item.qty).toFixed(2)} د.ل
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التوصيل</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      data-testid="input-address"
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>المجموع الفرعي</span>
                      <span>{getTotal().toFixed(2)} د.ل</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>التوصيل</span>
                      <span>مجاني</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2">
                      <span>المجموع الكلي</span>
                      <span data-testid="text-total">{getTotal().toFixed(2)} د.ل</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={items.length === 0 || createOrderMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {createOrderMutation.isPending ? 'جاري المعالجة...' : 'تأكيد الطلب'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
