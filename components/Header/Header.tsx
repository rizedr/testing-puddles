import { HStack, Box, VStack, Image, Button, Text, useMediaQuery, useBreakpointValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { truncated } from '../utils/getPlayerInfo';
import { formatMicroDollarsWithCommas } from '../utils/formatMoney';
import { useGetGameHostName } from '../hooks/useGetGameHostName';
import useGameData from '../hooks/useGameData';
import { getGameTypeString } from '../Shared/GameRecords/utils';
import { GameMenu } from './GameMenu';
import { SoundOnIcon } from '../Shared/SoundOnIcon';
import { SoundOffIcon } from '../Shared/SoundOffIcon';
import { useMuteState } from '../hooks/useMuteState';

const HostDisplay = () => {
    const host = useGetGameHostName();
    const { gameSettings } = useGameData();
    const smallBlind = formatMicroDollarsWithCommas(
        gameSettings?.small_blind_value || 0,
    );
    const bigBlind = formatMicroDollarsWithCommas(
        gameSettings?.big_blind_value || 0,
    );
    const hostDisplay = truncated(host);
    const gameMode = gameSettings?.game_mode;
    const gameTypeDisplay =
        smallBlind === '0.00' || bigBlind === '0.00'
            ? ''
            : `${getGameTypeString(gameMode)} ${smallBlind}/${bigBlind}`;

    return (
        <VStack color="white" alignItems="flex-end" spacing="0.1rem">
            <Box fontWeight="700" textAlign="right">
                {gameTypeDisplay}
            </Box>
            {hostDisplay && (
                <HStack opacity="0.55" alignItems="center" spacing="0.2rem">
                    <Image
                        src="/icons/Hosticon_white.png"
                        alt="Host Icon"
                        width="1.1em"
                        height="1.1em"
                        marginTop="-0.2rem"
                    />
                    <Box
                        color="brand.accentWhite"
                        fontWeight="800"
                        textAlign="right"
                    >
                        {hostDisplay}
                    </Box>
                </HStack>
            )}
        </VStack>
    );
};

const MuteButton = () => {
    const { isMuted, toggleMute } = useMuteState();

    return (
        <Box height="100%" position="relative">
            <Button
                onClick={toggleMute}
                alignSelf="center"
                minW="40px"
                minH="40px"
                w="40px"
                h="40px"
                bg="brand.gray65"
                border="1px solid"
                borderColor="brand.accentWhite"
                borderRadius="8px"
                p={0}
                _hover={{ bg: 'brand.gray40' }}
                _active={{}}
            >
                {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
            </Button>
            <Text
                position="absolute"
                fontSize="0.6rem"
                color="white"
                textAlign="center"
                left="50%"
                transform="translateX(-60%)"
                width="40px"
                mt="0.2rem"
            >
                {isMuted ? 'SOUND OFF' : 'SOUND ON'}
            </Text>
        </Box>
    );
};

export const Header = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <Box
            zIndex={1000}
            w="100%"
            px="1.5rem"
            display="grid"
            gridTemplateColumns="1fr auto 1fr"
            alignItems="top"
        >
            <HStack spacing={4} alignItems="top">
                <GameMenu />
                {!isPortrait && <MuteButton />}
            </HStack>
            <Box display="flex" justifyContent="center" width="100%">
                {/* <Image
                    src="/logos/Ginza Gaming_Logo System_Secondary_White.png"
                    alt="Landscape Image 1"
                    height="5rem"
                    // filter="brightness(90%) contrast(90%)"
                    zIndex={100}
                /> */}
            </Box>
            <HStack
                zIndex={1000}
                spacing={1}
                alignItems="center"
                justifyContent="flex-end"
                width="100%"
            >
                <HostDisplay />
            </HStack>
        </Box>
    );
};

export default Header;
