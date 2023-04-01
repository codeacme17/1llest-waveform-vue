import type { Ref } from 'vue'

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
  fade?: boolean | Ref<boolean>
}
