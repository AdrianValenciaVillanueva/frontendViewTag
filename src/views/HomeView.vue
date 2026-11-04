<template>
  <div class="space-y-10">
    <!-- Hero Section with 3D Canvas + Search -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-7 space-y-6 text-left">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-blue-100 border-2 border-slate-900 text-blue-900 text-xs font-mono font-extrabold shadow-[3px_3px_0_0_#0f172a]">
          <Sparkles class="w-3.5 h-3.5 text-blue-700" /> Búsqueda Semántica Vectorial de Fotogramas
        </div>
        <h1 class="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 font-sans">
          Encuentra cualquier instante en tus videos con <span class="bg-blue-600 text-white px-2 py-1 inline-block border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]">IA Avanzada</span>
        </h1>
        <p class="text-slate-700 text-base leading-relaxed font-medium">
          Escribe lo que buscas en lenguaje natural, filtra con precisión milimétrica y exporta tus datasets listos para entrenar modelos de IA.
        </p>

        <!-- Search Form -->
        <form @submit.prevent="handleSearch" class="flex flex-col sm:flex-row gap-3 pt-2">
          <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              v-model="query"
              type="text"
              placeholder="Ej. Persona usando laptop en una oficina..."
              class="w-full bg-white border-2 border-slate-900 rounded-none pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-blue-600 transition shadow-[4px_4px_0_0_#0f172a] font-bold text-base"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-none border-2 border-slate-900 transition-all duration-150 disabled:opacity-50 shadow-[4px_4px_0_0_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center gap-2 min-w-[140px] cursor-pointer"
          >
            <Search class="w-5 h-5" v-if="!loading" />
            <span v-if="loading" class="animate-pulse">Buscando...</span>
            <span v-else>Buscar</span>
          </button>
        </form>
      </div>

      <!-- 3D Interactive Component in Hero -->
      <div class="lg:col-span-5">
        <Hero3D />
      </div>
    </div>

    <!-- Controls / Filters for Dataset Management -->
    <div v-if="hasSearched" class="bg-white border-2 border-slate-900 rounded-none p-6 shadow-[6px_6px_0_0_#0f172a] flex flex-wrap items-center justify-between gap-6 transition-all">
      <div class="flex flex-wrap items-center gap-6">
        <!-- Limit / Number of images input manual -->
        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-900 font-bold flex items-center gap-1.5">
            <Sliders class="w-4 h-4 text-blue-600" /> Mostrar:
          </label>
          <input
            v-model.number="limit"
            type="number"
            min="1"
            max="1000"
            @change="handleSearch"
            class="w-24 bg-slate-50 border-2 border-slate-900 rounded-none px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-600 shadow-[2px_2px_0_0_#0f172a]"
          />
        </div>

        <!-- Score Filter Range with manual input -->
        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-900 font-bold flex items-center gap-2">
            Score mín (%):
            <input
              v-model.number="minScore"
              type="number"
              step="0.1"
              min="-100"
              max="100"
              class="w-20 bg-slate-50 border-2 border-slate-900 rounded-none px-2 py-1.5 text-xs text-blue-700 font-mono font-bold focus:outline-none focus:border-blue-600 text-center shadow-[2px_2px_0_0_#0f172a]"
            />
          </label>
          <input
            v-model.number="minScore"
            type="range"
            min="-100"
            max="100"
            step="0.5"
            class="w-32 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      <!-- Bulk Save Action -->
      <div class="flex items-center gap-3">
        <input
          v-model="bulkLabel"
          type="text"
          placeholder="Etiqueta masiva"
          class="bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-bold shadow-[2px_2px_0_0_#0f172a]"
        />
        <button
          @click="saveAllFilteredToDataset"
          :disabled="filteredResults.length === 0 || loading"
          class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 rounded-none border-2 border-slate-900 transition-all shadow-[4px_4px_0_0_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#0f172a] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <Download class="w-4 h-4" /> Guardar filtrados ({{ filteredResults.length }})
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="bg-red-100 border-2 border-slate-900 text-red-900 p-5 rounded-none shadow-[4px_4px_0_0_#0f172a] flex items-center gap-3 font-bold">
      <AlertCircle class="w-5 h-5 shrink-0 text-red-600" />
      <span>{{ error }}</span>
    </div>

    <!-- Success message dataset -->
    <div v-if="exportSuccess" class="bg-emerald-100 border-2 border-slate-900 text-emerald-900 p-5 rounded-none shadow-[4px_4px_0_0_#0f172a] flex items-center gap-3 font-bold">
      <CheckCircle2 class="w-5 h-5 shrink-0 text-emerald-600" />
      <span>{{ exportSuccess }}</span>
    </div>

    <!-- Results Section -->
    <div v-if="hasSearched" class="space-y-6">
      <div class="flex items-center justify-between text-sm text-slate-700 px-2 font-bold">
        <p>Mostrando <span class="text-slate-950 font-black">{{ filteredResults.length }}</span> de <span class="text-slate-950 font-black">{{ total }}</span> resultados coincidentes</p>
      </div>

      <div v-if="filteredResults.length === 0 && !loading" class="text-center py-20 bg-white border-2 border-slate-900 rounded-none shadow-[6px_6px_0_0_#0f172a] space-y-3">
        <Film class="w-12 h-12 text-slate-400 mx-auto" />
        <p class="text-slate-700 font-bold">No hay fotogramas que cumplan con el rango de score seleccionado.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredResults"
          :key="item.frame_id"
          class="bg-white border-2 border-slate-900 rounded-none overflow-hidden flex flex-col justify-between shadow-[5px_5px_0_0_#0f172a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all duration-150 group"
        >
          <!-- Frame Image Preview -->
          <div class="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center border-b-2 border-slate-900">
            <img
              :src="`/api/frames/${item.video_name}/${item.frame_id}`"
              :alt="item.frame_id"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              @error="(e: Event) => { (e.target as HTMLElement).style.display = 'none'; }"
            />
            <div class="absolute bottom-3 left-3 bg-white border-2 border-slate-900 px-2.5 py-1 rounded-none text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-[2px_2px_0_0_#0f172a]">
              <Clock class="w-3.5 h-3.5 text-blue-600" /> {{ formatTime(item.timestamp_seconds) }}
            </div>
            <div class="absolute top-3 right-3 bg-blue-600 border-2 border-slate-900 px-2.5 py-1 rounded-none text-xs font-mono font-black text-white shadow-[2px_2px_0_0_#0f172a]">
              {{ (item.score * 100).toFixed(1) }}%
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white">
            <div>
              <h3 class="font-extrabold text-slate-900 truncate text-sm flex items-center gap-2" :title="item.video_name">
                <Film class="w-4 h-4 text-blue-600 shrink-0" /> {{ item.video_name }}
              </h3>
              <p class="text-xs text-slate-600 font-mono mt-1.5 font-bold">
                ID: {{ item.frame_id }} &bull; {{ item.timestamp_seconds }}s
              </p>
            </div>

            <div class="pt-3 border-t-2 border-slate-900 flex items-center gap-2">
              <input
                v-model="labels[item.frame_id]"
                type="text"
                placeholder="Etiqueta dataset"
                class="flex-1 bg-slate-50 border-2 border-slate-900 rounded-none px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-bold shadow-[2px_2px_0_0_#0f172a]"
              />
              <button
                @click="saveToDataset(item)"
                class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-none border-2 border-slate-900 transition-all shadow-[2px_2px_0_0_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { videoSearchService } from '../services/videoSearchService'
import type { SearchResultItem } from '../types'
import Hero3D from '../components/Hero3D.vue'
import { Search, Sliders, Download, Sparkles, Clock, Film, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import confetti from 'canvas-confetti'

const query = ref('')
const limit = ref(10)
const minScore = ref(-1.5)
const maxScore = ref(100)

const results = ref<SearchResultItem[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const exportSuccess = ref<string | null>(null)
const hasSearched = ref(false)
const bulkLabel = ref('')
const labels = reactive<Record<string, string>>({})

const filteredResults = computed(() => {
  return results.value.filter((item) => {
    const scorePercent = item.score * 100
    return scorePercent >= minScore.value && scorePercent <= maxScore.value
  })
})

const handleSearch = async () => {
  if (!query.value.trim()) return

  loading.value = true
  error.value = null
  exportSuccess.value = null
  hasSearched.value = true

  try {
    const data = await videoSearchService.search(query.value, limit.value, 0)
    results.value = data.results
    total.value = data.total
    
    data.results.forEach((item) => {
      if (!labels[item.frame_id]) {
        labels[item.frame_id] = query.value.trim()
      }
    })
    if (!bulkLabel.value) {
      bulkLabel.value = query.value.trim()
    }
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Ocurrió un error al realizar la búsqueda.'
    results.value = []
  } finally {
    loading.value = false
  }
}

const saveToDataset = async (item: SearchResultItem) => {
  const label = labels[item.frame_id] || query.value.trim()
  if (!label) {
    alert('Por favor ingresa una etiqueta válida.')
    return
  }

  try {
    const res = await videoSearchService.exportDataset({
      video_name: item.video_name,
      frame_id: item.frame_id,
      label: label,
    })
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
    exportSuccess.value = `¡Fotograma guardado en el dataset bajo la etiqueta "${res.label}"!`
    setTimeout(() => {
      exportSuccess.value = null
    }, 4000)
  } catch (err: any) {
    alert(err.response?.data?.detail || 'Error al guardar en el dataset.')
  }
}

const saveAllFilteredToDataset = async () => {
  const label = bulkLabel.value.trim() || query.value.trim()
  if (!label) {
    alert('Por favor ingresa una etiqueta masiva válida.')
    return
  }

  if (filteredResults.value.length === 0) {
    alert('No hay imágenes filtradas para guardar.')
    return
  }

  loading.value = true
  try {
    let savedCount = 0
    for (const item of filteredResults.value) {
      await videoSearchService.exportDataset({
        video_name: item.video_name,
        frame_id: item.frame_id,
        label: label,
      })
      savedCount++
    }
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
    exportSuccess.value = `¡Se han guardado ${savedCount} imágenes en el dataset bajo la etiqueta "${label}"!`
  } catch (err: any) {
    alert(err.response?.data?.detail || 'Error al realizar el guardado masivo.')
  } finally {
    loading.value = false
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(1)
  return `${mins}m ${secs}s`
}
</script>
