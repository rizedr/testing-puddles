import React from 'react';
import { VStack, HStack, Text, Box, Image } from '@chakra-ui/react';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useHotkeyBlockingDisclosure } from '../../hooks/useHotkeyBlockingDisclosure';
import { useQueries } from '@tanstack/react-query';
import Link from 'next/link';
import { useConvex } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { Doc } from '../../../../../packages/convex/convex/_generated/dataModel';

const UserRow = ({ user }: { user: Doc<'users'> | null }) => {
    return (
        <HStack key={user?._id}>
            <Image
                src={user?.imageUrl}
                width="1.25rem"
                height="1.25rem"
                borderRadius="50%"
                alt="User Avatar"
            />
            <Text
                color="brand.white80"
                cursor="pointer"
                _hover={{
                    textDecoration: 'underline',
                }}
                fontSize="12px"
            >
                <Link href={`/profile/${user?._id}`}>
                    {user?.username ?? 'N/A'}
                </Link>
            </Text>
        </HStack>
    );
};

export const ShowPlayersSection = ({ playerIds }: { playerIds?: string[] }) => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();
    const convex = useConvex();

    const usersQueries = useQueries({
        queries: playerIds?.map((userId) => ({
            queryKey: ['user', userId],
            queryFn: () =>
                convex.query(api.tasks.getUserByUserId, {
                    userId: userId,
                }),
        })),
    });

    return (
        <>
            <Box
                as="button"
                onClick={isOpen ? onClose : onOpen}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                position="relative"
            >
                <HStack spacing={1}>
                    {isOpen ? (
                        <>
                            <FaChevronDown
                                size={16}
                                color="var(--chakra-colors-brand-white80)"
                            />
                            <Text fontSize="12px">Hide Players</Text>
                        </>
                    ) : (
                        <>
                            <FaChevronRight
                                size={16}
                                color="var(--chakra-colors-brand-white80)"
                            />
                            <Text fontSize="12px">Show Players</Text>
                        </>
                    )}
                </HStack>
            </Box>
            {isOpen && (
                <HStack
                    align="start"
                    spacing="30px"
                    padding="10px"
                    ml="8px"
                    mb="4px"
                    mt="-12px"
                >
                    <VStack align="start" spacing={2} flex="1">
                        {playerIds
                            ?.slice(0, Math.ceil(playerIds.length / 2))
                            .map((playerId, idx) => (
                                <UserRow
                                    key={playerId}
                                    user={usersQueries[idx]?.data ?? null}
                                />
                            ))}
                    </VStack>
                    <VStack align="start" spacing={2} flex="1">
                        {playerIds
                            ?.slice(Math.ceil(playerIds.length / 2))
                            .map((playerId, idx) => (
                                <UserRow
                                    key={playerId}
                                    user={
                                        usersQueries[
                                            idx +
                                                Math.ceil(playerIds.length / 2)
                                        ]?.data ?? null
                                    }
                                />
                            ))}
                    </VStack>
                </HStack>
            )}
        </>
    );
};
