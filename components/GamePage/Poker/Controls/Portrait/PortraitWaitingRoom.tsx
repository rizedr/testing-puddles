import { IconButton, HStack, Text, VStack } from '@chakra-ui/react';
import { useWaitingRoom } from '../Shared/useWaitingRoom';
import { ShareIcon } from './ShareIcon';
import { useGameData } from '../../../../hooks/useGameData';
import { useGetCurrentPlayer } from '../../../../hooks/useGetCurrentPlayer';
import { Action, PokerGameState } from '../../../../../client';

export const PortraitWaitingRoom = () => {
    const { isHost, url, copyURL } = useWaitingRoom();
    const { gameState } = useGameData();
    const currentPlayer = useGetCurrentPlayer();
    const isAway = currentPlayer?.action === Action.AWAY;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join my game!',
                    text: url,
                    url: url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
                // Fallback to copyURL if sharing fails
                copyURL();
            }
        } else {
            // Fallback for devices that don't support Web Share API
            copyURL();
        }
    };
    
    if (isAway && gameState === PokerGameState.CREATE) {
        return null;
    }

    return (
        <VStack
            paddingX="1.5rem"
            my="auto"
            w="100%"
            justifyContent="center"
            spacing="1rem"
        >
            <HStack
                spacing=".5rem"
                mx="3rem"
                w="100%"
                h="100%"
                justifyContent="center"
            >
                <Text
                    border="none"
                    bg="brand.lightGray"
                    mx="1rem"
                    paddingX="1.5rem"
                    paddingY="1rem"
                    textColor="brand.white70"
                    variant="bold"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    borderRadius="3px"
                    overflow="hidden"
                    fontWeight="400"
                    textAlign="center"
                    display="inline-block"
                    w="15rem"
                    flex="1"
                >
                    {url}
                </Text>
                <IconButton
                    onClick={handleShare}
                    aria-label="Share Link"
                    height="3.55rem"
                    width="3.5rem"
                    variant="walletButton"
                    borderRadius="3px"
                    icon={<ShareIcon w="2.5rem" />}
                />
            </HStack>
            <Text
                fontSize="0.825rem"
                variant="bold"
                textAlign="center"
                whiteSpace="pre-wrap"
            >
                {isHost
                    ? "Press 'start game' above to begin!"
                    : 'Waiting for the host to start the game...'}
                <br /> Share the link to invite your friends and earn rewards!
            </Text>
        </VStack>
    );
};

export default PortraitWaitingRoom;
