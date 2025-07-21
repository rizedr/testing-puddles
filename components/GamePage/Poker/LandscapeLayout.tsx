import { Box, Flex, VStack, Text, Button } from '@chakra-ui/react';
import { LandscapeControls } from './Controls/Landscape/LandscapeControls';
import { Header } from '../../Header/Header';
import { ApprovePlayerNotification } from '../../Notifications/ApprovePlayerNotification';
import PokerTable from './Table/PokerTable';
import Seats from './Table/Seats/Seats';
import { useGameData } from '../../hooks/useGameData';
import LedgerTable from '../../Modals/LedgerModal/LedgerTable';
import Link from 'next/link';
import { RunItTwiceVoteNotification } from '../../Notifications/RunItTwiceNotification';

const ArchivedGame = () => {
    return (
        <VStack w="100%" h="100%" flex={1} justifyContent="center" spacing={8}>
            <Text size="lg">This game has been archived due to inactivity</Text>
            <Box
                maxH="70%"
                overflowY="auto"
                border="1px solid"
                borderColor="brand.gray10"
                borderRadius="md"
                p={4}
            >
                <LedgerTable showStack={false} />
            </Box>
            <Box mx="auto" w="fit-content">
                <Button mt={4} as={Link} href="/" variant="walletButton">
                    Return Home
                </Button>
            </Box>
        </VStack>
    );
};

export const LandscapeLayout = () => {
    const { archived } = useGameData();

    if (archived) {
        return (
            <VStack
                h="100%"
                w="100%"
                flexDirection="column"
                position="absolute"
            >
                <Flex position="absolute" top="1.25rem" w="100%">
                    <Header />
                </Flex>
                <Box h="75%">
                    <ArchivedGame />
                </Box>
                <Flex zIndex={100} w="100%" h="25%" minH="185px">
                    <LandscapeControls />
                </Flex>
            </VStack>
        );
    }

    return (
        <VStack h="100%" w="100%" flexDirection="column" position="absolute">
            <Flex position="absolute" top="1.25rem" w="100%" zIndex={200}>
                <Header />
            </Flex>

            <Box position="fixed" left="75" w="100%" zIndex={100}>
                <ApprovePlayerNotification />
                <RunItTwiceVoteNotification />
            </Box>

            <Flex w="100%" h="100%">
                <Box position="relative" mt="-24vh" h="115vh" w="100%">
                    <PokerTable />
                </Box>

                <Box
                    h="30%"
                    w="30%"
                    mt="-13vh"
                    py="25vmin"
                    position="absolute"
                    top={`min(49%, 45vh)`}
                    left="50%"
                    transform="translate(-50%, -50%)"
                    zIndex={2}
                >
                    <Seats />
                </Box>

                <Flex
                    zIndex={100}
                    position="absolute"
                    w="100%"
                    h="25%"
                    minH="185px"
                    bottom="0"
                    flexDirection="column"
                >
                    <Box flex={1}>
                        <LandscapeControls />
                    </Box>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default LandscapeLayout;
