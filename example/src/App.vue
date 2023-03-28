<script setup lang="ts">
import { reactive } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { nanoid } from 'nanoid'
import Demo from './components/Demo.vue'
import type { IllestWaveformProps } from '../../src/types/waveform'
import SunIcon from '@/components/icons/Sun.vue'
import MoonIcon from '@/components/icons/Moon.vue'

type Props = {
  id: string
} & IllestWaveformProps

const isDark = useDark()
const toggleDark = useToggle(isDark)

const items = reactive<Props[]>([
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-1.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-2.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-3.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-4.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-5.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-6.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-7.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-8.mp3`,
  },
  {
    id: nanoid(),
    url: `${import.meta.env.BASE_URL}audios/loop-9.mp3`,
  },
])
</script>

<template>
  <section class="flex flex-col items-center">
    <h1 class="flex flex-col items-center mt-2 mb-5">
      <img src="/favicon.svg" class="w-32 h-32" />

      <span class="ml-1 font-black text-[20px]">
        <span class="text-[24px]">1</span>LLEST-WAVEFORM-PLUGIN
      </span>
    </h1>

    <div class="mb-6">
      <button class="btn" @click="toggleDark()">
        <SunIcon v-show="!isDark" />
        <MoonIcon v-show="isDark" />
        <div>{{ isDark ? 'dark' : 'light' }}</div>
      </button>
    </div>

    <Demo v-for="item in items" :key="item.id" :props="item" />
  </section>
</template>

<style scoped lang="scss">
.btn {
  @apply flex items-center hover:opacity-80;

  div {
    @apply ml-1 mt-1;
  }
}
</style>
