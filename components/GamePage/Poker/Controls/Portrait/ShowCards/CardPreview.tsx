import { Text, HStack } from '@chakra-ui/react';
import React from 'react';

import { oswald } from '../../../../../../tools/fonts';
import { Clove } from '../../../../Shared/Card/Clove';
import { Diamond } from '../../../../Shared/Card/Diamond';
import { Heart } from '../../../../Shared/Card/Heart';
import { Spade } from '../../../../Shared/Card/Spade';
import { SUIT, VALUE } from '../../../../Shared/Card/Suits';
import { fourColorDeckBackgroundColors, fourColorDeckBorderColors } from '../../../../Shared/Card/CardConstants';
const suitToCardCorner = {
    [SUIT.DIAMONDS]: Diamond,
    [SUIT.SPADES]: Spade,
    [SUIT.CLUBS]: Clove,
    [SUIT.HEARTS]: Heart,
};

const valueToCardCorner = {
    [VALUE.ACE]: 'A',
    [VALUE.KING]: 'K',
    [VALUE.QUEEN]: 'Q',
    [VALUE.JACK]: 'J',
    [VALUE.TEN]: '10',
    [VALUE.NINE]: '9',
    [VALUE.EIGHT]: '8',
    [VALUE.SEVEN]: '7',
    [VALUE.SIX]: '6',
    [VALUE.FIVE]: '5',
    [VALUE.FOUR]: '4',
    [VALUE.THREE]: '3',
    [VALUE.TWO]: '2',
};

export const CardPreview = ({
    value,
    suit,
    zIndex,
    top,
    left,
    isFourColorDeck,
}: {
    value: VALUE;
    suit: SUIT;
    zIndex: number;
    top: number;
    left: number;
    isFourColorDeck: boolean;
}) => {
    const SuitSVG = suitToCardCorner[suit];
    const fontColor = isFourColorDeck ? 'white' : (
        [SUIT.HEARTS, SUIT.DIAMONDS].includes(suit)
        ? '#CC0E0E'
        : 'black'
    );
    const backgroundColor = isFourColorDeck ? fourColorDeckBackgroundColors[suit] : 'brand.textWhite';
    const borderColor = isFourColorDeck ? fourColorDeckBorderColors[suit] : 'brand.textWhite';

    return (
        <HStack
            bg={backgroundColor}
            borderRadius="3px"
            border={`1px solid ${borderColor}`}
            boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.75)"
            spacing="0.15rem"
            zIndex={zIndex}
            px="0.5rem"
            pr="0.75rem"
            position="absolute"
            top={top}
            left="50%"
            transform="translateX(-50%)"
            justifyContent="center"
            alignItems="center"
        >
            <Text
                fontSize="1.5rem"
                fontWeight="700"
                color={fontColor}
                fontFamily={oswald.style.fontFamily}
                textShadow="0 0 0.5px"
                textAlign="center"
            >
                {valueToCardCorner[value]}
            </Text>
            <SuitSVG height="1.1rem" width="1.1rem" color={fontColor} isFourColorDeck={isFourColorDeck} />
        </HStack>
    );
};
