'use client';

import { Box, HStack, useBreakpointValue } from '@chakra-ui/react';
import { Rewards } from './Rewards';
import { ReferralsTable } from './ReferralsTable';
import { HostTable } from './HostTable';
import { OpacityCover } from '../page';
import useViewer from '../../../components/hooks/useViewer';
import { useState } from 'react';

export const RewardsPage = () => {
    const { userId, user } = useViewer();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const [activeTab, setActiveTab] = useState<'host' | 'affiliate'>('host');
    const [gamesHostedCount, setGamesHostedCount] = useState(0);

    return (
        <Box
            backgroundImage={`url('/home_bg4.webp')`}
            backgroundSize="cover"
            backgroundPosition="top"
            minH="100vh"
            w="100%"
            position="relative"
            overflowY="auto"
            p="1.5rem"
        >
            <OpacityCover opacity={0.4} blurAmount={2} />
            <Box
                display="flex"
                justifyContent="center"
                w="100%"
            >
                <HStack 
                    spacing="1rem" 
                    align="flex-start"
                    flexDir={isPortrait ? "column" : "row"}
                >
                    <Rewards onTabChange={setActiveTab} gamesHostedCount={gamesHostedCount} />
                    {activeTab === 'host' && (
                        <HostTable userId={userId as any} onGamesCountChange={setGamesHostedCount} />
                    )}
                    {activeTab === 'affiliate' && user?.affiliate && (
                        <ReferralsTable userId={userId as any} />
                    )}
                </HStack>
            </Box>
        </Box>
    );
};

export default RewardsPage;
