'use client';

import Link from 'next/link';
import type { Trail } from '@/lib/types';
import {
  MapPin,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronLeft,
  Mountain,
  Route,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Navigation,
  Bus,
  Timer,
  Eye,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  return h > 0 ? `${h}小时${m > 0 ? `${m}分` : ''}` : `${m}分钟`;
}

function VerifyStatusBadge({ status }: { status: string }) {
  const config = {
    verified: { icon: CheckCircle2, label: '已核验', className: 'bg-safe-green/10 text-safe-green' },
    pending: { icon: HelpCircle, label: '待核验', className: 'bg-warn-yellow/10 text-warn-yellow' },
    failed: { icon: AlertTriangle, label: '核验不通过', className: 'bg-danger-red/10 text-danger-red' },
  };
  const c = config[status as keyof typeof config] || config.pending;
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium', c.className)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}

function TimeWindowBadge({ status, time }: { status: string; time: string }) {
  const config = {
    safe: { className: 'bg-safe-green/10 text-safe-green border-safe-green/20', label: '建议通过' },
    caution: { className: 'bg-warn-yellow/10 text-warn-yellow border-warn-yellow/20', label: '注意' },
    danger: { className: 'bg-danger-red/10 text-danger-red border-danger-red/20', label: '建议下撤' },
  };
  const c = config[status as keyof typeof config] || config.safe;
  return (
    <div className={cn('flex items-center gap-1.5 rounded-md border px-2 py-1', c.className)}>
      <Timer className="h-3.5 w-3.5" />
      <span className="font-data text-xs font-bold">{time}</span>
      <span className="text-xs">{c.label}</span>
    </div>
  );
}

function SurfaceTypeIcon({ type }: { type: string }) {
  const labels: Record<string, string> = {
    stone: '石板路',
    dirt: '土路',
    stairs: '台阶路',
    road: '公路',
  };
  return (
    <span className="inline-flex items-center rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
      {labels[type] || type}
    </span>
  );
}

// Simple elevation profile visualization
function ElevationProfile({ trail }: { trail: Trail }) {
  const markers = trail.markers;
  if (markers.length === 0) return null;

  const maxElev = Math.max(...markers.map((m) => m.elevation));
  const minElev = Math.min(...markers.map((m) => m.elevation));
  const range = maxElev - minElev || 1;
  const width = 100;
  const height = 60;
  const padding = 4;

  const points = markers.map((m, i) => {
    const x = padding + (i / (markers.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((m.elevation - minElev) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold">海拔剖面</h3>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="font-data">{maxElev}m</span>
          <span>-</span>
          <span className="font-data">{minElev}m</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.12 155)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.55 0.12 155)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#elevGrad)" />
        <path d={pathD} fill="none" stroke="oklch(0.55 0.12 155)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {markers.map((m, i) => {
          const x = padding + (i / (markers.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((m.elevation - minElev) / range) * (height - 2 * padding);
          // Check if any evac point is anchored to this marker
          const hasEvac = trail.evacPoints.some((ep) => ep.anchorMarker === m.code);
          return (
            <g key={m.id}>
              {hasEvac && (
                <circle cx={x} cy={y} r="2.5" fill="oklch(0.70 0.19 55)" stroke="white" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              )}
              <text x={x} y={height - 0.5} textAnchor="middle" fontSize="3" fill="oklch(0.50 0.02 250)" className="font-data">
                {m.code.slice(-3)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-signal-orange" />
          <span>下撤点位置</span>
        </div>
      </div>
    </div>
  );
}

export function TrailDetailContent({ trail }: { trail: Trail }) {
  const [viewMode, setViewMode] = useState<'list' | 'profile'>('profile');
  const latestPack = trail.packs[0];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          资料包
        </Link>
        <span>/</span>
        <span className="text-foreground">{trail.name}</span>
      </div>

      {/* Trail header */}
      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-trail-green" />
              <h1 className="text-xl font-bold">{trail.name}</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {trail.startPoint} → {trail.endPoint}
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 text-sm">
                <Route className="h-4 w-4 text-muted-foreground" />
                <span className="font-data font-medium">{trail.totalDistance}km</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-data font-medium">+{trail.totalAscent}m</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-data font-medium">-{trail.totalDescent}m</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-data font-medium">{formatDuration(trail.estimatedDuration)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DifficultyDots level={trail.difficulty} />
                <span className="text-sm text-muted-foreground">Lv.{trail.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Download / pack info */}
          <div className="flex flex-col items-start gap-2 md:items-end">
            {latestPack && (
              <>
                <button className="inline-flex items-center gap-2 rounded-md bg-trail-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-trail-green/90">
                  <Navigation className="h-4 w-4" />
                  下载离线包
                </button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>v{latestPack.version}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-trail-green" />
                    已核验 {latestPack.verifiedCount}/{latestPack.evacPointCount}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Segments */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
          {trail.segments.map((seg) => (
            <div key={seg.id} className="flex items-center gap-1 text-xs">
              <span className="font-data text-muted-foreground">{seg.startMarker}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-data text-muted-foreground">{seg.endMarker}</span>
              <SurfaceTypeIcon type={seg.surfaceType} />
            </div>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">下撤点清单</h2>
        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            列表
          </button>
          <button
            onClick={() => setViewMode('profile')}
            className={cn(
              'flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'profile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            剖面
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'profile' && (
        <div className="mb-6">
          <ElevationProfile trail={trail} />
        </div>
      )}

      {/* Evacuation points list */}
      <div className="space-y-3">
        {trail.evacPoints
          .sort((a, b) => a.anchorMarker.localeCompare(b.anchorMarker))
          .map((ep) => (
            <Link
              key={ep.id}
              href={`/trails/${trail.id}/evac/${ep.id}`}
              className="group block rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Marker indicator */}
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-signal-orange/10 text-signal-orange">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-data text-sm font-bold">
                        {ep.anchorMarker}
                        {ep.offset > 0 && (
                          <span className="text-muted-foreground">+{ep.offset}m</span>
                        )}
                      </span>
                      <VerifyStatusBadge status={ep.verifyStatus} />
                    </div>
                    <p className="mt-1 text-sm text-foreground">{ep.pathDescription}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        下撤约{ep.evacDuration}分钟
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {ep.evacDestination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bus className="h-3 w-3" />
                        {ep.transitInfo.split('，')[0].split('(')[0]}
                      </span>
                    </div>
                    {ep.riskNote && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-signal-orange">
                        <AlertTriangle className="h-3 w-3" />
                        {ep.riskNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Time window */}
                <TimeWindowBadge status={ep.timeWindowStatus} time={ep.latestDeadline} />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
