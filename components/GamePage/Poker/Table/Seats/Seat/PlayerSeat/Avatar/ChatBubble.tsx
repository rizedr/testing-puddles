import { Box, Fade, useBreakpointValue } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';

import { useGetPlayerUIPosition } from '../../../../../../../hooks/useGetPlayerUIPositions';
import { Player } from '../../../../../../../../client';
import { getPosition, PlayerPosition } from './sharedPositioning';
import useGameData from '../../../../../../../hooks/useGameData';
import { api } from '../../../../../../../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../../../../../../../packages/convex/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import useGameId from '../../../../../../../hooks/useGameID';

const landscapeStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '1vmin', bottom: '5.25vmin' },
    topRight: { left: '2vmin', bottom: '5.25vmin' },
    upperLeft: { left: '1vmin', bottom: '5.25vmin' },
    upperRight: { left: '2vmin', bottom: '5.25vmin' },
    left: { left: '-0.5vmin', top: '5.25vmin' },
    right: { left: '2.5vmin', top: '5.25vmin' },
    bottomLeft: { left: '0vmin', top: '4.5vmin' },
    bottom: { left: '0vmin', top: '4.5vmin' },
    bottomRight: { left: '0.5vmin', top: '4.5vmin' },
};

const portraitStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '2.25vmax', bottom: '2.75vmax' },
    topRight: { left: '2.25vmax', bottom: '2.75vmax' },
    upperLeft: { left: '2.25vmax', bottom: '2.75vmax' },
    upperRight: { left: '2.25vmax', bottom: '2.75vmax' },
    left: { left: '2.25vmax', top: '-2vmax' },
    bottomLeft: { left: '2.25vmax', top: '-2vmax' },
    right: { left: '2.25vmax', top: '-2vmax' },
    bottomRight: { left: '2.25vmax', top: '-2vmax' },
    bottom: { left: '2.25vmax', bottom: '2.5vmax' },
};

interface ChatBubbleProps {
    player: Player;
}

export const ChatBubble = ({ player }: ChatBubbleProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const currentPlayerPosition = useGetPlayerUIPosition(player?.player_id);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const position = getPosition(currentPlayerPosition);
    const styles = isPortrait ? portraitStyles : landscapeStyles;
    const gameId = useGameId();
    const messages =
        useQuery(api.chat.getChat, {
            gameId: gameId as Id<'gameData'>,
        }) ?? [];
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (messages.length > 0) {
            const currentTime = Math.floor(Date.now());
            const recentMessages = messages
                .filter((msg) => {
                    const timeDiff = currentTime - msg._creationTime;
                    return (
                        msg.senderId === player.player_id && timeDiff <= 5000
                    );
                })
                .sort((a, b) => b._creationTime - a._creationTime);

            const latestPlayerMessage = recentMessages[0];

            if (latestPlayerMessage) {
                setCurrentMessage(latestPlayerMessage.message);
                setIsVisible(true);

                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                const msgTimestamp = latestPlayerMessage._creationTime;
                const timeDiff = currentTime - msgTimestamp;
                const timeoutDuration = Math.max(0, 5000 - timeDiff);

                timeoutRef.current = setTimeout(() => {
                    setIsVisible(false);
                    setCurrentMessage('');
                }, timeoutDuration);
            } else {
                setIsVisible(false);
                setCurrentMessage('');
            }
        } else {
            setIsVisible(false);
            setCurrentMessage('');
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [messages, player.player_id]);

    return (
        <Fade in={isVisible} unmountOnExit={true}>
            <Box
                bg="rgba(0, 100, 105, 0.7)"
                borderRadius="10px"
                borderBottomLeftRadius="0" // Remove rounding from bottom left corner
                color="white"
                fontSize={isPortrait ? '1.35vmax' : '1.35vmin'}
                fontWeight="400"
                maxH="3.2rem"
                maxW="9.5rem"
                w="fit-content"
                overflow="hidden"
                p={2}
                position="absolute"
                whiteSpace="nowrap"
                lineHeight="1.2"
                textOverflow="ellipsis"
                zIndex={1000}
                {...styles[position as keyof typeof styles]}
                _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-0.5rem', // Adjust as needed
                    left: '0.5rem', // Adjust as needed
                    borderWidth: '0.5rem',
                    borderStyle: 'solid',
                    borderColor:
                        'transparent transparent rgba(78, 36, 109, 0.7) transparent',
                }}
            >
                {currentMessage}
            </Box>
        </Fade>
    );
};

export default ChatBubble;
