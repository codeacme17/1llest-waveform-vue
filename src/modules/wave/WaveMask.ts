import Wave from './index'
import type { IllestWaveformProps } from '../../types/waveform'

export default class WaveMask extends Wave {
  waveCanvas!: HTMLCanvasElement

  constructor(
    canvas: HTMLCanvasElement,
    props: IllestWaveformProps,
    filteredData: number[][],
    waveCanvas: HTMLCanvasElement
  ) {
    super(canvas, props, filteredData)
    this.waveCanvas = waveCanvas
  }

  protected setCanvasBase(): void {
    this.canvas.width = this.waveCanvas.width
    this.canvas.height = this.waveCanvas.height
    this.canvas.style.opacity = '1'
  }

  public setCanvasStyle(): void {
    this.canvasCtx.lineWidth = this.props.lineWidth as number
    this.canvasCtx.lineCap = this.props.lineCap as CanvasLineCap
    this.canvasCtx.strokeStyle = this.props.maskColor as string
    this.canvasCtx.stroke()
  }
}
