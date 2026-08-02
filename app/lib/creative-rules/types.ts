// creative-rules/types.ts
// 여러 콘텐츠 유형(릴스, 블로그, 광고 등)이 공통으로 쓰는 타입 정의

export type RuleItem = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;

  // 확장 대비 필드 (지금은 사용하지 않지만 자리를 미리 마련해둠)
  recommendedIndustries?: string[];
  recommendedGoals?: string[];
  priority?: number;
  weight?: number;
  usageCount?: number;
  lastUsedAt?: string;
};

export type Tone = RuleItem;
export type ConceptPerspective = RuleItem;

// HM38 전체를 관통하는 "브랜드 정체성" 규칙
// → 릴스든 블로그든 광고든, 콘텐츠 유형과 무관하게 항상 적용됨
export type CoreRules = {
  absoluteRules: string[];
  tones: Tone[];
  forbidden: string[];        // 모든 콘텐츠 유형 공통 금지 사항
};

// 콘텐츠 유형(릴스, 블로그 등) 하나가 가지는 고유 규칙
export type ContentTypeRules = {
  perspectives: ConceptPerspective[];
  conceptRequirements: string[];
  storyboardRequirements: string[];
  forbidden: string[];        // 이 콘텐츠 유형에만 적용되는 금지 사항
};
