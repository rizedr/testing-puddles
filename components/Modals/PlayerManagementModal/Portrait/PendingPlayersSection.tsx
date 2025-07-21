import {
    Text,
    VStack,
    HStack,
    Grid,
    Button,
    Box,
    useToast,
    Image,
} from '@chakra-ui/react';

import { usePlayerManagementPendingPlayers } from '../usePlayerManagementPendingPlayers';
import { Action, playerAction, Player } from '../../../../client';
import useGameData from '../../../hooks/useGameData';
import { useState } from 'react';
import { PlayerManagementSortMenu } from '../InGamePlayersTable';
import useUser from '../../../hooks/useUser';
import useGameId from '../../../hooks/useGameID';

const PendingPlayersSection = () => {
    const { sortBy, setSortBy, pendingPlayers } =
        usePlayerManagementPendingPlayers();

    return (
        <>
            <HStack
                justifyContent="space-between"
                mb="4"
                borderBottom="1px solid"
                borderColor="brand.gray30"
                pb="0.3rem"
            >
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="brand.secondaryOrange"
                >
                    Waiting for approval ({pendingPlayers.length})
                </Text>
                <PlayerManagementSortMenu
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </HStack>
            <VStack spacing="1.5rem" align="stretch">
                {pendingPlayers?.map((player: Player) => (
                    <PendingPlayerRow key={player.player_id} player={player} />
                ))}
            </VStack>
        </>
    );
};

const PendingPlayerRow = ({ player }: { player: Player }) => {
    const toast = useToast();
    const handleError = (error: any) => {
        toast({
            title: `Unable to approve player: ${error}`,
            status: 'error',
            duration: 2000,
        });
    };
    const [approveLoading, setApproveLoading] = useState<boolean>(false);
    const [rejectLoading, setRejectLoading] = useState<boolean>(false);

    const gameId = useGameId();

    const { user } = useUser(player.player_id);

    return (
        <HStack
            backgroundColor={'brand.gray50'}
            borderRadius="5px"
            p="1rem"
            gap="1.5rem"
            key={player.player_id}
        >
            <Box flex={0.25}>
                <Image
                    src={user?.imageUrl}
                    width="2.5rem"
                    height="2.5rem"
                    borderRadius="50%"
                    alt="User Avatar"
                />
            </Box>
            <HStack flex={1.5}>
                <VStack>
                    <Text variant="mobilePlayerManagementUsername" w={'100%'}>
                        {user?.username}
                    </Text>
                    <Grid
                        color="white"
                        templateColumns="1fr 1fr"
                        templateRows="1fr 1fr"
                        columnGap={2}
                    >
                        <Text color="brand.gray10" variant="tableText">
                            Buy In Amount:
                        </Text>
                        <Text variant="mobilePlayerManagementValue">
                            5.0 USDB
                        </Text>
                        <Text color="brand.gray10" variant="tableText">
                            Time Requested:
                        </Text>

                        <Text variant="mobilePlayerManagementValue">
                            9:33PM
                        </Text>
                    </Grid>
                </VStack>
            </HStack>
            <VStack>
                <Button
                    onClick={() => {
                        setApproveLoading(true);
                        playerAction({
                            path: {
                                game_id: gameId,
                            },
                            body: {
                                action: Action.ACCEPT_PLAYER,
                                action_target: player.player_id,
                            },
                        })
                            .then(() => {
                                toast({
                                    title: 'Player Approved',
                                    description: `You approved ${user?.username} to join the table.`,
                                    status: 'success',
                                    duration: 5000,
                                });
                            })
                            .finally(() => {
                                setApproveLoading(false);
                            });
                    }}
                    onError={handleError}
                    variant="primary"
                    size="sm"
                    w="100%"
                    isLoading={approveLoading}
                    disabled={rejectLoading}
                >
                    Approve
                </Button>
                <Button
                    onClick={() => {
                        setRejectLoading(true);
                        playerAction({
                            path: {
                                game_id: gameId,
                            },
                            body: {
                                action: Action.REJECT_PLAYER,
                                action_target: player.player_id,
                            },
                        })
                            .then(() => {
                                toast({
                                    title: 'Player Rejected',
                                    description: `You rejected ${user?.username} from joining the table.`,
                                    status: 'success',
                                    duration: 5000,
                                });
                            })
                            .finally(() => {
                                setRejectLoading(false);
                            });
                    }}
                    onError={handleError}
                    isLoading={rejectLoading}
                    disabled={approveLoading}
                    variant="secondary"
                    w="100%"
                    size="sm"
                >
                    Deny
                </Button>
            </VStack>
        </HStack>
    );
};

export default PendingPlayersSection;
