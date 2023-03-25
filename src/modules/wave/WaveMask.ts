import Wave from './index'
import type { WaveformProps } from '../../types/waveform'

export default class WaveMask extends Wave {
  waveCanvas: HTMLCanvasElement | null

  constructor(
    canvas: HTMLCanvasElement | null,
    props: WaveformProps,
    filteredData: number[][],
    waveCanvas: HTMLCanvasElement | null
  ) {
    super(canvas, props, filteredData)
    this.waveCanvas = waveCanvas
  }

  protected setCanvasBase(): void {
    this.canvas!.width = this.waveCanvas!.width
    this.canvas!.height = this.waveCanvas!.height
    this.canvas!.style.opacity = '1'
  }

  public setCanvasStyle(): void {
    this.canvasCtx!.lineWidth = this.props.lineWidth as number
    this.canvasCtx!.lineCap = this.props.lineCap as CanvasLineCap
    this.canvasCtx!.strokeStyle = this.props.maskColor as string
    this.canvasCtx!.stroke()
  }
}
