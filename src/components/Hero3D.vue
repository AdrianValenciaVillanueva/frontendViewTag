<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'
</script>

<template>
  <div class="h-64 w-full relative overflow-hidden rounded-none bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#0f172a]">
    <TresCanvas clear-color="#f8fafc" antialias>
      <TresPerspectiveCamera :position="[5, 0, 5]" :fov="45" />
      <OrbitControls :enable-zoom="false" :enable-pan="false" />
      
      <TresAmbientLight :intensity="2" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="3" />

      <!-- Cargando modelo GLB -->
      <Suspense>
        <GLTFModel path="/models/pato.glb" :scale="[.15, .15, .15]" :position="[0, -1.5, 0]" />
      </Suspense>
    </TresCanvas>

    <div class="absolute bottom-3 left-4 pointer-events-none flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1 shadow-[3px_3px_0_0_#0f172a]">
      <span class="w-2.5 h-2.5 bg-blue-600 border border-slate-900 animate-pulse"></span>
      <span class="text-xs font-mono text-slate-900 tracking-wider font-black uppercase">にわとり by Kenta Imai [CC-BY] via Poly Pizza</span>
    </div>
  </div>
</template>