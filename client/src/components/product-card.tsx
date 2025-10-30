import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@shared/schema';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    toast({
      title: 'تمت الإضافة للسلة',
      description: `تم إضافة ${product.title} إلى سلة التسوق`,
    });
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              data-testid={`img-product-${product.id}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              لا توجد صورة
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            {product.category}
          </Badge>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-product-title-${product.id}`}>
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          <p className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            {product.price.toFixed(2)} د.ل
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="h-4 w-4" />
          أضف للسلة
        </Button>
      </CardFooter>
    </Card>
  );
}
