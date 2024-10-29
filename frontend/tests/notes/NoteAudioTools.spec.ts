import { flushPromises } from "@vue/test-utils"
import NoteAudioTools from "@/components/notes/accessory/NoteAudioTools.vue"
import helper from "@tests/helpers"
import { vi } from "vitest"
import makeMe from "@tests/fixtures/makeMe"

const mockMediaStreamSource = {
  connect: vi.fn(),
  disconnect: vi.fn(),
}

const mockAudioWorklet = {
  addModule: vi.fn(),
}

const mockAudioContext = {
  createMediaStreamSource: () => mockMediaStreamSource,
  audioWorklet: mockAudioWorklet,
  destination: {},
}

const mockAudioWorkletNode = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  port: {
    onmessage: null,
    postMessage: vi.fn(),
  },
}

// Mock navigator.mediaDevices
const mockMediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: () => [
      {
        stop: vi.fn(),
      },
    ],
  }),
}

// Apply mocks to global object
Object.defineProperty(global, "AudioContext", {
  writable: true,
  value: vi.fn(() => mockAudioContext),
})

// Apply mocks to global object
Object.defineProperty(global, "AudioWorkletNode", {
  writable: true,
  value: vi.fn(() => mockAudioWorkletNode),
})

Object.defineProperty(global.navigator, "mediaDevices", {
  value: mockMediaDevices,
  writable: true,
})

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:mocked-url")

// Mock getAudioRecordingWorkerURL
vi.mock("@/models/audio/recorderWorklet", () => ({
  getAudioRecordingWorkerURL: vi.fn(() => "mocked-worker-url"),
}))

const findButtonByTitle = (wrapper, title: string) => {
  return wrapper
    .findAll("button")
    .find((button) => button.attributes("title") === title)
}

