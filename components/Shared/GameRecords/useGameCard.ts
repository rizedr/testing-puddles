import { GameDetails } from '../../hooks/useGameHistory';
import { GameMode } from '../../../client';
import { useRouter } from 'next/navigation';
import { Doc } from '../../../../../packages/convex/convex/_generated/dataModel';

export function useGameCard(game: GameDetails, gameData?: Doc<'gameData'>) {
    const router = useRouter();

    const handleRejoinGame = () => {
        router.push(`/poker/${game.game_id}`);
    };

    const smallBlind: number = gameData?.game_settings?.small_blind_value ?? 0;
    const bigBlind: number = gameData?.game_settings?.big_blind_value ?? 0;
    const gameMode = gameData?.game_settings.game_mode ?? GameMode.NLH;
    const nonce = gameData?.nonce ?? 1;

    return {
        handleRejoinGame,
        smallBlind,
        bigBlind,
        gameMode,
        nonce,
    };
}
