<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
    <!-- Navbar -->
    <header class="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            viewTag
          </span>
          <span class="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Semantic Video Search
          </span>
        </div>
        <nav class="flex items-center space-x-6 text-sm font-medium">
          <RouterLink to="/" class="hover:text-blue-400 transition" active-class="text-blue-400">
            🔍 Búsqueda
          </RouterLink>
          <RouterLink to="/process" class="hover:text-blue-400 transition" active-class="text-blue-400">
            📤 Procesar Video
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
      viewTag &mdash; Impulsado por FastAPI, SigLIP y Qdrant
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
