import {
    Box,
    HStack,
    VStack,
    Text,
    Image,
    useBreakpointValue,
} from '@chakra-ui/react';

import { PotDisplay } from './PotDisplay/PotDisplay';
import { CommunityCards } from './CommunityCards';
import useGameData from '../../../../hooks/useGameData';
import { getGameTypeString } from '../../../../Shared/GameRecords/utils';
import { formatMicroDollarsWithCommas } from '../../../../utils/formatMoney';
import { useGetGameHostName } from '../../../../hooks/useGetGameHostName';
import { useIsInGame } from '../../../../hooks/useIsInGame';
import APIButton from '../../../../Shared/APIButton';
import { useWaitingRoom } from '../../Controls/Shared/useWaitingRoom';
import { Action, playerAction } from '../../../../../client';
import useGameId from '../../../../hooks/useGameID';
import { useShowBombPot } from '../../../../hooks/useShowBombPot';
import { useShowAnte } from '../../../../hooks/useShowAnte';
import { AnteAlert } from './AnteAlert';
import { BombPotAlert } from './BombPotAlert';

export const HostDisplay = () => {
    const { gameSettings } = useGameData();
    const host = useGetGameHostName();
    const smallBlind = formatMicroDollarsWithCommas(
        gameSettings?.small_blind_value,
    );
    const bigBlind = formatMicroDollarsWithCommas(
        gameSettings?.big_blind_value,
    );
    const hostDisplay = host;
    const gameMode = gameSettings?.game_mode;
    const gameTypeDisplay =
        smallBlind === '0.00' || bigBlind === '0.00'
            ? ''
            : `${getGameTypeString(gameMode)} ${smallBlind}/${bigBlind}`;

    return (
        <VStack color="white" alignItems="center" spacing="0.1rem" zIndex={10}>
            <Box
                color="brand.gray70"
                opacity="0.55"
                fontWeight="900"
                textAlign="right"
                fontSize="0.75rem"
            >
                {gameTypeDisplay}
            </Box>
            {hostDisplay && (
                <HStack opacity="0.55" alignItems="center" spacing="0.2rem">
                    <Image
                        src="/icons/Hosticon.png"
                        alt="Host Icon"
                        width="0.75em"
                        height="0.75em"
                        marginTop="-0.2rem"
                        userSelect="none"
                        draggable={false}
                    />
                    <Box
                        color="brand.gray70"
                        fontWeight="800"
                        textAlign="right"
                        fontSize="0.75rem"
                    >
                        {hostDisplay}
                    </Box>
                </HStack>
            )}
        </VStack>
    );
};

export const StartButton = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const gameId = useGameId();

    return (
        <APIButton
            endpoint={playerAction}
            params={{
                path: {
                    game_id: gameId,
                },
                body: {
                    action: Action.START_GAME,
                },
            }}
            bgGradient="linear(to-b, brand.gray30 20%, black)"
            border="1px solid"
            borderRadius="1rem"
            borderColor="rgba(255,255,255, 0.25)"
            _hover={{
                bgGradient: 'linear(to-b, #181B20 60%, black)',
            }}
            _active={{
                bgGradient: 'linear(to-b, brand.primaryGray 60%, black)',
            }}
            alignSelf="center"
            zIndex={10}
            w={isPortrait ? '13.5vmax' : '13.5vmin'}
            h={isPortrait ? '4.75vmax' : '4.75vmin'}
            position="absolute"
            bottom="50%"
            _loading={{
                color: 'white',
            }}
        >
            <Text
                variant="bold"
                fontSize={isPortrait ? '1.7vmax' : '1.9vmin'}
                paddingX={isPortrait ? '1.25vmax' : '1.25vmin'}
                paddingY={isPortrait ? '0.625vmax' : '0.625vmin'}
            >
                Start Game
            </Text>
        </APIButton>
    );
};

export const GameBoard = () => {
    const isInGame = useIsInGame();
    const showBombPot = useShowBombPot();
    const showAnte = useShowAnte();
    const { isHost } = useWaitingRoom();
    return (
        <VStack spacing="1rem" justifyContent="center">
            <PotDisplay />
            <CommunityCards />
            {isHost && !isInGame && <StartButton />}
            {showBombPot && <BombPotAlert />}
            {/* {showAnte && <AnteAlert />} */}
        </VStack>
    );
};

export default GameBoard;
