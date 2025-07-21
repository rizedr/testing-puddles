import { Box, HStack, VStack, Text, Image } from '@chakra-ui/react';
import { stringToRouletteColor } from '../utils/colors';
import useUser from '../../../../components/hooks/useUser';
import { formatMicroDollars } from '../../../../components/utils/formatMoney';

interface PlayerRowProps {
    playerId: string;
    betAmount: number;
    winningChance: number;
}

export const PlayerRow = ({
    playerId,
    betAmount,
    winningChance,
}: PlayerRowProps) => {
    const { user } = useUser(playerId);
    return (
        <HStack spacing={0} w="100%">
            <HStack
                justifyContent="space-between"
                w="100%"
                h="100%"
                p={2}
                bg="#1C1C1C"
                borderRadius="16px 0 0 16px"
            >
                <Box minW="2rem">
                    <Image
                        src={user?.imageUrl ?? undefined}
                        alt="User Avatar"
                        width="3rem"
                        height="3rem"
                        borderRadius="50%"
                    />
                </Box>
                <VStack flexGrow={1} spacing={0}>
                    <HStack justifyContent="space-between" w="100%">
                        <Text fontSize="md">{user?.username}</Text>
                        <Text fontSize="md" fontWeight="bold">
                            {winningChance.toFixed(2)}%
                        </Text>
                    </HStack>
                    <HStack
                        w="100%"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={1}
                    >
                        <Text fontSize="sm" lineHeight="14px">
                            {formatMicroDollars(betAmount)}
                        </Text>
                        <Image
                            src="/GinzaCoin.png"
                            w="24px"
                            h="24px"
                            alt="Ginza Coin"
                            userSelect="none"
                            draggable={false}
                        />
                    </HStack>
                </VStack>
            </HStack>
            <Box
                h="100%"
                bg={stringToRouletteColor(playerId)}
                w="0.75rem"
                borderRadius="0 16px 16px 0"
            />
        </HStack>
    );
};
