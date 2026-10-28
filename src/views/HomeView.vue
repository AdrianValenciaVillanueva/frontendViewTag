<template>
  <div class="space-y-8">
    <!-- Hero / Search bar -->
    <div class="text-center space-y-4 max-w-2xl mx-auto">
      <h1 class="text-4xl font-extrabold tracking-tight">
        Busca dentro de tus videos con texto
      </h1>
      <p class="text-slate-400">
        Escribe lo que buscas y filtra o guarda masivamente tus fotogramas para datasets de IA.
      </p>

      <form @submit.prevent="handleSearch" class="flex gap-2 pt-2">
        <input
          v-model="query"
          type="text"
          placeholder="¿Qué quieres buscar en el video?"
          class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          <span v-if="loading">Buscando...</span>
          <span v-else>Buscar</span>
        </button>
      </form>
    </div>

    <!-- Controls / Filters for Dataset Management -->
    <div v-if="hasSearched" class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-6">
        <!-- Limit / Number of images input manual -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-slate-300 font-medium">Mostrar:</label>
          <input
            v-model.number="limit"
            type="number"
            min="1"
            max="1000"
            @change="handleSearch"
            class="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <!-- Score Filter Range with manual input -->
        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-300 font-medium flex items-center gap-1">
            Score mín (%):
            <input
              v-model.number="minScore"
              type="number"
              step="0.1"
              min="-100"
              max="100"
              class="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-blue-400 font-mono focus:outline-none focus:border-blue-500"
            />
          </label>
          <input
            v-model.number="minScore"
            type="range"
            min="-100"
            max="100"
            step="0.5"
            class="w-28 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      <!-- Bulk Save Action -->
      <div class="flex items-center gap-2">
        <input
          v-model="bulkLabel"
          type="text"
          placeholder="Etiqueta masiva"
          class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          @click="saveAllFilteredToDataset"
          :disabled="filteredResults.length === 0"
          class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          Guardar filtrados ({{ filteredResults.length }})
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
      {{ error }}
    </div>

    <!-- Success message dataset -->
    <div v-if="exportSuccess" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center">
      {{ exportSuccess }}
    </div>

    <!-- Results Section -->
    <div v-if="hasSearched" class="space-y-4">
      <div class="flex items-center justify-between text-sm text-slate-400">
        <p>Mostrando <span class="text-white font-semibold">{{ filteredResults.length }}</span> de <span class="text-white font-semibold">{{ total }}</span> resultados coincidentes</p>
      </div>

      <div v-if="filteredResults.length === 0 && !loading" class="text-center py-16 bg-slate-800/40 border border-slate-800 rounded-2xl">
        <p class="text-slate-400">No hay fotogramas que cumplan con el rango de score seleccionado.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredResults"
          :key="item.frame_id"
          class="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition shadow-lg"
        >
          <!-- Frame Image Preview -->
          <div class="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-slate-700/50">
            <img
              :src="`/api/frames/${item.video_name}/${item.frame_id}`"
              :alt="item.frame_id"
              class="w-full h-full object-cover"
              @error="(e: Event) => { (e.target as HTMLElement).style.display = 'none'; }"
            />
            <div class="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-xs font-semibold text-white">
              ⏱️ {{ formatTime(item.timestamp_seconds) }}
            </div>
            <div class="absolute top-2 right-2 bg-blue-600/90 backdrop-blur px-2 py-0.5 rounded text-xs font-mono text-white">
              {{ (item.score * 100).toFixed(1) }}%
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-medium text-slate-200 truncate text-sm" :title="item.video_name">
                🎬 {{ item.video_name }}
              </h3>
              <p class="text-xs text-slate-400 font-mono mt-1">
                {{ item.frame_id }} &bull; {{ item.timestamp_seconds }}s
              </p>
            </div>

            <div class="pt-3 border-t border-slate-700/50 flex items-center gap-2">
              <input
                v-model="labels[item.frame_id]"
                type="text"
                placeholder="Etiqueta dataset"
                class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                @click="saveToDataset(item)"
                class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
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

const query = ref('')
const limit = ref(10)
const minScore = ref(-1.5) // Por defecto en -1.5%
const maxScore = ref(100)

const results = ref<SearchResultItem[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const exportSuccess = ref<string | null>(null)
const hasSearched = ref(false)
const bulkLabel = ref('')
const labels = reactive<Record<string, string>>({})

// Filtro computado en base al rango de puntuación (-1% a 100%)
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
    
    // Inicializar etiquetas por defecto
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
