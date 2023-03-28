<script setup lang="ts">
import { reactive } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { nanoid } from 'nanoid'
import Demo from './components/Demo.vue'
// import type { IllestWaveformProps } from '1llest-waveform-vue'
import type { IllestWaveformProps } from '../../src/types/waveform'

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
    <h1 class="flex flex-col items-center mt-2 mb-10">
      <img src="/favicon.svg" class="w-32 h-32" />

      <span class="ml-1 font-black text-[20px]">
        <span class="text-[24px]">1</span>LLEST-WAVEFORM-PLUGIN
      </span>
    </h1>

    <div>
      <button @click="toggleDark()">theme</button>
    </div>

    <Demo v-for="item in items" :key="item.id" :props="item" />
  </section>
</template>
