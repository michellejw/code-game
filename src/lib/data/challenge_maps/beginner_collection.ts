import { type ChallengeMap } from '../types'

export const beginnerCollection: ChallengeMap = {
  id: 'beginner',
  name: 'Beginner Python Adventure',
  description: 'A fun treasure hunt with simple Python puzzles!',
  challenges: [
    {
      challengeId: '1', // Print Your Name challenge
      clueId: 'pillow',
      unlockCode: 'UNICORN'
    },
    {
      challengeId: '2', // Counting Apples challenge  
      clueId: 'tv',
      unlockCode: 'APPLES'
    },
    {
      challengeId: '3', // Magic Word challenge
      clueId: 'book',
      unlockCode: 'BOOK'
    },
    {
      challengeId: '4', // Secret Password challenge
      clueId: 'shoes', 
      unlockCode: 'SHOES'
    },
    {
      challengeId: '5', // Animal Sounds challenge
      clueId: 'crate',
      unlockCode: 'WELCOME',
      isFinal: true
    }
  ]
}
