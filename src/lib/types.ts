// 数据模型定义

export interface TrailMarker {
  id: string;
  code: string; // 标距柱编号，如 YK000
  lat: number;
  lng: number;
  elevation: number;
  status: 'normal' | 'missing' | 'damaged';
}

export interface TrailSegment {
  id: string;
  startMarker: string;
  endMarker: string;
  surfaceType: 'stone' | 'dirt' | 'stairs' | 'road';
  surfaceLabel: string;
}

export interface EvacuationPoint {
  id: string;
  trailId: string;
  anchorMarker: string; // 锚定标距柱编号
  offset: number; // 偏移量(米)
  pathDescription: string; // 下撤路径描述
  evacDuration: number; // 下撤用时(分钟)
  evacDestination: string; // 下撤终点
  transitInfo: string; // 接驳信息
  riskNote?: string; // 路况风险
  condition?: string; // 适用条件
  photos: string[]; // 照片URL
  verifyStatus: 'pending' | 'verified' | 'failed';
  verifyRecord?: VerifyRecord;
  latestDeadline: string; // 建议最晚通过时间 (HH:mm)
  timeWindowStatus: 'safe' | 'caution' | 'danger';
}

export interface VerifyRecord {
  id: string;
  evacPointId: string;
  verifierName: string;
  verifyTime: string;
  photos: string[];
  pathCondition: string;
  actualDuration: number;
  transitActual: string;
  conclusion: 'pass' | 'fail';
  failReason?: string;
}

export interface TrailPack {
  id: string;
  trailId: string;
  version: number;
  publishTime: string;
  publisher: string;
  status: 'published' | 'archived';
  evacPointCount: number;
  verifiedCount: number;
}

export interface Trail {
  id: string;
  name: string;
  system: string; // 所属径系
  section: string; // 段号
  startPoint: string;
  endPoint: string;
  startMarker: string;
  endMarker: string;
  totalDistance: number; // 总距离(公里)
  totalAscent: number; // 累计爬升(米)
  totalDescent: number; // 累计下降(米)
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // 参考用时(分钟)
  markers: TrailMarker[];
  segments: TrailSegment[];
  evacPoints: EvacuationPoint[];
  packs: TrailPack[];
  coverImage?: string;
  updatedAt: string;
}

export interface UserChecklist {
  id: string;
  title: string;
  checked: boolean;
}

export type ViewMode = 'list' | 'map';
