interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }
  
  interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }
  
  interface SpeechRecognitionResult {
    length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
  
  declare class SpeechRecognition extends EventTarget {
    constructor()
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: SpeechRecognitionErrorEvent) => void
    onend: () => void
    start(): void
    stop(): void
    abort(): void
  }
s  