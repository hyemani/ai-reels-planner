import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildHm38SystemPrompt } from "../../lib/creative-rules/prompt-builder";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 스토리보드 한 장면의 구조 (page.tsx에서도 이 타입을 가져다 씀)
// 대부분의 필드에 ?를 붙인 이유: 장면마다 해당 없는 항목(예: 나레이션 없음)은
// Claude가 아예 필드를 생략하고 응답할 수 있고, 화면에서도 없는 항목은 숨겨야 하기 때문
export type StoryboardScene = {
  scene: number;
  time?: string;
  purpose?: string;
  visual?: string;
  camera?: string;
  action?: string;
  caption?: string;
  narration?: string;
  sound?: string;
  transition?: string;
  productionMethod?: string;
  difficulty?: string;
};

function extractJson(text: string) {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { mode, title, description, conceptTitle, conceptDescription } = body;

  if (mode === "storyboard") {
    // 스토리보드 생성 요청
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      system: buildHm38SystemPrompt(),
      messages: [
        {
          role: "user",
          content: `아래 제품/여행 정보와 선택된 콘셉트를 바탕으로, 릴스 스토리보드를 만들어줘.

제목: ${title}
설명: ${description}
선택된 콘셉트: ${conceptTitle} - ${conceptDescription}

반드시 아래 JSON 형식으로만 답변해줘. 다른 설명 문장은 절대 포함하지 마.
각 필드는 해당 장면에 실제로 필요한 경우에만 채우고, 해당 없는 필드는 아예 생략해도 된다.
(예: 나레이션이 없는 장면이면 narration 필드 자체를 넣지 않아도 됨)

{
  "storyboard": [
    {
      "scene": 1,
      "time": "0~3초",
      "purpose": "훅",
      "visual": "화면에 무엇이 보이는지",
      "camera": "촬영 구도 및 카메라 움직임",
      "action": "등장인물의 행동과 표정",
      "caption": "화면 자막",
      "narration": "나레이션 (없으면 필드 생략)",
      "sound": "효과음/BGM 분위기",
      "transition": "전환 및 편집 효과",
      "productionMethod": "직접 촬영 또는 AI 생성 추천",
      "difficulty": "구현 난이도"
    }
  ]
}`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    const resultText = textContent && "text" in textContent ? textContent.text : "{}";
    return NextResponse.json(extractJson(resultText));
  }

  // 기본값: 콘셉트 생성 요청
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: buildHm38SystemPrompt(),
    messages: [
      {
        role: "user",
        content: `아래 제품/여행 정보를 바탕으로, 릴스(짧은 영상) 콘셉트 3가지를 제안해줘.

제목: ${title}
설명: ${description}

반드시 아래 JSON 형식으로만 답변해줘. 다른 설명 문장은 절대 포함하지 마.

{
  "concepts": [
    { "id": 1, "title": "콘셉트 제목", "description": "콘셉트 설명 (한 문장)" },
    { "id": 2, "title": "콘셉트 제목", "description": "콘셉트 설명 (한 문장)" },
    { "id": 3, "title": "콘셉트 제목", "description": "콘셉트 설명 (한 문장)" }
  ]
}`,
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === "text");
  const resultText = textContent && "text" in textContent ? textContent.text : "{}";
  return NextResponse.json(extractJson(resultText));
}