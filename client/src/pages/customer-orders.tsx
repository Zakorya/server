import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import type { Order } from '@shared/schema';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function CustomerOrders() {
  const [, setLocation] = useLocation();
  const customer = useAuthStore(state => state.customer);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: !!customer,
  });

  if (!customer) {
    setLocation('/login');
    return null;
  }

  const myOrders = orders?.filter(
    (order) => order.customerId === customer.id ||
    order.customer.email?.toLowerCase() === customer.email.toLowerCase()
  ) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">طلباتي</h1>
          <p className="text-muted-foreground">تتبع حالة طلباتك ومشترياتك السابقة</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-48 animate-pulse" />
            ))}
          </div>
        ) : myOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
            <p className="text-muted-foreground mb-6">
              لم تقم بأي طلبات بعد. ابدأ التسوق الآن!
            </p>
            <Link href="/products">
              <Button className="gap-2" data-testid="button-start-shopping">
                <ShoppingBag className="h-4 w-4" />
                تصفح المنتجات
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {myOrders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
                <Card key={order.id} data-testid={`card-order-${order.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5" />
                          طلب #{order.id.substring(0, 8)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), 'PPP - p', { locale: ar })}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الاسم:</span>
                          <span className="font-medium">{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الهاتف:</span>
                          <span className="font-medium">{order.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">العنوان:</span>
                          <span className="font-medium">{order.customer.address}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">المنتجات:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>
                                {item.title} × {item.quantity}
                              </span>
                              <span className="font-medium">
                                {(item.price * item.quantity).toFixed(2)} د.ل
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t pt-4 flex justify-between text-lg font-bold">
                        <span>المجموع الكلي:</span>
                        <span className="text-primary" data-testid={`text-order-total-${order.id}`}>
                          {order.total.toFixed(2)} د.ل
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
