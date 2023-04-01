<script setup lang="ts">
import {
  onMounted,
  reactive,
  ref,
  watchEffect,
  defineProps,
  computed,
} from 'vue'
import type { Ref } from 'vue'
import { useDark } from '@vueuse/core'
import IllestWaveform from '../../../src/components/IllestWaveform.vue'
import type { IllestWaveformProps } from '../../../src/types/waveform'
import '../../../lib/style.css'
import PlayIcon from './icons/Play.vue'
import PauseIcon from './icons/Pause.vue'
import ReplayIcon from './icons/Replay.vue'

const darkMode = useDark()

const props = defineProps(['id', 'url', 'interact', 'skeleton', 'lazy', 'fade'])

const waveOptions = reactive<IllestWaveformProps>({
  url: props.url,
  interact: computed(() => props.interact),
  skeleton: computed(() => props.skeleton),
  lazy: computed(() => props.lazy),
  fade: computed(() => props.fade),
})

watchEffect(() => {
  if (darkMode.value) {
    waveOptions.lineColor = '#5e5e5e'
    waveOptions.maskColor = '#fff'
    waveOptions.skeletonColor = '#232323'
    waveOptions.cursorColor = '#fff'
  } else {
    waveOptions.lineColor = '#a1a1aa'
    waveOptions.maskColor = '#000'
    waveOptions.skeletonColor = '#f3f4f6'
    waveOptions.cursorColor = '#000'
  }
})

const waveformRef = ref<typeof IllestWaveform | null>(null)

onMounted(() => {
  getCurrentTime()
})

const init = ref(false)
const fetched = ref(false)
const playing = ref(false)
const finished = ref(false)
const ready = ref(false)
const currentTime = ref('0:00')
const durationTime = ref('0:00')

const initHandler = (v: boolean) => {
  init.value = v
}

const fetchedHandler = (v: boolean) => {
  fetched.value = v
}

const readyHandler = (v: boolean) => {
  ready.value = v
  getDuration()
}

const finishHandler = (v: boolean) => {
  finished.value = v
}

const clickHandler = (el: Ref<HTMLElement>) => {
  // do something
}

const play = () => {
  emits('play', props.id)
  waveformRef.value!.play()
}

const replay = () => {
  waveformRef.value!.replay()
}

const pause = () => {
  waveformRef.value!.pause()
}

const getCurrentTime = () => {
  watchEffect(() => {
    const current = waveformRef.value!.getCurrentTime()
    currentTime.value = current
  })
}

const getDuration = () => {
  const duration = waveformRef.value!.getDuration()
  durationTime.value = duration
}

const emits = defineEmits(['play'])

defineExpose({
  pause,
  playing,
  id: props.id,
})
</script>

<template>
  <section class="flex flex-col mb-14">
    <div class="h-16 w-[700px] mx-auto">
      <IllestWaveform
        ref="waveformRef"
        v-bind="waveOptions"
        @on-init="initHandler"
        @on-fetched="fetchedHandler"
        @on-ready="readyHandler"
        @on-play="(v: boolean) => (playing = v)"
        @on-pause="(v: boolean) => (playing = v)"
        @on-finish="finishHandler"
        @on-click="clickHandler"
      />
    </div>

    <div class="flex mt-2 items-end">
      <div
        class="flex items-center w-28"
        :class="`${fetched ? '' : 'animate-pulse'}`"
      >
        <span
          class="tag"
          :class="`${
            fetched ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-400'
          }`"
        />
        {{ fetched ? 'fetched' : 'fetching' }}
      </div>

      <div
        class="flex items-center w-28"
        :class="`${ready ? '' : 'animate-pulse'}`"
      >
        <span
          class="tag"
          :class="`${ready ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-400'}`"
        />
        {{ ready ? 'ready' : 'rendering' }}
      </div>

      <div class="ml-auto">
        <span class="text-neutral-400">{{ currentTime }}</span> /
        <strong>{{ durationTime }}</strong>
      </div>

      <div class="ml-5">
        <button
          v-show="!playing && !finished"
          class="text-[#3e6bff]"
          @click="play"
        >
          <PlayIcon />
          <div class="ml-2">PLAY</div>
        </button>

        <button
          v-show="playing && !finished"
          class="text-yellow-500"
          @click="pause"
        >
          <PauseIcon />
          <div>PAUSE</div>
        </button>

        <button v-show="finished" class="text-green-500" @click="replay">
          <ReplayIcon />
          <div>REPLAY</div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tag {
  @apply inline-flex h-2 w-2 mr-2 rounded-full opacity-75;
}

button {
  @apply flex items-center bg-neutral-200 dark:bg-neutral-700 px-5 py-1 rounded-sm;

  & div {
    @apply ml-1 font-bold -mb-0.5;
  }
}
</style>
