'use client';

import Link from 'next/link';
import {
  ChevronLeft,
  Check,
  Square,
  RotateCcw,
  Backpack,
  Smartphone,
  Battery,
  Droplets,
  Map,
  Cross,
  Sun,
  Flashlight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: typeof Check;
  category: 'gear' | 'tech' | 'safety';
}

const defaultItems: ChecklistItem[] = [
  { id: '1', title: '防滑徒步鞋', description: '确认鞋底纹路清晰，抓地力良好', icon: Backpack, category: 'gear' },
  { id: '2', title: '离线轨迹已下载', description: 'GPX文件已导入导航App', icon: Map, category: 'tech' },
  { id: '3', title: '手机电量充足', description: '建议电量 > 80%，携带充电宝', icon: Battery, category: 'tech' },
  { id: '4', title: '饮用水', description: '至少1.5L，高温天气加倍', icon: Droplets, category: 'gear' },
  { id: '5', title: '下撤点信息已记忆', description: '记住最近2-3个下撤点标距柱编号', icon: Map, category: 'tech' },
  { id: '6', title: '急救包', description: '创可贴、绷带、消毒液、个人药品', icon: Cross, category: 'safety' },
  { id: '7', title: '防晒装备', description: '帽子、防晒霜、太阳镜', icon: Sun, category: 'gear' },
  { id: '8', title: '头灯/手电', description: '即使计划白天完成，也建议携带', icon: Flashlight, category: 'safety' },
  { id: '9', title: '离线资料包已下载', description: '下撤点清单、接驳信息PDF', icon: Smartphone, category: 'tech' },
  { id: '10', title: '告知他人行程', description: '将路线计划和预计返回时间告知家人/朋友', icon: Check, category: 'safety' },
];

const categoryLabels: Record<string, string> = {
  gear: '装备',
  tech: '技术准备',
  safety: '安全',
};

export function PreHikeChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hike-checklist');
      if (saved) {
        setCheckedItems(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('hike-checklist', JSON.stringify([...next]));
      return next;
    });
  };

  const resetAll = () => {
    setCheckedItems(new Set());
    localStorage.removeItem('hike-checklist');
  };

  const totalItems = defaultItems.length;
  const checkedCount = checkedItems.size;
  const progress = Math.round((checkedCount / totalItems) * 100);

  // Group by category
  const grouped = defaultItems.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/user/favorites" className="flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          我的
        </Link>
        <span>/</span>
        <span className="text-foreground">行前检查单</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">行前检查单</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            出发前逐项确认，确保安全准备充分
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重置
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">完成进度</span>
          <span className="font-data text-sm font-bold">
            {checkedCount}/{totalItems}
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              progress === 100 ? 'bg-safe-green' : 'bg-trail-green'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {progress === 100
            ? '所有检查项已完成，祝徒步愉快！'
            : `还有 ${totalItems - checkedCount} 项待确认`}
        </p>
      </div>

      {/* Checklist groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {categoryLabels[category]}
            </h2>
            <div className="space-y-1.5">
              {items.map((item) => {
                const isChecked = checkedItems.has(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                      isChecked
                        ? 'border-safe-green/20 bg-safe-green/5'
                        : 'border-border bg-card hover:bg-secondary/50'
                    )}
                  >
                    <div className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors',
                      isChecked ? 'bg-safe-green text-white' : 'border border-border text-muted-foreground'
                    )}>
                      {isChecked ? <Check className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </div>
                    <Icon className={cn(
                      'h-4 w-4 shrink-0',
                      isChecked ? 'text-safe-green' : 'text-muted-foreground'
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        'text-sm font-medium',
                        isChecked && 'text-safe-green line-through'
                      )}>
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
