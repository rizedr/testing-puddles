import { Box, useBreakpointValue, Image } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Temporary interface to fix type error
interface Player {
    player_id: string;
    amount: bigint;
    action?: any;
    hand_win_odds?: number;
    hand?: any[];
    bet_amount?: bigint;
}

import { useAvatar } from './useAvatar';
import { PlayerVPIP } from './AvatarVPIP';
import AvatarInfo from './AvatarInfo/AvatarInfo';
import AvatarProfile from './AvatarProfile/AvatarProfile';
import DealerChip from './DealerChip';
import ChatBubble from './ChatBubble';
import PlayerCards from './AvatarProfile/PlayerCards';
import { PlayerActionBubble } from './PlayerActionBubble';
import { PlayerHandBox } from './AvatarAction/PlayerHandBox';
import StraddleChip from './StraddleChip';
import Emote from './Emote';
import EmoteSelect from './EmoteSelect';
import ExtraTimerButton from './ExtraTimerButton';

export const Avatar = ({ player }: { player: Player }) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const {
        isCurrentPlayer,
        isYou,
        isWinner,
        isDealer,
        isAway,
        amountWon,
        isYourTurn,
        opacity,
        isFolded,
        isShowdown,
        isStraddle,
    } = useAvatar(player);

    // Win icon animation keyframes
    const slideInKeyframes = keyframes`
        0% {
            transform: translateX(-50%) translateY(20%);
            opacity: 0;
        }
        40% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        63% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1);
        }
        64% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1.15) drop-shadow(-20px 0 6px rgba(255, 255, 255, 0.5));
        }
        65% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1.3) drop-shadow(-10px 0 10px rgba(255, 255, 255, 0.7));
        }
        66% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1.45) drop-shadow(0px 0 12px rgba(255, 255, 255, 0.9));
        }
        67% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1.3) drop-shadow(10px 0 10px rgba(255, 255, 255, 0.7));
        }
        68% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1.15) drop-shadow(20px 0 6px rgba(255, 255, 255, 0.5));
        }
        69% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
            filter: brightness(1);
        }
        88% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(0);
            opacity: 0;
        }
    `;

    // Win icon animation keyframes for current user (lower position)
    const slideInKeyframesForUser = keyframes`
        0% {
            transform: translateX(-50%) translateY(calc(20% - ${isPortrait ? '0.5vmax' : '0.5vmin'}));
            opacity: 0;
        }
        40% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
        }
        63% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1);
        }
        64% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1.15) drop-shadow(-20px 0 6px rgba(255, 255, 255, 0.5));
        }
        65% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1.3) drop-shadow(-10px 0 10px rgba(255, 255, 255, 0.7));
        }
        66% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1.45) drop-shadow(0px 0 12px rgba(255, 255, 255, 0.9));
        }
        67% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1.3) drop-shadow(10px 0 10px rgba(255, 255, 255, 0.7));
        }
        68% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1.15) drop-shadow(20px 0 6px rgba(255, 255, 255, 0.5));
        }
        69% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
            filter: brightness(1);
        }
        88% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-${isPortrait ? '0.5vmax' : '0.5vmin'});
            opacity: 0;
        }
    `;

    return (
        <Box minW={isPortrait ? '15vmax' : 'min(17.5vmin, 14vmax)'}>
            {(!isFolded || isYou ||
                (isShowdown &&
                    player.hand?.some((card: any) => card?.show ?? false))) && (
                <Box
                    position="absolute"
                    top="-30%"
                    left="30%"
                    opacity={isYou && isFolded ? 0.4 : opacity}
                    zIndex={100}
                    pointerEvents="none"
                >
                    <PlayerCards player={player} isYou={isYou} />
                </Box>
            )}
            <DealerChip isDealer={isDealer} player={player} />
            <EmoteSelect player={player} isYou={isYou} />
            <ExtraTimerButton isYou={isYou} isYourTurn={isYourTurn} />
            <Emote player={player} />
            <StraddleChip isStraddle={isStraddle} player={player} />
            <PlayerActionBubble
                amountWon={amountWon}
                isWinner={isWinner}
                player={player}
            />
            {isWinner && !isPortrait && (
                <Box
                    position="absolute"
                    top={'max(-9.25vmin, -9.25vmax)'}
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={1001}
                    pointerEvents="none"
                    animation={`${isYou ? slideInKeyframesForUser : slideInKeyframes} 2.75s ease-out forwards`}
                >
                    <Image
                        src="/WinIcon.webp"
                        alt="Winner"
                        width="min(7.5vmin, 5.75vmax)"
                        height="min(7.5vmin, 5.75vmax)"
                        objectFit="contain"
                    />
                </Box>
            )}
            <Box
                display="flex"
                flexDirection="row"
                margin={0}
                top={isYou ? (isPortrait ? '0.25vmax' : '1.6vmin') : '0'}
                padding={0}
                height="100%"
                border={isPortrait ? '0.2vmax solid' : '0.2vmin solid'}
                boxShadow={
                    isCurrentPlayer 
                        ? '0 0 10px white' 
                        : isWinner 
                          ? '0 0 12px #4A9A6D, 0 0 20px #4A9A6D'
                          : 'none'
                }
                borderColor={
                    isWinner
                        ? 'green.300'
                        : !isFolded && !isAway
                          ? 'brand.gray10'
                          : 'rgba(255, 255, 255, 0.15)'
                }
                borderRadius={isPortrait ? '2vmax' : '2vmin'}
                position="relative"
                bg={
                    isFolded || isAway
                        ? 'brand.gray50'
                        : 'linear-gradient(180deg,rgb(40, 43, 50), #12151B)'
                }
                zIndex={1000}
            >
                <PlayerHandBox player={player} isYou={isYou} />
                <ChatBubble player={player} />
                <Box>
                    <AvatarProfile
                        isCurrentPlayer={isCurrentPlayer}
                        isYourTurn={isYourTurn}
                        isWinner={isWinner ?? false}
                        opacity={opacity}
                        player={player}
                        isFolded={isFolded || isAway}
                    />
                    <PlayerVPIP player={player} />
                </Box>

                <Box w="100%">
                    <AvatarInfo 
                        player={player} 
                        isAway={isAway} 
                        isShowdown={isShowdown}
                        isWinner={isWinner}
                        amountWon={amountWon}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Avatar;
