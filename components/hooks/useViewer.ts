import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '../../../../packages/convex/convex/_generated/api';

const useViewer = () => {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const user = useQuery(api.users.current);
    return {
        isLoading: isLoading || (isAuthenticated && user === null),
        isAuthenticated: isAuthenticated && user !== null,
        user,
        userId: user?._id ?? '',
        isAdmin: user?.role === 'ADMIN',
        isModerator: user?.role === 'MODERATOR',
    };
};

export default useViewer;
