'use client';

import Link from 'next/link';
import { trails } from '@/lib/mock-data';
import {
  Route,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  ChevronRight,
  BarChart3,
  FileCheck,
  Users,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: '路线总数', value: trails.length, icon: Route, color: 'text-trail-green' },
  { label: '下撤点总数', value: trails.reduce((sum, t) => sum + t.evacPoints.length, 0), icon: MapPin, color: 'text-signal-orange' },
  { label: '已核验', value: trails.reduce((sum, t) => sum + t.evacPoints.filter((ep) => ep.verifyStatus === 'verified').length, 0), icon: ShieldCheck, color: 'text-safe-green' },
  { label: '待核验', value: trails.reduce((sum, t) => sum + t.evacPoints.filter((ep) => ep.verifyStatus === 'pending').length, 0), icon: Clock, color: 'text-warn-yellow' },
];

const quickActions = [
  { label: '新建路线', icon: Plus, href: '/admin/routes/new', color: 'bg-trail-green text-white' },
  { label: '核验任务', icon: FileCheck, href: '/admin/verify', color: 'bg-signal-orange text-white' },
  { label: '领队管理', icon: Users, href: '#', color: 'bg-secondary text-foreground' },
  { label: '系统设置', icon: Settings, href: '#', color: 'bg-secondary text-foreground' },
];

export function AdminDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">运营管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理路线、下撤点核验与资料包发布
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon className={cn('h-5 w-5', stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-2 font-data text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">快捷操作</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90',
                  action.color
                )}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Routes overview */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">路线概览</h2>
          <Link href="/admin/routes" className="flex items-center gap-1 text-xs text-trail-green hover:underline">
            查看全部 <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {trails.map((trail) => {
            const verifiedCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'verified').length;
            const totalCount = trail.evacPoints.length;
            const pendingCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'pending').length;
            const failedCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'failed').length;
            const ratio = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

            return (
              <Link
                key={trail.id}
                href={`/admin/routes/${trail.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-trail-green/10 text-trail-green">
                    <Route className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{trail.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {trail.totalDistance}km · {totalCount}个下撤点
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Verification progress */}
                  <div className="hidden items-center gap-2 md:flex">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-trail-green transition-all"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <span className="font-data text-xs">{ratio}%</span>
                  </div>

                  {/* Status counts */}
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

                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Verification coverage chart placeholder */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-trail-green" />
          <h2 className="text-sm font-bold">核验覆盖率统计</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {trails.map((trail) => {
            const verifiedCount = trail.evacPoints.filter((ep) => ep.verifyStatus === 'verified').length;
            const totalCount = trail.evacPoints.length;
            const ratio = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
            return (
              <div key={trail.id} className="flex items-center gap-3">
                <span className="w-28 truncate text-xs">{trail.name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      ratio >= 90 ? 'bg-safe-green' : ratio >= 60 ? 'bg-warn-yellow' : 'bg-danger-red'
                    )}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
                <span className="font-data w-10 text-right text-xs font-bold">{ratio}%</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <ClipboardList className="h-3 w-3" />
          目标：发布资料包中已核验点位占比 ≥ 90%
        </div>
      </div>
    </div>
  );
}
