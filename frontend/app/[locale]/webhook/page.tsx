"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import { registerWebhook } from "@/app/action/webhook";

type Status = "idle" | "loading" | "success" | "error";

export default function Webhook() {
  const t = useTranslations("webhook");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!webhookUrl.trim()) {
      setStatus("error");
      setMessage(t("messages.urlRequired"));
      return;
    }

    // 간단한 Discord 웹훅 URL 유효성 검사
    if (!webhookUrl.includes("discord.com/api/webhooks/")) {
      setStatus("error");
      setMessage(t("messages.invalidUrl"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await registerWebhook(webhookUrl);
      setStatus("success");
      setMessage(t("messages.success"));
      setWebhookUrl("");

      // 2초 후에 기본 상태로 돌아가기
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(t("messages.serverError") + " " + error);
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
            {t("title")}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            {t("description")}
          </p>

          <div>
            <label
              htmlFor="webhookUrl"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              {t("urlLabel")}
            </label>
            <input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder={t("urlPlaceholder")}
              className="w-full py-1 border-zinc-200 dark:border-zinc-700 outline-none
                         border-b"
              disabled={status === "loading"}
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {t("urlHelp")}
            </p>
          </div>

          <button
            disabled={status === "loading"}
            className={`p-2 mt-2 font-medium cursor-pointer dark:bg-zinc-800/50 bg-zinc-100/50
               hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 rounded-lg`}
            onClick={handleSubmit}
          >
            <div className="text-white">{t("registerButton")}</div>
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
              {status === "loading" && t("status.registering")}
              {status === "success" && t("status.success")}
              {status === "error" && (message || t("status.error"))}
            </span>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              {t("setup.title")}
            </h2>
            <ol className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>1. {t("setup.steps.1")}</li>
              <li>2. {t("setup.steps.2")}</li>
              <li>3. {t("setup.steps.3")}</li>
              <li>4. {t("setup.steps.4")}</li>
              <li>5. {t("setup.steps.5")}</li>
              <li>6. {t("setup.steps.6")}</li>
              <li>7. {t("setup.steps.7")}</li>
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
