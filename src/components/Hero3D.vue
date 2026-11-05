<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'

const props = defineProps<{
  loading?: boolean
}>()

const modelRef = shallowRef()
let animationFrameId: number

onMounted(() => {
  let elapsed = 0
  const animate = () => {
    elapsed += 0.016
    if (modelRef.value) {
      // Si está cargando, gira a alta velocidad; si no, giro suave
      const rotationSpeed = props.loading ? 0.08 : 0.01
      modelRef.value.rotation.y += rotationSpeed
    }
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="h-64 w-full relative overflow-hidden rounded-none bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#0f172a]">
    <TresCanvas clear-color="#f8fafc" antialias>
      <TresPerspectiveCamera :position="[0, 1, 4]" :fov="50" />
      <OrbitControls :enable-zoom="false" :enable-pan="false" />
      
      <TresAmbientLight :intensity="2.5" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="3.5" />
      <TresPointLight :position="[-5, -5, -2]" :intensity="2" color="#3b82f6" />

      <!-- Modelo 3D de la mascota (Pato GLB) -->
      <Suspense>
        <GLTFModel 
          ref="modelRef" 
          path="/models/pato.glb" 
          :scale="[1, 1, 1]" 
          :position="[0, -0.5, 0]" 
        />
      </Suspense>
    </TresCanvas>

    <div class="absolute bottom-3 left-4 pointer-events-none flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1 shadow-[3px_3px_0_0_#0f172a]">
      <span class="w-2.5 h-2.5 bg-blue-600 border border-slate-900 animate-pulse"></span>
      <span class="text-xs font-mono text-slate-900 tracking-wider font-black uppercase">
        {{ loading ? 'MASCOTA: BUSCANDO (GIRANDO)...' : 'MASCOTA: LISTA' }}
      </span>
    </div>
  </div>
</template>
