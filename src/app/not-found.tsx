import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      {/* 大标题 404 渐变色 */}
      <h1 className="bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-orange bg-clip-text text-[8rem] font-black leading-none text-transparent sm:text-[10rem]">
        404
      </h1>

      {/* 副标题 */}
      <h2 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">
        页面走丢了
      </h2>
      <p className="mt-3 text-center text-gray-500">
        您访问的页面不存在或已被移动
      </p>

      {/* 搜索框 */}
      <form action="/search" method="GET" className="mt-8 w-full max-w-md">
        <div className="flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-brand-blue">
          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            placeholder="搜索工艺、配方、中试..."
            className="flex-1 border-none bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="flex-shrink-0 rounded-full bg-brand-blue px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-blue-light"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 快捷链接卡片 */}
      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/"
          className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-brand-blue-light hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl transition group-hover:bg-blue-100">
            🏠
          </div>
          <h3 className="mt-3 font-semibold text-gray-800">首页</h3>
          <p className="mt-1 text-xs text-gray-500">返回平台主页</p>
        </Link>

        <Link
          href="/tool"
          className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-brand-blue-light hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl transition group-hover:bg-red-100">
            🗺️
          </div>
          <h3 className="mt-3 font-semibold text-gray-800">中试地图</h3>
          <p className="mt-1 text-xs text-gray-500">查看共享中试产线</p>
        </Link>

        <Link
          href="/community"
          className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-brand-blue-light hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl transition group-hover:bg-green-100">
            💬
          </div>
          <h3 className="mt-3 font-semibold text-gray-800">工艺问答社区</h3>
          <p className="mt-1 text-xs text-gray-500">向同行提问交流</p>
        </Link>
      </div>

      {/* 返回首页按钮 */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-light px-8 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回首页
      </Link>
    </div>
  );
}
