import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description } = body;

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
let resultText = textContent && "text" in textContent ? textContent.text : "{}";

// AI가 답변을 ```json ... ``` 형태로 감싸서 줄 경우, 그 장식 기호를 제거
resultText = resultText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

return NextResponse.json(JSON.parse(resultText));
}