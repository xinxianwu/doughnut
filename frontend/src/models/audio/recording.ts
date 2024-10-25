import { getAudioRecordingWorkerURL } from "./recorderWorklet"

export interface AudioRecorder {
  startRecording: () => Promise<void>
  stopRecording: () => File
  getAudioData: () => Float32Array[]
}

export const createAudioRecorder = (
  processorCallback: (file: File) => void
): AudioRecorder => {
  let audioContext: AudioContext | null = null
  let mediaStream: MediaStream | null = null
  let audioInput: MediaStreamAudioSourceNode | null = null
  let workletNode: AudioWorkletNode | null = null
  let audioData: Float32Array[] = []
  let lastProcessedIndex = 0
  let processorTimer: number | null = null

  const audioRecorder: AudioRecorder = {
    startRecording: async function (): Promise<void> {
      const audioWorkletUrl = getAudioRecordingWorkerURL()
      try {
        audioContext = new AudioContext({ sampleRate: 16000 })

        await audioContext.audioWorklet.addModule(audioWorkletUrl)

        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        audioInput = audioContext.createMediaStreamSource(mediaStream)

        workletNode = new AudioWorkletNode(
          audioContext,
          "recorder-worklet-processor"
        )

        workletNode.port.onmessage = (event) => {
          if (event.data.audioBuffer) {
            audioData.push(...event.data.audioBuffer)
          }
        }

        audioInput.connect(workletNode)
        workletNode.connect(audioContext.destination)

        // Start the timer to process audio data every minute
        processorTimer = window.setInterval(() => {
          if (audioData.length > lastProcessedIndex) {
            const newAudioData = audioData.slice(lastProcessedIndex)
            const partialFile = createAudioFile(
              newAudioData,
              audioContext?.sampleRate ?? 16000,
              true
            )
            processorCallback(partialFile)
            lastProcessedIndex = audioData.length
          }
        }, 60000) // 60000 ms = 1 minute
      } catch (error) {
        console.error("Error starting recording:", error)
        throw new Error("Failed to start recording")
      }
    },

    stopRecording: function (): File {
      if (processorTimer) {
        clearInterval(processorTimer)
        processorTimer = null
      }

      if (workletNode) {
        workletNode.disconnect()
      }
      if (audioInput) {
        audioInput.disconnect()
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }

      // Process any remaining audio data
      if (audioData.length > lastProcessedIndex) {
        const remainingAudioData = audioData.slice(lastProcessedIndex)
        const partialFile = createAudioFile(
          remainingAudioData,
          audioContext?.sampleRate ?? 16000,
          true
        )
        processorCallback(partialFile)
      }

      // Create and return the full audio file
      const fullFile = createAudioFile(
        audioData,
        audioContext?.sampleRate ?? 16000,
        false
      )

      // Reset the audioData and lastProcessedIndex
      audioData = []
      lastProcessedIndex = 0

      return fullFile
    },

    getAudioData: function (): Float32Array[] {
      return audioData
    },
  }

  return audioRecorder
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
