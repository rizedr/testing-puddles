import { useReferralLink } from '../../../../hooks/useReferralLink';
import useGameData from '../../../../hooks/useGameData';
import useViewer from '../../../../hooks/useViewer';

export const useWaitingRoom = () => {
    const { userId } = useViewer();
    const { gameHost, gameId } = useGameData();

    const isHost = gameHost === userId;
    const { url, copyURL } = useReferralLink();

    return {
        isHost,
        gameId,
        url,
        copyURL,
    };
};
