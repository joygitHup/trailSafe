import { Header } from '@/components/shared/header';
import { VerifyManagement } from '@/components/shared/verify-management';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <VerifyManagement />
      </main>
    </div>
  );
}
