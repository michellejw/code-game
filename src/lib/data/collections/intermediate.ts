import { Collection } from '@/types'
import { challenges } from '@/lib/data/challenges/index'

export const intermediateCollection: Collection = {
  id: 'intermediate',
  name: 'Intermediate Python Challenges',
  description: 'The second collection of challenges',
  challenges: challenges.filter((challenge) =>
    ['4', '5'].includes(challenge.id)
  ),
  clues: ['book', 'final_prize'],
}
