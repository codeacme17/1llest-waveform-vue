import type { Ref } from 'vue'

type CanvasLineCap = 'butt' | 'round' | 'square'

export type IllestWaveformProps = {
  url: string
  requestOptions?: RequestInit
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
