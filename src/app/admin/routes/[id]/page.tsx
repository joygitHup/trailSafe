import { Header } from '@/components/shared/header';
import { AdminRouteDetail } from '@/components/shared/admin-route-detail';
import { getTrailById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default async function AdminRouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trail = getTrailById(id);

  if (!trail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <AdminRouteDetail trail={trail} />
      </main>
    </div>
  );
}
