import useGameData from './useGameData';
import { usePlayerUsername } from './usePlayerUsername';

export const useGetGameHostName = (): string => {
    const { gameHost } = useGameData();
    const username = usePlayerUsername(
        gameHost === 'ADMIN' ? undefined : gameHost,
    );
    return username ? username : gameHost;
};
