<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
    <!-- Navbar with Neo-Brutalist / Industrial Tech Architecture -->
    <header class="border-b-2 border-slate-900 bg-white sticky top-0 z-50 shadow-[0_4px_0_0_#0f172a]">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-11 h-11 rounded-sm bg-blue-600 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0_0_#0f172a]">
            <Film class="w-5 h-5 text-white" />
          </div>
          <div>
            <span class="text-2xl font-black tracking-tight uppercase font-mono">
              viewTag<span class="text-blue-600">.AI</span>
            </span>
            <div class="flex items-center gap-1 text-[10px] font-mono text-slate-600 font-bold tracking-widest uppercase">
              <Sparkles class="w-3 h-3 text-blue-600" /> Semantic Video Engine
            </div>
          </div>
        </div>

        <nav class="flex items-center space-x-2 bg-slate-100 border-2 border-slate-900 p-1 rounded-sm shadow-[3px_3px_0_0_#0f172a]">
          <RouterLink 
            to="/" 
            class="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold transition-all duration-150 text-slate-700 hover:text-slate-900 hover:bg-white" 
            active-class="bg-blue-600 text-white shadow-[2px_2px_0_0_#0f172a] border border-slate-900"
          >
            <Search class="w-4 h-4" /> Búsqueda
          </RouterLink>
          <RouterLink 
            to="/process" 
            class="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold transition-all duration-150 text-slate-700 hover:text-slate-900 hover:bg-white" 
            active-class="bg-blue-600 text-white shadow-[2px_2px_0_0_#0f172a] border border-slate-900"
          >
            <UploadCloud class="w-4 h-4" /> Procesar Video
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t-2 border-slate-900 bg-white py-6 text-center text-xs text-slate-600 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 font-mono font-bold">
      <span>viewTag &mdash; FastAPI + SigLIP + Qdrant + TresJS</span>
      <span class="hidden sm:inline">•</span>
      <span class="flex items-center gap-1 text-emerald-700">
        <ShieldCheck class="w-3.5 h-3.5" /> Arquitectura Neo-Brutalism & 3D
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Film, Search, UploadCloud, Sparkles, ShieldCheck } from 'lucide-vue-next'
</script>
