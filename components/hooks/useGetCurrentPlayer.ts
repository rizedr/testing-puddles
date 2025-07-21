import useGameData from './useGameData';
import useViewer from './useViewer';

export const useGetCurrentPlayer = () => {
    const { userId } = useViewer();
    const { players } = useGameData();
    const currentPlayer = players?.find((p) => p.player_id === userId);
    return currentPlayer;
};
