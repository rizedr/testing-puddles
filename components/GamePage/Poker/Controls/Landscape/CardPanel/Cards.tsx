import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

import Card from '../../../../Shared/Card/Card';
import { SUIT, VALUE } from '../../../../Shared/Card/Suits';
import { CardState } from '../../../../../../client';
import { useGetCurrentPlayer } from '../../../../../hooks/useGetCurrentPlayer';
import { usePokerGameState } from '../../../../../hooks/usePokerGameState';
import { PokerGameState } from '../../../../../types/PokerGameState';
import { useQuery } from 'convex/react';
import { Id } from '../../../../../../../../packages/convex/convex/_generated/dataModel';
import { api } from '../../../../../../../../packages/convex/convex/_generated/api';
import useGameId from '../../../../../hooks/useGameID';

const twoCardTrans = [
    'rotate(-10deg) translateX(3vmin)',
    'rotate(5deg) translateX(-2.75vmin)',
];
const fourCardTrans = [
    'rotate(-10deg) translateX(8.1vmin) translateY(3vmin)',
    'rotate(-4deg) translateX(3vmin) translateY(0.75vmin)',
    'rotate(3deg) translateX(-2.6vmin) translateY(0.75vmin)',
    'rotate(11deg) translateX(-8vmin) translateY(3vmin)',
];

const Cards = () => {
    const gameId = useGameId();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const currentPlayer = useGetCurrentPlayer();
    const privateCards = currentPlayer?.hand || [];
    const gameState = usePokerGameState();
    const isBetweenGames =
        gameState === PokerGameState.SHOWDOWN ||
        gameState === PokerGameState.RESET;
    const handName = currentPlayer?.hand_name;
    const showCards = currentPlayer?.hand.map((card) => card.show) || [];

    const encryptedDecks = useQuery(api.tasks.getEncryptedDecks, {
        gameId: gameId as Id<'gameData'>,
    });

    const cornerSize = isPortrait ? '1.75vmax' : '2.5vmin';
    const cornerValueSize = isPortrait ? '2.5vmax' : '3.75vmin';
    const cornerMarginTop = isPortrait ? '-0.5vmax' : '-0.5vmin';
    const cornerSpacing = isPortrait ? '-0.5vmax' : '-0.5vmin';
    const cornerValueSizeBottom = '6.5vmin';

    const allCardsShown =
        showCards.length === privateCards.length &&
        showCards.every((shown: boolean) => shown);

    // temporary while i figure out how to utilize this space better
    const infoText =
        isBetweenGames && !allCardsShown
            ? "Click on each card you'd like to show"
            : undefined;

    const infoTextVisibility =
        infoText && privateCards.length && (isBetweenGames || handName !== null)
            ? 'visible'
            : 'hidden';

    const encryptedDeckVisibility =
        gameState !== PokerGameState.CREATE &&
        encryptedDecks &&
        encryptedDecks?.encryptedDeck
            ? 'visible'
            : 'hidden';

    return (
        <Flex
            h="100%"
            direction="column"
            align="center"
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            top={{ lg: '-3vmin', xl: '-5vmin' }}
        >
            <Flex direction="row">
                {privateCards?.map((card, index) => {
                    const isHighlighted = card?.state === CardState.HIGHLIGHTED;
                    const isDimmed = card?.state === CardState.DIMMED;

                    return (
                        <Box
                            h="14vmin"
                            w="10.25vmin"
                            filter="drop-shadow(0px 4px 1.25rem rgba(0, 0, 0, 0.5))"
                            key={index}
                            transform={`
                                ${
                                    privateCards.length > 2
                                        ? fourCardTrans[index]
                                        : twoCardTrans[index]
                                }
                                ${isHighlighted ? 'translateY(-2.5vmin)' : ''}
                            `}
                            opacity={isDimmed ? 0.5 : 1}
                            _hover={{
                                transform: `
                                    ${
                                        privateCards.length > 2
                                            ? fourCardTrans[index]
                                            : twoCardTrans[index]
                                    }
                                    translateY(-3vmin) scale(1.3)
                                `,
                                boxShadow: '0px 0px 2vmin brand.lightBlue',
                                cursor: 'pointer',
                            }}
                            boxShadow="0px 0px 3vmin .3vmin rgba(0, 0, 0, 0.50)"
                            transition="all 0.3s ease"
                            border={
                                currentPlayer?.hand[index].show
                                    ? '0.6vmin solid var(--Secondary-Blue-active, #2a5ab3)'
                                    : 'none'
                            }
                            borderRadius="0.75rem"
                        >
                            <Card
                                value={card?.value as VALUE}
                                suit={card?.suit as SUIT}
                                state={card?.state}
                                cardIndex={index}
                                key={index}
                                isFlipped={false}
                                cornerSize={cornerSize}
                                cornerValueSize={cornerValueSize}
                                cornerMarginTop={cornerMarginTop}
                                cornerSpacing={cornerSpacing}
                                cornerValueSizeBottom={cornerValueSizeBottom}
                            />
                        </Box>
                    );
                })}
            </Flex>
            <Box
                zIndex={2}
                fontSize="1.5vmin"
                fontWeight="600"
                lineHeight="2.75vmin"
                borderRadius="1.5vmin"
                bg="#595E6B"
                position="absolute"
                visibility={infoTextVisibility}
                top="13vmin"
            >
                <Text px="1.5vmin" py="0.5vmin" variant="bold">
                    {infoText}
                </Text>
            </Box>

            <Box
                zIndex={2}
                fontSize="0.8rem"
                fontWeight="600"
                lineHeight="1.75vmin"
                borderRadius="1.5vmin"
                bg="brand.gray30"
                position="absolute"
                visibility={encryptedDeckVisibility}
                bottom="-6%"
                textAlign="center"
                py="0.5rem"
                color="brand.gray10"
            >
                <Flex align="center" justify="center" px="1vmin" mb="0.1vmin">
                    <Text py="0.1vmin" variant="bold" color="brand.gray10">
                        Hand {`${encryptedDecks?.nonce}`}
                    </Text>
                </Flex>
                <Flex
                    align="center"
                    justify="space-between"
                    px="1vmin"
                    mb="0.1vmin"
                >
                    <Text variant="bold" color="brand.gray10">
                        Encrypted Deck:{' '}
                        {`${encryptedDecks?.encryptedDeck?.slice(0, 4)}...${encryptedDecks?.encryptedDeck?.slice(-4)}`}
                    </Text>
                    <CopyIcon
                        ml="0.5vmin"
                        cursor="pointer"
                        color="brand.gray10"
                        _hover={{ color: '#C0C0C0' }}
                        onClick={() =>
                            navigator.clipboard.writeText(
                                encryptedDecks?.encryptedDeck || '',
                            )
                        }
                    />
                </Flex>
            </Box>
        </Flex>
    );
};

export default Cards;
