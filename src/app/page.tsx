import { Header } from '@/components/shared/header';
import { TrailPackList } from '@/components/shared/trail-pack-list';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero section */}
        <div className="contour-bg mb-8 rounded-lg border border-border bg-card p-6 md:p-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              每一条路线，都有安全底线
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              经过实地核验的下撤点信息、时间窗口与接驳方案。
              让你在山上需要做决定的那一刻，能拿到确定的信息。
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-safe-green" />
                已核验下撤点
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warn-yellow" />
                接近时间窗口
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger-red" />
                建议下撤
              </div>
            </div>
          </div>
        </div>

        {/* Trail pack list */}
        <TrailPackList />
      </main>
    </div>
  );
}
