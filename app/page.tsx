"use client";

import { useState } from "react";

type Concept = { id: number; title: string; description: string };
type Scene = { scene: number; content: string };

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"input" | "concept" | "storyboard">("input");
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [storyboard, setStoryboard] = useState<Scene[]>([]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const [isLoadingStoryboard, setIsLoadingStoryboard] = useState(false);

  const handleSubmit = async () => {
    setIsLoadingConcepts(true);
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
      setIsLoadingConcepts(false);
    }
  };

  const handleSelectConcept = async (concept: Concept) => {
    setSelectedConcept(concept.id);
    setIsLoadingStoryboard(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "storyboard",
          title,
          description,
          conceptTitle: concept.title,
          conceptDescription: concept.description,
        }),
      });
      const data = await response.json();
      setStoryboard(data.storyboard);
      setStep("storyboard");
    } catch (error) {
      alert("스토리보드를 만드는 중 문제가 생겼어요. 다시 시도해주세요.");
    } finally {
      setIsLoadingStoryboard(false);
    }
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

      <button onClick={handleSubmit} disabled={isLoadingConcepts} style={{ marginTop: "20px", padding: "10px 20px" }}>
        {isLoadingConcepts ? "AI가 콘셉트를 만드는 중..." : "제출"}
      </button>

      {(step === "concept" || step === "storyboard") && (
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h2>콘셉트를 선택해주세요</h2>
          {concepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleSelectConcept(concept)}
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
          {isLoadingStoryboard && <p style={{ marginTop: "10px", color: "#666" }}>AI가 스토리보드를 만드는 중...</p>}
        </div>
      )}

      {step === "storyboard" && (
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h2>스토리보드</h2>
          {storyboard.map((scene) => (
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