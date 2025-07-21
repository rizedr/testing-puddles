import { CardState } from '../../client';

export const getCardStyles = (state: CardState, shouldAnimate: boolean) => {
    switch (state) {
        case CardState.HIGHLIGHTED:
            return {
                transform: shouldAnimate ? 'translateY(-1rem)' : '',
                transition: 'transform 0.5s ease',
            };
        case CardState.DIMMED:
            return {
                opacity: 0.5,
                transition: 'opacity 0.5s ease',
            };
        default:
            return {};
    }
};
