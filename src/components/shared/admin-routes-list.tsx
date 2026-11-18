'use client';

import Link from 'next/link';
import { trails } from '@/lib/mock-data';
import {
  ChevronLeft,
  Route,
  MapPin,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Plus,
  ChevronRight,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function AdminRoutesList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = trails.filter(
    (t) =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.system.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          运营管理
        </Link>
        <span>/</span>
        <span className="text-foreground">路线管理</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">路线管理</h1>
        <button className="inline-flex items-center gap-1.5 rounded-md bg-trail-green px-4 py-2 text-sm font-medium text-white hover:bg-trail-green/90">
          <Plus className="h-4 w-4" />
          新建路线
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索路线名称或径系..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring md:w-80"
        />
      </div>

      {/* Routes list */}
      <div className="space-y-3">
        {filtered.map((trail) => {
          const verifiedCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'verified').length;
          const totalCount = trail.evacPoints.length;
          const pendingCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'pending').length;
          const failedCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'failed').length;
          const ratio = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
          const latestPack = trail.packs[0];

          return (
            <Link
              key={trail.id}
              href={`/admin/routes/${trail.id}`}
              className="block rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-trail-green/10 text-trail-green">
                    <Route className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{trail.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {trail.system} · {trail.section} · {trail.startPoint} → {trail.endPoint}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-data">{trail.totalDistance}km</span>
                      <span>爬升 {trail.totalAscent}m</span>
                      <span>难度 Lv.{trail.difficulty}</span>
                      <span>{totalCount}个下撤点</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {latestPack && (
                    <span className={cn(
                      'rounded-sm px-2 py-0.5 text-xs font-medium',
                      latestPack.status === 'published'
                        ? 'bg-safe-green/10 text-safe-green'
                        : 'bg-danger-red/10 text-danger-red'
                    )}>
                      {latestPack.status === 'published' ? '已发布' : '已下架'}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Verification progress */}
              <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-muted-foreground">核验覆盖率</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        ratio >= 90 ? 'bg-safe-green' : ratio >= 60 ? 'bg-warn-yellow' : 'bg-danger-red'
                      )}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span className="font-data text-xs font-bold">{ratio}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-0.5 text-safe-green">
                    <ShieldCheck className="h-3 w-3" />{verifiedCount}
                  </span>
                  {pendingCount > 0 && (
                    <span className="flex items-center gap-0.5 text-warn-yellow">
                      <Clock className="h-3 w-3" />{pendingCount}
                    </span>
                  )}
                  {failedCount > 0 && (
                    <span className="flex items-center gap-0.5 text-danger-red">
                      <AlertTriangle className="h-3 w-3" />{failedCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <Search className="h-8 w-8" />
          <p className="text-sm">没有找到匹配的路线</p>
        </div>
      )}
    </div>
  );
}
