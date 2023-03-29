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
const waveRef = ref<HTMLCanvasElement | null>(null)
const ready = ref<boolean>(false)

let webAudioController: AudioController
let wave: Wave

// initialize waveform
async function init(): Promise<void> {
  if (ready.value) return
  emits('onInit', true)
  await initAudio()
  await Promise.all([initWave()])
  ready.value = true
  emits('onReady', ready.value)
}

// initialize web audio
async function initAudio(): Promise<void> {
  webAudioController = new AudioController(props)
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
    wave.setWaveStyle(maskWidth.value)
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
  if (!ready.value || !props.interact) return

  if (e.layerX <= 0) moveX.value = 0
  else if (e.layerX >= wave._canvas.width) moveX.value = wave._canvas.width
  else moveX.value = e.layerX
}

function clickHandler(): void {
  if (!ready.value || !props.interact) return
  maskWidth.value = moveX.value
  const pickedTime: number =
    (moveX.value / wave._canvas.width) * webAudioController._audioDuration
  webAudioController.pick(pickedTime)
  currentTime.value = pickedTime
  emits('onClick', waveformContainer)
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
    id="illest-wave-container"
    ref="waveformContainer"
    @mousemove="mouseMoveHandler"
    @click="clickHandler"
  >
    <transition name="fade">
      <div
        v-show="props.skeleton && !ready"
        id="illest-skeleton"
        :style="`background-color: ${skeletonColor}`"
      >
        <div
          v-show="!ready"
          id="illest-skeleton__load"
          :style="`background-color: ${skeletonColor}`"
        />
      </div>
    </transition>

    <canvas id="illest-wave" ref="waveRef" />

    <div
      v-show="ready && props.interact"
      id="illest-cursor"
      :style="`width:${props.cursorWidth}px; transform: translateX(${moveX}px);background-color: ${props.cursorColor}; `"
    />
  </section>
</template>

<style scoped>
#illest-wave-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#illest-wave-container > #illest-skeleton {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 7px;
  overflow: hidden;
  z-index: 0;
}

#illest-wave-container > #illest-skeleton > #illest-skeleton__load {
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

#illest-wave-container > #illest-wave {
  width: inherit;
  height: inherit;
  opacity: 0;
}

#illest-wave-container > #illest-cursor {
  position: absolute;
  height: inherit;
  left: 0px;
  top: 0px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}

#illest-wave-container:hover #illest-cursor {
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
