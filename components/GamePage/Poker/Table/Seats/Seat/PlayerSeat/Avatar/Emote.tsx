import { Box, Image } from '@chakra-ui/react';
import { useGetPlayerUIPosition } from '../../../../../../../hooks/useGetPlayerUIPositions';
import { Player } from '../../../../../../../../client';
import { getPosition, PlayerPosition } from './sharedPositioning';
import { useBreakpointValue } from '@chakra-ui/react';
import { Id } from '../../../../../../../../../../packages/convex/convex/_generated/dataModel';
import useGameData from '../../../../../../../hooks/useGameData';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../../../../../packages/convex/convex/_generated/api';
import { useState, useEffect, useRef } from 'react';
import useGameId from '../../../../../../../hooks/useGameID';

const landscapeStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '-9.5vmin', bottom: '9vmin' },
    topRight: { right: '9.5vmin', bottom: '9vmin' },
    upperLeft: { left: '-9.5vmin', bottom: '10vmin' },
    upperRight: { right: '9.5vmin', bottom: '10vmin' },
    left: { left: '-9.75vmin', top: '-4.5vmin' },
    right: { right: '9.5vmin', top: '-4.5vmin' },
    bottomLeft: { left: '-9.85vmin', top: '-5vmin' },
    bottomRight: { right: '9.75vmin', top: '-5vmin' },
    bottom: { left: '-9.5vmin', top: '-5.25vmin' },
};

const portraitStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '-1vmax', top: '-1vmax' },
    topRight: { right: '1.25vmax', top: '-1vmax' },
    upperLeft: { left: '-0.25vmax', top: '-0.5vmax' },
    upperRight: { right: '0.75vmax', top: '-0.5vmax' },
    left: { left: '-0.25vmax', top: '-0.5vmax' },
    right: { right: '0.75vmax', top: '-0.5vmax' },
    bottomLeft: { left: '-0.25vmax', top: '-0.5vmax' },
    bottomRight: { right: '1.25vmax', top: '-0.5vmax' },
    bottom: { left: '-0.95vmax', top: '-0.25vmax' },
};

interface EmoteProps {
    player: Player;
}

export const Emote = ({ player }: EmoteProps) => {
    const currentPlayerPosition = useGetPlayerUIPosition(player?.player_id);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const position = getPosition(currentPlayerPosition);
    const styles = isPortrait ? portraitStyles : landscapeStyles;

    const gameId = useGameId();
    const query = api.tasks.getEmotes;
    const emotes =
        useQuery(query, {
            gameId: gameId as Id<'gameData'>,
        }) ?? [];

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showEmote, setShowEmote] = useState(false);
    const [currentEmote, setCurrentEmote] = useState('');
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (emotes.length > 0) {
            const currentTime = Math.floor(Date.now());
            const recentEmotes = emotes
                .filter((em) => {
                    const timeDiff = currentTime - em._creationTime;
                    return em.userId === player.player_id && timeDiff <= 5000;
                })
                .sort((a, b) => b._creationTime - a._creationTime);

            const latestPlayerEmote = recentEmotes[0];

            if (latestPlayerEmote) {
                setCurrentEmote(latestPlayerEmote.emote);
                setShowEmote(true);
                setIsFading(false);

                const emoteTimestamp = latestPlayerEmote._creationTime;
                const timeDiff = currentTime - emoteTimestamp;
                const timeoutDuration = Math.max(0, 5000 - timeDiff);

                timeoutRef.current = setTimeout(() => {
                    setIsFading(true);
                    setTimeout(() => {
                        setShowEmote(false);
                    }, 1000);
                }, timeoutDuration - 1000);
            } else {
                setShowEmote(false);
            }
        } else {
            setShowEmote(false);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [emotes, player.player_id]);

    const emoteBackground = 'rgb(228, 219, 249)';
    const emoteShadow = 'rgb(177, 137, 241)';

    return (
        <>
            {showEmote && (
                <Box
                    position="absolute"
                    zIndex={1001}
                    w="100%"
                    {...styles[position as keyof typeof styles]}
                >
                    <Box
                        zIndex={1002}
                        position="absolute"
                        bg={emoteBackground}
                        opacity={isFading ? 0 : 0.95}
                        transition="opacity 1s ease-out"
                        borderRadius="2.25rem"
                        padding="2px"
                        boxShadow={`0 0 8px ${emoteShadow}`}
                        width={isPortrait ? '6.25vmax' : '8.25vmin'}
                        height={isPortrait ? '6.25vmax' : '8.25vmin'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _after={{
                            content: '""',
                            position: 'absolute',
                            right: '0vmin',
                            bottom: '0.25vmin',
                            transform: 'translate(50%, 50%) rotate(43.5deg)',
                            borderWidth: '16px 22px 20px 30px',
                            borderStyle: 'solid',
                            borderColor: `transparent transparent transparent ${emoteBackground}`,
                        }}
                    >
                        <Image
                            zIndex={1003}
                            src={`/emotes/${currentEmote}`}
                            alt={`${currentEmote} Emote`}
                            width={isPortrait ? '5.75vmax' : '7.25vmin'}
                            height={isPortrait ? '5.25vmax' : '7vmin'}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Emote;