describe("NoteAudioTools", () => {
  let wrapper
  const note = makeMe.aNote.please()

  beforeEach(() => {
    vi.useFakeTimers()
    // Mock the canvas element
    const mockContext = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
    }
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      mockContext as unknown as CanvasRenderingContext2D
    )

    wrapper = helper
      .component(NoteAudioTools)
      .withStorageProps({
        note,
      })
      .mount()

    // Reset Web Audio API mocks
    mockMediaStreamSource.connect.mockClear()
    mockMediaStreamSource.disconnect.mockClear()
    mockAudioWorklet.addModule.mockClear()
    mockAudioWorkletNode.connect.mockClear()
    mockAudioWorkletNode.disconnect.mockClear()
    mockAudioWorkletNode.port.postMessage.mockClear()
    mockMediaDevices.getUserMedia.mockClear()
  })

  it("renders the component with correct buttons", () => {
    expect(findButtonByTitle(wrapper, "Record Audio")).toBeTruthy()
    expect(findButtonByTitle(wrapper, "Stop Recording")).toBeTruthy()
  })

  it("disables Record Audio button when recording", async () => {
    const recordButton = findButtonByTitle(wrapper, "Record Audio")
    expect(recordButton.attributes("disabled")).toBeFalsy()
    await recordButton.trigger("click")
    await flushPromises()
    expect(recordButton.attributes("disabled")).toBeDefined()
  })

  it("enables Stop Recording button when recording", async () => {
    const recordButton = findButtonByTitle(wrapper, "Record Audio")
    const stopButton = findButtonByTitle(wrapper, "Stop Recording")

    expect(stopButton.attributes("disabled")).toBeDefined()

    await recordButton.trigger("click")
    await flushPromises()
    expect(stopButton.attributes("disabled")).toBeUndefined()
  })

  it("starts recording when Record Audio button is clicked", async () => {
    const recordButton = findButtonByTitle(wrapper, "Record Audio")

    await recordButton.trigger("click")
    await flushPromises()

    expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(mockMediaStreamSource.connect).toHaveBeenCalledWith(
      mockAudioWorkletNode
    )
    expect(mockAudioWorkletNode.connect).toHaveBeenCalledWith(
      mockAudioContext.destination
    )
    expect(wrapper.vm.isRecording).toBe(true)
  })

  it("stops recording when Stop Recording button is clicked", async () => {
    // First, start recording
    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()

    const stopButton = findButtonByTitle(wrapper, "Stop Recording")
    await stopButton.trigger("click")
    await flushPromises()

    expect(mockAudioWorkletNode.disconnect).toHaveBeenCalled()
    expect(mockMediaStreamSource.disconnect).toHaveBeenCalled()
    expect(wrapper.vm.isRecording).toBe(false)
  })

  it("stops browser recording and resets audio context when Stop Recording button is clicked", async () => {
    const mockTrackStop = vi.fn()
    mockMediaDevices.getUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: mockTrackStop }],
    })

    // Start recording
    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()

    // Stop recording
    const stopButton = findButtonByTitle(wrapper, "Stop Recording")
    await stopButton.trigger("click")
    await flushPromises()

    // Check if all tracks in the media stream were stopped
    expect(mockTrackStop).toHaveBeenCalled()

    // Check if isRecording is set to false
    expect(wrapper.vm.isRecording).toBe(false)

    // Check if audio context is reset
    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()
    expect(mockMediaStreamSource.connect).toHaveBeenCalledTimes(2)
  })

  it("renders Save Audio Locally button", () => {
    expect(findButtonByTitle(wrapper, "Save Audio Locally")).toBeTruthy()
  })

  it("disables Save Audio Locally button when recording", async () => {
    const saveButton = findButtonByTitle(wrapper, "Save Audio Locally")
    expect(saveButton.attributes("disabled")).toBeDefined()

    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()

    expect(saveButton.attributes("disabled")).toBeDefined()
  })

  it("enables Save Audio Locally button when not recording and audio file exists", async () => {
    const saveButton = findButtonByTitle(wrapper, "Save Audio Locally")
    expect(saveButton.attributes("disabled")).toBeDefined()

    // Simulate recording and stopping
    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()
    await findButtonByTitle(wrapper, "Stop Recording").trigger("click")
    await flushPromises()

    // Mock the existence of an audio file
    wrapper.vm.audioFile = new File([], "test.webm")

    await wrapper.vm.$nextTick()
    expect(saveButton.attributes("disabled")).toBeUndefined()
  })

  it("calls saveAudioLocally when Save Audio Locally button is clicked", async () => {
    const saveButton = findButtonByTitle(wrapper, "Save Audio Locally")

    // Mock the existence of an audio file
    wrapper.vm.audioFile = new File([], "test.webm")
    await wrapper.vm.$nextTick()

    const mockCreateObjectURL = vi.fn(() => "blob:mocked-url")
    const mockRevokeObjectURL = vi.fn()
    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    const mockAppendChild = vi.fn()
    const mockRemoveChild = vi.fn()
    const mockClick = vi.fn()
    document.body.appendChild = mockAppendChild
    document.body.removeChild = mockRemoveChild
    HTMLAnchorElement.prototype.click = mockClick

    await saveButton.trigger("click")

    expect(mockCreateObjectURL).toHaveBeenCalledWith(wrapper.vm.audioFile)
    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mocked-url")
  })

  it("renders close button and emits closeDialog event when clicked", async () => {
    const closeButton = wrapper.find(".close-btn")
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger("click")
    expect(wrapper.emitted().closeDialog).toBeTruthy()
  })

  it("stops recording and emits closeDialog event when close button is clicked while recording", async () => {
    // Start recording
    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()

    const closeButton = wrapper.find(".close-btn")
    await closeButton.trigger("click")

    expect(wrapper.vm.isRecording).toBe(false)
    expect(mockAudioWorkletNode.disconnect).toHaveBeenCalled()
    expect(mockMediaStreamSource.disconnect).toHaveBeenCalled()
    expect(wrapper.emitted().closeDialog).toBeTruthy()
  })

  it("renders Flush Audio button", () => {
    expect(findButtonByTitle(wrapper, "Flush Audio")).toBeTruthy()
  })

  it("disables Flush Audio button when not recording", () => {
    const flushButton = findButtonByTitle(wrapper, "Flush Audio")
    expect(flushButton.attributes("disabled")).toBeDefined()
  })

  it("enables Flush Audio button when recording", async () => {
    const recordButton = findButtonByTitle(wrapper, "Record Audio")
    const flushButton = findButtonByTitle(wrapper, "Flush Audio")

    expect(flushButton.attributes("disabled")).toBeDefined()

    await recordButton.trigger("click")
    await flushPromises()
    expect(flushButton.attributes("disabled")).toBeUndefined()
  })

  it("calls audioRecorder.flush when Flush Audio button is clicked", async () => {
    const mockFlush = vi.fn()
    wrapper.vm.audioRecorder.flush = mockFlush

    // Start recording
    await findButtonByTitle(wrapper, "Record Audio").trigger("click")
    await flushPromises()

    const flushButton = findButtonByTitle(wrapper, "Flush Audio")
    await flushButton.trigger("click")

    expect(mockFlush).toHaveBeenCalled()
  })
})