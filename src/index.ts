import { App } from 'vue'
import IllGWaveform from './components/Waveform.vue'

export default {
  install: (app: App) => {
    app.component('IllGWaveform', IllGWaveform)
  },
}
