import { Box, Button, HStack } from '@chakra-ui/react';
import { SUIT } from '../../../../Shared/Card/Suits';
import { CardPreview } from './CardPreview';
import { Card } from '../../../../../../client';
import useViewer from '../../../../../hooks/useViewer';

interface CardButtonProps {
    onClick: () => void;
    cards: Card[];
    isRevealed: boolean;
}

export const CardButton = ({ onClick, cards, isRevealed }: CardButtonProps) => {
    const { user } = useViewer();
    const isFourColorDeck = user?.pokerPreferences?.fourColorDeck ?? false;

    return (
        <Button
            _hover={{ bg: isRevealed ? 'transparent' : 'gray.700' }}
            alignItems="center"
            bg={isRevealed ? 'transparent' : 'brand.gray40'}
            borderRadius="0.75rem"
            color="brand.accentWhite"
            display="flex"
            flexDirection="column"
            height="4.5rem"
            justifyContent="center"
            onClick={isRevealed ? undefined : onClick}
            width="5.5rem"
            cursor={isRevealed ? 'default' : 'pointer'}
        >
            <Box
                color="brand.accentWhite"
                fontSize="1rem"
                fontWeight="700"
                my="0.4rem"
            >
                {isRevealed ? 'Showing' : cards.length >= 2 ? 'Show All' : 'Show'}
            </Box>
            {cards.length < 2 && (
                <HStack position="relative" pb="2rem" pt="1rem" px="1rem">
                    {cards?.map((card, index) => {
                        return (
                            <CardPreview
                                key={index}
                                value={card.value}
                                suit={card.suit as SUIT}
                                zIndex={index}
                                top={
                                    cards.length === 1
                                        ? '0rem'
                                        : `calc(-0.2rem + ${index * 0.5}rem)`
                                }
                                left={
                                    cards.length === 1
                                        ? '-0.5rem'
                                        : `calc(-2.2rem + ${index * 3}rem)`
                                }
                                isFourColorDeck={isFourColorDeck}
                            />
                        );
                    })}
                </HStack>
            )}
        </Button>
    );
};
