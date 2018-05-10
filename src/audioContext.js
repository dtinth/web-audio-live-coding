let audioContext

/**
 * @return {AudioContext}
 */
export function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}
