import { SUIT, VALUE } from "./Suits";

const valueToString = {
    [VALUE.TWO]: '2',
    [VALUE.THREE]: '3',
    [VALUE.FOUR]: '4',
    [VALUE.FIVE]: '5',
    [VALUE.SIX]: '6',
    [VALUE.SEVEN]: '7',
    [VALUE.EIGHT]: '8',
    [VALUE.NINE]: '9',
    [VALUE.TEN]: '10',
    [VALUE.JACK]: 'J',
    [VALUE.QUEEN]: 'Q',
    [VALUE.KING]: 'K',
    [VALUE.ACE]: 'A',
};

const fourColorDeckBackgroundColors = {
    [SUIT.SPADES]: 'linear-gradient(15deg,rgb(29, 27, 27),rgb(51, 49, 49))',
    [SUIT.CLUBS]: 'linear-gradient(15deg,rgb(19, 83, 30),rgb(52, 119, 35))',
    [SUIT.HEARTS]: 'linear-gradient(15deg,rgb(122, 21, 14),rgb(164, 67, 60))',
    [SUIT.DIAMONDS]: 'linear-gradient(15deg,rgb(21, 66, 130),rgb(43, 93, 155))',
}

const fourColorDeckBorderColors = {
    [SUIT.SPADES]: '#5E5E5E',
    [SUIT.CLUBS]: '#57915D',
    [SUIT.HEARTS]: '#B53821',
    [SUIT.DIAMONDS]: '#4269A1',
}

export { valueToString, fourColorDeckBackgroundColors, fourColorDeckBorderColors };