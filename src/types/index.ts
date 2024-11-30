export interface Challenge {
  id: string // Unique identifier for the challenge
  title: string // Title of the challenge
  description: string // Description of what the challenge entails
  initialCode: string // The initial code provided to the user
  validateOutput: (output: string) => boolean // Function to validate the user's output
  clueId: string // ID linking to the clue for this challenge
  unlockCode: string // Code needed to unlock the next challenge
  hint?: string // Optional hint for the challenge
  isFinal?: boolean // Optional flag to indicate if this is the final challenge
  requiredCode?: string // Optional code that must be present in the user's code to complete the challenge
}

export interface Clue {
  id: string // Unique identifier for the clue
  clue: string // The clue text
}

export interface Collection {
  id: string // Unique identifier for the collection
  name: string // Name of the collection
  description: string // Description of the collection
  challenges: string[] // Array of Challenge IDs
  clues: string[] // Array of clue IDs included in this collection
}
