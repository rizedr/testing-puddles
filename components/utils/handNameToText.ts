import { HandName } from '../../client';

export const handNameToText: Record<HandName, string> = {
    [HandName.NONE]: 'None',
    [HandName.LAST_PLAYER_STANDING]: 'Last Player Standing',
    [HandName.HIGH_CARD]: 'High Card',
    [HandName.PAIR]: 'Pair',
    [HandName.TWO_PAIR]: 'Two Pair',
    [HandName.THREE_OF_A_KIND]: 'Three of a Kind',
    [HandName.STRAIGHT]: 'Straight',
    [HandName.FLUSH]: 'Flush',
    [HandName.FULL_HOUSE]: 'Full House',
    [HandName.FOUR_OF_A_KIND]: 'Four of a Kind',
    [HandName.STRAIGHT_FLUSH]: 'Straight Flush',
    [HandName.ROYAL_FLUSH]: 'Royal Flush',
};
