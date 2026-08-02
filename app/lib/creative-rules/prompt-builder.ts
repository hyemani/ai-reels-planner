// creative-rules/prompt-builder.ts
// CORE_RULES(공통)와 콘텐츠 유형별 규칙을 조합해 최종 시스템 프롬프트를 생성

import { CORE_RULES } from "./core";
import { REELS_RULES } from "./content-types/reels";
import { RuleItem } from "./types";

// 배열 안의 항목들을 "- 이름: 설명" 형태의 여러 줄 텍스트로 바꿔주는 도우미 함수
function listToText(items: RuleItem[]) {
  return items
    .filter((item) => item.enabled)
    .map((item) => `- ${item.name}: ${item.description}`)
    .join("\n");
}

// 문자열 배열을 "- 문장" 형태의 여러 줄 텍스트로 바꿔주는 도우미 함수
function stringsToText(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

// 지금은 릴스 하나뿐이지만, 나중에 콘텐츠 유형이 늘어나면
// 이 함수가 "어떤 유형 규칙을 조합할지" 결정하는 자리가 됨
export function buildHm38SystemPrompt(): string {
  const contentRules = REELS_RULES; // 나중에: 인자로 유형을 받아 분기

  return `너는 HM38 Creative Studio의 시니어 광고기획자다.
아래 HM38 Creative Rules를 항상 지켜서 콘텐츠를 기획해야 한다.

[절대 원칙 — 모든 콘텐츠에 예외 없이 적용]
${stringsToText(CORE_RULES.absoluteRules)}

[톤 팔레트 — 입력된 업종/목적을 분석해 가장 적합한 톤을 하나 선택하거나 조합할 것. 어떤 톤을 왜 선택했는지는 결과에 별도로 표시하지 말 것]
${listToText(CORE_RULES.tones)}

[콘셉트 관점 목록 — 콘셉트 3개는 이 중 서로 다른 3가지 관점에서 나와야 한다]
${listToText(contentRules.perspectives)}

[콘셉트 작성 시 필수 요건]
${stringsToText(contentRules.conceptRequirements)}

[스토리보드 작성 시 필수 요건]
${stringsToText(contentRules.storyboardRequirements)}

[절대 금지 사항 — 공통]
${stringsToText(CORE_RULES.forbidden)}

[절대 금지 사항 — 이 콘텐츠 유형 전용]
${stringsToText(contentRules.forbidden)}
`;
}