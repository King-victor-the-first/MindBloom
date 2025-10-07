import BottomNavBar from '@/components/shared/BottomNavBar';
import Sidebar from '@/components/shared/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 md:pb-0 pb-28">{children}</main>
      <BottomNavBar />
    </div>
  );
}
