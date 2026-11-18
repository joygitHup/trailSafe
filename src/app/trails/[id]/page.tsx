import { Header } from '@/components/shared/header';
import { TrailDetailContent } from '@/components/shared/trail-detail-content';
import { getTrailById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = { id: 't1' }; // Will be resolved at runtime
  return {
    title: `路线详情`,
  };
}

export default async function TrailDetailPage({
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
        <TrailDetailContent trail={trail} />
      </main>
    </div>
  );
}
