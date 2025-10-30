export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} سوق نوح — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
