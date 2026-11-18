'use client';

import Link from 'next/link';
import { trails } from '@/lib/mock-data';
import {
  MapPin,
  Clock,
  ArrowUpCircle,
  AlertTriangle,
  Download,
  ChevronRight,
  Mountain,
  Route,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            'h-2 w-2 rounded-full',
            i <= level ? 'bg-signal-orange' : 'bg-border'
          )}
        />
      ))}
    </div>
  );
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

export function TrailPackList() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">可用资料包</h2>
        <span className="text-xs text-muted-foreground">
          共 {trails.length} 条路线
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {trails.map((trail) => {
          const latestPack = trail.packs[0];
          const verifiedRatio = latestPack
            ? `${latestPack.verifiedCount}/${latestPack.evacPointCount}`
            : '0/0';
          const isArchived = latestPack?.status === 'archived';

          return (
            <Link
              key={trail.id}
              href={`/trails/${trail.id}`}
              className={cn(
                'group relative rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md',
                isArchived && 'opacity-70'
              )}
            >
              {/* Status badge */}
              {isArchived && (
                <div className="absolute right-3 top-3">
                  <span className="inline-flex items-center gap-1 rounded-sm bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    已下架
                  </span>
                </div>
              )}

              {/* Trail header */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-trail-green/10 text-trail-green">
                  <Mountain className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-foreground group-hover:text-trail-green">
                    {trail.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {trail.system} · {trail.section}
                  </p>
                </div>
              </div>

              {/* Key stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <Route className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-data font-medium">{trail.totalDistance}km</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <ArrowUpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-data font-medium">{trail.totalAscent}m</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-data font-medium">{formatDuration(trail.estimatedDuration)}</span>
                </div>
              </div>

              {/* Bottom row */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <DifficultyDots level={trail.difficulty} />
                    <span className="text-xs text-muted-foreground">
                      Lv.{trail.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-trail-green" />
                    <span className="font-data text-xs">
                      核验 {verifiedRatio}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-trail-green">
                  <span>查看</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Evac points count */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{trail.evacPoints.length} 个下撤点</span>
                {latestPack && (
                  <>
                    <span className="mx-1">·</span>
                    <Download className="h-3 w-3" />
                    <span>v{latestPack.version}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
