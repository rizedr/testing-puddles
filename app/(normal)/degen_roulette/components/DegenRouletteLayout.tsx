import { Box, Stack, VStack } from '@chakra-ui/react';
import { Player } from './types';
import { PlayerList } from './PlayerList';
import { RouletteWheel } from './RouletteWheel';
import { PlayerControls } from './PlayerControls';

interface DegenRouletteLayoutProps {
    players: Player[];
    totalBet: number;
    playerBet: number;
    targetTime: number;
    winner?: string | null;
    nonce: number;
}

export const DegenRouletteLayout = ({
    players,
    totalBet,
    playerBet,
    targetTime,
    winner,
    nonce,
}: DegenRouletteLayoutProps) => {
    return (
        <Stack
            w="100%"
            h="100vh"
            spacing={4}
            p={4}
            direction={{ base: 'column', xl: 'row' }}
        >
            <Box
                w={{ base: '100%', xl: '25%' }}
                h={{ base: '25%', xl: '100%' }}
                p={4}
                borderRadius="16px"
                bg="brand.gray70"
                border="1px solid rgba(255, 255, 255, 0.1)"
            >
                <PlayerList players={players} totalBet={totalBet} />
            </Box>
            <VStack
                w={{ base: '100%', xl: '75%' }}
                h={{ base: '75%', xl: '100%' }}
                spacing={4}
            >
                <Box
                    w="100%"
                    h={{ base: '66.67%', xl: '75%' }}
                    borderRadius="16px"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    bg="brand.gray70"
                >
                    <RouletteWheel
                        players={players}
                        totalBet={totalBet}
                        winner={winner}
                    />
                </Box>
                <Box
                    w="100%"
                    h={{ base: '33.33%', xl: '25%' }}
                    borderRadius="16px"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    bg="brand.gray70"
                >
                    <PlayerControls
                        totalBet={totalBet}
                        playerBet={playerBet}
                        targetTime={targetTime}
                        nonce={nonce}
                    />
                </Box>
            </VStack>
        </Stack>
    );
};
