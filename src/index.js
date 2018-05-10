import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { getAudioContext } from './audioContext'
import noiseBuffer from './noiseBuffer'

const context = getAudioContext()

const drumPatterns = {
  HalfA: 'b - h b s - h s',
  HalfB: 'b s h b s - h -',
  Half2: 'b h h b h h s -',
  Floor: 'b h b h b h b h',
  Disco: 'b H s H b H s H',
  Rock: 'b h s h b b s h',
  Double: 's b s b s b s b',
  FillIn: 's b b s b b s -',
  Fill2: 's s s s s s s s',
  Dnb: 'b h s h b b h s',
  None: '- - - - - - - -'
  // Y: 'b - b - s - b - s - b - b - H - b b s s b b t t b b t t b b s'
}

const bpm = 180
const beatSplit = 2

function playDrumPattern(pattern) {
  const bass = [
    // Intro
    '6',
    '3',
    '4',
    '5',
    '4',
    '5',
    '6',
    '-',

    // Verse 1
    '6',
    '-',
    '-',
    '-',
    '4',
    '-',
    '5',
    '-',

    '6',
    '-',
    '-',
    '-',
    '4',
    '-',
    '5',
    '-',

    // PC
    '4',
    '3',
    '6',
    '2',
    '9',
    '-',
    '-',
    '-',
    '4',
    '5',

    //
    '6',
    '3',
    '4',
    '5',
    '4',
    '-',
    '7',
    '3',
    '6',
    '3',
    '4',
    '5',
    '6',
    '4',
    '7',
    '3',
    '2',
    '3',
    '6',
    '1',
    '4',
    '5',
    '6',
    '-',
    '6',
    '3',
    '4',
    '5',
    '4'
  ]

  const program = [
    'HalfA',
    'HalfB',
    'HalfA',
    'HalfB',
    'Rock',
    'Rock',
    'Rock',
    'Rock',
    'Floor',
    'Floor',
    'Floor',
    'Floor',
    'Dnb',
    'Dnb',
    'Dnb',
    'Dnb',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Dnb',
    'Dnb',
    'Dnb',
    'Dnb',

    // PC
    'Half2',
    'Half2',
    'Half2',
    'Half2',
    'Fill2',
    'Fill2',
    'Fill2',
    'Fill2',

    'FillIn',
    'None',

    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'Disco',
    'HalfA',
    'HalfB',
    'HalfA',
    'HalfB',
    'HalfA',
    'HalfB',
    'HalfA',
    'HalfB',
    'HalfA',
    'HalfB',
    'HalfA',
    'HalfB'
  ]

  const start = context.currentTime
  const notes = []
  const bassKey = [undefined, 0, 2, 4, 5, 7, 9, 11, 12, 10]
  let d
  bass.forEach((bassNote, index) => {
    if (bassKey[bassNote]) d = bassKey[bassNote]
    notes.push(d)
  })
  notes.forEach((note, index) => {
    const offset = index * 60 / bpm * 4
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        const t = start + i * 60 / bpm / 2 + offset
        const osc = context.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = noteToFrequency(
          note + 48 - 12 - (i % 2 === 0 ? 12 : 0) + 5
        )
        const gain = context.createGain()
        gain.gain.setValueAtTime(0.3, t)
        osc.connect(gain)
        gain.connect(context.destination)
        osc.start(t)
        osc.stop(t + 60 / bpm / 2)
      }
    }, offset * 1000 - 100)
  })
  console.log(notes)

  program.forEach((programName, index) => {
    const pattern = drumPatterns[programName].split(' ')
    const offset = index * 60 / bpm * 4
    setTimeout(() => {
      pattern.forEach((s, i) => {
        const t = start + i * 60 / bpm / beatSplit + offset
        if (s === 'b') {
          kick(t)
        } else if (s === 's') {
          snare(t)
        } else if (s === 'h') {
          hat(t)
        } else if (s === 't') {
          tom(t)
        } else if (s === 'H') {
          openHat(t)
        }
      })
    }, offset * 1000 - 100)
  })
}

