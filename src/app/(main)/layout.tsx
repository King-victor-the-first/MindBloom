import BottomNavBar from '@/components/shared/BottomNavBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNavBar />
    </div>
  );
}
