<template>
  <div class="max-w-xl mx-auto space-y-6">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-extrabold tracking-tight">Procesar nuevo video</h1>
      <p class="text-slate-400 text-sm">
        Ingresa la ruta absoluta o relativa del archivo de video en el servidor para extraer sus fotogramas e indexarlos.
      </p>
    </div>

    <form @submit.prevent="handleProcess" class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4 shadow-xl">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-300">Ruta del video</label>
        <input
          v-model="videoPath"
          type="text"
          placeholder="ej. C:/videos/demo.mp4 o /app/data/demo.mp4"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono text-sm"
        />
      </div>

      <button
        type="submit"
        :disabled="loading || !videoPath.trim()"
        class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
      >
        <span v-if="loading">Procesando video (esto puede tardar)...</span>
        <span v-else>Iniciar Procesamiento</span>
      </button>
    </form>

    <!-- Success Feedback -->
    <div v-if="successData" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl space-y-2">
      <h3 class="font-bold">¡Video procesado con éxito!</h3>
      <ul class="text-sm space-y-1">
        <li>🎬 Nombre: <span class="font-mono text-white">{{ successData.video_name }}</span></li>
        <li>🖼️ Frames procesados: <span class="font-mono text-white">{{ successData.frames_processed }}</span></li>
        <li>💾 Embeddings guardados: <span class="font-mono text-white">{{ successData.embeddings_saved }}</span></li>
      </ul>
    </div>

    <!-- Error Feedback -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { videoSearchService } from '../services/videoSearchService'
import type { ProcessVideoResponse } from '../types'

const videoPath = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const successData = ref<ProcessVideoResponse | null>(null)

const handleProcess = async () => {
  if (!videoPath.value.trim()) return

  loading.value = true
  error.value = null
  successData.value = null

  try {
    const data = await videoSearchService.processVideo(videoPath.value.trim())
    successData.value = data
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Ocurrió un error al procesar el video.'
  } finally {
    loading.value = false
  }
}
</script>