function noteToFrequency(m) {
  return 27.5 * 2 ** ((m - 21) / 12)
}

function kick(t = context.currentTime) {
  context.resume()
  const src = context.createBufferSource()
  src.buffer = noiseBuffer
  src.playbackRate.value = 8

  const gain = context.createGain()
  gain.gain.setValueAtTime(1, t)
  gain.gain.linearRampToValueAtTime(0, t + 0.03)

  const osc = context.createOscillator()
  osc.type = 'square'
  osc.frequency.setValueAtTime(400, t)
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.05)
  osc.connect(gain)
  src.connect(gain)
  gain.connect(context.destination)

  osc.start(t)
  osc.stop(t + 0.1)
  src.start(t)
  src.stop(t + 0.2)
}

function tom(t = context.currentTime) {
  context.resume()
  const src = context.createBufferSource()
  src.buffer = noiseBuffer
  src.playbackRate.value = 3

  const gain = context.createGain()
  gain.gain.setValueAtTime(1, t)
  gain.gain.linearRampToValueAtTime(0, t + 0.15)

  const osc = context.createOscillator()
  osc.type = 'square'
  osc.frequency.setValueAtTime(300, t)
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.15)
  osc.connect(gain)
  src.connect(gain)
  gain.connect(context.destination)

  osc.start(t)
  osc.stop(t + 0.15)
  src.start(t)
  src.stop(t + 0.2)
}

function hat(t = context.currentTime) {
  context.resume()
  const src = context.createBufferSource()
  src.buffer = noiseBuffer
  src.playbackRate.value = 8

  const gain = context.createGain()
  gain.gain.setValueAtTime(1, t)
  gain.gain.linearRampToValueAtTime(0, t + 0.03)

  src.connect(gain)
  gain.connect(context.destination)
  src.start(t)
  src.stop(t + 0.2)
}

function openHat(t = context.currentTime) {
  context.resume()
  const src = context.createBufferSource()
  src.buffer = noiseBuffer
  src.playbackRate.value = 8

  const gain = context.createGain()
  gain.gain.setValueAtTime(1, t)
  gain.gain.linearRampToValueAtTime(0, t + 0.2)

  src.connect(gain)
  gain.connect(context.destination)
  src.start(t)
  src.stop(t + 0.2)
}

function snare(t = context.currentTime) {
  context.resume()

  const src = context.createBufferSource()
  src.buffer = noiseBuffer
  src.playbackRate.setValueAtTime(1, t)
  src.playbackRate.linearRampToValueAtTime(2, t + 0.05)

  const gain = context.createGain()
  gain.gain.setValueAtTime(1, t)
  gain.gain.linearRampToValueAtTime(0, t + 0.15)

  src.connect(gain)
  gain.connect(context.destination)

  src.start(t)
  src.stop(t + 0.2)
}

/**
 * @param {AudioContext} context
 * @param {number} freq
 * @param {number} t
 */
function tone(context, freq, t, velocity = 127) {
  const v = velocity / 127
  const osc = context.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = freq

  const waveShaper = context.createWaveShaper()
  const a = new Float32Array(256)
  for (let i = 0; i < 256; i++) a[i] = i < 64 ? -1 : 1
  waveShaper.curve = a

  const gain = context.createGain()
  gain.gain.setValueAtTime(0.4 * v, t)
  gain.gain.linearRampToValueAtTime(0.2 * v, t + 0.1)

  osc.connect(waveShaper)
  waveShaper.connect(gain)
  gain.connect(context.destination)

  osc.start(t)
  return {
    stop() {
      const t = context.currentTime
      gain.gain.setValueAtTime(0.2 * v, t)
      gain.gain.linearRampToValueAtTime(0, t + 0.2)
      osc.stop(context.currentTime + 0.5)
    }
  }
}

