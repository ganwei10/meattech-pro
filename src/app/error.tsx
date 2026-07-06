'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 将错误记录到控制台（生产环境可接入监控服务）
    console.error('页面错误:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      {/* 错误图标动画 */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <span className="absolute -right-2 -top-2 flex h-6 w-6">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-6 w-6 rounded-full bg-red-500"></span>
        </span>
      </div>

      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
        服务器开小差了
      </h1>
      <p className="mt-3 text-center text-gray-500">
        系统遇到了一些问题，请稍后重试
      </p>

      {/* 操作按钮 */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-light px-8 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重试
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition hover:border-brand-blue hover:text-brand-blue"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>

      {/* 错误摘要（仅显示摘要，不暴露敏感信息） */}
      {error.digest && (
        <p className="mt-6 text-xs text-gray-400">
          错误编号：{error.digest}
        </p>
      )}
    </div>
  );
}
