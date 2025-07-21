import { HandName, Action } from '../../client';
import useIsSpectator from './useIsSpectator';
import useGameData from './useGameData';
import useViewer from './useViewer';

/**
 * Custom hook to determine the user's status in the game.
 *
 * @returns {Object} An object containing the user's status derived from the game data:
 * - isWinner {boolean}: Whether the user is the winner.
 * - isSpectator {boolean}: Whether the user is a spectator.
 * - isCurrentDecidingPlayer {boolean}: Whether the user is the current deciding player.
 * - isAway {boolean}: Whether the user is away.
 * - isHost {boolean}: Whether the user is the host.
 * - isShowingCards {boolean}: Whether the user is showing any of their cards.
 * - isLastPlayerStanding {boolean}: Whether the user is the last player standing.
 * - isFolded {boolean}: Whether the user is folded.
 * - isPlayer {boolean}: Whether the user is a player.

 */
export const useUserStatus = () => {
    const isSpectator = useIsSpectator();
    const { currentDecidingPlayer, gameHost, winnerData, players } =
        useGameData();

    const { userId } = useViewer();
    const isWinner =
        winnerData?.main_pot?.winners?.includes(userId as string) ||
        winnerData?.side_pots?.some((sidePot) =>
            sidePot?.winners?.includes(userId as string),
        );

    const isCurrentDecidingPlayer =
        !!currentDecidingPlayer && !!userId && currentDecidingPlayer === userId;

    const currentPlayer = players?.find((p) => p.player_id === userId);
    const hand = currentPlayer?.hand?.filter((card) => card) || [];
    const handName = currentPlayer?.hand_name;
    const showCards = currentPlayer?.hand.map((card) => card.show) || [];
    const isShowingCards =
        hand.filter((_, index) => showCards[index]).length > 0;

    const isHost = userId === gameHost;
    const isLastPlayerStanding = handName === HandName.LAST_PLAYER_STANDING;
    const isAway = currentPlayer?.action === Action.AWAY;
    const isYou = currentPlayer?.player_id === userId;
    const isFolded = currentPlayer?.action === Action.FOLD;
    const isPlayer = !!currentPlayer;

    const userStatus = {
        currentPlayer,
        isAway,
        isCurrentDecidingPlayer,
        isFolded,
        isHost,
        isLastPlayerStanding,
        isShowingCards,
        isSpectator,
        isWinner,
        isYou,
        isPlayer,
    };

    return userStatus;
};

export default useUserStatus;
