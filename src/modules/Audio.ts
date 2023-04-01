import type { IllestWaveformProps } from '../types/waveform'

/**
 *  The WebAudio class creates a playable audio instance
 *  and converts the audio into an array for visual processing
 *
 */

export default class WebAudio {
  protected props: IllestWaveformProps
  protected audioCtx: AudioContext
  protected audioBuffer!: AudioBuffer
  private filteredData!: number[]
  private arrayBuffer!: ArrayBuffer
  protected gainNode!: GainNode

  constructor(props: IllestWaveformProps) {
    this.props = props
    this.audioCtx = new AudioContext()
  }

  get _filteredData(): number[] {
    return this.filteredData
  }

  get _audioDuration(): number {
    if (!this.audioBuffer)
      throw new Error('can not get duration before audio inited')
    return this.audioBuffer.duration
  }

  public async setupAudio(): Promise<void> {
    await this.createAudioBuffer()
    this.createFilterData()
    this.createGainNode()
  }

  public async fetchAudioFile(): Promise<void> {
    try {
      const response = await fetch(this.props.url)
      this.arrayBuffer = await response.arrayBuffer()
    } catch (error) {
      console.error(error)
    }
  }

  private async createAudioBuffer(): Promise<void> {
    this.audioBuffer = await this.audioCtx.decodeAudioData(this.arrayBuffer)
  }

  private createGainNode(): void {
    this.gainNode = this.audioCtx.createGain()
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
  }

  private createFilterData(): void {
    const samplingRate: number = this.props.samplingRate as number
    const filteredData: number[] = []

    const rawDataList: Float32Array = this.audioBuffer.getChannelData(0)

    for (let index = 0; index < samplingRate; index++) {
      const blockSize = Math.floor(rawDataList.length / samplingRate)
      const temp = rawDataList[index * blockSize]
      filteredData.push(temp)
    }

    this.filteredData = filteredData
  }
}
