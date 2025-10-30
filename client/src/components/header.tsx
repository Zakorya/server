import { Link, useLocation } from 'wouter';
import { ShoppingCart, User, LogOut, Package, Home as HomeIcon, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

export function Header() {
  const [location, setLocation] = useLocation();
  const itemCount = useCartStore(state => state.getItemCount());
  const { customer, isAdmin, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-2 py-1 -mr-2" 
          data-testid="link-home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-lg font-bold text-white">
            نوح
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground">سوق نوح</h1>
            <p className="text-xs text-muted-foreground">متجر المواد الغذائية</p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2">
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-2 mr-4">
            <Link href="/">
              <Button
                variant={location === '/' ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                data-testid="button-nav-home"
              >
                <HomeIcon className="h-4 w-4" />
                الرئيسية
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant={location === '/products' ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                data-testid="button-nav-products"
              >
                <Store className="h-4 w-4" />
                المنتجات
              </Button>
            </Link>
          </nav>

          {/* Cart Button */}
          <Link href="/checkout">
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">السلة</span>
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -left-2 h-5 min-w-5 rounded-full px-1 text-xs"
                  data-testid="badge-cart-count"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {customer || isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-user-menu">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isAdmin ? 'مدير' : customer?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {isAdmin ? 'لوحة التحكم' : 'حسابي'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <DropdownMenuItem onClick={() => setLocation('/admin')} data-testid="menu-item-admin">
                    <Package className="ml-2 h-4 w-4" />
                    <span>إدارة المتجر</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setLocation('/orders')} data-testid="menu-item-orders">
                    <Package className="ml-2 h-4 w-4" />
                    <span>طلباتي</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-testid="menu-item-logout">
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-login">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">دخول</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
