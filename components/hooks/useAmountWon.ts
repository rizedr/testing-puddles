// Temporary interface to fix type error
interface Player {
    player_id: string;
    amount: bigint;
    action?: any;
    hand_win_odds?: number;
    hand?: any[];
}

import useGameData from './useGameData';

/**
 * Hook to get the amount won by a player in the current game
 */
export const useAmountWon = (player: Player) => {
    const { winnerData } = useGameData();
    const amountWon = winnerData?.winner_deltas?.[player.player_id] ?? 0;

    return {
        amountWon,
        hasWon: amountWon > 0,
    };
};
