<script setup lang="ts">
import { ref, onMounted, watchEffect, onUnmounted } from 'vue'
import WebAudioController from '../modules/WebAudio/Controller'
import Wave from '../modules/Wave/index'
import WaveMask from '../modules/Wave/WaveMask'
import {
  lazyLoader,
  registerScrollHander,
  canelScrollHander,
} from '../utils/lazy-load'
import { formatSecond } from '../utils/format-time'

type CanvasLineCap = 'butt' | 'round' | 'square'

type IllestWaveformProps = {
  url: string
  lineWidth: number
  lineCap: CanvasLineCap
  lineStyle: string
  samplingRate: number
  cursorWidth: number
  cursorColor: string
  maskColor: string
  lazy: boolean
  skeleton: boolean
}

const props = withDefaults(defineProps<IllestWaveformProps>(), {
  lineWidth: 2,
  lineCap: 'round',
  lineStyle: '#5e5e5e',
  cursorWidth: 2,
  cursorColor: '#fff',
  samplingRate: 1050,
  maskColor: '#fff',
  lazy: true,
  skeleton: true,
})

// Render trigger can control the render time
// of current waveform
const renderTrigger = ref<boolean>(false)
const waveformContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (props.lazy) {
    lazyLoader(waveformContainer.value as HTMLElement, lazyLoadHandler)
    registerScrollHander(
      waveformContainer.value as HTMLElement,
      lazyLoadHandler
    )
    watchEffect(async () => {
      if (renderTrigger.value) await init()
    })
  } else await init()
})

onUnmounted(() => {
  if (props.lazy)
    canelScrollHander(waveformContainer.value as HTMLElement, lazyLoadHandler)
})

function lazyLoadHandler() {
  renderTrigger.value = true
}

// initialize
const ready = ref<boolean>(false)
const waveRef = ref<HTMLCanvasElement | null>(null)
const maskRef = ref<HTMLCanvasElement | null>(null)

let webAudioController: WebAudioController
let wave: Wave
let waveMask: WaveMask

// initialize waveform
async function init(): Promise<void> {
  emits('onInit', true)
  await initAudio()
  await initWave()
  await initWaveMask()
  ready.value = true
  emits('onReady', ready.value)
}

// initialize web audio
async function initAudio(): Promise<void> {
  webAudioController = new WebAudioController(props)
  await webAudioController.setupAudio()
  watchIsFinish()
}

// initialize wave canvas
async function initWave(): Promise<void> {
  wave = new Wave(
    waveRef.value as HTMLCanvasElement,
    props,
    await webAudioController._filterData
  )
  wave.setupCanvas()
  watchEffect(() => {
    wave._props = props
    wave.setCanvasStyle()
  })
}

// initialize wave mask canvas
async function initWaveMask(): Promise<void> {
  waveMask = new WaveMask(
    maskRef.value as HTMLCanvasElement,
    props,
    await webAudioController._filterData,
    wave._canvas
  )
  waveMask.setupCanvas()
  watchEffect(() => {
    waveMask._props = props
    waveMask.setCanvasStyle()
  })
}

// Waveform handlers
const moveX = ref<number>(0)
const currentTime = ref<number>(0)
const maskWidth = ref<number>(0)

function drawWaveMask(): void | undefined {
  if (!webAudioController._playing) return
  requestAnimationFrame(drawWaveMask)
  currentTime.value = webAudioController._currentTime
  maskWidth.value =
    (currentTime.value / webAudioController._audioDuration) * wave._canvas.width
}

function mouseMoveHandler(e: any): void {
  if (!ready.value) return
  moveX.value = e.layerX
}

function clickHandler(): void {
  if (!ready.value) return
  maskWidth.value = moveX.value
  const pickedTime: number =
    (moveX.value / wave._canvas.width) * webAudioController._audioDuration
  webAudioController.pick(pickedTime)
  emits('onFinish', false)
}

// Audio handlers
function play(): void {
  if (!ready.value) return
  webAudioController.play()
  emits('onPlay', true)
  drawWaveMask()
}

function replay(): void {
  webAudioController.replay()
  emits('onFinish', false)
  emits('onPlay', true)
  drawWaveMask()
}

function pause(): void {
  webAudioController.pause()
  emits('onPause', false)
}

function finish(): void {
  emits('onFinish', true)
}

function watchIsFinish(): void {
  watchEffect(() => {
    if (currentTime.value < webAudioController._audioDuration) return
    pause()
    finish()
  })
}

function getCurrentTime(): string {
  return formatSecond(currentTime.value)
}

function getDuration(): string {
  const duration = webAudioController._audioDuration
  return formatSecond(duration)
}

const emits = defineEmits([
  'onInit', // start init hook
  'onReady', // ready to play, rended
  'onPlay', // start play hook
  'onPause', // pause hook
  'onFinish', // finish current track hook
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
    id="ill-wave-container"
    ref="waveformContainer"
    :style="`${!ready ? 'cursor: progress;' : 'cursor: pointer'}`"
    @mousemove="mouseMoveHandler"
    @click="clickHandler"
  >
    <transition name="fade">
      <div v-show="props.skeleton && !ready" id="ill-skeleton">
        <div v-show="!ready" id="ill-skeleton__load" />
      </div>
    </transition>

    <canvas id="ill-wave" ref="waveRef" />

    <div id="ill-waveMask-container" :style="`width:${maskWidth}px;`">
      <canvas id="ill-waveMask" ref="maskRef" />
    </div>

    <div
      v-show="ready"
      id="ill-cursor"
      :style="`width:${props.cursorWidth}px; transform: translateX(${moveX}px);background-color: ${props.cursorColor}; `"
    />
  </section>
</template>

<style scoped>
#ill-wave-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#ill-wave-container > #ill-skeleton {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #232323;
  border-radius: 7px;
  overflow: hidden;
  z-index: 0;
}

#ill-wave-container > #ill-skeleton > #ill-skeleton__load {
  background-color: #232323;
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

#ill-wave-container > #ill-wave {
  width: inherit;
  height: inherit;
  opacity: 0;
}

#ill-wave-container > #ill-waveMask-container {
  position: absolute;
  top: 0;
  left: 0;
  height: inherit;
  overflow: hidden;
}

#ill-wave-container > #ill-waveMask-container > #ill-waveMask {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

#ill-wave-container > #ill-cursor {
  position: absolute;
  height: inherit;
  left: 0px;
  top: 0px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

#ill-wave-container:hover #ill-cursor {
  opacity: 1;
}

@keyframes skeleton-load {
  from {
    margin-left: -20%;
  }
  to {
    margin-left: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease-in-out 0.7s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
