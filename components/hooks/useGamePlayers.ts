import { useQuery } from 'convex/react';
import { Player } from '../../client';
import { api } from '../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../packages/convex/convex/_generated/dataModel';
import { GameHistoryType } from './useGameHistory';

interface PlayerWithBuyInInfo {
    player_id: string;
    totalBuyIn: bigint;
    totalCashout: bigint;
    currentStack: number;
    playerPnl: number;
    // timeRequested: string;
    // firstBuyInTimestamp: number;
}

const SPECIAL_ACCOUNTS = ['ADMIN_surplus', 'ADMIN', 'ADMIN_rewards'];

export const useGameAllPlayers = (gameId: string) => {
    const gameTransactions = useQuery(api.tasks.getGameTransactionsForGame, {
        gameId: gameId as Id<'gameData'>,
    }) ?? { debits: [], credits: [] };
    const gameDataQuery = useQuery(api.tasks.getGameDataPublic, {
        gameId: gameId as Id<'gameData'>,
    });

    if (!gameTransactions || !gameDataQuery) {
        return {
            players: [],
            loading: true,
        };
    }

    const allGameTransactions = [
        ...gameTransactions.debits.map((debit) => ({
            time: debit._creationTime,
            gameHistoryType: GameHistoryType.CASH_OUT,
            gameId: debit.debitAccount.split('_')[1] as Id<'gameData'>,
            amount: debit.amount,
            userId: debit.creditAccount,
        })),
        ...gameTransactions.credits.map((credit) => ({
            time: credit._creationTime,
            gameHistoryType: GameHistoryType.BUY_IN,
            gameId: credit.creditAccount.split('_')[1] as Id<'gameData'>,
            amount: credit.amount,
            userId: credit.debitAccount,
        })),
    ].filter((transaction) => !SPECIAL_ACCOUNTS.includes(transaction.userId));

    const players: PlayerWithBuyInInfo[] = allGameTransactions.reduce(
        (acc, gameHistoryEntry) => {
            const existingPlayer = acc.find(
                (p) => p.player_id === gameHistoryEntry.userId,
            );
            const player = gameDataQuery?.gameData?.players?.find(
                (p: Player) => p.player_id === gameHistoryEntry.userId,
            );

            if (existingPlayer) {
                // Update existing player
                if (
                    gameHistoryEntry.gameHistoryType === GameHistoryType.BUY_IN
                ) {
                    existingPlayer.totalBuyIn += BigInt(
                        gameHistoryEntry.amount,
                    );
                } else if (
                    gameHistoryEntry.gameHistoryType ===
                    GameHistoryType.CASH_OUT
                ) {
                    existingPlayer.totalCashout += BigInt(
                        gameHistoryEntry.amount,
                    );
                }
                existingPlayer.playerPnl = Number(
                    BigInt(player?.amount ?? 0) +
                        existingPlayer.totalCashout -
                        existingPlayer.totalBuyIn,
                );
                return acc;
            }

            // Add new player
            acc.push({
                player_id: gameHistoryEntry.userId,
                totalBuyIn:
                    gameHistoryEntry.gameHistoryType === GameHistoryType.BUY_IN
                        ? BigInt(gameHistoryEntry.amount)
                        : BigInt(0),
                totalCashout:
                    gameHistoryEntry.gameHistoryType ===
                    GameHistoryType.CASH_OUT
                        ? BigInt(gameHistoryEntry.amount)
                        : BigInt(0),
                currentStack: player?.amount ?? 0,
                playerPnl: Number(
                    BigInt(player?.amount ?? 0) +
                        (gameHistoryEntry.gameHistoryType ===
                        GameHistoryType.CASH_OUT
                            ? BigInt(gameHistoryEntry.amount)
                            : BigInt(0)) -
                        (gameHistoryEntry.gameHistoryType ===
                        GameHistoryType.BUY_IN
                            ? BigInt(gameHistoryEntry.amount)
                            : BigInt(0)),
                ),
            });
            return acc;
        },
        [] as (PlayerWithBuyInInfo & {
            totalBuyIn: bigint;
            totalCashout: bigint;
        })[],
    );
    return {
        players,
        loading: gameTransactions === undefined,
    };
};
