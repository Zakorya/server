import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import type { Product } from '@shared/schema';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Get unique categories
  const categories = products
    ? Array.from(new Set(products.map(p => p.category)))
    : [];

  // Filter products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  }) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المنتجات</h1>
          <p className="text-muted-foreground">تصفح تشكيلتنا المميزة من المواد الغذائية</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                البحث والفلترة
              </h2>

              {/* Search */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium">بحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                    data-testid="input-search"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium">التصنيفات</label>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                    data-testid="button-category-all"
                  >
                    جميع المنتجات
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`button-category-${category}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">نطاق السعر</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="الحد الأدنى"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    data-testid="input-min-price"
                  />
                  <Input
                    type="number"
                    placeholder="الحد الأقصى"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    data-testid="input-max-price"
                  />
                </div>
              </div>
            </Card>
          </aside>

          {/* Products Grid */}
          <div>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  لا توجد منتجات تطابق معايير البحث
                </p>
              </Card>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  عرض {filteredProducts.length} منتج
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
