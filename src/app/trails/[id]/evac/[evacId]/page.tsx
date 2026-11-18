import { Header } from '@/components/shared/header';
import { EvacPointDetailContent } from '@/components/shared/evac-point-detail';
import { getTrailById, getEvacPointById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default async function EvacPointDetailPage({
  params,
}: {
  params: Promise<{ id: string; evacId: string }>;
}) {
  const { id, evacId } = await params;
  const trail = getTrailById(id);
  const evacPoint = getEvacPointById(id, evacId);

  if (!trail || !evacPoint) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <EvacPointDetailContent trail={trail} evacPoint={evacPoint} />
      </main>
    </div>
  );
}
