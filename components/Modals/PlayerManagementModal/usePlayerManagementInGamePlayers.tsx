import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';

import { Player } from '../../../client';
import { useIsGameHost } from '../../hooks/useIsGameHost';
import useGameData from '../../hooks/useGameData';
import { useQueries } from '@tanstack/react-query';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { useConvex, useQuery } from 'convex/react';
import useViewer from '../../hooks/useViewer';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';
import { GameHistoryType } from '../../hooks/useGameHistory';

export const usePlayerManagementInGamePlayers = () => {
    const { userId } = useViewer();
    const [sortBy, setSortBy] = useState<
        'Time Joined' | 'Buy In Amount' | 'Player Name'
    >('Time Joined');
    const { players, gameId } = useGameData();
    const playersInGame = players?.filter((p): p is Player => p !== null);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const {
        isOpen: isSetHostOpen,
        onOpen: onSetHostOpen,
        onClose: onSetHostClose,
    } = useDisclosure();
    const isGameHost = useIsGameHost();

    const convex = useConvex();
    const usersQueries = useQueries({
        queries: playersInGame?.map((p) => ({
            queryKey: ['user', p.player_id],
            queryFn: () =>
                convex.query(api.tasks.getUserByUserId, {
                    userId: p.player_id,
                }),
        })),
    });

    const gameTransactions = useQuery(api.tasks.getGameTransactionsForGame, {
        gameId: gameId as Id<'gameData'>,
    }) || { debits: [], credits: [] };

    const allGameTransactions = [
        ...gameTransactions.debits.map((debit) => ({
            time: debit._creationTime,
            gameHistoryType: GameHistoryType.BUY_IN,
            gameId: debit.debitAccount.split('_')[1] as Id<'gameData'>,
            amount: debit.amount,
            userId: debit.creditAccount,
        })),
        ...gameTransactions.credits.map((credit) => ({
            time: credit._creationTime,
            gameHistoryType: GameHistoryType.CASH_OUT,
            gameId: credit.creditAccount.split('_')[1] as Id<'gameData'>,
            amount: credit.amount,
            userId: credit.debitAccount,
        })),
    ];

    const playersWithInfo = playersInGame.map((player, idx) => {
        const playerHistory = allGameTransactions.filter(
            (h) => h.userId === player.player_id,
        );
        const playerUsername = usersQueries[idx]?.data?.username;
        const playerImageUrl = usersQueries[idx]?.data?.imageUrl;
        const totalBuyIn =
            playerHistory
                ?.filter((h) => h.gameHistoryType === GameHistoryType.BUY_IN)
                .reduce((sum, buyIn) => sum + buyIn.amount, 0n) ?? 0n;
        const firstBuyInTime =
            (playerHistory?.filter(
                (h) => h.gameHistoryType === GameHistoryType.BUY_IN,
            ).length ?? 0) > 0
                ? new Date(
                      playerHistory?.filter(
                          (h) => h.gameHistoryType === GameHistoryType.BUY_IN,
                      )[0].time ?? '',
                  )
                : null;

        return {
            ...player,
            totalBuyIn: totalBuyIn,
            username: playerUsername ?? 'N/A',
            imageUrl: playerImageUrl ?? '',
            timeRequested: firstBuyInTime
                ? format(firstBuyInTime, 'MMM d, h:mma')
                : 'N/A',
            firstBuyInTimestamp: firstBuyInTime
                ? firstBuyInTime.getTime()
                : Infinity,
        };
    });

    // Sorting logic

    let playersWithBuyInInfo;
    switch (sortBy) {
        case 'Time Joined':
            playersWithBuyInInfo = playersWithInfo.sort(
                (a, b) => a.firstBuyInTimestamp - b.firstBuyInTimestamp,
            );
        case 'Buy In Amount':
            playersWithBuyInInfo = playersWithInfo.sort((a, b) =>
                Number(b.totalBuyIn - a.totalBuyIn),
            );
        case 'Player Name':
            playersWithBuyInInfo = playersWithInfo.sort((a, b) =>
                a.username.localeCompare(b.username),
            );
        default:
            playersWithBuyInInfo = playersWithInfo;
    }

    return {
        userId,
        sortBy,
        setSortBy,
        playersInGame,
        selectedPlayer,
        setSelectedPlayer,
        isGameHost,
        isSetHostOpen,
        onSetHostOpen,
        onSetHostClose,
        playersWithBuyInInfo,
        loading: usersQueries.some((query) => query.isLoading),
    };
};
