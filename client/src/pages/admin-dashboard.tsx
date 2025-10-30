import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Plus, Edit, Trash2, Check, Truck } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Product, Order, InsertProduct } from '@shared/schema';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const isAdmin = useAuthStore(state => state.isAdmin);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [productForm, setProductForm] = useState<Partial<InsertProduct>>({
    title: '',
    price: 0,
    category: '',
    image: '',
    description: '',
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!isAdmin) {
    setLocation('/admin-login');
    return null;
  }

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest('POST', '/api/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setProductForm({ title: '', price: 0, category: '', image: '', description: '' });
      toast({ title: 'تم إضافة المنتج بنجاح' });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      return await apiRequest('PATCH', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setEditingProduct(null);
      setProductForm({ title: '', price: 0, category: '', image: '', description: '' });
      toast({ title: 'تم تحديث المنتج بنجاح' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/products/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'تم حذف المنتج بنجاح' });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest('PATCH', `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: 'تم تحديث حالة الطلب' });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/orders/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: 'تم حذف الطلب' });
    },
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productForm });
    } else {
      createProductMutation.mutate(productForm as InsertProduct);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image || '',
      description: product.description || '',
    });
  };

  const stats = {
    totalProducts: products?.length || 0,
    totalOrders: orders?.length || 0,
    preparingOrders: orders?.filter(o => o.status === 'قيد التحضير').length || 0,
    deliveryOrders: orders?.filter(o => o.status === 'قيد التوصيل').length || 0,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">إدارة المنتجات والطلبات</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد التحضير</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.preparingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد التوصيل</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deliveryOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">اسم المنتج</Label>
                      <Input
                        id="title"
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        required
                        data-testid="input-product-title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر (د.ل)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                        required
                        data-testid="input-product-price"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">التصنيف</Label>
                      <Input
                        id="category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        required
                        data-testid="input-product-category"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">رابط الصورة</Label>
                      <Input
                        id="image"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        data-testid="input-product-image"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={3}
                      data-testid="input-product-description"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" data-testid="button-save-product">
                      <Plus className="h-4 w-4 mr-2" />
                      {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                    </Button>
                    {editingProduct && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({ title: '', price: 0, category: '', image: '', description: '' });
                        }}
                        data-testid="button-cancel-edit"
                      >
                        إلغاء
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>قائمة المنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products?.map((product) => (
                    <Card key={product.id} data-testid={`admin-product-card-${product.id}`}>
                      <CardContent className="p-4">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        )}
                        <h3 className="font-semibold mb-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                        <p className="text-lg font-bold text-primary mb-3">
                          {product.price.toFixed(2)} د.ل
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                deleteProductMutation.mutate(product.id);
                              }
                            }}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders?.length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">لا توجد طلبات</p>
              </Card>
            ) : (
              orders
                ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((order) => (
                  <Card key={order.id} data-testid={`admin-order-card-${order.id}`}>
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
                    <CardContent className="space-y-4">
                      {/* Customer Info */}
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">العميل:</span>
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

                      {/* Items */}
                      <div className="border-t pt-4">
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
                        <span>المجموع:</span>
                        <span className="text-primary">{order.total.toFixed(2)} د.ل</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {order.status === 'قيد التحضير' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'قيد التوصيل' })}
                            data-testid={`button-accept-${order.id}`}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            قبول الطلب
                          </Button>
                        )}
                        {order.status === 'قيد التوصيل' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'تم التوصيل' })}
                            data-testid={`button-deliver-${order.id}`}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            تم التوصيل
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                              deleteOrderMutation.mutate(order.id);
                            }
                          }}
                          data-testid={`button-delete-order-${order.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
