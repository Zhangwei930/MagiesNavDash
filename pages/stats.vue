<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">统计中心</h1>
      
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="bg-blue-50 p-6 rounded-2xl">
            <div class="text-blue-600 text-sm font-medium">总访问量</div>
            <div class="text-4xl font-bold mt-2">45,892</div>
            <div class="text-green-600 text-sm mt-1">↑ 12% 本月</div>
          </div>
          <div class="bg-emerald-50 p-6 rounded-2xl">
            <div class="text-emerald-600 text-sm font-medium">本月下载</div>
            <div class="text-4xl font-bold mt-2">1,284</div>
            <div class="text-green-600 text-sm mt-1">↑ 8%</div>
          </div>
          <div class="bg-purple-50 p-6 rounded-2xl">
            <div class="text-purple-600 text-sm font-medium">注册用户</div>
            <div class="text-4xl font-bold mt-2">8,124</div>
            <div class="text-purple-600 text-sm mt-1">↑ 5%</div>
          </div>
          <div class="bg-amber-50 p-6 rounded-2xl">
            <div class="text-amber-600 text-sm font-medium">邮件发送</div>
            <div class="text-4xl font-bold mt-2">3,456</div>
            <div class="text-amber-600 text-sm mt-1">↑ 3%</div>
          </div>
        </div>

        <!-- ECharts skeleton -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div class="text-sm font-medium mb-4">访问趋势</div>
            <div class="h-64 bg-gray-50 rounded-2xl flex items-end justify-around p-4 border border-gray-100">
              <!-- Mock chart area -->
              <div class="w-1/5 h-16 bg-blue-500 rounded-t" style="height: 20%"></div>
              <div class="w-1/5 h-16 bg-blue-500 rounded-t" style="height: 35%"></div>
              <div class="w-1/5 h-16 bg-blue-500 rounded-t" style="height: 55%"></div>
              <div class="w-1/5 h-16 bg-blue-500 rounded-t" style="height: 40%"></div>
              <div class="w-1/5 h-16 bg-blue-500 rounded-t" style="height: 28%"></div>
            </div>
          </div>
          
          <div>
            <div class="text-sm font-medium mb-4">下载 vs 注册</div>
            <div class="h-64 bg-gray-50 rounded-2xl flex items-end justify-around p-4 border border-gray-100">
              <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-emerald-400 rounded-2xl mb-2"></div>
                <div class="text-xs text-gray-500">下载</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-purple-400 rounded-2xl mb-2"></div>
                <div class="text-xs text-gray-500">注册</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 text-xs text-gray-400">
          邮件中心日志 • 下载签名统计 • 用户活跃度分析 • 后续可接入真实后端数据
        </div>
      </div>
    </div>
  </div>
</template>
