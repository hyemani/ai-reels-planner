"use client";

import { useState } from "react";

// 스토리보드는 아직 가짜 데이터 그대로 사용 (다음 단계에서 다룰 예정)
const fakeStoryboard = [
  { scene: 1, content: "도착 장면 - 설레는 표정으로 입구를 들어서는 모습" },
  { scene: 2, content: "공간 소개 - 방 안 곳곳을 훑는 카메라 워크" },
  { scene: 3, content: "하이라이트 - 가장 인상적인 순간을 강조" },
  { scene: 4, content: "마무리 - 감상 한마디와 함께 여운을 남기는 컷" },
];

type Concept = { id: number; title: string; description: string };

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"input" | "concept" | "storyboard">("input");
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      setConcepts(data.concepts);
      setStep("concept");
    } catch (error) {
      alert("콘셉트를 만드는 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConcept = (id: number) => {
    setSelectedConcept(id);
    setStep("storyboard");
  };

  return (
    <main style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>AI 릴스 기획 자동화</h1>

      <div style={{ marginTop: "20px" }}>
        <label>제품/여행 정보 제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>상세 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px", height: "120px" }}
        />
      </div>

      <button onClick={handleSubmit} disabled={isLoading} style={{ marginTop: "20px", padding: "10px 20px" }}>
        {isLoading ? "AI가 콘셉트를 만드는 중..." : "제출"}
      </button>

      {(step === "concept" || step === "storyboard") && (
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h2>콘셉트를 선택해주세요</h2>
          {concepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleSelectConcept(concept.id)}
              style={{
                border: selectedConcept === concept.id ? "2px solid #333" : "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              <strong>{concept.title}</strong>
              <p style={{ margin: "4px 0 0", color: "#666" }}>{concept.description}</p>
            </div>
          ))}
        </div>
      )}

      {step === "storyboard" && (
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h2>스토리보드</h2>
          {fakeStoryboard.map((scene) => (
            <div key={scene.scene} style={{ marginTop: "10px" }}>
              <strong>장면 {scene.scene}</strong>
              <p style={{ margin: "4px 0 0", color: "#666" }}>{scene.content}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}