import useGameData from './useGameData';

import { useGetCurrentPlayer } from './useGetCurrentPlayer';

export const useGetPlayerRaise = () => {
    const { raiseOptions } = useGameData();
    const minRaise = raiseOptions?.min_raise;
    const currentPlayer = useGetCurrentPlayer();
    const currentUserAmount = currentPlayer?.amount || 0;
    const currentUserBet = currentPlayer?.bet_amount || 0;
    const playerMinRaise = minRaise;

    const isMinRaise = (val: number) => val <= playerMinRaise;

    return {
        isMinRaise,
        minRaise,
        maxRaise: currentUserAmount + currentUserBet,
    };
};
