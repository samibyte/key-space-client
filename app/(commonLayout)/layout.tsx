import Footer from "@/components/shared/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children} <Footer />
    </div>
  );
}
