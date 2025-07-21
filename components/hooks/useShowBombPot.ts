import { PokerGameState } from '../../client';
import useGameData from './useGameData';

/**
 * Hook to determine if the bomb pot should be displayed
 */
export const useShowBombPot = () => {
    const { bombPotEligible, gameState } = useGameData();
    return bombPotEligible && gameState === PokerGameState.PRE_FLOP;
};
