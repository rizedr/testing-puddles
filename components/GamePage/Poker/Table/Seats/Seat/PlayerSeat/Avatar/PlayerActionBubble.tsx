import { HStack, Text, Box, useBreakpointValue } from '@chakra-ui/react';
import { Action } from '../../../../../../../../client';

// Temporary interface to fix type error
interface Player {
    player_id: string;
    amount: bigint;
    action?: Action;
    hand_win_odds?: number;
    hand?: any[];
    bet_amount?: bigint;
}

import { useGetPlayerUIPosition } from '../../../../../../../hooks/useGetPlayerUIPositions';
import { getPosition, PlayerPosition } from './sharedPositioning';
import { BetChipIcon } from '../../../../../../../Shared/BetChipIcon';
import { useMoneyDisplay } from '../../../../../../../Shared/MoneyDisplay';
import { useEffect, useRef, useState } from 'react';

const landscapeStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '7.75vmin', bottom: '-5.5vmin' },
    topRight: { right: '8vmin', bottom: '-5.5vmin' },
    upperLeft: { left: '8.25vmin', bottom: '-3.25vmin' },
    upperRight: { right: '8vmin', bottom: '-3.25vmin' },
    left: { left: '7.25vmin', top: '-5.4vmin' },
    right: { right: '7.25vmin', top: '-5.4vmin' },
    bottomLeft: { left: '10.5vmin', top: '-7.15vmin' },
    bottom: { left: '4.5vmin', top: '-7.15vmin' },
    bottomRight: { left: '-3vmin', top: '-7.15vmin' },
};

const portraitStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '8vmax', bottom: '-3vmax' },
    topRight: { right: '8.15vmax', bottom: '-3vmax' },
    upperLeft: { left: '8vmax', bottom: '-3vmax' },
    upperRight: { right: '8.15vmax', bottom: '-3vmax' },
    left: { left: '7.5vmax', top: '5.15vmax' },
    right: { right: '7.75vmax', top: '5.15vmax' },
    bottomLeft: { left: '8.75vmax', top: '5.15vmax' },
    bottomRight: { right: '8.75vmax', top: '5.15vmax' },
    bottom: { left: '3.85vmax', top: '-7vmax' },
};

