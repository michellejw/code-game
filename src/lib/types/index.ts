export interface Challenge {
  id: string
  title: string
  description: string
  initialCode: string
  validateOutput: (output: string) => boolean
  clueId: string
  unlockCode: string
  hint?: string
  isFinal?: boolean
}

export interface Collection {
  id: string
  name: string
  description: string
  challengeSequence: string[]
}

export interface Clue {
  location: string
  hint?: string
}
