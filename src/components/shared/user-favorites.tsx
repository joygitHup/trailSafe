'use client';

import Link from 'next/link';
import { trails } from '@/lib/mock-data';
import {
  Heart,
  Download,
  Clock,
  MapPin,
  Star,
  Bookmark,
  ListChecks,
  ChevronRight,
  Mountain,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulate favorited trails
const favoritedTrailIds = ['t1', 't3'];

export function UserFavorites() {
  const favoritedTrails = trails.filter((t) => favoritedTrailIds.includes(t.id));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">我的</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          收藏的资料包、下载记录与行前准备
        </p>
      </div>

      {/* Quick links */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Link
          href="/user/favorites"
          className="flex flex-col items-center gap-2 rounded-lg border border-trail-green/20 bg-trail-green/5 p-4"
        >
          <Bookmark className="h-6 w-6 text-trail-green" />
          <span className="text-xs font-medium">我的收藏</span>
          <span className="font-data text-lg font-bold">{favoritedTrails.length}</span>
        </Link>
        <Link
          href="/user/checklist"
          className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4"
        >
          <ListChecks className="h-6 w-6 text-signal-orange" />
          <span className="text-xs font-medium">行前检查</span>
          <span className="font-data text-lg font-bold">6</span>
        </Link>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4">
          <Download className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs font-medium">离线包</span>
          <span className="font-data text-lg font-bold">{favoritedTrails.length}</span>
        </div>
      </div>

      {/* Favorites list */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Heart className="h-4 w-4 text-danger-red" />
          收藏的资料包
        </h2>
        <span className="text-xs text-muted-foreground">按最近使用排序</span>
      </div>

      <div className="space-y-3">
        {favoritedTrails.map((trail) => {
          const latestPack = trail.packs[0];
          return (
            <Link
              key={trail.id}
              href={`/trails/${trail.id}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-trail-green/10 text-trail-green">
                <Mountain className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold group-hover:text-trail-green">{trail.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {trail.evacPoints.length}个下撤点
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-trail-green" />
                    {latestPack?.verifiedCount}/{latestPack?.evacPointCount}已核验
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {trail.totalDistance}km
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-safe-green/10 px-2 py-0.5 text-xs font-medium text-safe-green">
                  已下载
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Clock className="h-4 w-4 text-muted-foreground" />
          最近活动
        </h2>
        <div className="space-y-2">
          {[
            { action: '下载离线包', trail: '鲲鹏径第一段', time: '2026-11-10 08:30' },
            { action: '收藏资料包', trail: '翠微径', time: '2026-11-08 14:20' },
            { action: '查看下撤点', trail: '鲲鹏径第一段 YK006', time: '2026-11-05 09:15' },
            { action: '更新离线包', trail: '翠微径', time: '2026-10-28 16:45' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-card p-3 text-sm">
              <div>
                <span className="font-medium">{item.action}</span>
                <span className="ml-2 text-muted-foreground">{item.trail}</span>
              </div>
              <span className="font-data text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
