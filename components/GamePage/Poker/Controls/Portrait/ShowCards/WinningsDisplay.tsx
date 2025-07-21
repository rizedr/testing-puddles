import { Text } from '@chakra-ui/react';

import { useAmountWon } from '../../../../../hooks/useAmountWon';
import { Player } from '../../../../../../client';
import { useMoneyDisplay } from '../../../../../Shared/MoneyDisplay';

export const WinningsDisplay = ({
    currentPlayer,
}: {
    currentPlayer: Player;
}) => {
    const { hasWon, amountWon } = useAmountWon(currentPlayer as Player);
    const moneyDisplay = useMoneyDisplay(amountWon ?? 0n);
    if (!hasWon) return null;
    return (
        <Text
            color="brand.secondaryGreen"
            fontSize="1.2rem"
            fontWeight="700"
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            top="100%"
            marginTop="0.5rem"
            whiteSpace="nowrap"
            textShadow="0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3)"
        >
            + {moneyDisplay}
        </Text>
    );
};
