import { PokerGameState } from '../../client';
import useGameData from './useGameData';

/**
 * Hook to determine if the ante alert should be displayed
 */
export const useShowAnte = () => {
    const { gameState, gameSettings, bombPotEligible } = useGameData();
    return !bombPotEligible && gameState === PokerGameState.ANTE && (gameSettings?.ante_value ?? 0) > 0;
};
