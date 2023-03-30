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
  protected audioBufferSourceNode!: AudioBufferSourceNode
  private filterData!: number[][]
  private arrayBuffer!: ArrayBuffer

  constructor(props: IllestWaveformProps) {
    this.props = props
    this.audioCtx = new AudioContext()
  }

  get _filterData(): number[][] {
    return this.filterData
  }

  get _audioDuration(): number {
    if (!this.audioBuffer)
      throw new Error('can not get duration before audio inited')
    return this.audioBuffer.duration
  }

  public async setupAudio(): Promise<void> {
    await this.createAudioBuffer()
    this.createFilterData()
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

  private createFilterData(): void {
    const samplingRate: number = this.props.samplingRate as number
    const channels: number = this.audioBuffer.numberOfChannels
    const rawDataList: Float32Array[] = []
    const filteredData: number[][] = []

    for (let channel = 0; channel < channels; channel++) {
      rawDataList.push(this.audioBuffer.getChannelData(channel))
    }

    for (let index = 0; index < samplingRate; index++) {
      const temp = [0, 0]
      for (let channel = 0; channel < channels; channel++) {
        const blockSize = Math.floor(rawDataList[channel].length / samplingRate)
        temp[channel] = rawDataList[channel][index * blockSize]
      }
      filteredData.push(temp)
    }

    this.filterData = filteredData
  }

  protected connectDestination(): void {
    this.createAudioBufferSourceNode()
    this.disconnectDestination()
    this.audioBufferSourceNode.connect(this.audioCtx.destination)
  }

  private createAudioBufferSourceNode(): void {
    this.audioBufferSourceNode = this.audioCtx.createBufferSource()
    this.audioBufferSourceNode.buffer = this.audioBuffer
  }

  protected disconnectDestination(): void {
    if (this.audioBufferSourceNode) this.audioBufferSourceNode.disconnect()
  }
}
