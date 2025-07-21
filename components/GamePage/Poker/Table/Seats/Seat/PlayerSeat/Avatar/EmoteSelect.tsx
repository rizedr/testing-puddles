import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import { Player } from '../../../../../../../../client';
import { useBreakpointValue } from '@chakra-ui/react';
import { Id } from '../../../../../../../../../../packages/convex/convex/_generated/dataModel';
import { api } from '../../../../../../../../../../packages/convex/convex/_generated/api';
import { useMutation } from 'convex/react';
import { EmoteModal } from './EmoteModal';
import useGameId from '../../../../../../../hooks/useGameID';

interface EmoteSelectProps {
    player: Player;
    isYou: boolean;
}

export const EmoteSelect = ({ isYou }: EmoteSelectProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const gameId = useGameId();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const sendEmoteMutation = useMutation(api.tasks.sendEmote);

    const handleEmoteSelect = async (emoteId: string) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await sendEmoteMutation({
                gameId: gameId as Id<'gameData'>,
                emote: emoteId,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        isYou && (
            <>
                <Box
                    position="absolute"
                    zIndex={1000}
                    width={isPortrait ? '4vmax' : '4vmin'}
                    height={isPortrait ? '4vmax' : '3.85vmin'}
                    alignItems="center"
                    justifyContent="center"
                    left={isPortrait ? '-5.5vmax' : '-5.25vmin'}
                    top={isPortrait ? '1.25vmax' : '3.85vmin'}
                >
                    <Image
                        src="/emotes/EmoteButton2.webp"
                        alt="Emote Button"
                        width={isPortrait ? '4vmax' : '3.5vmin'}
                        height={isPortrait ? '4vmax' : '3.5vmin'}
                        onClick={() => setIsModalOpen(true)}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        cursor="pointer"
                        opacity={0.95}
                        _hover={{
                            filter: 'brightness(1.15)',
                            opacity: 1,
                        }}
                    />
                </Box>
                <EmoteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelectEmote={handleEmoteSelect}
                    isPortrait={isPortrait}
                />
            </>
        )
    );
};

export default EmoteSelect;
