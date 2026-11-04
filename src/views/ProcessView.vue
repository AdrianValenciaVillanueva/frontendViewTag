<template>
  <div class="max-w-3xl mx-auto space-y-8 py-6 font-mono">
    <!-- Header Console Banner (Light Neo-Brutalist Theme) -->
    <div class="bg-white text-slate-900 p-6 border-2 border-slate-900 shadow-[6px_6px_0_0_#0f172a]">
      <div class="flex items-center justify-between pb-4 border-b-2 border-slate-900">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-red-500 inline-block border-2 border-slate-900"></span>
          <span class="w-3 h-3 bg-yellow-400 inline-block border-2 border-slate-900"></span>
          <span class="w-3 h-3 bg-green-500 inline-block border-2 border-slate-900"></span>
          <span class="text-xs text-slate-600 font-extrabold ml-2">ingest_node@viewtag: ~/pipeline</span>
        </div>
        <span class="text-xs px-2.5 py-1 bg-blue-600 text-white font-black uppercase tracking-widest border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]">CLI v2.4</span>
      </div>
      <div class="pt-4 space-y-2">
        <h1 class="text-xl font-black text-slate-900 flex items-center gap-2 font-sans">
          <Terminal class="w-6 h-6 text-blue-600" /> Pipeline de Ingesta y Vectorización
        </h1>
        <p class="text-xs text-slate-600 font-bold">
          Ejecuta la extracción de fotogramas y generación de embeddings SigLIP directamente en el motor Qdrant del servidor.
        </p>

        <!-- Typewriter Command Prompt Effect -->
        <div class="bg-slate-50 border-2 border-slate-900 p-3 mt-3 shadow-[3px_3px_0_0_#0f172a] flex items-center gap-2 text-xs">
          <span class="text-blue-600 font-black">$</span>
          <span class="text-slate-900 font-mono font-bold">{{ typedCommand }}</span>
          <span class="w-2 h-4 bg-blue-600 animate-pulse"></span>
        </div>
      </div>
    </div>

    <!-- Ingestion Console Form -->
    <form @submit.prevent="handleProcess" class="bg-white border-2 border-slate-900 p-8 space-y-6 shadow-[6px_6px_0_0_#0f172a]">
      <div class="space-y-3">
        <label class="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <span class="flex items-center gap-2"><FolderOpen class="w-4 h-4 text-blue-600" /> Archivo de Video Objetivo</span>
          <span class="text-[10px] text-slate-500 font-bold">Formatos: .mp4, .mov, .avi, .mkv</span>
        </label>
        <div class="flex items-center">
          <span class="bg-blue-600 text-white px-4 py-3.5 text-xs font-black border-2 border-slate-900 select-none shadow-[2px_2px_0_0_#0f172a]">$</span>
          <input
            v-model="videoPath"
            type="text"
            placeholder="/absolute/path/to/video.mp4"
            class="flex-1 bg-slate-50 border-2 border-l-0 border-slate-900 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition text-xs font-mono font-bold"
          />
        </div>
      </div>

      <div class="flex items-center justify-between pt-2">
        <div class="text-xs text-slate-700 font-mono font-bold flex items-center gap-1.5">
          <Cpu class="w-4 h-4 text-blue-600" /> Batch size: 32 frames / chunk
        </div>
        <button
          type="submit"
          :disabled="loading || !videoPath.trim()"
          class="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3.5 text-xs uppercase tracking-wider border-2 border-slate-900 transition-all duration-150 disabled:opacity-50 shadow-[4px_4px_0_0_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#0f172a] flex items-center gap-2 cursor-pointer"
        >
          <Play class="w-4 h-4 text-white fill-current" v-if="!loading" />
          <span v-if="loading" class="animate-pulse">EJECUTANDO PIPELINE...</span>
          <span v-else>INICIAR INDEXACIÓN</span>
        </button>
      </div>
    </form>

    <!-- CLI Terminal Output Log (Success) -->
    <div v-if="successData" class="bg-white border-2 border-slate-900 text-slate-900 p-6 space-y-4 shadow-[6px_6px_0_0_#0f172a]">
      <div class="flex items-center justify-between text-xs border-b-2 border-slate-900 pb-3">
        <span class="flex items-center gap-2 font-black text-emerald-700">
          <CheckCircle2 class="w-4 h-4 text-emerald-600" /> PIPELINE FINALIZADO EXITOSAMENTE
        </span>
        <span class="text-slate-500 font-mono text-[10px] font-bold">STATUS: 200 OK</span>
      </div>
      <div class="bg-slate-50 p-4 border-2 border-slate-900 text-xs font-mono space-y-1.5 text-slate-800 shadow-[3px_3px_0_0_#0f172a]">
        <div class="text-slate-500 font-bold">// Reporte de indexación Qdrant:</div>
        <div><span class="text-blue-600 font-bold">target_video:</span> "{{ successData.video_name }}"</div>
        <div><span class="text-blue-600 font-bold">frames_extracted:</span> <span class="text-amber-700 font-black">{{ successData.frames_processed }}</span></div>
        <div><span class="text-blue-600 font-bold">embeddings_indexed:</span> <span class="text-amber-700 font-black">{{ successData.embeddings_saved }}</span></div>
        <div class="text-emerald-700 pt-2 font-black">&gt; Base de vectores actualizada y lista para consultas semánticas.</div>
      </div>
    </div>

    <!-- Error Console Log -->
    <div v-if="error" class="bg-red-50 border-2 border-slate-900 text-red-900 p-5 shadow-[6px_6px_0_0_#0f172a] flex items-start gap-3 text-xs font-mono">
      <AlertCircle class="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
      <div class="space-y-1">
        <div class="font-black uppercase tracking-wider">[ERROR DE EJECUCIÓN]</div>
        <div class="font-bold">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { videoSearchService } from '../services/videoSearchService'
import type { ProcessVideoResponse } from '../types'
import { FolderOpen, Terminal, Cpu, Play, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import confetti from 'canvas-confetti'

const videoPath = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const successData = ref<ProcessVideoResponse | null>(null)

// Typewriter effect for commands
const commands = [
  './ingest --model siglip --input /data/videos/demo.mp4',
  'qdrant-cli vector-index --collection frames_v1 --batch 32',
  'viewtag-pipeline --process-video "C:/videos/sample.mp4"',
  'python -m viewtag.indexer --source ./videos/train.mov'
]
const typedCommand = ref('')
let cmdIndex = 0
let charIndex = 0
let typingTimer: any = null

const typeWriter = () => {
  const currentCmd = commands[cmdIndex]
  if (charIndex <= currentCmd.length) {
    typedCommand.value = currentCmd.substring(0, charIndex)
    charIndex++
    typingTimer = setTimeout(typeWriter, 50)
  } else {
    typingTimer = setTimeout(() => {
      charIndex = 0
      cmdIndex = (cmdIndex + 1) % commands.length
      typeWriter()
    }, 2500)
  }
}

onMounted(() => {
  typeWriter()
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
})

const handleProcess = async () => {
  if (!videoPath.value.trim()) return

  loading.value = true
  error.value = null
  successData.value = null

  try {
    const data = await videoSearchService.processVideo(videoPath.value.trim())
    successData.value = data
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Ocurrió un error al procesar el video.'
  } finally {
    loading.value = false
  }
}
</script>
