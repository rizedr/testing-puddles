import React, { useMemo } from 'react';
import {
    VStack,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    Text,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { Id, Doc } from '../../../../../packages/convex/convex/_generated/dataModel';

const formatAmount = (amount: bigint | number) => {
    const amountNumber = Number(amount) / 1000000;
    return `$${amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Referrals = () => {
    // Get all users
    const allUsers = useQuery(api.users.getAllUsers);
    const userIds: Id<'users'>[] = allUsers ? allUsers.map((u: Doc<'users'>) => u._id).filter(Boolean) : [];
    const rewards = useQuery(api.tasks.batchGetLifetimeRewardsForUsers, userIds.length > 0 ? { userIds } : 'skip');

    // Merge users and rewards
    const leaderboard = useMemo(() => {
        if (!allUsers || !rewards) return [];
        const rewardsMap: Record<string, bigint> = Object.fromEntries(rewards.map((r: { userId: Id<'users'>, lifetimeRewards: bigint }) => [r.userId, r.lifetimeRewards]));
        return allUsers
            .map((user: Doc<'users'>) => ({
                username: user.username,
                userId: user._id,
                lifetimeRewards: rewardsMap[user._id] || 0n,
            }))
            .filter((user) => user.lifetimeRewards > 0n)
            .sort((a, b) => Number(b.lifetimeRewards - a.lifetimeRewards));
    }, [allUsers, rewards]);

    return (
        <VStack w="100%" maxW="600px" spacing="1.5rem" align="start">
            <Box w="100%">
                <Text fontSize="xl" fontWeight="bold" color="white" mb="1rem">Game Referrals</Text>
                <Box
                    w="100%"
                    p="1.5rem"
                    bg="brand.gray60"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                >
                    {!allUsers || !rewards ? (
                        <Spinner color="white" />
                    ) : leaderboard.length === 0 ? (
                        <Text color="white">No users found</Text>
                    ) : (
                        <Box overflowX="auto" maxH="400px" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">Username</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="right">Earned</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {leaderboard.map((user: { username: string, userId: Id<'users'>, lifetimeRewards: bigint }) => (
                                        <Tr key={user.userId}>
                                            <Td color="white">{user.username}</Td>
                                            <Td color="white" textAlign="right" fontWeight="bold">{formatAmount(user.lifetimeRewards)}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>
        </VStack>
    );
};

export default Referrals; 