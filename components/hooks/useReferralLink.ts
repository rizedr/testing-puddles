import { useToast } from '@chakra-ui/react';

import { getPokerUrl } from '../utils/getUrl';
import useViewer from './useViewer';
import useGameId from './useGameID';

export const useReferralLink = () => {
    const gameId = useGameId();
    const { userId } = useViewer();
    const toast = useToast();

    const url = `${getPokerUrl()}/${gameId}${userId ? `?ref=${userId}` : ''}`;
    
    const copyURL = () => {
        navigator.clipboard.writeText(url);
        toast({
            title: 'Invite link copied',
            status: 'success',
            duration: 3000,
        });
    };

    return {
        url,
        copyURL,
    };
};
