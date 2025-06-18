"use client";

import { Suspense, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { registerWebhook } from "../action/webhook";

type Status = "idle" | "loading" | "success" | "error";

export default function Webhook() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!webhookUrl.trim()) {
      setStatus("error");
      setMessage("웹훅 URL을 입력해주세요.");
      return;
    }

    // 간단한 Discord 웹훅 URL 유효성 검사
    if (!webhookUrl.includes("discord.com/api/webhooks/")) {
      setStatus("error");
      setMessage("올바른 Discord 웹훅 URL을 입력해주세요.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await registerWebhook(webhookUrl);
      setStatus("success");
      setMessage("웹훅이 성공적으로 등록되었습니다!");
      setWebhookUrl("");

      // 2초 후에 기본 상태로 돌아가기
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage("서버 오류가 발생했습니다. 다시 시도해주세요. " + error);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Suspense>
        <Header />
      </Suspense>
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto flex flex-col">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Discord 웹훅 등록
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            새로운 글이 업로드될 때 Discord 채널로 알림을 받으세요.
          </p>

          <div>
            <label
              htmlFor="webhookUrl"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Discord 웹훅 URL
            </label>
            <input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full py-1 border-zinc-200 dark:border-zinc-700 outline-none
                         border-b"
              disabled={status === "loading"}
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Discord 서버 설정 → 연동 → 웹훅에서 웹훅 URL을 복사하여
              붙여넣으세요.
            </p>
          </div>

          <button
            disabled={status === "loading"}
            className={`p-2 mt-2 font-medium cursor-pointer dark:bg-zinc-800/50 bg-zinc-100/50
               hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 rounded-lg`}
            onClick={handleSubmit}
          >
            <div className="text-white">웹훅 등록하기</div>
          </button>
          <div className="flex items-center gap-2 text-sm mt-1">
            {status === "loading" && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === "success" && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {status === "error" && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>
              {status === "loading" && "등록 중..."}
              {status === "success" && "등록 완료!"}
              {status === "error" && (message || "등록 실패")}
            </span>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              웹훅 설정 방법
            </h2>
            <ol className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>1. Discord 서버에서 웹훅을 받을 채널로 이동</li>
              <li>2. 채널 설정 (톱니바퀴 아이콘) 클릭</li>
              <li>3. 좌측 메뉴에서 "연동" 선택</li>
              <li>4. "웹훅" 탭으로 이동</li>
              <li>5. "새 웹훅" 버튼 클릭</li>
              <li>6. 웹훅 이름 설정 후 "웹훅 URL 복사" 클릭</li>
              <li>7. 복사한 URL을 위 입력창에 붙여넣기</li>
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
