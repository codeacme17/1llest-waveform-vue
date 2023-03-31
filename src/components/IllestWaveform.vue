<script setup lang="ts">
import { ref, onMounted, watchEffect, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { Wave, AudioController } from '../modules'
import { formatSecond } from '../utils/format-time'
import {
  lazyLoader,
  registerScrollHander,
  canelScrollHander,
} from '../utils/lazy-load'

type CanvasLineCap = 'butt' | 'round' | 'square'

type IllestWaveformProps = {
  url: string
  lineWidth?: number
  lineCap?: CanvasLineCap
  lineColor?: string
  samplingRate?: number
  cursorWidth?: number
  cursorColor?: string
  maskColor?: string
  lazy?: boolean | Ref<boolean>
  skeleton?: boolean | Ref<boolean>
  skeletonColor?: string
  interact?: boolean | Ref<boolean>
}

const props = withDefaults(defineProps<IllestWaveformProps>(), {
  lineWidth: 0.5,
  lineCap: 'round',
  lineColor: '#5e5e5e',
  cursorWidth: 2,
  cursorColor: '#fff',
  samplingRate: 22050,
  maskColor: '#fff',
  lazy: true,
  skeleton: true,
  skeletonColor: '#232323',
  interact: true,
})

// Render trigger can control the render time
// of current waveform
const renderTrigger = ref<boolean>(false)
const __illestWaveformRef__ = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (props.lazy) {
    lazyLoader(__illestWaveformRef__.value as HTMLElement, lazyLoadHandler)
    registerScrollHander(
      __illestWaveformRef__.value as HTMLElement,
      lazyLoadHandler
    )
    watchEffect(async () => {
      if (renderTrigger.value) await init()
    })
  } else await init()
})

onUnmounted(() => {
  if (props.lazy)
    canelScrollHander(
      __illestWaveformRef__.value as HTMLElement,
      lazyLoadHandler
    )
})

function lazyLoadHandler() {
  renderTrigger.value = true
}

// initialize handlers
const waveRef = ref<HTMLCanvasElement | null>(null)
const ready = ref<boolean>(false)

let audioController: AudioController
let wave: Wave

async function init(): Promise<void> {
  if (ready.value) return
  emits('onInit', true)
  await initAudioController()
  await initWave()
  ready.value = true
  emits('onReady', ready.value)
}

async function initAudioController(): Promise<void> {
  audioController = new AudioController(props)
  await audioController.fetchAudioFile()
  emits('onFetched', true)
  await audioController.setupAudio()
  watchIsFinish()
}

async function initWave(): Promise<void> {
  wave = new Wave(
    waveRef.value as HTMLCanvasElement,
    props,
    audioController._filteredData
  )
  wave.setupCanvas()
  watchEffect(() => {
    wave._props = props
    wave.setWaveStyle(maskWidth.value)
  })
}

// wave handlers
const moveX = ref<number>(0)
const currentTime = ref<number>(0)
const maskWidth = ref<number>(0)

function drawWaveMask(): void | undefined {
  if (!audioController._playing) return

  requestAnimationFrame(drawWaveMask)
  currentTime.value = audioController._currentTime
  maskWidth.value =
    (currentTime.value / audioController._audioDuration) * wave._canvas.width
}

function mouseMoveHandler(e: any): void {
  if (!ready.value || !props.interact) return

  if (e.layerX <= 0) moveX.value = 0
  else if (e.layerX >= wave._canvas.width) moveX.value = wave._canvas.width
  else moveX.value = e.layerX
}

function clickHandler(): void {
  if (!ready.value || !props.interact) return

  maskWidth.value = moveX.value
  const pickedTime: number =
    (moveX.value / wave._canvas.width) * audioController._audioDuration
  audioController.pick(pickedTime)
  currentTime.value = pickedTime
  emits('onClick', __illestWaveformRef__)
  emits('onFinish', false)
}

// audio handlers
function play(): void {
  if (!ready.value) return
  audioController.play()
  emits('onPlay', true)
  drawWaveMask()
}

function replay(): void {
  audioController.replay()
  emits('onFinish', false)
  emits('onPlay', true)
  drawWaveMask()
}

function pause(): void {
  audioController.pause()
  emits('onPause', false)
}

function finish(): void {
  audioController.finish()
  emits('onPlay', false)
  emits('onFinish', true)
}

function watchIsFinish(): void {
  watchEffect(() => {
    if (currentTime.value <= audioController._audioDuration) return
    finish()
  })
}

function getCurrentTime(): string {
  return formatSecond(currentTime.value)
}

function getDuration(): string {
  const duration = audioController._audioDuration
  return formatSecond(duration)
}

const emits = defineEmits([
  'onInit', // start init hook
  'onFetched', // fetched audio file
  'onReady', // ready to play, rended
  'onPlay', // start play hook
  'onPause', // pause hook
  'onFinish', // finish current track hook
  'onClick', // while click the waveform
])

defineExpose({
  play,
  pause,
  replay,
  getCurrentTime,
  getDuration,
})
</script>

<template>
  <section
    id="illest-waveform"
    ref="__illestWaveformRef__"
    :style="`${ready && interact ? 'cursor: pointer' : ''}`"
    @mousemove="mouseMoveHandler"
    @click="clickHandler"
  >
    <transition name="fade">
      <div
        v-show="props.skeleton && !ready"
        id="illest-waveform__skeleton"
        :style="`background-color: ${skeletonColor}`"
      >
        <div
          v-show="!ready"
          id="illest-waveform__skeleton__load"
          :style="`background-color: ${skeletonColor}`"
        />
      </div>
    </transition>

    <canvas id="illest-waveform__view" ref="waveRef" />

    <div
      v-show="ready && props.interact"
      id="illest-waveform__cursor"
      :style="`width:${props.cursorWidth}px; transform: translateX(${moveX}px);background-color: ${props.cursorColor}; `"
    />
  </section>
</template>

<style scoped>
#illest-waveform {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#illest-waveform > #illest-waveform__skeleton {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 7px;
  overflow: hidden;
  z-index: 0;
}

#illest-waveform
  > #illest-waveform__skeleton
  > #illest-waveform__skeleton__load {
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  height: 100%;
  width: 30%;
  animation: skeleton-load 2.5s ease 0s infinite;
}

#illest-waveform > #illest-waveform__view {
  width: inherit;
  height: inherit;
  opacity: 0;
}

#illest-waveform > #illest-waveform__cursor {
  position: absolute;
  height: inherit;
  left: 0px;
  top: 0px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

#illest-waveform:hover #illest-waveform__cursor {
  opacity: 1;
}

@keyframes skeleton-load {
  from {
    transform: translateX(-80%);
  }
  to {
    transform: translateX(330%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease-in-out 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
