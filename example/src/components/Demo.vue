<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect, defineProps } from 'vue'
import type { Ref } from 'vue'
import { IllestWaveform } from '1llest-waveform-vue'
// import IllestWaveform from '../../../src/components/IllestWaveform.vue'
import type { IllestWaveformProps } from '1llest-waveform-vue'
import '1llest-waveform-vue/dist/style.css'
import PlayIcon from './icons/Play.vue'
import PauseIcon from './icons/Pause.vue'
import ReplayIcon from './icons/Replay.vue'

const { props } = defineProps(['props'])

const waveOptions = reactive<IllestWaveformProps>({
  url: props.url,
})

const waveformRef = ref<typeof IllestWaveform | null>(null)

onMounted(() => {
  getCurrentTime()
})

const init = ref(false)
const playing = ref(false)
const finished = ref(false)
const ready = ref(false)
const currentTime = ref('0:00')
const durationTime = ref('0:00')

const initHandler = (v: boolean) => {
  init.value = v
}

const readyHandler = (v: boolean) => {
  ready.value = v
  getDuration()
}

const finishHandler = (v: boolean) => {
  finished.value = v
}

const clickHandler = (el: Ref<HTMLElement>) => {
  console.log(el)
}

const play = () => {
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
</script>

<template>
  <section class="flex flex-col mb-14">
    <div class="h-16 w-[700px] mx-auto">
      <IllestWaveform
        ref="waveformRef"
        v-bind="waveOptions"
        @on-init="initHandler"
        @on-ready="readyHandler"
        @on-play="(v: boolean) => (playing = v)"
        @on-pause="(v: boolean) => (playing = v)"
        @on-finish="finishHandler"
        @on-click="clickHandler"
      />
    </div>

    <div class="flex mt-2 items-end">
      <div class="ml-auto">
        <span class="text-neutral-400">{{ currentTime }}</span> /
        <strong>{{ durationTime }}</strong>
      </div>

      <div class="ml-5">
        <button
          v-show="!playing && !finished"
          class="btn text-[#3e6bff]"
          @click="play"
        >
          <PlayIcon />
          <div class="ml-2">PLAY</div>
        </button>

        <button
          v-show="playing && !finished"
          class="btn text-yellow-500"
          @click="pause"
        >
          <PauseIcon />
          <div>PAUSE</div>
        </button>

        <button v-show="finished" class="btn text-green-500" @click="replay">
          <ReplayIcon />
          <div>REPLAY</div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.btn {
  @apply flex items-center bg-neutral-700 px-5 py-1 rounded-sm;

  & div {
    @apply ml-1 font-bold -mb-0.5;
  }
}
</style>
