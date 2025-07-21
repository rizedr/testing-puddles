import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { SUIT, VALUE } from '../../../../../../../Shared/Card/Suits';
import Card from '../../../../../../../Shared/Card/Card';
import CardBack from '../../../../../../../Shared/Card/CardBack';
import useViewer from '../../../../../../../../hooks/useViewer';
import { useEffect, useRef, useState } from 'react';

// Temporary interface to fix type error (copied from AvatarInfo.tsx)
interface Player {
    player_id: string;
    amount: bigint;
    action?: any;
    hand_win_odds?: number;
    hand?: any[];
}

/**
 * This component is used to display a player's cards.
 */
export const PlayerCards = ({ player, isYou }: { player: Player, isYou: boolean }) => {
    const isPortrait = useBreakpointValue({ base: true, lg:false, xl: false });
    const { userId } = useViewer();
    const isUser = player?.player_id === userId;
    const [flipped, setFlipped] = useState<boolean[]>([]);
    const prevShowRef = useRef<(boolean | undefined)[]>([]);

    useEffect(() => {
        // Track previous show state for each card
        const prevShow = prevShowRef.current;
        const newFlipped = player?.hand?.map((card: any, idx: number) => {
            const prev = prevShow[idx];
            const curr = card?.show;
            // Flip if transitioned from hidden to shown
            return !prev && curr;
        }) || [];
        // If any card needs to be flipped, set flipped state
        if (newFlipped.some(Boolean)) {
            setFlipped(newFlipped);
            // Reset after animation duration (e.g., 600ms)
            setTimeout(() => {
                setFlipped(Array(player?.hand?.length || 0).fill(false));
            }, 150);
        }
        // Update previous show state
        prevShowRef.current = player?.hand?.map((card: any) => card?.show) || [];
    }, [player?.hand]);

    const twoCardFrontTrans = [
        isPortrait ? 'rotate(-5deg) translateX(0.4vmax) translateY(-0.75vmax)' : 'rotate(-5deg) translateX(-0.4vmin) translateY(0.2vmin)',
        isPortrait ? 'rotate(5deg) translateX(2.3vmax) translateY(-1.32vmax)' : 'rotate(5deg) translateX(2.1vmin) translateY(-0.42vmin)',
    ];
    
    const twoCardBackTrans = [
        isPortrait ? 'rotate(-6deg) translateY(0.47vmax)' : 'rotate(-8deg) translateY(1.1vmin)',
        isPortrait ? 'rotate(6deg) translateX(2.25vmax) translateY(0.28vmax)' : 'rotate(7deg) translateX(2.75vmin) translateY(0.75vmin)',
    ];
    
    const fourCardFrontTrans = [
        isPortrait ? 'rotate(-10deg) translateX(-0.3525vmax) translateY(-1.05vmax)' : 'rotate(-10deg) translateX(-1.1vmin) translateY(-0.55vmin)',
        isPortrait ? 'rotate(-3deg) translateX(1.5vmax) translateY(-1.3vmax)' : 'rotate(-3deg) translateX(0.9vmin) translateY(-0.8vmin)',
        isPortrait ? 'rotate(3deg) translateX(3.5vmax) translateY(-1.7vmax)' : 'rotate(3deg) translateX(2.95vmin) translateY(-1.26vmin)',
        isPortrait ? 'rotate(10deg) translateX(5.05vmax) translateY(-2.45vmax)' : 'rotate(10deg) translateX(4.85vmin) translateY(-1.95vmin)',
    ];
    
    const fourCardBackTrans = [
        isPortrait ? 'rotate(-10deg) translateX(-0.15vmax) translateY(0.3vmax)' : 'rotate(-10deg) translateY(0.5vmin)',
        isPortrait ? 'rotate(-3deg) translateX(1.25vmax) translateY(0.25vmax)' : 'rotate(-3deg) translateX(1.5vmin) translateY(0.4vmin)',
        isPortrait ? 'rotate(3deg) translateX(2.5vmax) translateY(0.05vmax)' : 'rotate(3deg) translateX(3vmin) translateY(0.2vmin)',
        isPortrait ? 'rotate(10deg) translateX(3.75vmax) translateY(-0.3vmax)' : 'rotate(10deg) translateX(4.25vmin) translateY(-0.175vmin)',
    ];

    const cardTrans =
        (player?.hand?.length ?? 0) > 2 ? fourCardFrontTrans : twoCardFrontTrans;
    const cardBackTrans =
        (player?.hand?.length ?? 0) > 2 ? fourCardBackTrans : twoCardBackTrans;

    const width = (player?.hand?.length ?? 0) > 2 
        ? (isPortrait ? '3.5vmax' : (isYou ? '5vmin' : '4vmin')) 
        : (isPortrait ? '4.2vmax' : (isYou ? '5.65vmin' : '4.4vmin'));
    const height = (player?.hand?.length ?? 0) > 2 
        ? (isPortrait ? '4.25vmax' : (isYou ? '6.5vmin' : '5.2vmin')) 
        : (isPortrait ? '5.25vmax' : (isYou ? '6.95vmin' : '5.5vmin'));
    const leftOffset = (player?.hand?.length ?? 0) > 2 
        ? (isPortrait ? '0.3vmax' : '0.3vmin') 
        : (isPortrait ? '0.75vmax' : '1.25vmin');
    const topOffset = (player?.hand?.length ?? 0) > 2 
        ? (isPortrait ? '-0.8vmax' : '-1.1vmin') 
        : (isPortrait ? '-1.25vmax' : '-1.75vmin');

    const cardCornerSizeLandscape = isYou ? '1.6vmin' : '1.2vmin';
    const cardCornerValueSizeLandscape = isYou ? '2.1vmin' : '1.6vmin';
    const cardCornerSpacingLandscape = isYou ? '-0.18vmin' : '-0.15vmin';
    const cardCornerMarginTopLandscape = isYou ? '-0.3vmin' : '-0.25vmin';
    const cardCornerValueSizeBottomLandscape = isYou ? '1.8vmin' : '1.5vmin';


    return (
        <Flex zIndex={1} position="relative">
            {player?.hand?.map((card: any, index: number) => {
                const isCardHidden = !card?.show;
                // const isLandscapeHidden = !isPortrait && !card?.show;
                const shouldShowCardBack =
                    card === null ||
                    (isCardHidden && !isYou);

                if (shouldShowCardBack) {
                    return (
                        <Box
                            key={index}
                            borderRadius="1.25rem"
                            w={width}
                            h={height}
                            transform={cardBackTrans[index]}
                            left={leftOffset}
                            top={topOffset}
                            position="absolute"
                            bgSize="cover"
                            // boxShadow="0px 0px 10px 0px rgba(0, 0, 0, 0.3)"
                        >
                            <CardBack />
                        </Box>
                    );
                }
                return (
                    <Box
                        h={height}
                        w={width}
                        transform={cardTrans[index]}
                        key={index}
                        position="absolute"
                        transformOrigin="bottom left"
                        left={leftOffset}
                        top={topOffset}
                        border={
                            isPortrait && isUser && card?.show
                                ? '0.25vmax solid var(--Secondary-Blue-active, #4955EB)'
                                : 'none'
                        }
                        
                        borderRadius="0.75rem"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.7)"
                    >
                        <Card
                            value={card.value as VALUE}
                            suit={card.suit as SUIT}
                            state={card.state}
                            cardIndex={index}
                            cornerSize={isPortrait ? "1.2vmax" : cardCornerSizeLandscape}
                            cornerValueSize={isPortrait ? "1.6vmax" : cardCornerValueSizeLandscape}
                            cornerSpacing={isPortrait ? "-0.1vmax" : cardCornerSpacingLandscape}
                            cornerMarginTop={isPortrait ? "-0.2vmax" : cardCornerMarginTopLandscape}
                            cornerValueSizeBottom={isPortrait ? "1.5vmax" : cardCornerValueSizeBottomLandscape}
                            shouldAnimate={false}
                            isFlipped={!!flipped[index]}
                            showSuit={false}
                        />
                    </Box>
                );
            })}
        </Flex>
    );
};

export default PlayerCards;
