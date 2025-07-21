'use client';
import {
    VStack,
    Spacer,
    HStack,
    useBreakpointValue,
    Text,
    Box,
} from '@chakra-ui/react';
import { GameStat } from './GameStat';
import { useGameCard } from './useGameCard';
import { useGameAllPlayers } from '../../hooks/useGamePlayers';
import { GameDetails, GameProgressStatus } from '../../hooks/useGameHistory';
import { GameCardHeader } from './GameCardHeader';
import { ShowPlayersSection } from './ShowPlayersSection';
import useViewer from '../../hooks/useViewer';
import { FaRegCopy } from 'react-icons/fa';
import { formatDateTime } from './utils';
import { PokerGameData } from '../../../client';
import { Doc } from '../../../../../packages/convex/convex/_generated/dataModel';

// const separatorColor = 'brand.lightestGray';

const ActiveGameInfo = ({ game }: { game: GameDetails }) => {
    return (
        <HStack width="100%" justify="space-between">
            <HStack spacing="1rem">
                <GameStat label="Buy-in" value={game.buy_in} />
                <GameStat label="Rewards" value={game.rake} />
            </HStack>
        </HStack>
    );
};

const PastGameInfo = ({ game }: { game: GameDetails }) => {
    const positive = game.cashout >= game.buy_in;

    return (
        <HStack width="100%" justify="space-between">
            <HStack spacing="1rem">
                <GameStat label="Buy-in" value={game.buy_in} />
                <GameStat label="Cashout" value={game.cashout} />
                <GameStat label="Rewards" value={game.rake} />
                <GameStat
                    label="PnL"
                    value={game.cashout - game.buy_in}
                    statColor={positive ? 'green.300' : 'red.400'}
                    addSignage
                />
            </HStack>
        </HStack>
    );
};

const PortraitPastGameInfo = ({
    game,
}: {
    game: GameDetails;
    isOtherUser: boolean;
    user: Doc<'users'>;
    smallBlind: number;
    bigBlind: number;
}) => {
    const positive = game.cashout >= game.buy_in;
    return (
        <HStack width="100%" justify="flex-start">
            <VStack align="start" spacing="0.25rem" justify="center" flex={1}>
                <HStack justify="flex-start" spacing="1rem">
                    <GameStat label="Buy-in" value={game.buy_in} />
                    <GameStat
                        label="PnL"
                        value={game.cashout - game.buy_in}
                        statColor={positive ? 'green.300' : 'red.400'}
                        addSignage
                    />
                </HStack>
                <HStack justify="flex-start" spacing="1rem">
                    <GameStat label="Cashout" value={game.cashout} />
                    <GameStat label="Earnings" value={game.rake} />
                </HStack>
            </VStack>
        </HStack>
    );
};

export function GameCard({
    game,
    gameData,
    user,
}: {
    game: GameDetails;
    user: Doc<'users'>;
    gameData?: Doc<'gameData'>;
    loading: boolean;
}) {
    const { handleRejoinGame, smallBlind, bigBlind } = useGameCard(
        game,
        gameData,
    );
    const players = useGameAllPlayers(game.game_id);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { user: viewerUser } = useViewer();
    const isOtherUser = user !== null && user.username !== viewerUser?.username;

    return (
        <VStack
            width="100%"
            bg="brand.gray45"
            borderRadius="xl"
            p="1rem"
            pb="2.5rem"
            borderWidth="0.5px"
            borderColor="rgba(255, 255, 255, 0.2)"
            align="stretch"
            overflow="hidden"
            position="relative"
        >
            <GameCardHeader
                game={game}
                gameData={gameData}
                isOtherUser={isOtherUser}
                user={user}
                handleRejoinGame={handleRejoinGame}
            />

            <VStack
                width="100%"
                align="start"
                bg="brand.primaryGray"
                borderRadius="xl"
                p="1rem"
                spacing="1rem"
            >
                {!gameData?.archived ? (
                    <ActiveGameInfo game={game} />
                ) : isPortrait ? (
                    <PortraitPastGameInfo
                        game={game}
                        user={user}
                        isOtherUser={isOtherUser}
                        smallBlind={smallBlind}
                        bigBlind={bigBlind}
                    />
                ) : (
                    <PastGameInfo game={game} />
                )}
                <ShowPlayersSection
                    playerIds={players.players.map((p) => p.player_id)}
                />
            </VStack>

            <HStack
                width="100%"
                justify="space-between"
                position="absolute"
                bottom="0.5rem"
                pl="0.5rem"
                pr="2rem"
            >
                <Text
                    fontWeight="semibold"
                    fontSize="13px"
                    textAlign="left"
                    color="rgba(255, 255, 255, 0.60)"
                    noOfLines={1}
                >
                    {formatDateTime(game.game_start_time)}
                </Text>
                <Spacer />
                <HStack spacing="0.5rem">
                    <Text
                        fontSize="13px"
                        fontWeight="semibold"
                        color="rgba(255, 255, 255, 0.60)"
                    >
                        Game ID: {game.game_id.slice(0, 4)}...
                        {game.game_id.slice(-4)}
                    </Text>
                    {(!isOtherUser || viewerUser?.role === 'ADMIN') && (
                        <Box
                            as="span"
                            cursor="pointer"
                            _hover={{ color: 'white' }}
                            color="rgba(255, 255, 255, 0.60)"
                            onClick={() =>
                                navigator.clipboard.writeText(game.game_id)
                            }
                        >
                            <FaRegCopy size={14} />
                        </Box>
                    )}
                </HStack>
            </HStack>
        </VStack>
    );
}
