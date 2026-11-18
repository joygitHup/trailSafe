import { Header } from '@/components/shared/header';
import { AdminRoutesList } from '@/components/shared/admin-routes-list';

export default function AdminRoutesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <AdminRoutesList />
      </main>
    </div>
  );
}
