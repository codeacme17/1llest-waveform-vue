<script setup lang="ts">
import { reactive } from 'vue'
import { useDark, useToggle, useStorage } from '@vueuse/core'
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

const skeleton = useStorage('skeleton', true)
const interact = useStorage('interact', true)
const lazy = useStorage('lazy', true)

const toggleInteract = () => {
  interact.value = !interact.value
}

const toggleSkeleton = () => {
  skeleton.value = !skeleton.value
}

const toggleLazy = () => {
  lazy.value = !lazy.value
}
</script>

<template>
  <section class="flex flex-col items-center">
    <h1 class="flex flex-col items-center mt-2 mb-5">
      <img src="/favicon.svg" class="w-32 h-32" />

      <span class="ml-1 font-black text-[20px]">
        <span class="text-[24px]">1</span>LLEST-WAVEFORM-PLUGIN
      </span>
    </h1>

    <div class="mb-8 flex">
      <button class="btn" @click="toggleDark()">
        <SunIcon v-show="!isDark" class="w-5" />
        <MoonIcon v-show="isDark" class="w-5" />
        <div>{{ isDark ? 'dark' : 'light' }}</div>
      </button>

      <button class="btn" @click="toggleInteract()">
        <span :class="{ 'bg-green-500': interact }" />
        <div>interact</div>
      </button>

      <button class="btn" @click="toggleSkeleton()">
        <span :class="{ 'bg-green-500': skeleton }" />
        <div>skeleton</div>
      </button>

      <button class="btn" @click="toggleLazy()">
        <span :class="{ 'bg-green-500': lazy }" />
        <div>lazy</div>
      </button>
    </div>

    <Demo
      v-for="item in items"
      :key="item.id"
      :url="item.url"
      :interact="interact"
      :skeleton="skeleton"
      :lazy="lazy"
    />
  </section>
</template>

<style scoped lang="scss">
.btn {
  @apply flex items-center hover:opacity-80 mx-3;

  div {
    @apply ml-1 mt-1;
  }

  span {
    @apply w-4 h-4 rounded-full duration-200 transition-[background-color] border-gray-500 dark:border-gray-200 border-[2px];
  }
}
</style>
