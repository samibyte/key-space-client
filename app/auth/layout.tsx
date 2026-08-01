export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[calc(100vh-73px)] overflow-hidden">{children}</div>;
}
