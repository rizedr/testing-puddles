import { Box, HStack } from '@chakra-ui/react';

import { useUserStatus } from '../../../../../hooks/useUserStatus';
import { useShowCard } from '../../../../../hooks/useShowCard';
import { CardButton } from './CardButton';
import { Player } from '../../../../../../client';
import { WinningsDisplay } from './WinningsDisplay';

/**
 * 3 possible UI states:
 * 1. All cards shown (1 Revealed Card)
 * 2. No cards shown (3 Hidden Cards)
 * 3. Partial reveal (1 Hidden Card, 1 Revealed Card)
 */


export const ShowCards = () => {
    const { currentPlayer } = useUserStatus();
    const hand = currentPlayer?.hand?.filter((card) => card) || [];
    const { showCard } = useShowCard();
    const showCards = currentPlayer?.hand.map((card) => card.show) || [];

    const allCardsShown =
        showCards.length === hand.length && showCards.every((shown) => shown);
    const noCardsShown =
        !hand.every((card) => card === null) &&
        showCards.every((shown) => !shown);

    const handleShowCard = (index: number) => showCard(index);
    const handleShowBothCards = () => hand.forEach((_, i) => showCard(i));

    return (
        <Box w="100%">
            <HStack
                position="relative"
                justifyContent="center"
                alignItems="center"
                spacing="1rem"
                my="auto"
            >
                {!allCardsShown &&
                    hand.map((card, index) => (
                        <CardButton
                            key={index}
                            onClick={() => handleShowCard(index)}
                            cards={[card]}
                            isRevealed={showCards[index]}
                        />
                    ))}
                {noCardsShown && (
                    <CardButton
                        onClick={handleShowBothCards}
                        cards={hand}
                        isRevealed={false}
                    />
                )}
                {allCardsShown && (
                    <CardButton
                        isRevealed
                        onClick={handleShowBothCards}
                        cards={hand}
                    />
                )}
            </HStack>
            {/* <WinningsDisplay currentPlayer={currentPlayer as Player} /> */}
        </Box>
    );
};

export default ShowCards;
