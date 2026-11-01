<script setup lang="ts">
const { t } = useI18n()
const imgs = ['city-night', 'neon-rain', 'coast', 'desert-road', 'ocean', 'portrait', 'waterfall', 'city-walk']
const doubled = [...imgs, ...imgs]
</script>

<template>
  <section class="py-10 sm:py-14">
    <div class="container-x mb-8 text-center">
      <span class="eyebrow">{{ t('showcase.eyebrow') }}</span>
      <h2 class="h-section mt-4">{{ t('showcase.title') }}</h2>
    </div>
    <div class="relative overflow-hidden" style="mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)">
      <div class="marquee">
        <figure v-for="(name, i) in doubled" :key="i" class="relative h-44 w-72 shrink-0 overflow-hidden rounded-2xl border sm:h-52 sm:w-80" style="border-color: var(--line)">
          <img :src="`/images/showcase/${name}.jpg`" :alt="name" loading="lazy" class="h-full w-full object-cover" />
          <figcaption class="absolute bottom-2 left-2 rounded-md px-2 py-0.5 font-mono text-[10px] text-white" style="background: rgba(0,0,0,.55)">{{ name }}.mp4</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
