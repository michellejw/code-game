import { Challenge } from '@/lib/types/index';

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Challenge: Print Your Name',
    description: 'Can you help the computer say hello? Type your name in the quotes!',
    initialCode: 'name = ""\nprint("Hello, " + name)',
    validateOutput: (output: string) => {
      return output.startsWith('Hello, ') && output.trim() !== 'Hello, ';
    },
    clueId: 'pillow', // Links to clues.json
    unlockCode: 'UNICORN',
    hint: 'Make sure to put your name between the quotes!',
  },
  {
    id: '2',
    title: 'Challenge: Counting Apples',
    description: 'You have 5 apples, and your friend gives you 5 more. Change the number of starting apples to get the correct total of 10 apples!',
    initialCode: 'apples = 0\nprint("You have " + str(apples + 5) + " apples")',
    validateOutput: (output: string) => {
      return output.includes('You have 10 apples');
    },
    clueId: 'tv',
    unlockCode: 'APPLES',
    hint: 'Remember: 5 apples + 5 more apples = 10 apples. What starting number do you need?',
  },
  {
    id: '5',
    title: 'Challenge: Animal Sounds',
    description: 'Can you make the computer say what sound a dog makes? Type "WOOF" to make the puppy bark!',
    initialCode: 'dog_sound = ""\nprint("The dog says: " + dog_sound + "!")',
    validateOutput: (output: string) => {
      return output.toLowerCase().includes('the dog says: woof!');
    },
    clueId: 'final_prize', // Reference the final prize clue
    unlockCode: 'WELCOME',
    hint: 'What sound does a dog make? It starts with W and ends with F!',
    isFinal: true, // Indicate this is the final challenge
  },
  // Add more challenges as needed...
];
