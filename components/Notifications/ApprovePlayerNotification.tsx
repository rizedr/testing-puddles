import {
    Flex,
    HStack,
    IconButton,
    Text,
    VStack,
    Image,
    useToast,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import useGameData from '../hooks/useGameData';
import { Action, playerAction, Player } from '../../client';
import { useState } from 'react';
import useViewer from '../hooks/useViewer';
import useUser from '../hooks/useUser';
import { useMoneyDisplay } from '../Shared/MoneyDisplay';
import useGameId from '../hooks/useGameID';

export const ApprovePlayerNotification = () => {
    const { gameHost, pendingPlayers } = useGameData();
    const { userId } = useViewer();
    const isHost = gameHost === userId;

    if (!isHost) {
        return null;
    }

    return (
        <Flex position="absolute" top="5rem" left="1.75rem" zIndex={1000}>
            <VStack w="100%">
                {pendingPlayers?.map((player: Player) => {
                    return (
                        <PendingPlayerRow
                            key={player.player_id}
                            player={player}
                        />
                    );
                })}
            </VStack>
        </Flex>
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
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const gameId = useGameId();
    const { user } = useUser(player.player_id);
    const moneyDisplay = useMoneyDisplay(player.amount);

    return (
        <HStack
            bg="#131418"
            w="100%"
            borderRadius="0.5rem"
            padding="0.5rem"
            justifyContent="space-between"
            key={player.player_id}
            border="0.5px solid rgba(255, 255, 255, 0.5)"
        >
            <HStack>
                <Image
                    src={user?.imageUrl}
                    width="1.25rem"
                    height="1.25rem"
                    borderRadius="50%"
                    alt="User Avatar"
                />
                <Text size="md">{user?.username}</Text>
                <Text size="md" color="brand.silverGray">
                    {moneyDisplay}
                </Text>
            </HStack>
            <HStack ml="0.625rem" spacing="0.625rem">
                <IconButton
                    size="sm"
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
                        }).then(() => {
                            toast({
                                title: 'Player Approved',
                                description: `You approved ${user?.username} to join the table.`,
                                status: 'success',
                                duration: 5000,
                            });
                            setApproveLoading(false);
                        });
                    }}
                    icon={<CheckIcon boxSize="0.85rem" />}
                    aria-label="Approve Player"
                    color="white"
                    borderRadius="0.25rem"
                    variant="walletButton"
                    h="1.95rem"
                    w="1.95rem"
                    // _hover={{ bg: 'brand.primaryBlueHover' }}
                    // _active={{ bg: 'brand.primaryBlueActive' }}
                    onError={handleError}
                    isLoading={approveLoading}
                    disabled={rejectLoading}
                />
                <IconButton
                    size="sm"
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
                        }).then(() => {
                            toast({
                                title: 'Player Rejected',
                                description: `You rejected ${user?.username} from the table.`,
                                status: 'info',
                                duration: 5000,
                            });
                            setRejectLoading(false);
                        });
                    }}
                    background="rgba(255, 255, 255, 0.20)"
                    color="white"
                    borderRadius="0.25rem"
                    _hover={{ bg: '#303133' }}
                    _active={{ bg: '#28292D' }}
                    onError={handleError}
                    isLoading={rejectLoading}
                    disabled={approveLoading}
                    icon={<CloseIcon boxSize="0.7rem" />}
                    aria-label="Reject Player"
                />
            </HStack>
        </HStack>
    );
};
