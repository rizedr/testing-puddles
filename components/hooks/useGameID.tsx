import { usePathname } from 'next/navigation';
import { Id } from '../../../../packages/convex/convex/_generated/dataModel';

export const useGameId = () => {
    const pathname = usePathname();
    const gameId = pathname?.split('/').pop() as string;
    return gameId as Id<'gameData'>;
};

export default useGameId;
