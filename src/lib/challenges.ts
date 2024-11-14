export interface Challenge {
  id: string
  title: string
  description: string
  initialCode: string
  validateOutput: (output: string) => boolean
  nextClue: string
  requiredCode?: string
  unlockCode: string
  finalPrizeLocation?: string
  hint?: string
}

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Print Your Name',
    description:
      'Can you help the computer say hello? Type your name in the quotes!',
    initialCode: 'name = ""\nprint("Hello, " + name)',
    validateOutput: (output: string) => {
      return output.includes('Hello, ') && output !== 'Hello, '
    },
    nextClue: 'Great job! Look under your pillow for the next clue! 🦄',
    requiredCode: 'print',
    unlockCode: 'UNICORN',
    hint: 'Make sure to put your name between the quotes!',
  },
  {
    id: '2',
    title: 'Counting Apples',
    description:
      'You have 5 apples, and your friend gives you 5 more. Change the number of starting apples to get the correct total of 10 apples!',
    initialCode: 'apples = 0\nprint("You have " + str(apples + 5) + " apples")',
    validateOutput: (output: string) => {
      return output.includes('You have 10 apples')
    },
    nextClue: 'Super! Check behind the TV for your next clue! 📺',
    requiredCode: 'print',
    unlockCode: 'APPLES',
    hint: 'Remember: 5 apples + 5 more apples = 10 apples. What starting number do you need?',
  },
  {
    id: '3',
    title: 'The Magic Word',
    description:
      "When you want something, it's polite to say a special word! Can you make the computer say the magic word that starts with 'P' and ends with 'E'?",
    initialCode: 'magic_word = ""\nprint("The magic word is: " + magic_word)',
    validateOutput: (output: string) => {
      return output.includes('The magic word is: PLEASE')
    },
    nextClue: 'Amazing! Look in your favorite book for the next clue! 📚',
    requiredCode: 'print',
    unlockCode: 'BOOK',
    finalPrizeLocation: "Look in mom's desk drawer for your prize! 🎁",
    hint: "What do we say when we want something? The magic word that means 'May I have'?",
  },
]
