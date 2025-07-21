import { useGetCurrentPlayer } from '../../../../../../../hooks/useGetCurrentPlayer';
import useGameData from '../../../../../../../hooks/useGameData';

export const useRaiseActions = () => {
    const { raiseOptions } = useGameData();
    const {
        min_raise: minRaiseValue,
        half_pot_raise: halfPotRaiseValue,
        three_quarters_pot_raise: threeQuarterPotRaiseValue,
        pot_raise: potRaiseValue,
    } = raiseOptions;

    const currentPlayer = useGetCurrentPlayer();
    const currentUserAmount = currentPlayer?.amount || 0;
    const currentUserBet = currentPlayer?.bet_amount || 0;

    const raiseActions = [
        {
            name: 'Min',
            value: minRaiseValue,
        },
        {
            name: '1/2 Pot',
            value: halfPotRaiseValue,
        },
        {
            name: '3/4 Pot',
            value: threeQuarterPotRaiseValue,
        },
        {
            name: 'Pot',
            value: potRaiseValue,
        },
        {
            name: 'All In',
            value: currentUserAmount + currentUserBet,
        },
    ];

    return {
        raiseActions,
    };
};
