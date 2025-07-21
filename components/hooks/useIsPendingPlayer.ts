import useGameData from './useGameData';
import useViewer from './useViewer';

/**
 * Custom hook to determine if the user is a pending player.
 *
 * @returns {boolean} Whether the user is a pending player.
 */
export const useIsPendingPlayer = () => {
    const { pendingPlayers } = useGameData();
    const { userId } = useViewer();

    return pendingPlayers?.find((p) => p.player_id === userId) !== undefined;
};

export default useIsPendingPlayer;
