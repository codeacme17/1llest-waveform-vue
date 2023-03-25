import type { IllestWaveformProps } from '../../types/waveform'

/**
 *  The WebAudio class creates a playable audio instance
 *  and converts the audio into an array for visual processing
 *
 *  @states
 *  - props : The configs of web-audio
 *  - audioCtx : *https://developer.mozilla.org/en-US/docs/Web/API/AudioContext*
 *  - audioBuffer : *https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer*
 *  - audioBufferSourceNode : *https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode*
 *
 */

export default class WebAudio {
  protected props: IllestWaveformProps
  protected audioCtx: AudioContext
  protected audioBuffer!: AudioBuffer
  protected audioBufferSourceNode!: AudioBufferSourceNode

  constructor(props: IllestWaveformProps) {
    this.props = props
    this.audioCtx = new AudioContext()
  }

  get _filterData(): Promise<number[][]> {
    return this.createFilterData()
  }

  get _audioDuration(): number {
    return this.audioBuffer.duration
  }

  public async setupAudio(): Promise<void> {
    await this.createAudioBuffer()
  }

  private async createAudioBuffer(): Promise<void> {
    const response: Response = await fetch(this.props.url)
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer()
    this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer)
  }

  private createFilterData(): Promise<number[][]> {
    const samplingRate: number | undefined = this.props.samplingRate
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

    return Promise.resolve(filteredData)
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
