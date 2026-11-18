'use client';

import { trails } from '@/lib/mock-data';
import {
  ChevronLeft,
  MapPin,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  Filter,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type FilterStatus = 'all' | 'pending' | 'verified' | 'failed';

export function VerifyManagement() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all evac points across all trails
  const allEvacPoints = trails.flatMap((trail) =>
    trail.evacPoints.map((ep) => ({ ...ep, trailName: trail.name, trailId: trail.id }))
  );

  const filtered = allEvacPoints.filter((ep) => {
    if (filter !== 'all' && ep.verifyStatus !== filter) return false;
    if (searchQuery && !ep.anchorMarker.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ep.evacDestination.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ep.trailName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusCounts = {
    all: allEvacPoints.length,
    pending: allEvacPoints.filter((ep) => ep.verifyStatus === 'pending').length,
    verified: allEvacPoints.filter((ep) => ep.verifyStatus === 'verified').length,
    failed: allEvacPoints.filter((ep) => ep.verifyStatus === 'failed').length,
  };

  const filters: { key: FilterStatus; label: string; icon: typeof CheckCircle2 }[] = [
    { key: 'all', label: '全部', icon: Filter },
    { key: 'pending', label: '待核验', icon: HelpCircle },
    { key: 'verified', label: '已核验', icon: ShieldCheck },
    { key: 'failed', label: '不通过', icon: AlertTriangle },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          运营管理
        </Link>
        <span>/</span>
        <span className="text-foreground">核验管理</span>
      </div>

      <h1 className="mb-4 text-2xl font-bold">核验记录管理</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <f.icon className="h-3 w-3" />
              {f.label}
              <span className="ml-1 rounded-sm bg-current/10 px-1 text-[10px]">
                {statusCounts[f.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索标距柱、终点、路线..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring md:w-64"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((ep) => (
          <div
            key={ep.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md',
                ep.verifyStatus === 'verified' && 'bg-safe-green/10 text-safe-green',
                ep.verifyStatus === 'pending' && 'bg-warn-yellow/10 text-warn-yellow',
                ep.verifyStatus === 'failed' && 'bg-danger-red/10 text-danger-red',
              )}>
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-data text-sm font-bold">{ep.anchorMarker}</span>
                  {ep.offset > 0 && (
                    <span className="font-data text-xs text-muted-foreground">+{ep.offset}m</span>
                  )}
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{ep.trailName}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {ep.evacDestination} · {ep.pathDescription.slice(0, 30)}...
                </p>
                {ep.verifyRecord && (
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ep.verifyRecord.verifierName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(ep.verifyRecord.verifyTime).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {ep.verifyStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-safe-green/10 px-2 py-0.5 text-xs font-medium text-safe-green">
                  <CheckCircle2 className="h-3 w-3" />
                  已核验
                </span>
              )}
              {ep.verifyStatus === 'pending' && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-warn-yellow/10 px-2 py-0.5 text-xs font-medium text-warn-yellow">
                  <Clock className="h-3 w-3" />
                  待核验
                </span>
              )}
              {ep.verifyStatus === 'failed' && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-danger-red/10 px-2 py-0.5 text-xs font-medium text-danger-red">
                  <AlertTriangle className="h-3 w-3" />
                  不通过
                </span>
              )}
              <Link
                href={`/trails/${ep.trailId}/evac/${ep.id}`}
                className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                查看
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <Search className="h-8 w-8" />
          <p className="text-sm">没有找到匹配的核验记录</p>
        </div>
      )}
    </div>
  );
}
