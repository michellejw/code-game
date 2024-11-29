import cluesData from './clues/index.json';
import { Clue } from '@/lib/types/index';

export const getClues = (): Clue[] => {
  return cluesData.clues;
};

export const getClueById = (id: string): Clue | undefined => {
  return cluesData.clues.find(clue => clue.id === id);
};