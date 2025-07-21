import { useToast } from '@chakra-ui/react';

import { getBaseUrl } from '../utils/getUrl';
import useViewer from './useViewer';

export const useAffiliateLink = () => {
    const { user } = useViewer();
    const toast = useToast();

    const url = `${getBaseUrl()}${user?.affiliate?.code ? `?affiliate=${user.affiliate.code}` : ''}`;

    const copyURL = () => {
        navigator.clipboard.writeText(url);
        toast({
            title: 'Affiliate link copied',
            status: 'success',
            duration: 3000,
        });
    };

    return {
        url,
        copyURL,
    };
};
