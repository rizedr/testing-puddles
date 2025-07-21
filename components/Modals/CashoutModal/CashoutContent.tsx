import { HStack, VStack, Text, Spacer } from '@chakra-ui/react';

import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import Confetti from 'react-confetti';
import useViewer from '../../hooks/useViewer';
import { useBalance } from '../../hooks/useCurrentBalance';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { formatMicroDollarsWithCommas } from '../../utils/formatMoney';

interface CashoutContentProps {
    cashoutAmount: bigint;
}

export const CashoutContent = ({ cashoutAmount }: CashoutContentProps) => {
    const { userId } = useViewer();
    const { rawBalance } = useBalance(`${userId}_rewards`);

    return (
        <>
            <VStack spacing="2rem" h="100%" justify="space-between" p="2rem">
                <Text size="md" whiteSpace="normal" wordBreak="break-word">
                    Here&apos;s an estimated summary of your earnings.
                    <br />
                    You will be removed from the table at the end of the hand.
                </Text>
                <HStack position="relative">
                    <Text
                        position="absolute"
                        fontSize="5.625rem"
                        bottom="-64px"
                        left="-5.25rem"
                    >
                        🎉
                    </Text>
                    <Text
                        fontSize="5.625rem"
                        position="absolute"
                        top="-2rem"
                        right="-5.25rem"
                        transform="scaleX(-1)"
                    >
                        🎉
                    </Text>
                    <Text
                        fontSize="1.5rem"
                        letterSpacing="0.07rem"
                        bg="brand.primaryBlue"
                        p="1.5rem"
                    >
                        ${convertCurrencyToDisplay(cashoutAmount)}
                    </Text>
                </HStack>
                <Spacer />
                <VStack spacing="0.5rem">
                    <Text
                        size="md"
                        color="brand.tealColor1"
                        whiteSpace="normal"
                        wordBreak="break-word"
                    >
                        Your actual cashout amount may differ if you perform any
                        actions or win the current hand.
                    </Text>
                    <Text
                        size="md"
                        color="brand.tealColor1"
                        whiteSpace="normal"
                        wordBreak="break-word"
                    >
                        The final amount will be displayed in the History tab
                        once the hand has settled.
                    </Text>
                </VStack>
                {rawBalance > 10000n && (
                    <HStack
                        w="100%"
                        h="100%"
                        justify="space-between"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        borderRadius="32px"
                        p="1rem"
                        bgGradient="linear(to-t, rgba(255,255,255,0.15), rgba(255,255,255,0.05))"
                        boxShadow="0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow:
                                '0 6px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        as={Link}
                        href="/rewards"
                    >
                        <Text>
                            🎉 You have $
                            {formatMicroDollarsWithCommas(Number(rawBalance))}{' '}
                            of rewards ready to claim
                        </Text>
                        <FaArrowRight />
                    </HStack>
                )}
            </VStack>
            <Confetti recycle={false} numberOfPieces={500} gravity={0.2} />
        </>
    );
};
