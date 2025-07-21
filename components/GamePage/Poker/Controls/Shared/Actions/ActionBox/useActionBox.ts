import { PokerGameState } from '../../../../../../types/PokerGameState';
import { usePokerGameState } from '../../../../../../hooks/usePokerGameState';
import { Action } from '../../../../../../../client';
import useGameData from '../../../../../../hooks/useGameData';
import useViewer from '../../../../../../hooks/useViewer';

export const useActionBox = () => {
    const { userId } = useViewer();
    const { players, currentDecidingPlayer } = useGameData();
    const gameState = usePokerGameState();
    const you = players?.find((player) => player?.player_id === userId);
    const shouldShowActions =
        you?.action != Action.FOLD &&
        you?.action != Action.ALL_IN &&
        you?.action !== Action.AWAY &&
        gameState !== PokerGameState.SHOWDOWN &&
        gameState !== PokerGameState.RESET;
    const shouldShowAllIn =
        you?.action == Action.ALL_IN && gameState !== PokerGameState.SHOWDOWN;
    const isCurrentDecidingPlayer = currentDecidingPlayer === userId;

    return { shouldShowActions, isCurrentDecidingPlayer, shouldShowAllIn };
};
