import type { Ref, Component } from 'vue'

declare const _default: {
  install: (app: Component) => void
}

type CanvasLineCap = 'butt' | 'round' | 'square'

export type IllestWaveformProps = {
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

export default _default
