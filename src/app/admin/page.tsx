import { Header } from '@/components/shared/header';
import { AdminDashboard } from '@/components/shared/admin-dashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <AdminDashboard />
      </main>
    </div>
  );
}
