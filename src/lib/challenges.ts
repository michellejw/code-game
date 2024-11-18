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
    title: 'Challenge: Print Your Name',
    description:
      'Can you help the computer say hello? Type your name in the quotes!',
    initialCode: 'name = ""\nprint("Hello, " + name)',
    validateOutput: (output: string) => {
      return output.startsWith('Hello, ') && output.trim() !== 'Hello, '
    },
    nextClue: 'Great job! Look under your pillow for the next clue! 🦄',
    requiredCode: 'print',
    unlockCode: 'UNICORN',
    hint: 'Make sure to put your name between the quotes!',
  },
  {
    id: '2',
    title: 'Challenge: Counting Apples',
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
    title: 'Challenge: The Magic Word',
    description:
      "When you want something, it's polite to say a special word! Can you make the computer say the magic word that starts with 'P' and ends with 'E'?",
    initialCode: 'magic_word = ""\nprint("The magic word is: " + magic_word)',
    validateOutput: (output: string) => {
      return output.toLowerCase().includes('the magic word is: please')
    },
    nextClue: 'Amazing! Look in the Rosie Revere book for the next clue! 📚',
    requiredCode: 'print',
    unlockCode: 'BOOK',
    hint: "What do we say when we want something? It starts with P and ends with E!",
  },
  {
    id: '4',
    title: 'Challenge: Secret Password',
    description:
      'The secret clubhouse needs a password! Can you make it say "OPEN SESAME" to get in?',
    initialCode: 'password = ""\nprint("The password is: " + password)',
    validateOutput: (output: string) => {
      return output.toLowerCase().includes('the password is: open sesame')
    },
    nextClue: 'Excellent! Check inside your blue crocs for the next clue! 👟',
    requiredCode: 'print',
    unlockCode: 'SHOES',
    hint: 'What magical words did Ali Baba use to open the cave? (It starts with OPEN...)',
  },
  {
    id: '5',
    title: 'Challenge: Animal Sounds',
    description:
      'Can you make the computer say what sound a dog makes? Type "WOOF" to make the puppy bark!',
    initialCode: 'dog_sound = ""\nprint("The dog says: " + dog_sound + "!")',
    validateOutput: (output: string) => {
      return output.toLowerCase().includes('the dog says: woof!')
    },
    nextClue: 'Perfect! Look in the dog crate for your final surprise! 🎁',
    requiredCode: 'print',
    unlockCode: 'WELCOME',
    finalPrizeLocation: "Check the porch egg chair for your grand prize! 🎉",
    hint: 'What sound does a dog make? It starts with W and ends with F!',
  },
]
