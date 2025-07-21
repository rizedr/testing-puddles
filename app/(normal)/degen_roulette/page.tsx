'use client';

import { DegenRouletteLayout } from './components/DegenRouletteLayout';
import { useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import useViewer from '../../../components/hooks/useViewer';

const DegenRouletteGame = () => {
    const gameState = useQuery(api.tasks.getDegenRouletteGame);
    const { user } = useViewer();
    const totalBet =
        gameState?.gameData?.players?.reduce(
            (acc, player) => acc + player.bet_amount,
            0,
        ) ?? 0;

    const sortedPlayers =
        gameState?.gameData?.players?.sort(
            (a, b) => b.bet_amount - a.bet_amount,
        ) ?? [];

    const playerBet =
        gameState?.gameData?.players?.find(
            (player) => player.player_id === user?._id,
        )?.bet_amount ?? 0;

    return (
        <DegenRouletteLayout
            players={sortedPlayers}
            totalBet={totalBet}
            playerBet={playerBet}
            targetTime={gameState?.gameData?.target_time}
            winner={gameState?.gameData?.winner}
            nonce={gameState?.gameData?.nonce}
        />
    );
};

export default DegenRouletteGame;
