import { Header } from '@/components/shared/header';
import { UserFavorites } from '@/components/shared/user-favorites';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <UserFavorites />
      </main>
    </div>
  );
}
