'use client';

import React from 'react';
import { VStack, Box, Stack, Text } from '@chakra-ui/react';

import { ProfileInfo } from '../../../components/Modals/ProfileModal/ProfileInfo';
import { GameHistoryList } from '../../../components/Shared/GameRecords/GameHistoryList';
import { ProfileStats } from '../../../components/Modals/ProfileModal/ProfileStats';
import { ProfileProps } from './[slug]/page';
import { usePreloadedQuery } from 'convex/react';
import { processGameHistory } from '../../../components/hooks/useGameHistory';
import { ProfileHeader } from './ProfileHeader';

export function ProfilePage({
    preloadedUser,
    preloadedTransactions,
}: ProfileProps) {
    const user = usePreloadedQuery(preloadedUser);
    const userTransactions = usePreloadedQuery(preloadedTransactions);
    const [showProfile, setShowProfile] = React.useState(true);
    const games = processGameHistory(userTransactions);
    
    // Don't render if user is null
    if (!user) {
        return null;
    }
    
    return (
        <Box w="100%" h="100vh" position="relative" overflowY="auto">
            <VStack w="100%" spacing="52px" align="stretch">
                <Box w="100%">
                    <ProfileHeader onSearchResult={setShowProfile} />
                </Box>
                {showProfile && (
                    <Box w="100%" maxW="1000px" px="4px" mx="auto">
                        <VStack
                            h="100%"
                            w="100%"
                            spacing="28px"
                            align="stretch"
                            pb="32px"
                        >
                            <Stack
                                h="100%"
                                w="100%"
                                spacing="1rem"
                                direction={{ base: 'column', lg: 'row' }}
                                alignItems={{
                                    base: 'stretch',
                                    lg: 'flex-start',
                                }}
                            >
                                <Box flex="1" minH="125px">
                                    <ProfileInfo userData={user} />
                                </Box>
                                <Box flex="1" minH="125px">
                                    <ProfileStats games={games} />
                                </Box>
                            </Stack>
                            {games.length === 0 ? (
                                <Text
                                    color="white"
                                    mt={4}
                                    textAlign="center"
                                    fontWeight="600"
                                    fontSize="1rem"
                                >
                                    There are no recent game records for this
                                    user.
                                </Text>
                            ) : (
                                <GameHistoryList games={games} user={user} />
                            )}
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}

export default ProfilePage;
