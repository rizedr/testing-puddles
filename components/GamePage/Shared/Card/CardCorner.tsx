import { Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { oswald } from '../../../../tools/fonts';
import { Clove } from './Clove';
import { Diamond } from './Diamond';
import { Heart } from './Heart';
import { Spade } from './Spade';
import { SUIT, VALUE } from './Suits';
import { valueToString } from './CardConstants';

const suitToCardCorner = {
    [SUIT.HEARTS]: Heart,
    [SUIT.DIAMONDS]: Diamond,
    [SUIT.CLUBS]: Clove,
    [SUIT.SPADES]: Spade,
};

interface CardCornerProps {
    value: VALUE;
    suit: SUIT;
    cornerSize: string;
    cornerValueSize: string;
    cornerSpacing?: string;
    showSecondarySuit?: boolean;
    isFourColorDeck: boolean;
}

export const CardCorner = ({
    value,
    suit,
    cornerSize,
    cornerValueSize,
    cornerSpacing = '-0.75rem',
    showSecondarySuit = true,
    isFourColorDeck = true,
}: CardCornerProps) => {
    const SuitSVG = suitToCardCorner[suit];
    
    const cardTextColor = isFourColorDeck ? 'white' : (
        [SUIT.HEARTS, SUIT.DIAMONDS].includes(suit)
        ? '#CC0E0E'
        : 'black'
    );

    return (
        <VStack spacing="0px">
            <Text
                fontSize={cornerValueSize}
                fontWeight="400"
                fontFamily={oswald.style.fontFamily}
                color={cardTextColor}
                textShadow="0 0 0.5px"
            >
                {valueToString[value]}
            </Text>
            {showSecondarySuit && (
                <SuitSVG
                    marginTop={cornerSpacing}
                    height={cornerSize}
                    width={cornerSize}
                    isFourColorDeck={isFourColorDeck}
                />
            )} 
        </VStack>
    );
};
