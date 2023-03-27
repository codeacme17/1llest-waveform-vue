<script setup lang="ts">
import { reactive } from "vue"
import { nanoid } from "nanoid"
import Demo from "./components/Demo.vue"
import type { IllestWaveformProps } from "1llest-waveform-vue"

type Props = {
  id: string
} & IllestWaveformProps

const items = reactive<Props[]>([
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-1.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-2.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-3.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-4.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-5.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-6.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-7.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-8.wav`
  },
  {
    id: nanoid(),
    url:`${import.meta.env.BASE_URL}audios/loop-9.wav`
  }
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

    <Demo v-for="item in items" :props="item" />
  </section>
</template>
