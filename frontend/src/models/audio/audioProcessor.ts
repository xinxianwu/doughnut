export interface AudioProcessor {
  processAudioData: (newData: Float32Array[]) => void
  getAudioData: () => Float32Array[]
  start: () => void
  stop: () => File
}

export const createAudioProcessor = (
  sampleRate: number,
  processorCallback: (file: File) => void
): AudioProcessor => {
  let audioData: Float32Array[] = []
  let lastProcessedIndex = 0
  let processorTimer: NodeJS.Timeout | null = null

  const SILENCE_THRESHOLD = 0.01 // Adjust this threshold as needed

  const isSilent = (data: Float32Array): boolean => {
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum += Math.abs(data[i] ?? 0)
    }
    const avg = sum / data.length
    return avg < SILENCE_THRESHOLD
  }

  const processAndCallback = (data: Float32Array[]) => {
    const isAllSilent = data.every((chunk) => isSilent(chunk))
    if (!isAllSilent) {
      const partialFile = createAudioFile(data, sampleRate, true)
      processorCallback(partialFile)
    }
  }

  const processAudioData = (newData: Float32Array[]) => {
    // Filter out silent data
    const filteredData = newData.map((chunk) => {
      if (isSilent(chunk)) {
        // Replace silent chunk with minimal data to maintain duration
        return new Float32Array(chunk.length) // Filled with zeros
      } else {
        return chunk
      }
    })
    audioData.push(...filteredData)
  }

  const start = () => {
    processorTimer = setInterval(() => {
      if (audioData.length > lastProcessedIndex) {
        const newAudioData = audioData.slice(lastProcessedIndex)
        processAndCallback(newAudioData)
        lastProcessedIndex = audioData.length
      }
    }, 60 * 1000)
  }

  const stop = () => {
    if (processorTimer) {
      clearInterval(processorTimer)
      processorTimer = null
    }
    // Process any remaining audio data
    if (audioData.length > lastProcessedIndex) {
      const remainingAudioData = audioData.slice(lastProcessedIndex)
      processAndCallback(remainingAudioData)
    }

    const file = createAudioFile(audioData, sampleRate, false)
    audioData = []
    lastProcessedIndex = 0
    return file
  }

  const getAudioData = () => {
    return audioData
  }

  return {
    processAudioData,
    start,
    stop,
    getAudioData,
  }
}

// Helper function to create audio files
const createAudioFile = (
  data: Float32Array[],
  sampleRate: number,
  isPartial: boolean
): File => {
  const wavBlob = encodeWAV(data, sampleRate)
  const timestamp = new Date().toISOString()
  const fileName = `recorded_audio_${isPartial ? "partial_" : ""}${timestamp}.wav`
  return new File([wavBlob], fileName, { type: "audio/wav" })
}

const encodeWAV = (samples: Float32Array[], sampleRate: number): Blob => {
  const bufferLength = samples.reduce((acc, sample) => acc + sample.length, 0)
  const buffer = new ArrayBuffer(44 + bufferLength * 2)
  const view = new DataView(buffer)

  writeString(view, 0, "RIFF")
  view.setUint32(4, 36 + bufferLength * 2, true)
  writeString(view, 8, "WAVE")
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, "data")
  view.setUint32(40, bufferLength * 2, true)

  let offset = 44
  samples.forEach((sample) => {
    for (let i = 0; i < sample.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, sample[i] ?? 0))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  })

  return new Blob([view], { type: "audio/wav" })
}

const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
