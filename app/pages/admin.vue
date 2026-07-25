<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">后台管理</h1>
      
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Stats bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
          <div class="bg-white p-6">
            <div class="text-xs text-gray-500">今日访问</div>
            <div class="text-3xl font-semibold mt-1">1,248</div>
          </div>
          <div class="bg-white p-6">
            <div class="text-xs text-gray-500">下载量</div>
            <div class="text-3xl font-semibold mt-1 text-emerald-600">892</div>
          </div>
          <div class="bg-white p-6">
            <div class="text-xs text-gray-500">注册用户</div>
            <div class="text-3xl font-semibold mt-1">4,567</div>
          </div>
          <div class="bg-white p-6">
            <div class="text-xs text-gray-500">反馈数量</div>
            <div class="text-3xl font-semibold mt-1">23</div>
          </div>
        </div>

        <div class="p-8">
          <h2 class="font-semibold text-lg mb-6">管理面板</h2>
          
          <div class="space-y-8">
            <!-- Product Management -->
            <div>
              <div class="uppercase text-xs font-medium tracking-widest text-gray-500 mb-4">产品管理</div>
              <div class="border border-gray-200 rounded-2xl p-6">
                <div class="flex justify-between items-center mb-4">
                  <div class="font-medium">最新版本管理</div>
                  <button class="px-6 py-2 bg-gray-900 text-white text-sm rounded-2xl">添加新版本</button>
                </div>
                <div class="text-xs text-gray-500">支持签名验证、自动更新、版本对比</div>
              </div>
            </div>

            <!-- User & Feedback -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div class="uppercase text-xs font-medium tracking-widest text-gray-500 mb-4">用户管理</div>
                <div class="border border-gray-200 rounded-2xl p-6 h-full">
                  <div class="text-sm">实时用户列表 • 最近活跃</div>
                  <div class="mt-4 text-xs bg-gray-50 p-3 rounded-xl font-mono">admin@magies.top • 最后登录：2026-07-24</div>
                </div>
              </div>
              <div>
                <div class="uppercase text-xs font-medium tracking-widest text-gray-500 mb-4">反馈 & 邮件日志</div>
                <div class="border border-gray-200 rounded-2xl p-6 h-full">
                  <div class="text-sm">邮件发送日志 • 验证码记录</div>
                  <div class="mt-4 flex gap-2">
                    <div class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs">已发送 124 次</div>
                    <div class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs">限流 7 次</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
            <div>Phase2 完整版将支持：产品列表、版本发布、用户权限、邮件模板编辑、操作审计日志。</div>
            <div class="text-blue-600 cursor-pointer">查看完整文档中心 →</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
