import { getPokerGameState } from '../types/PokerGameState';
import useGameData from './useGameData';

/**
 * @returns the current poker game state
 */
export const usePokerGameState = () => {
    const { gameState } = useGameData();
    return getPokerGameState(gameState);
};