// Add keyframes for moving to center
const styles = `
@keyframes moveToCenter {
  to {
    left: 50vw !important;
    top: 50vh !important;
    right: auto !important;
    bottom: auto !important;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
  }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('player-bubble-anim')) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.id = 'player-bubble-anim';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

interface PlayerActionBubbleProps {
    player: Player;
    isWinner?: boolean;
    amountWon?: bigint;
    visibility?: string;
}

type BubbleVariant = {
    backgroundColor: string;
    color: string;
    boxShadow?: string;
    content: string | number | React.ReactNode;
    showChip?: boolean;
};

export const PlayerActionBubble = ({
    player,
    isWinner,
    amountWon,
}: PlayerActionBubbleProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const currentPlayerPosition = useGetPlayerUIPosition(player.player_id);
    const position = getPosition(currentPlayerPosition);
    const stylesObj = isPortrait ? portraitStyles : landscapeStyles;
    const [isExiting, setIsExiting] = useState(false);
    const prevBetAmount = useRef(player.bet_amount);
    const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const amountWonDisplay = useMoneyDisplay(amountWon ?? 0n);
    const betAmountDisplay = useMoneyDisplay(player.bet_amount ?? 0n);
    const [lastNonzeroBet, setLastNonzeroBet] = useState(player.bet_amount);

    // Animation state
    const bubbleRef = useRef<HTMLDivElement>(null);
    const [flyStyle, setFlyStyle] = useState<React.CSSProperties>({});
    const [fixedMode, setFixedMode] = useState(false);

    const lastNonzeroBetDisplay = useMoneyDisplay(lastNonzeroBet ?? 0n);

    useEffect(() => {
        // If a new bet comes in, update lastNonzeroBet, cancel exit animation and reset fly style
        if (player.bet_amount && player.bet_amount > 0n) {
            setLastNonzeroBet(player.bet_amount);
            setIsExiting(false);
            setFlyStyle({});
            if (exitTimeoutRef.current) {
                clearTimeout(exitTimeoutRef.current);
                exitTimeoutRef.current = null;
            }
        }
        // If bet_amount goes from nonzero to zero, trigger exit animation
        else if (prevBetAmount.current && prevBetAmount.current > 0n && (!player.bet_amount || player.bet_amount === 0n)) {
            setIsExiting(true);
            // Start the fly-out animation after a short delay
            setTimeout(() => {
                if (bubbleRef.current) {
                    const bubbleRect = bubbleRef.current.getBoundingClientRect();
                    const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2;
                    const bubbleCenterY = bubbleRect.top + bubbleRect.height / 2;
                    const centerX = window.innerWidth * 0.52;
                    const centerY = window.innerHeight * 0.265;
                    const deltaX = centerX - bubbleCenterX;
                    const deltaY = centerY - bubbleCenterY;
                    setFixedMode(false);
                    setFlyStyle({
                        transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s',
                        transform: `translate(${deltaX}px, ${deltaY}px) scale(0.7)`,
                        opacity: 0,
                        zIndex: 2000,
                    });
                }
            }, 10);
            // End the animation after 485ms
            exitTimeoutRef.current = setTimeout(() => {
                setIsExiting(false);
                setFlyStyle({});
                exitTimeoutRef.current = null;
            }, 485);
        }
        prevBetAmount.current = player.bet_amount;
    }, [player.bet_amount]);

    const getBubbleVariant = (): BubbleVariant | null => {
        if (isWinner) {
            return null;
        }
        if (player.action === Action.CHECK) {
            return {
                backgroundColor: '#1D409D',
                color: 'white',
                content: 'CHECK',
            };
        }
        if (player.bet_amount && player.bet_amount > 0n || isExiting) {
            // Always show lastNonzeroBetDisplay during exit
            const display = isExiting ? lastNonzeroBetDisplay : betAmountDisplay;
            return {
                backgroundColor: 'brand.darkGray',
                color: 'white',
                content: display,
                showChip: true,
            };
        }
        return null;
    };

    const variant = getBubbleVariant();
    if (!variant) return null;

    if (variant.showChip) {
        return (
            ((player.bet_amount && player.bet_amount > 0n) || isExiting) && (
                <div
                    ref={bubbleRef}
                    style={{
                        position: 'absolute',
                        ...stylesObj[position as keyof typeof stylesObj],
                        pointerEvents: 'none',
                        ...(isExiting ? flyStyle : {}),
                    }}
                >
                    <HStack
                        borderRadius="1.5625rem"
                        py={isPortrait ? '0.65vmax' : 'min(0.85vmin, 0.3vmax)'}
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={variant.backgroundColor}
                        boxShadow={variant.boxShadow}
                        border="0.5px solid"
                        borderColor="rgba(255, 255, 255, 0.25)"
                        spacing="0.25rem"
                        pr="0.4rem"
                        pl="0.4rem"
                        width="100%"
                        height="100%"
                    >
                        <BetChipIcon
                            height={isPortrait ? '1.25vmax' : '1.4vmin'}
                            width={isPortrait ? '1.25vmax' : '1.4vmin'}
                        />
                        <Text
                            variant="bold"
                            fontSize={isPortrait ? '1.35vmax' : '1.5vmin'}
                            lineHeight={isPortrait ? '0.875vmax' : '1.125vmin'}
                            color={variant.color}
                        >
                            {variant.content}
                        </Text>
                    </HStack>
                </div>
            )
        );
    }

    // Default (non-bet) bubbles, no animation
    const Container = Box;
    const containerProps = { px: isPortrait ? '1vmax' : '1vmin' };

    return (
        <Container
            position="absolute"
            borderRadius="1.5625rem"
            py={isPortrait ? '0.65vmax' : 'min(0.85vmin, 0.3vmax)'}
            alignItems="center"
            justifyContent="center"
            backgroundColor={variant.backgroundColor}
            boxShadow={variant.boxShadow}
            border="0.5px solid"
            borderColor="rgba(255, 255, 255, 0.25)"
            zIndex={1000}
            {...containerProps}
            {...stylesObj[position as keyof typeof stylesObj]}
        >
            <Text
                variant="bold"
                fontSize={isPortrait ? '1.35vmax' : '1.5vmin'}
                lineHeight={isPortrait ? '0.875vmax' : '1.125vmin'}
                color={variant.color}
            >
                {variant.content}
            </Text>
        </Container>
    );
};
