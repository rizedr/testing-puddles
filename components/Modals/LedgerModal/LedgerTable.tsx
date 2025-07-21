import React from 'react';
import {
    HStack,
    Image,
    Show,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import { useGameAllPlayers } from '../../hooks/useGamePlayers';
import { formatMicroDollarsWithCommas } from '../../utils/formatMoney';
import { useQueries } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import useGameId from '../../hooks/useGameID';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';

export const LedgerTable = ({ showStack = true }: { showStack?: boolean }) => {
    const gameId = useGameId();
    const { players } = useGameAllPlayers(gameId);
    const playerIds = players.map((player) => player.player_id);
    const convex = useConvex();
    const usersQueries = useQueries({
        queries: playerIds?.map((userId) => ({
            queryKey: ['user', userId],
            queryFn: () =>
                convex.query(api.tasks.getUserByUserId, {
                    userId: userId as Id<"users">,
                }),
        })),
    });

    // Create a sorted array of player indices by PnL (descending)
    const sortedIndices = [...players.keys()].sort(
        (a, b) => players[b].playerPnl - players[a].playerPnl
    );

    return (
        <Table w="100%" size={{ base: 'sm', xl: 'md' }}>
            <Thead>
                <Tr>
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="start"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="start"
                        >
                            Player
                        </Text>
                    </Th>
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="end"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="end"
                        >
                            Buy-In
                        </Text>
                    </Th>
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="end"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="end"
                        >
                            Cashout
                        </Text>
                    </Th>
                    {showStack && (
                        <Th
                            borderBottom="1px solid"
                            borderColor="brand.gray30"
                            borderTop="none"
                            borderLeft="none"
                            borderRight="none"
                            textAlign="end"
                        >
                            <Text
                                fontSize="1rem"
                                variant="tableHeaderText"
                                textAlign="end"
                            >
                                Stack
                            </Text>
                        </Th>
                    )}
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="end"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="end"
                        >
                            PnL
                        </Text>
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {sortedIndices.map((idx) => {
                    const player = players[idx];
                    return (
                        <Tr key={player.player_id}>
                            <Td borderBottom="none">
                                <HStack overflow="hidden">
                                    <Show above="xl">
                                        <Image
                                            src={usersQueries[idx]?.data?.imageUrl}
                                            w="2.5rem"
                                            h="2.5rem"
                                            borderRadius="50%"
                                        />
                                    </Show>
                                    <Text
                                        variant="tableText"
                                        overflow="hidden"
                                        wordBreak="break-word"
                                        whiteSpace="wrap"
                                    >
                                        {usersQueries[idx]?.data?.username}
                                    </Text>
                                </HStack>
                            </Td>
                            <Td borderBottom="none" textAlign="end">
                                <Text variant="tableText" textAlign="end">
                                    {convertCurrencyToDisplay(
                                        BigInt(player.totalBuyIn),
                                    )}
                                </Text>
                            </Td>
                            <Td borderBottom="none" textAlign="end">
                                <Text variant="tableText" textAlign="end">
                                    {convertCurrencyToDisplay(
                                        BigInt(player.totalCashout),
                                    )}
                                </Text>
                            </Td>
                            {showStack && (
                                <Td borderBottom="none" textAlign="end">
                                    <Text variant="tableText" textAlign="end">
                                        {formatMicroDollarsWithCommas(
                                            player.currentStack,
                                        )}
                                    </Text>
                                </Td>
                            )}
                            <Td borderBottom="none" textAlign="end">
                                <Text
                                    variant="tableText"
                                    textAlign="end"
                                    color={
                                        player.playerPnl >= 0
                                            ? 'green.400'
                                            : 'red.400'
                                    }
                                >
                                    {player.playerPnl >= 0
                                        ? `+${convertCurrencyToDisplay(BigInt(player.playerPnl))}`
                                        : `-${convertCurrencyToDisplay(BigInt(-player.playerPnl))}`}
                                </Text>
                            </Td>
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
};

export default LedgerTable;
