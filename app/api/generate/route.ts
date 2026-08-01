import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `아래 제품/여행 정보와 선택된 콘셉트를 바탕으로, 릴스 스토리보드(장면 4개)를 만들어줘.

제목: ${title}
설명: ${description}
선택된 콘셉트: ${conceptTitle} - ${conceptDescription}

반드시 아래 JSON 형식으로만 답변해줘. 다른 설명 문장은 절대 포함하지 마.

{
  "storyboard": [
    { "scene": 1, "content": "장면 설명" },
    { "scene": 2, "content": "장면 설명" },
    { "scene": 3, "content": "장면 설명" },
    { "scene": 4, "content": "장면 설명" }
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