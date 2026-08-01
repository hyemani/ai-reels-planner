"use client";

import { useState } from "react";

// 가짜 콘셉트 데이터 (나중에 진짜 AI 결과로 교체할 부분)
const fakeConcepts = [
  { id: 1, title: "감성 브이로그형", description: "잔잔한 음악과 함께 여행의 분위기를 느긋하게 보여주는 콘셉트" },
  { id: 2, title: "정보 전달형", description: "핵심 포인트를 자막으로 빠르게 짚어주는 정보성 콘셉트" },
  { id: 3, title: "비포/애프터형", description: "기대와 실제 경험을 비교하며 반전 매력을 보여주는 콘셉트" },
];

// 가짜 스토리보드 데이터 (나중에 진짜 AI 결과로 교체할 부분)
const fakeStoryboard = [
  { scene: 1, content: "도착 장면 - 설레는 표정으로 입구를 들어서는 모습" },
  { scene: 2, content: "공간 소개 - 방 안 곳곳을 훑는 카메라 워크" },
  { scene: 3, content: "하이라이트 - 가장 인상적인 순간을 강조" },
  { scene: 4, content: "마무리 - 감상 한마디와 함께 여운을 남기는 컷" },
];

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"input" | "concept" | "storyboard">("input");
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  const handleSubmit = () => {
    setStep("concept");
  };

  const handleSelectConcept = (id: number) => {
    setSelectedConcept(id);
    setStep("storyboard");
  };

  return (
    <main style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>AI 릴스 기획 자동화</h1>

      {/* 입력 폼 영역 */}
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

      <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px 20px" }}>
        제출
      </button>

      {/* 콘셉트 영역 - step이 "concept" 또는 "storyboard"일 때만 보임 */}
      {(step === "concept" || step === "storyboard") && (
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h2>콘셉트를 선택해주세요</h2>
          {fakeConcepts.map((concept) => (
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

      {/* 스토리보드 영역 - step이 "storyboard"일 때만 보임 */}
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