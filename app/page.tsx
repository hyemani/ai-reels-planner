"use client";

import { useState } from "react";
import { supabase } from "./supabase";
import type { StoryboardScene } from "./api/generate/route";

type Concept = { id: number; title: string; description: string };

// 화면에 표시할 때는 혹시 모를 구버전 데이터({ scene, content })도 함께 받을 수 있게 함
type SceneItem = StoryboardScene & { content?: string };

// 라벨 텍스트와, 그 값을 SceneItem에서 어떻게 꺼낼지 정의
const SCENE_FIELDS: { key: keyof SceneItem; label: string }[] = [
  { key: "visual", label: "화면" },
  { key: "camera", label: "촬영" },
  { key: "action", label: "행동" },
  { key: "caption", label: "자막" },
  { key: "narration", label: "나레이션" },
  { key: "sound", label: "BGM/효과음" },
  { key: "transition", label: "전환" },
  { key: "productionMethod", label: "제작 방식" },
  { key: "difficulty", label: "난이도" },
];

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"input" | "concept" | "storyboard">("input");
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [storyboard, setStoryboard] = useState<SceneItem[]>([]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const [isLoadingStoryboard, setIsLoadingStoryboard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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
    setSelectedConcept(concept);
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

  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const { error } = await supabase.from("projects").insert({
        title,
        description,
        concept: JSON.stringify(selectedConcept),
        storyboard: JSON.stringify(storyboard),
      });
      if (error) throw error;
      setSaveMessage("저장됐어요!");
    } catch (error) {
      setSaveMessage("저장 중 문제가 생겼어요.");
    } finally {
      setIsSaving(false);
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
                border: selectedConcept?.id === concept.id ? "2px solid #333" : "1px solid #ccc",
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

          {storyboard.map((scene) => {
            // 구조화된 필드가 하나도 없고 content(구버전)만 있는 경우를 위한 대비
            const hasStructuredData = SCENE_FIELDS.some((field) => scene[field.key]);

            return (
              <div
                key={scene.scene}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "16px",
                  marginTop: "16px",
                }}
              >
                {/* 카드 상단: 장면 번호 · 시간 · 목적 */}
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  장면 {scene.scene}
                  {scene.time && ` · ${scene.time}`}
                </div>
                {scene.purpose && (
                  <div style={{ marginTop: "4px", color: "#888", fontSize: "14px" }}>
                    목적: {scene.purpose}
                  </div>
                )}

                {/* 구조화된 항목들을 한 줄씩, 값이 있을 때만 표시 */}
                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {SCENE_FIELDS.map(
                    (field) =>
                      scene[field.key] && (
                        <div key={String(field.key)} style={{ fontSize: "14px", lineHeight: "1.5" }}>
                          <strong>{field.label}:</strong> {String(scene[field.key])}
                        </div>
                      )
                  )}

                  {/* 구버전 데이터 대비: 구조화된 값이 없고 content만 있으면 그거라도 표시 */}
                  {!hasStructuredData && scene.content && (
                    <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#666" }}>
                      {scene.content}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button onClick={handleSaveProject} disabled={isSaving} style={{ marginTop: "20px", padding: "10px 20px" }}>
            {isSaving ? "저장하는 중..." : "프로젝트 저장"}
          </button>
          {saveMessage && <p style={{ marginTop: "10px" }}>{saveMessage}</p>}
        </div>
      )}
    </main>
  );
}