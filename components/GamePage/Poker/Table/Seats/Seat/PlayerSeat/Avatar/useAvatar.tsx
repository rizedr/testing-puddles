import { Action, Player, PokerGameState } from '../../../../../../../../client';
import { useAmountWon } from '../../../../../../../hooks/useAmountWon';
import useGameData from '../../../../../../../hooks/useGameData';
import useViewer from '../../../../../../../hooks/useViewer';

export const useAvatar = (player: Player) => {
    const { currentDecidingPlayer, dealer, winnerData, gameState } =
        useGameData();

    const { userId } = useViewer();

    const isCurrentPlayer = player.player_id === currentDecidingPlayer;
    const isYou = player.player_id === userId;
    const isWinner =
        winnerData?.main_pot.winners.includes(player.player_id) ||
        winnerData?.side_pots?.some((sidePot) =>
            sidePot.winners.includes(player.player_id),
        );
    const isDealer = player.player_id === dealer;
    const isStraddle = player.action === Action.STRADDLE;
    const { amountWon } = useAmountWon(player);
    const isAway = player.action === Action.AWAY;
    const isFolded = player.action === Action.FOLD;
    const isYourTurn = userId === currentDecidingPlayer && isCurrentPlayer;
    const shouldDim = isFolded || isAway;
    const opacity = shouldDim ? 0.2 : 1;
    const isShowdown = gameState === PokerGameState.SHOWDOWN;

    return {
        isCurrentPlayer,
        isYou,
        isWinner,
        isDealer,
        isStraddle,
        isAway,
        amountWon,
        isYourTurn,
        opacity,
        isFolded,
        isShowdown,
    };
};
