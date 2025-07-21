import useGameData from './useGameData';
import { Player } from '../../client';
import useViewer from './useViewer';

/**
 * Custom hook to determine if the user is a spectator.
 *
 * @returns {boolean} Whether the user is a spectator.
 */
export const useIsSpectator = () => {
    const { players } = useGameData();
    const { userId } = useViewer();

    return !userId || players?.every((p: Player) => p.player_id !== userId);
};

export default useIsSpectator;
