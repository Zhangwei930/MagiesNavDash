<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">下载中心</h1>
      
      <div class="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          <div>
            <div class="uppercase text-blue-600 text-sm font-medium tracking-widest mb-2">最新稳定版</div>
            <div class="text-5xl font-bold">Magies Hub v1.0</div>
            <div class="text-emerald-600 font-medium">签名验证已启用 • 2026-07-24</div>
          </div>
          <button @click="downloadProduct" class="px-12 py-5 bg-black text-white rounded-2xl text-xl font-semibold hover:bg-gray-900 active:scale-95 transition-all flex items-center gap-4">
            立即下载
            <span class="text-3xl">↓</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div class="bg-gray-50 p-6 rounded-2xl">
            <div class="font-medium mb-3">签名文件</div>
            <div class="font-mono bg-white p-3 rounded-xl text-xs break-all">magies-hub-v1.0.sig</div>
          </div>
          <div class="bg-gray-50 p-6 rounded-2xl">
            <div class="font-medium mb-3">支持平台</div>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div class="bg-white p-3 rounded-xl text-center">🪟 Windows</div>
              <div class="bg-white p-3 rounded-xl text-center"> macOS</div>
              <div class="bg-white p-3 rounded-xl text-center">🐧 Linux</div>
            </div>
          </div>
          <div class="bg-gray-50 p-6 rounded-2xl">
            <div class="font-medium mb-3">统计</div>
            <div class="text-2xl font-semibold text-emerald-600">12.8k</div>
            <div class="text-xs text-gray-500">次本月下载</div>
          </div>
        </div>

        <div class="mt-10 text-xs text-gray-400 border-t border-gray-100 pt-6">
          签名验证使用私钥保护 • 任何修改将导致下载失败 • 详情请参阅产品文档
        </div>
      </div>

      <div class="mt-12 text-center text-sm text-gray-500">
        <button @click="backToHome" class="hover:text-blue-600 underline">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const downloadProduct = () => {
  alert('下载请求已模拟发送（Phase1 完整版）\n实际集成后将触发签名验证流程。')
}

const backToHome = () => {
  router.push('/')
}
</script>
