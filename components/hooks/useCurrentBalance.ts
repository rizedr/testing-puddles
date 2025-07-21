import { useQuery } from 'convex/react';
import useViewer from './useViewer';
import { api } from '../../../../packages/convex/convex/_generated/api';
import { formatMicroDollars } from '../utils/formatMoney';

interface BalanceResult {
    rawBalance: bigint;
    formattedBalance: string;
    isLoading: boolean;
}

const roundDownToNearestCent = (amount: bigint): bigint => {
    return amount - (amount % 10000n);
};

export const useBalance = (accountId: string): BalanceResult => {
    const balance =
        useQuery(api.tasks.getAccountBalance, {
            accountId,
        }) ?? 0n;
    const formattedBalance: string = formatMicroDollars(
        Number(roundDownToNearestCent(balance)),
    );
    return {
        rawBalance: balance,
        formattedBalance,
        isLoading: balance === undefined,
    };
};

export const useCurrentUserBalance = (): BalanceResult => {
    const { userId } = useViewer();

    const balance = useBalance(userId ?? '');

    return balance;
};
