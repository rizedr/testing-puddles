import React, { useEffect, useRef } from 'react';
import { Box, Image, useToast } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import APIButton from '../../../../../../../Shared/APIButton';
import useGameData from '../../../../../../../hooks/useGameData';
import useViewer from '../../../../../../../hooks/useViewer';
import { Action } from '../../../../../../../../client';
import { playerAction } from '../../../../../../../../client';

interface ExtraTimerButtonProps {
    isYou: boolean;
    isYourTurn: boolean;
}

export const ExtraTimerButton = ({ isYou, isYourTurn }: ExtraTimerButtonProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { gameId, extraTimeActivated, gameSettings, currentDecidingPlayer } = useGameData();
    const { user } = useViewer();
    const toast = useToast();
    const hasAutoActivatedRef = useRef(false);
    const lastDecidingPlayerRef = useRef<string | null>(null);

    // Reset auto-activation flag when turn changes
    useEffect(() => {
        if (currentDecidingPlayer !== lastDecidingPlayerRef.current) {
            hasAutoActivatedRef.current = false;
            lastDecidingPlayerRef.current = currentDecidingPlayer;
        }
    }, [currentDecidingPlayer]);

    // Auto-activate extra time if preference is enabled
    useEffect(() => {
        const shouldAutoActivate = 
            isYou && 
            isYourTurn && 
            !extraTimeActivated && 
            !hasAutoActivatedRef.current &&
            user?.pokerPreferences?.autoActivateExtraTime === true;

        if (shouldAutoActivate) {
            hasAutoActivatedRef.current = true;
            // Call the API directly with error handling
            playerAction({
                path: { game_id: gameId },
                body: { action: Action.ACTIVATE_EXTRA_TIME },
            }).catch((error: unknown) => {
                // console.error('Failed to auto-activate extra time:', error);
                // Reset the flag on error so user can try manually
                hasAutoActivatedRef.current = false;
            });
        }
    }, [isYou, isYourTurn, extraTimeActivated, user?.pokerPreferences?.autoActivateExtraTime, gameId, toast]);

    // Determine the correct icon based on extra time duration
    const getExtraTimeIcon = () => {
        const extraTime = gameSettings?.extra_time || 10;
        switch (extraTime) {
            case 10:
                return "/ExtraTimeIcon.webp";
            case 20:
                return "/ExtraTimeIcon20.webp";
            case 30:
                return "/ExtraTimeIcon30.webp";
            default:
                return "/ExtraTimeIcon.webp"; // Default to 10s icon
        }
    };

    return (
        isYou && isYourTurn && (
            <Box
                position="absolute"
                zIndex={1000}
                width={isPortrait ? '4.75vmax' : '4vmin'}
                height={isPortrait ? '4.5vmax' : '3.85vmin'}
                alignItems="center"
                justifyContent="center"
                right={isPortrait ? '-5.5vmax' : '-5.25vmin'}
                top={isPortrait ? '1.25vmax' : '3vmin'}
            >
                <APIButton
                    endpoint={playerAction}
                    params={{
                        path: {
                            game_id: gameId,
                        },
                        body: {
                            action: Action.ACTIVATE_EXTRA_TIME,
                        },
                    }}
                    disabled={extraTimeActivated}
                    variant="extraTimeButton"
                    p={0}
                    bg="transparent"
                    _hover={{
                        bg: "transparent",
                    }}
                >
                    <Image
                        src={getExtraTimeIcon()}
                        alt="Extra Time"
                        width={isPortrait ? '4.5vmax' : '4.4vmin'}
                        height={isPortrait ? '4.5vmax' : '4.4vmin'}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        cursor="pointer"
                        opacity={extraTimeActivated ? 0.5 : 0.95}
                        _hover={{
                            filter: extraTimeActivated ? 'none' : 'brightness(1.15)',
                            opacity: extraTimeActivated ? 0.5 : 1,
                        }}
                        userSelect="none"
                        draggable={false}
                    />
                </APIButton>
            </Box>
        )
    );
};

export default ExtraTimerButton;
