import { usePokerGameState } from './usePokerGameState';
import { PokerGameState } from '../types/PokerGameState';

export const useIsInGame = () => {
    const gameState = usePokerGameState();
    return gameState !== PokerGameState.CREATE;
};
