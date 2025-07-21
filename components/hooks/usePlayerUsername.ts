import useUser from './useUser';

export function usePlayerUsername(userId: string) {
    const { user } = useUser(userId);
    return user?.username;
}
