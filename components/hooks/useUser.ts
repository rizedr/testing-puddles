import { useQuery } from 'convex/react';
import { api } from '../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../packages/convex/convex/_generated/dataModel';

const useUser = (userId: string | undefined) => {
    const user = useQuery(api.tasks.getUserByUserId, {
        userId: userId as Id<'users'>,
    });

    return {
        user: user,
        userId,
        isLoading: user === undefined,
    };
};

export default useUser;
