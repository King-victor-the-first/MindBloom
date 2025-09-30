export default function TherapySessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <main>{children}</main>
    </div>
  );
}
