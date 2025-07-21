import useGameData from '../hooks/useGameData';
import useViewer from '../hooks/useViewer';
import { formatMicroDollars } from '../utils/formatMoney';

export const useMoneyDisplay = (
    amount?: bigint,
    isFolded?: boolean,
    showAllInForZero?: boolean,
    betAmount?: bigint
): string => {
    const { user } = useViewer();
    const { bigBlind } = useGameData();
    if (!amount || !bigBlind) {
        if (user?.pokerPreferences?.displayAmountsInBigBlinds) {
            return `0 BB`;
        }
        return showAllInForZero && !isFolded && (!betAmount || betAmount === 0n) ? 'ALL-IN' : `$0.00`;
    }
    const amountInDollars = formatMicroDollars(Number(amount));
    const amountInBigBlinds = Number(amount / bigBlind);
    if (user?.pokerPreferences?.displayAmountsInBigBlinds) {
        return `${amountInBigBlinds.toFixed(2)} BB`;
    }
    return showAllInForZero &&
        amountInDollars === '0.00' &&
        !isFolded &&
        (!betAmount || betAmount === 0n)
        ? 'ALL-IN'
        : `$${amountInDollars}`;
};
