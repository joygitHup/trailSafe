'use client';

import Link from 'next/link';
import type { Trail } from '@/lib/types';
import {
  MapPin,
  Clock,
  ChevronLeft,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  FileText,
  ArrowUpCircle,
  Download,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function VerifyStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircle2; label: string; className: string }> = {
    verified: { icon: CheckCircle2, label: '已核验', className: 'bg-safe-green/10 text-safe-green' },
    pending: { icon: HelpCircle, label: '待核验', className: 'bg-warn-yellow/10 text-warn-yellow' },
    failed: { icon: AlertTriangle, label: '不通过', className: 'bg-danger-red/10 text-danger-red' },
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium', c.className)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}

export function AdminRouteDetail({ trail }: { trail: Trail }) {
  const latestPack = trail.packs[0];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          运营管理
        </Link>
        <span>/</span>
        <span className="text-foreground">{trail.name}</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">{trail.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {trail.startPoint} → {trail.endPoint} · {trail.totalDistance}km · 爬升{trail.totalAscent}m
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary">
            <Edit className="h-4 w-4" />
            编辑路线
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-trail-green px-3 py-2 text-sm font-medium text-white hover:bg-trail-green/90">
            <Download className="h-4 w-4" />
            发布资料包
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Evac points management */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">下撤点管理</h2>
            <button className="inline-flex items-center gap-1 rounded-md bg-signal-orange px-3 py-1.5 text-xs font-medium text-white hover:bg-signal-orange/90">
              <Plus className="h-3 w-3" />
              添加下撤点
            </button>
          </div>

          <div className="space-y-2">
            {trail.evacPoints
              .sort((a, b) => a.anchorMarker.localeCompare(b.anchorMarker))
              .map((ep) => (
                <div
                  key={ep.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-orange/10 text-signal-orange">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-data text-sm font-bold">{ep.anchorMarker}</span>
                        {ep.offset > 0 && (
                          <span className="font-data text-xs text-muted-foreground">+{ep.offset}m</span>
                        )}
                        <VerifyStatusBadge status={ep.verifyStatus} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ep.evacDestination} · 约{ep.evacDuration}分钟
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/trails/${trail.id}/evac/${ep.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-danger-red/10 hover:text-danger-red">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Pack info & version history */}
        <div className="space-y-4">
          {/* Current pack */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <FileText className="h-4 w-4 text-trail-green" />
              当前资料包
            </h3>
            {latestPack ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">版本</span>
                  <span className="font-data font-medium">v{latestPack.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">状态</span>
                  <span className={cn(
                    'text-xs font-medium',
                    latestPack.status === 'published' ? 'text-safe-green' : 'text-danger-red'
                  )}>
                    {latestPack.status === 'published' ? '已发布' : '已下架'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">发布时间</span>
                  <span className="font-data text-xs">
                    {new Date(latestPack.publishTime).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">发布人</span>
                  <span>{latestPack.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">核验覆盖</span>
                  <span className="font-data font-medium">
                    {latestPack.verifiedCount}/{latestPack.evacPointCount}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">尚未发布资料包</p>
            )}
          </div>

          {/* Version history */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <History className="h-4 w-4 text-muted-foreground" />
              版本历史
            </h3>
            <div className="space-y-2">
              {trail.packs.map((pack) => (
                <div key={pack.id} className="flex items-center justify-between rounded-md bg-secondary/50 p-2 text-xs">
                  <div>
                    <span className="font-data font-medium">v{pack.version}</span>
                    <span className="ml-2 text-muted-foreground">
                      {new Date(pack.publishTime).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <span className={cn(
                    'rounded-sm px-1.5 py-0.5 font-medium',
                    pack.status === 'published' ? 'bg-safe-green/10 text-safe-green' : 'bg-danger-red/10 text-danger-red'
                  )}>
                    {pack.status === 'published' ? '当前' : '已下架'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Route info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold">路线信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">标距柱范围</span>
                <span className="font-data text-xs">{trail.startMarker} - {trail.endMarker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">标距柱数量</span>
                <span className="font-data">{trail.markers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">分段数</span>
                <span className="font-data">{trail.segments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最近更新</span>
                <span className="font-data text-xs">
                  {new Date(trail.updatedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
