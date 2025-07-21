import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import { oswald } from '../../../../tools/fonts';
import Cloves from '../../../../public/Cards/Cloves.svg';
import Diamonds from '../../../../public/Cards/Diamonds.svg';
import Hearts from '../../../../public/Cards/Hearts.svg';
import Spades from '../../../../public/Cards/Spades.svg';
import { useShowCard } from '../../../hooks/useShowCard';

import { CardState } from '../../../../client';
import { getCardStyles } from '../../../utils/getCardStyles';
import { SUIT, VALUE } from './Suits';
import { CardCorner } from './CardCorner';
import { valueToString, fourColorDeckBackgroundColors, fourColorDeckBorderColors } from './CardConstants';
import useViewer from '../../../hooks/useViewer';

interface CardProps {
    cardIndex: number;
    cornerSize?: string;
    cornerValueSize?: string;
    cornerMarginTop?: string;
    cornerSpacing?: string;
    suit: SUIT;
    value: VALUE;
    state?: CardState;
    isFlipped: boolean;
    hideCursor?: boolean;
    shouldAnimate?: boolean;
    showSuit?: boolean;
    showSecondarySuit?: boolean;
    cornerValueSizeBottom?: string;
    communityCard?: boolean;
    shadowTop?: boolean;
}

const suitToSVG = {
    [SUIT.SPADES]: Spades,
    [SUIT.CLUBS]: Cloves,
    [SUIT.HEARTS]: Hearts,
    [SUIT.DIAMONDS]: Diamonds,
};

export const Card = ({
    value,
    suit,
    state,
    cardIndex,
    cornerSize = '1.75rem',
    cornerValueSize = '2.75rem',
    cornerMarginTop = '-0.5rem',
    cornerSpacing = '-0.5rem',
    isFlipped,
    hideCursor = false,
    shouldAnimate = false,
    showSuit = true,
    showSecondarySuit = true,
    cornerValueSizeBottom,
    communityCard = false,
    shadowTop = false,
}: CardProps) => {
    const { showCard } = useShowCard();
    const { user } = useViewer();
    const SuitSVG = suitToSVG[suit];
    const isPortrait = useBreakpointValue({ base: true, sm: true, lg: false, xl: false });

    const isFourColorDeck = user?.pokerPreferences?.fourColorDeck ?? false;
    const cardTextColor = isFourColorDeck ? 'white' : 'black';
    const cardBackgroundColor = isFourColorDeck ? fourColorDeckBackgroundColors[suit] : 'white';
    const cardBorderColor = isFourColorDeck ? fourColorDeckBorderColors[suit] : 'black';

    return (
        <Flex
            className={`card ${isFlipped ? 'flipped' : ''} ${oswald.className} ${hideCursor ? 'hide-cursor' : ''}`}
            fontFamily={oswald.style.fontFamily}
            w="100%"
            h="100%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            // transition="all 0.3s ease"
            position="relative"
            onClick={() => showCard(cardIndex)}
            style={getCardStyles(state ?? CardState.NORMAL, shouldAnimate)}
            color={cardTextColor}
        >
            <Box borderRadius="6px" w="100%" h="100%" className={`card-inner ${isFlipped ? 'flip-animation' : ''}`}>
                {/* Card Front */}
                <Box
                    bg={cardBackgroundColor}
                    borderRadius="0.5vmin"
                    width="100%"
                    height="100%"
                    className="card-front"
                    boxShadow={
                        shadowTop
                            ? `${communityCard ? '0px 2.25px 1.75px #16261E, ' : ''}0 -8px 16px -8px rgba(0,0,0,0.45)`
                            : communityCard
                                ? '0px 2.25px 1.75px #16261E'
                                : 'none'
                    }
                    style={{
                        backfaceVisibility: 'hidden',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: isFourColorDeck ? `1px solid ${cardBorderColor}` : 'none',
                        transform: isFlipped ? 'rotateY(120deg)' : 'rotateY(0deg)',
                        transition: 'transform 0.25s',
                    }}
                >
                    <Flex
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        position="absolute"
                        top={cornerMarginTop}
                        left="0"
                        mb={isPortrait ? "0.3vmax" : "0.5vmax"}
                        ml={isPortrait ? "0.4vmax" : "0.4vmin"}
                    >
                        <CardCorner
                            cornerSize={cornerSize}
                            cornerValueSize={cornerValueSize}
                            cornerSpacing={cornerSpacing}
                            value={value as VALUE}
                            suit={suit as SUIT}
                            showSecondarySuit={showSecondarySuit}
                            isFourColorDeck={isFourColorDeck}
                        />
                    </Flex>
                    <Flex
                        position="absolute"
                        right="0"
                        bottom="0"
                        mr={isFourColorDeck ? isPortrait ? "0.65vmax" : "0.75vmin" : isPortrait ? "0.3vmax" : "0.3vmin"}
                        mb={isFourColorDeck ? isPortrait ? "0.15vmax" : "0.1vmin" : isPortrait ? "0.3vmax" : "0.3vmin"}
                        zIndex={100}
                    >
                        {showSuit && (
                            isFourColorDeck ? (
                                <Box>
                                    <Text
                                        fontSize={cornerValueSizeBottom}
                                        fontWeight="700"
                                        fontFamily={oswald.style.fontFamily}
                                        color={cardTextColor}
                                        textShadow="0 0 0.5px"
                                    >
                                       {valueToString[value]}
                                    </Text>
                                </Box>
                            ) : (
                                <SuitSVG
                                    height="100%"
                                    width="100%"
                                    alt={`${suit} symbol`}
                                    style={{ fill: cardTextColor }}
                                />
                            )
                        )}
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default Card;
