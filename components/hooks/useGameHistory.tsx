import {
    Doc,
    Id,
} from '../../../../packages/convex/convex/_generated/dataModel';
import { Ledger } from '../../../../packages/convex/convex/ledger';

export enum GameProgressStatus {
    ACTIVE = 'ACTIVE',
    WITHDRAWN = 'WITHDRAWN',
}

export interface Transaction {
    amount: bigint;
    time: Date;
}

export interface GameDetails {
    game_id: Id<'gameData'>;
    game_start_time: Date;
    last_action_time: Date;
    game_progress_status: GameProgressStatus;
    buy_in: bigint;
    rake: bigint;
    cashout: bigint;
}

export enum GameHistoryType {
    BUY_IN = 'BUY_IN',
    CASH_OUT = 'CASH_OUT',
}

export const processGameHistory = (
    userTransactions:
        | {
              userGameDebits: Ledger[];
              userGameCredits: Ledger[];
          }
        | undefined,
): GameDetails[] => {
    if (!userTransactions) {
        return [];
    }
    const allTransactions = [
        ...userTransactions.userGameDebits.map((debit) => ({
            time: debit._creationTime,
            gameHistoryType: GameHistoryType.BUY_IN,
            gameId: debit.creditAccount.split('_')[1] as Id<'gameData'>,
            amount: debit.amount,
        })),
        ...userTransactions.userGameCredits.map((credit) => ({
            time: credit._creationTime,
            gameHistoryType: GameHistoryType.CASH_OUT,
            gameId: credit.debitAccount.split('_')[1] as Id<'gameData'>,
            amount: credit.amount,
        })),
    ];
    const gameHistoryMap = allTransactions.reduce(
        (acc, row) => {
            if (!acc[row.gameId]) {
                acc[row.gameId] = {
                    buy_ins: [],
                    cashouts: [],
                };
            }

            switch (row.gameHistoryType) {
                case GameHistoryType.BUY_IN:
                    acc[row.gameId].buy_ins.push({
                        amount: row.amount,
                        time: new Date(row.time),
                    });
                    break;
                case GameHistoryType.CASH_OUT:
                    acc[row.gameId].cashouts.push({
                        amount: row.amount,
                        time: new Date(row.time),
                    });
                    break;
            }
            return acc;
        },
        {} as Record<
            Id<'gameData'>,
            {
                buy_ins: Transaction[];
                cashouts: Transaction[];
            }
        >,
    );

    return Object.entries(gameHistoryMap)
        .map(([gameId, gameHistory]) => {
            const sum = (items: Transaction[]) =>
                items.reduce((sum, item) => sum + item.amount, BigInt(0));
            const totalBuyIn = sum(gameHistory.buy_ins);
            const totalCashout = sum(gameHistory.cashouts);

            const allActions = [
                ...gameHistory.buy_ins,
                ...gameHistory.cashouts,
            ];

            const timestamps = allActions.map((item) =>
                new Date(item.time).getTime(),
            );
            const startTime = new Date(Math.min(...timestamps));
            const lastActionTime = new Date(Math.max(...timestamps));

            const isStillInGame =
                gameHistory.buy_ins.length > gameHistory.cashouts.length; // TODO: this is not entirely correct

            return {
                game_id: gameId as Id<'gameData'>,
                game_start_time: startTime,
                last_action_time: lastActionTime,
                game_progress_status: isStillInGame
                    ? GameProgressStatus.ACTIVE
                    : GameProgressStatus.WITHDRAWN,
                buy_in: totalBuyIn,
                rake: 0n, // TODO: Add rake
                cashout: totalCashout,
            };
        })
        .sort(
            (a, b) =>
                b.last_action_time.getTime() - a.last_action_time.getTime(),
        );
};
