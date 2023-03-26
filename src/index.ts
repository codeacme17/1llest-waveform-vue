import { App } from 'vue'
import IllestWaveform from './components/IllestWaveform.vue'

export default {
  install: (app: App) => {
    app.component('IllestWaveform', IllestWaveform)
  },
}

export { IllestWaveform }
