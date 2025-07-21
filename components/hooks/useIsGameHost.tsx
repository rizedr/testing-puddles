import useGameData from './useGameData';
import useViewer from './useViewer';

export const useIsGameHost = () => {
    const { userId } = useViewer();
    const { gameHost } = useGameData();
    return userId === gameHost;
};
