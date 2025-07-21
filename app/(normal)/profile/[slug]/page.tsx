import React from 'react';
import { VStack, Flex, Box } from '@chakra-ui/react';
import ProfilePage from '../ProfilePage';
import { ProfileHeader } from '../ProfileHeader';
import { preloadQuery } from 'convex/nextjs';
import { api } from '../../../../../../packages/convex/convex/_generated/api';
import { Preloaded } from 'convex/react';
import { Id } from '../../../../../../packages/convex/convex/_generated/dataModel';
import { OpacityCover } from '../../page';

export interface ProfileProps {
    preloadedUser: Preloaded<typeof api.tasks.getUserByUserId>;
    preloadedTransactions: Preloaded<
        typeof api.tasks.getGameTransactionsForUser
    >;
}

async function getUser(userId: Id<'users'>): Promise<ProfileProps> {
    const preloadedUser = await preloadQuery(api.tasks.getUserByUserId, {
        userId,
    });
    const preloadedTransactions =
        (await preloadQuery(api.tasks.getGameTransactionsForUser, {
            userId,
        })) ?? [];
    return { preloadedUser, preloadedTransactions };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const userId = (await params).slug;
    const userData = await getUser(userId as Id<'users'>);
    return (
        <Flex
            p="16px"
            backgroundImage={`url('/home_bg4.webp')`}
            backgroundSize="cover"
            backgroundPosition="top"
            w="100%"
            position="relative"
            overflowY="hidden"
            h="100vh"
        >
            <OpacityCover opacity={0.5} blurAmount={8} />
            <VStack
                w="100%"
                spacing="16px"
                align="stretch"
                overflowY="hidden"
                h="100dvh"
            >
                {/* <ProfileHeader /> */}
                <ProfilePage
                    preloadedUser={userData.preloadedUser}
                    preloadedTransactions={userData.preloadedTransactions}
                />
            </VStack>
        </Flex>
    );
}
