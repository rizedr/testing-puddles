import {
    Text,
    VStack,
    HStack,
    Grid,
    Button,
    Box,
    Image,
} from '@chakra-ui/react';

import { getPlayerUsername } from '../../../utils/getPlayerInfo';
import { convertCurrencyToDisplay } from '../../../utils/convertCurrency';

import { usePlayerManagementInGamePlayers } from '../usePlayerManagementInGamePlayers';
import SetHostModal from '../../HostManagement/SetHostModal';
import APIButton from '../../../Shared/APIButton';
import { Action, playerAction } from '../../../../client';
import { PlayerManagementSortMenu } from '../InGamePlayersTable';
import useGameId from '../../../hooks/useGameID';

const InGamePlayersSection = () => {
    const {
        userId,
        sortBy,
        setSortBy,
        playersWithBuyInInfo,
        isGameHost,
        setSelectedPlayer,
        selectedPlayer,
        isSetHostOpen,
        onSetHostClose,
        onSetHostOpen,
        loading,
    } = usePlayerManagementInGamePlayers();

    const gameId = useGameId();

    if (loading) return <Text>Loading...</Text>;

    return (
        <>
            {isSetHostOpen && (
                <SetHostModal
                    isOpen={isSetHostOpen}
                    onClose={onSetHostClose}
                    player={selectedPlayer}
                />
            )}
            <HStack
                justifyContent="space-between"
                mb="4"
                mt="1.5rem"
                borderBottom="1px solid"
                borderColor="brand.gray30"
                pb="0.3rem"
            >
                <Text fontSize="lg" fontWeight="bold" color="brand.tealColor1">
                    Currently in game ({playersWithBuyInInfo?.length})
                </Text>
                <PlayerManagementSortMenu
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </HStack>
            <VStack spacing="1.5rem" align="stretch">
                {playersWithBuyInInfo?.map((player) => (
                    <HStack
                        key={player.player_id}
                        backgroundColor={'brand.gray50'}
                        borderRadius="5px"
                        p="1rem"
                        gap="1.5rem"
                    >
                        <Box flex={0.25}>
                            <Image
                                src={player?.imageUrl}
                                width="2.5rem"
                                height="2.5rem"
                                borderRadius="50%"
                                alt="User Avatar"
                            />
                        </Box>
                        <HStack flex={1.5}>
                            <VStack>
                                <Text
                                    variant="mobilePlayerManagementUsername"
                                    w={'100%'}
                                >
                                    {getPlayerUsername(player)}
                                </Text>
                                <Grid
                                    color="white"
                                    templateColumns="1fr 1fr"
                                    templateRows="1fr 1fr"
                                    columnGap={2}
                                >
                                    <Text
                                        color="brand.gray10"
                                        variant="tableText"
                                    >
                                        Total Buy In:
                                    </Text>
                                    <Text variant="mobilePlayerManagementValue">
                                        $
                                        {convertCurrencyToDisplay(
                                            BigInt(player.totalBuyIn),
                                        )}
                                    </Text>
                                    <Text
                                        color="brand.gray10"
                                        variant="tableText"
                                    >
                                        Time Joined:
                                    </Text>
                                    <Text variant="mobilePlayerManagementValue">
                                        {player.timeRequested}
                                    </Text>
                                </Grid>
                            </VStack>
                        </HStack>
                        {userId !== player.player_id && isGameHost ? (
                            <VStack flex={1}>
                                <Button
                                    onClick={() => {
                                        setSelectedPlayer(player);
                                        onSetHostOpen();
                                    }}
                                    variant="secondary"
                                    w={'100%'}
                                    size="sm"
                                >
                                    Set as Host
                                </Button>
                                <APIButton
                                    endpoint={playerAction}
                                    params={{
                                        path: {
                                            game_id: gameId,
                                        },
                                        body: {
                                            action: Action.KICK_PLAYER,
                                            action_target: player.player_id,
                                        },
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    w={'100%'}
                                >
                                    Kick
                                </APIButton>
                            </VStack>
                        ) : (
                            <Box flex={1}></Box>
                        )}
                    </HStack>
                ))}
            </VStack>
        </>
    );
};

export default InGamePlayersSection;
