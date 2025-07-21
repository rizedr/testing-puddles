import {
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Table,
    Tbody,
    Td,
    Image,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { getPlayerUsername } from '../../utils/getPlayerInfo';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import SetHostModal from '../HostManagement/SetHostModal';
import { usePlayerManagementInGamePlayers } from './usePlayerManagementInGamePlayers';
import { Action, playerAction } from '../../../client';
import APIButton from '../../Shared/APIButton';

import useGameData from '../../hooks/useGameData';
import useGameId from '../../hooks/useGameID';

export const PlayerManagementSortMenu = ({
    sortBy,
    setSortBy,
}: {
    sortBy: 'Time Joined' | 'Buy In Amount' | 'Player Name';
    setSortBy: (
        sortBy: 'Time Joined' | 'Buy In Amount' | 'Player Name',
    ) => void;
}) => {
    return (
        <Menu placement="bottom-end">
            {({ isOpen }) => (
                <>
                    <MenuButton
                        as={Button}
                        variant="tableSortButton"
                        rightIcon={
                            isOpen ? (
                                <ChevronUpIcon
                                    w="1.5rem"
                                    h="1.5rem"
                                    color="white"
                                />
                            ) : (
                                <ChevronDownIcon
                                    w="1.5rem"
                                    h="1.5rem"
                                    color="white"
                                />
                            )
                        }
                    >
                        <HStack>
                            <Text variant="tableSortByButtonText">
                                Sort By:
                            </Text>
                            <Text variant="tableSortOptionText">{sortBy}</Text>
                        </HStack>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => setSortBy('Time Joined')}>
                            Time Joined
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('Buy In Amount')}>
                            Buy In Amount
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('Player Name')}>
                            Player Name
                        </MenuItem>
                    </MenuList>
                </>
            )}
        </Menu>
    );
};

export const InGamePlayersTable = () => {
    const {
        userId,
        sortBy,
        setSortBy,
        playersInGame,
        isGameHost,
        setSelectedPlayer,
        selectedPlayer,
        isSetHostOpen,
        onSetHostClose,
        onSetHostOpen,
        playersWithBuyInInfo,
    } = usePlayerManagementInGamePlayers();

    const gameId = useGameId();

    return (
        <>
            {isSetHostOpen && (
                <SetHostModal
                    isOpen={isSetHostOpen}
                    onClose={onSetHostClose}
                    player={selectedPlayer}
                />
            )}
            <HStack justifyContent="space-between" mb="4">
                <Text fontSize="xl" fontWeight="bold" color="brand.tealColor1">
                    Currently in game ({playersWithBuyInInfo?.length})
                </Text>
                <PlayerManagementSortMenu
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </HStack>
            <Table>
                <Thead>
                    <Tr>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">PLAYER</Text>
                        </Th>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">BUY IN</Text>
                        </Th>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">TIME JOINED</Text>
                        </Th>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">ACTIONS</Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {playersInGame.length === 0 && (
                        <Tr>
                            <Td colSpan={4} borderBottom="none">
                                <Spacer h="6.25rem" />
                            </Td>
                        </Tr>
                    )}
                    {playersWithBuyInInfo?.map((player) => (
                        <Tr key={player.player_id}>
                            <Td borderBottom="none">
                                <HStack>
                                    <Image
                                        src={player?.imageUrl ?? undefined}
                                        width="1.25rem"
                                        height="1.25rem"
                                        borderRadius="50%"
                                        alt="User Avatar"
                                    />
                                    <Text variant="tableText">
                                        {getPlayerUsername(player)}
                                    </Text>
                                </HStack>
                            </Td>
                            <Td borderBottom="none">
                                <Text variant="tableText">
                                    $
                                    {convertCurrencyToDisplay(
                                        BigInt(player.totalBuyIn),
                                    )}
                                </Text>
                            </Td>
                            <Td borderBottom="none">
                                <Text variant="tableText">
                                    {player.timeRequested}
                                </Text>
                            </Td>
                            <Td borderBottom="none">
                                {userId === player.player_id && (
                                    <Button size="sm" variant="secondary">
                                        Leave
                                    </Button>
                                )}
                                {userId !== player.player_id && isGameHost && (
                                    <HStack>
                                        <Button
                                            onClick={() => {
                                                setSelectedPlayer(player);
                                                onSetHostOpen();
                                            }}
                                            variant="secondary"
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
                                                    action_target:
                                                        player.player_id,
                                                },
                                            }}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Kick
                                        </APIButton>
                                    </HStack>
                                )}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );
};

export default InGamePlayersTable;
