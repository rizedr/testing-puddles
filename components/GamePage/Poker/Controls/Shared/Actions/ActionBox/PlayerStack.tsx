import { Hide, HStack, Text } from '@chakra-ui/react';

import { useAmountWon } from '../../../../../../hooks/useAmountWon';
import { useUserStatus } from '../../../../../../hooks/useUserStatus';

import { useActionBox } from './useActionBox';
import { useMoneyDisplay } from '../../../../../../Shared/MoneyDisplay';

export const PlayerStack = () => {
    const { currentPlayer, isWinner } = useUserStatus();
    const { isCurrentDecidingPlayer } = useActionBox();
    const { amountWon, hasWon } = useAmountWon(currentPlayer);
    const moneyDisplay = useMoneyDisplay(
        hasWon ? amountWon : currentPlayer.amount,
    );
    return (
        <Hide below="lg">
            <HStack spacing="0.5rem">
                {currentPlayer && (
                    <Text
                        fontSize="1.325rem"
                        lineHeight="1.5rem"
                        variant="bold"
                        paddingX="1.5625rem"
                        paddingY="0.75rem"
                        borderRadius="xl"
                        bg="brand.determinationGray"
                        textColor={
                            isWinner
                                ? 'brand.winnerGreen'
                                : isCurrentDecidingPlayer
                                  ? 'brand.accentWhite'
                                  : 'brand.white50'
                        }
                    >
                        {hasWon ? '+' : ''}
                        {moneyDisplay}
                    </Text>
                )}
            </HStack>
        </Hide>
    );
};
