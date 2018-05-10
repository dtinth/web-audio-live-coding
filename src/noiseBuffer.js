import { getAudioContext } from './audioContext'

const context = getAudioContext()
const noiseBuffer = context.createBuffer(1, 44100, 44100)
const data = noiseBuffer.getChannelData(0)

let x = 1

for (let i = 0; i < 44100; i++) {
  data[i] = x & 1 ? 0.5 : -0.5
  if (i % 8 === 0) {
    let next = (x & 1) ^ ((x & 2) >> 1)
    x = (x >> 1) | (next << 14)
  }
}

export default noiseBuffer
