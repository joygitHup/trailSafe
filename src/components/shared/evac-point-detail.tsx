'use client';

import Link from 'next/link';
import type { Trail, EvacuationPoint } from '@/lib/types';
import {
  MapPin,
  Clock,
  ChevronLeft,
  Navigation,
  Bus,
  Timer,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  User,
  Calendar,
  Camera,
  Footprints,
  ArrowRight,
  ShieldCheck,
  ShieldX,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    safe: { className: 'bg-safe-green/10 text-safe-green border-safe-green/30', label: '建议通过' },
    caution: { className: 'bg-warn-yellow/10 text-warn-yellow border-warn-yellow/30', label: '注意' },
    danger: { className: 'bg-danger-red/10 text-danger-red border-danger-red/30', label: '建议下撤' },
  };
  const c = config[status as keyof typeof config] || config.safe;
  return (
    <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2', c.className)}>
      <Timer className="h-5 w-5" />
      <div>
        <div className="font-data text-lg font-bold">{time}</div>
        <div className="text-xs">建议最晚通过时间</div>
      </div>
      <span className="ml-2 rounded-sm bg-current/10 px-2 py-0.5 text-xs font-medium">{c.label}</span>
    </div>
  );
}

export function EvacPointDetailContent({
  trail,
  evacPoint,
}: {
  trail: Trail;
  evacPoint: EvacuationPoint;
}) {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          资料包
        </Link>
        <span>/</span>
        <Link href={`/trails/${trail.id}`} className="flex items-center gap-1 hover:text-foreground">
          {trail.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {evacPoint.anchorMarker}
          {evacPoint.offset > 0 && `+${evacPoint.offset}m`}
        </span>
      </div>

      {/* Header */}
      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-signal-orange/10 text-signal-orange">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-data">
                  {evacPoint.anchorMarker}
                  {evacPoint.offset > 0 && (
                    <span className="text-muted-foreground">+{evacPoint.offset}m</span>
                  )}
                </h1>
                <VerifyStatusBadge status={evacPoint.verifyStatus} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {trail.name} · {trail.system}
              </p>
            </div>
          </div>
        </div>

        {/* Time window */}
        <div className="mt-4">
          <TimeWindowBadge status={evacPoint.timeWindowStatus} time={evacPoint.latestDeadline} />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left: path info */}
        <div className="space-y-4">
          {/* Path description */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Footprints className="h-4 w-4 text-trail-green" />
              下撤路径
            </h3>
            <p className="text-sm leading-relaxed">{evacPoint.pathDescription}</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>约 <span className="font-data font-bold">{evacPoint.evacDuration}</span> 分钟</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span>{evacPoint.evacDestination}</span>
              </div>
            </div>
          </div>

          {/* Transit info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Bus className="h-4 w-4 text-trail-green" />
              接驳信息
            </h3>
            <p className="text-sm leading-relaxed">{evacPoint.transitInfo}</p>
          </div>

          {/* Risk notes */}
          {evacPoint.riskNote && (
            <div className="rounded-lg border border-signal-orange/20 bg-signal-orange/5 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-signal-orange">
                <AlertTriangle className="h-4 w-4" />
                路况风险
              </h3>
              <p className="text-sm">{evacPoint.riskNote}</p>
            </div>
          )}

          {/* Conditions */}
          {evacPoint.condition && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Info className="h-4 w-4 text-muted-foreground" />
                适用条件
              </h3>
              <p className="text-sm">{evacPoint.condition}</p>
            </div>
          )}
        </div>

        {/* Right: verification record */}
        <div className="space-y-4">
          {/* Verify record */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="h-4 w-4 text-trail-green" />
              核验记录
            </h3>

            {evacPoint.verifyRecord ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{evacPoint.verifyRecord.verifierName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-data">
                    {new Date(evacPoint.verifyRecord.verifyTime).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="rounded-md bg-secondary/50 p-3 text-sm">
                  <p className="font-medium">路况描述</p>
                  <p className="mt-1 text-muted-foreground">{evacPoint.verifyRecord.pathCondition}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">实际用时</p>
                    <p className="font-data text-sm font-bold">{evacPoint.verifyRecord.actualDuration}分钟</p>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">接驳情况</p>
                    <p className="text-xs">{evacPoint.verifyRecord.transitActual}</p>
                  </div>
                </div>
                <div className={cn(
                  'flex items-center gap-2 rounded-md p-2 text-sm font-medium',
                  evacPoint.verifyRecord.conclusion === 'pass'
                    ? 'bg-safe-green/10 text-safe-green'
                    : 'bg-danger-red/10 text-danger-red'
                )}>
                  {evacPoint.verifyRecord.conclusion === 'pass' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      核验通过
                    </>
                  ) : (
                    <>
                      <ShieldX className="h-4 w-4" />
                      核验不通过
                      {evacPoint.verifyRecord.failReason && (
                        <span className="text-xs font-normal">: {evacPoint.verifyRecord.failReason}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
                <HelpCircle className="h-8 w-8 text-warn-yellow" />
                <p className="text-sm">暂无核验记录</p>
                <p className="text-xs">该下撤点尚未完成实地核验</p>
              </div>
            )}
          </div>

          {/* Photos placeholder */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <Camera className="h-4 w-4 text-muted-foreground" />
              现场照片
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex aspect-video items-center justify-center rounded-md bg-secondary text-xs text-muted-foreground">
                路口全景
              </div>
              <div className="flex aspect-video items-center justify-center rounded-md bg-secondary text-xs text-muted-foreground">
                标识细节
              </div>
            </div>
          </div>

          {/* Neighboring points */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold">相邻下撤点</h3>
            <div className="space-y-2">
              {trail.evacPoints
                .filter((ep) => ep.id !== evacPoint.id)
                .sort((a, b) => a.anchorMarker.localeCompare(b.anchorMarker))
                .slice(0, 3)
                .map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/trails/${trail.id}/evac/${ep.id}`}
                    className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-secondary"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-signal-orange" />
                      <span className="font-data font-medium">{ep.anchorMarker}</span>
                      <span className="text-xs text-muted-foreground">{ep.evacDestination}</span>
                    </div>
                    <VerifyStatusBadge status={ep.verifyStatus} />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
