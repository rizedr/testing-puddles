import { Box, Image, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { AvatarProgress } from './AvatarProgress';
import { usePlayerProgress } from '../usePlayerProgress';
import { keyframes } from '@emotion/react';
import useUser from '../../../../../../../../hooks/useUser';

interface AvatarProfileProps {
    isCurrentPlayer: boolean;
    isWinner: boolean;
    isYourTurn: boolean;
    player: any;
    opacity: number;
    isFolded: boolean;
}

export const AvatarProfile = ({
    isCurrentPlayer,
    isYourTurn,
    isWinner,
    player,
    isFolded,
}: AvatarProfileProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { progressValue, progressColor, remainingSeconds, extraTimeProgressValue, extraTimeProgressColor, extraTimeActivated } = usePlayerProgress();
    const { user } = useUser(player.player_id);
    const isPurpleGlow = extraTimeActivated && progressValue === 0;
    const glowKeyframes = keyframes`
        0% {
            box-shadow: 0 0 5px ${isPurpleGlow ? '#9F7AEA' : progressColor}, 0 0 10px ${isPurpleGlow ? '#9F7AEA' : progressColor};
        }
        50% {
            box-shadow: 0 0 20px ${isPurpleGlow ? '#9F7AEA' : progressColor}, 0 0 30px ${isPurpleGlow ? '#9F7AEA' : progressColor};
        }
        100% {
            box-shadow: 0 0 5px ${isPurpleGlow ? '#9F7AEA' : progressColor}, 0 0 10px ${isPurpleGlow ? '#9F7AEA' : progressColor};
        }
    `;

    const constantGlowKeyframes = keyframes`
        0%, 100% {
            box-shadow: 0 0 10px #66F28D, 0 0 20px #66F28D;
        }
    `;

    const glowAnimation = isYourTurn
        ? `${glowKeyframes} 2s ease-in-out infinite`
        : isWinner || isCurrentPlayer
          ? `${constantGlowKeyframes} 2s linear infinite`
          : undefined;

    const currentPlayerGlowAnimation =
        isCurrentPlayer && !isYourTurn
            ? `${keyframes`
            0%, 100% {
                box-shadow: 0 0 10px ${isPurpleGlow ? '#9F7AEA' : progressColor}, 0 0 20px ${isPurpleGlow ? '#9F7AEA' : progressColor};
            }
        `} 2s linear infinite`
            : undefined;

    const animation =
        isCurrentPlayer && !isYourTurn
            ? currentPlayerGlowAnimation
            : glowAnimation;

    const border = isFolded
        ? '0.125rem solid'
        : isWinner
          ? '0.25rem solid'
          : '0.125rem solid';
    const borderColor = isFolded
        ? 'brand.gray30'
        : isWinner
          ? 'brand.secondaryGreen'
          : 'brand.gray10';

    const [remainingTime, setRemainingTime] = useState<number | null>(null);

    useEffect(() => {
        setRemainingTime(remainingSeconds);
    }, [remainingSeconds]);

    return (
        <Box
            height={isPortrait ? "4.5vmax" : "5vmin"}
            width={isPortrait ? "4.5vmax" : "5vmin"}
            position="relative"
            borderRadius="full"
            zIndex="100"
            animation={animation}
            bg={isFolded || remainingTime !== null ? 'brand.primaryGray' : 'undefined'}
        >
            <AvatarProgress
                isCurrentPlayer={isCurrentPlayer}
                isYourTurn={isYourTurn}
                progressValue={progressValue}
                progressColor={progressColor}
                extraTimeProgressValue={extraTimeProgressValue}
                extraTimeProgressColor={extraTimeProgressColor}
                extraTimeActivated={extraTimeActivated}
            />
            <Box
                width={isPortrait ? "5.1vmax" : "5.68vmin"}
                height={isPortrait ? "5.1vmax" : "5.68vmin"}
                border={border}
                borderColor={borderColor}
                borderRadius="50%"
                top={isPortrait ? "-0.28vmax" : "-0.33vmin"}
                left={isPortrait ? "-0.44vmax" : "-0.55vmin"}
                position="relative"
                overflow="hidden"
                bg={isFolded ||(remainingTime !== null && isYourTurn && isCurrentPlayer) ? 'brand.darkGray' : 'transparent'}
            >
                <Box position="relative">
                    <Image
                        src={user?.imageUrl ?? undefined}
                        alt="User Avatar"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        borderRadius="50%"
                        opacity={isFolded || (isYourTurn && isCurrentPlayer) ? 0.25 : 1}
                    />
                    {isCurrentPlayer && isYourTurn && remainingTime !== null && (
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            color="brand.accentWhite"
                            fontSize={isPortrait ? "1.5vmax" : "1.5vmin"}
                            fontWeight="700"
                        >
                            {remainingTime}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default AvatarProfile;