const lower = [
  16,
  90,
  83,
  88,
  69,
  67,
  86,
  71,
  66,
  89,
  80,
  78,
  77,
  188,
  79,
  190,
  72,
  191
]
const upper = [
  9,
  81,
  50,
  87,
  51,
  68,
  70,
  53,
  75,
  54,
  74,
  55,
  85,
  82,
  57,
  76,
  48,
  186,
  219,
  187,
  221,
  8,
  220
]

const keyCodesHeldDown = new Set()
const playingNotes = new Map()

function update() {
  const notesToPlay = new Set()
  const context = getAudioContext()
  for (const key of keyCodesHeldDown) {
    {
      const index = lower.indexOf(key)
      if (index >= 0) {
        notesToPlay.add(47 + 5 + index)
      }
    }
    {
      const index = upper.indexOf(key)
      if (index >= 0) {
        notesToPlay.add(59 + 5 + index)
      }
    }
  }
  for (const note of [...playingNotes.keys()]) {
    if (!notesToPlay.has(note)) {
      playingNotes.get(note).stop()
      playingNotes.delete(note)
    }
  }
  for (const note of [...notesToPlay]) {
    if (!playingNotes.has(note)) {
      const noteObject = tone(
        context,
        noteToFrequency(note),
        context.currentTime
      )
      playingNotes.set(note, noteObject)
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    window.keys = []
    this.onKeyDown = e => {
      if (e.metaKey) return
      keyCodesHeldDown.add(e.keyCode)
      update()
      // window.keys.push(e.keyCode)
      // const context = getAudioContext()
      // let t = context.currentTime
      // {
      //   const index = lower.indexOf(e.keyCode)
      //   if (index >= 0) {
      //     tone(context, noteToFrequency(47 + index), t)
      //   }
      // }
      // {
      //   const index = upper.indexOf(e.keyCode)
      //   if (index >= 0) {
      //     tone(context, noteToFrequency(59 + index), t)
      //   }
      // }
    }
    this.onKeyUp = e => {
      keyCodesHeldDown.delete(e.keyCode)
      update()
      // console.log(e)
    }
  }
  _playHappyBirthdaySong(e) {
    const context = getAudioContext()
    let t = context.currentTime
    for (let root of [0, -5, -5, 0, 0, 5, -5, 0]) {
      const base = 65 - 12 + root
      tone(context, noteToFrequency(base + 0), t)
      tone(context, noteToFrequency(base + 4), t + 0.3)
      tone(context, noteToFrequency(base + 7), t + 0.6)
      tone(context, noteToFrequency(base + 12), t + 0.9)
      tone(context, noteToFrequency(base + 7), t + 1.2)
      tone(context, noteToFrequency(base + 4), t + 1.5)
      t += 1.8
    }
  }
  async componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)

    const access = await navigator.requestMIDIAccess()
    const inputs = access.inputs
    // Array.from(inputs.keys()).forEach(k => {
    //   const inp = inputs.get(k)
    //   inp.onmidimessage = e => {
    //     if (e.data[0] === 144) {
    //       const noteObject = tone(
    //         context,
    //         noteToFrequency(e.data[1]),
    //         context.currentTime,
    //         e.data[2]
    //       )
    //       playingNotes.set(e.data[1], noteObject)
    //     }
    //     if (e.data[0] === 128) {
    //       if (playingNotes.get(e.data[1])) {
    //         playingNotes.get(e.data[1]).stop()
    //         playingNotes.delete(e.data[1])
    //       }
    //     }
    //   }
    // })
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
  render() {
    return (
      <div>
        {/*<button onClick={e => this._playHappyBirthdaySong(e)}>Click me</button>
        <button onClick={kick}>Kick</button>
        <button onClick={snare}>Snare</button>
        <button onClick={hat}>Hi-Hat</button>
    <button onClick={openHat}>Open hat</button>*/}
        <button onClick={playDrumPattern}>Play pattern</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'))
