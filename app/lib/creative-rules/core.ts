// creative-rules/core.ts
// HM38 전체를 관통하는 공통 규칙 (모든 콘텐츠 유형에 항상 적용)

import { CoreRules } from "./types";

export const CORE_RULES: CoreRules = {
  absoluteRules: [
    "초반 3초 안에 스크롤을 멈추게 할 훅이 반드시 존재해야 한다.",
    "문제 제기 → 공감 → 해결 → CTA 흐름을 기본 골격으로 삼는다.",
    "광고처럼 보이지 않는 구성으로 만든다. (노골적인 판매 문구 지양)",
    "설명보다 보여주기 중심으로 구성한다.",
    "시청 유지율을 최우선으로 고려한다.",
  ],

  tones: [
    {
      id: "emotional",
      name: "감성",
      description: "여행·라이프스타일·힐링 콘텐츠에 적합. 분위기와 여운 중심.",
      enabled: true,
    },
    {
      id: "trendy",
      name: "트렌디",
      description: "젊은 타깃, 유행 아이템, 카페류에 적합. 밈·신조어 활용 가능.",
      enabled: true,
    },
    {
      id: "informative",
      name: "정보 전달",
      description: "병원, 전문 서비스, 비교/추천류에 적합. 팩트 기반, 신뢰감 우선.",
      enabled: true,
    },
    {
      id: "luxury",
      name: "럭셔리",
      description: "고급 브랜드, 프리미엄 제품에 적합. 절제되고 고급스러운 표현.",
      enabled: true,
    },
    {
      id: "humor",
      name: "유머",
      description: "친근한 브랜드, 접근성 높은 제품에 적합. 가볍고 위트 있는 전개.",
      enabled: true,
    },
  ],

  forbidden: [
    "검증되지 않은 효과·수치를 단정적으로 표현하는 과장·허위 정보",
    "'여러분', '지금 바로', '놓치지 마세요' 같은 상투적이고 뻔한 광고 문구",
    "콘텐츠 자체의 재미 없이 노골적으로 판매·홍보만 하는 문구",
  ],
};