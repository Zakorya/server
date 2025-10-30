import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import heroImage from '@assets/generated_images/Fresh_market_hero_banner_a92057d1.png';

export default function Home() {
  const features = [
    {
      icon: ShoppingBag,
      title: 'منتجات طازجة',
      description: 'نختار لك أفضل المنتجات الطازجة يومياً',
    },
    {
      icon: Truck,
      title: 'توصيل سريع',
      description: 'نوصل طلبك في نفس اليوم داخل المدينة',
    },
    {
      icon: Shield,
      title: 'دفع آمن',
      description: 'معاملات آمنة ومحمية بالكامل',
    },
    {
      icon: Star,
      title: 'جودة مضمونة',
      description: 'نضمن لك جودة المنتجات 100%',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 opacity-20">
            <img
              src={heroImage}
              alt="Fresh market"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
          
          <div className="container relative mx-auto px-4 py-20 lg:py-32">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" data-testid="text-hero-title">
                عروض اليوم — منتجات طازجة
                <span className="block text-primary">بأسعار منافسة</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl" data-testid="text-hero-subtitle">
                تسوّق المواد الغذائية بسهولة، عروض يومية، توصيل سريع داخل المدينة
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2 text-lg" data-testid="button-browse-products">
                    <ShoppingBag className="h-5 w-5" />
                    تصفح المنتجات
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="text-lg" data-testid="button-create-account">
                    إنشاء حساب جديد
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">لماذا سوق نوح؟</h2>
              <p className="text-muted-foreground text-lg">
                نقدم لك أفضل تجربة تسوق للمواد الغذائية
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary to-accent py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">ابدأ التسوق الآن</h2>
            <p className="text-lg mb-8 text-white/90">
              اكتشف تشكيلتنا الواسعة من المنتجات الطازجة والعروض المميزة
            </p>
            <Link href="/products">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-lg"
                data-testid="button-start-shopping"
              >
                <ShoppingBag className="h-5 w-5" />
                ابدأ التسوق
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
