import React from 'react';
import { VStack, Box, HStack, Text } from '@chakra-ui/react';
import { GameDetails, GameProgressStatus } from '../../hooks/useGameHistory';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import { FaArrowTrendUp, FaChartLine } from 'react-icons/fa6';

const StatCard = ({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
}) => {
    return (
        <VStack
            align="start"
            spacing="1.875rem"
            border="1px solid"
            borderColor="purple.400"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%),rgb(23, 30, 65)"
            borderRadius="xl"
            p="1rem"
            flex={1}
        >
            <Box bg="white" borderRadius="full" p="0.5rem">
                {icon}
            </Box>
            <VStack spacing="0.25rem" align="start">
                <Text size="md" color="white" opacity="0.5">
                    {title}
                </Text>
                <Text fontSize="1.25rem" fontWeight="700" color="white">
                    {value}
                </Text>
            </VStack>
        </VStack>
    );
};

export const ProfileStats = ({ games }: { games: GameDetails[] }) => {
    const totalBuyins = games.reduce(
        (acc, game) => acc + BigInt(game.buy_in),
        0n,
    );
    const totalCashouts = games.reduce(
        (acc, game) => acc + BigInt(game.cashout),
        0n,
    );
    const totalPnl = totalCashouts - totalBuyins;
    const totalPnlString = convertCurrencyToDisplay(totalPnl);
    const totalPnlDisplay =
        totalPnl < 0
            ? `-$${totalPnlString.slice(1)}`
            : totalPnlString === '0.00'
              ? `$${totalPnlString}`
              : `+$${totalPnlString}`;

    return (
        <HStack
            align="start"
            flex={1}
            spacing={4}
            justifyContent="center"
            w="100%"
            h="100%"
        >
            <StatCard
                title="Games played"
                value={games.length.toString()}
                icon={<FaChartLine />}
            />
            <StatCard
                title="Profit/Loss"
                value={totalPnlDisplay}
                icon={<FaArrowTrendUp />}
            />
        </HStack>
    );
};
