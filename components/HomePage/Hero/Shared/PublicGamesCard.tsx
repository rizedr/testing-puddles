'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../../packages/convex/convex/_generated/api';
import { VStack, Text, HStack, Button, Image } from '@chakra-ui/react';
import { Doc } from '../../../../../../packages/convex/convex/_generated/dataModel';
import { formatMicroDollars } from '../../../utils/formatMoney';
import { FaArrowRight, FaGlobe } from 'react-icons/fa6';
import Link from 'next/link';
import { GiPokerHand } from 'react-icons/gi';

export const PublicGameRow: React.FC<{
    game: Doc<'gameData'>;
}> = ({ game }) => {
    return (
        <HStack
            w="100%"
            p="0.75rem"
            background="linear-gradient(353.96deg, #B37FEB -90.9%, rgba(210, 174, 245, 0) 95%, #EFDBFF 120%), #371C5F"
            borderRadius="12px"
            // border="solid rgba(255,255,255,0.4)"
            cursor="pointer"
            transition="all 0.2s"
            // borderWidth="1px"
            _hover={{
                background:
                    'linear-gradient(353.96deg, #392164 -50.9%, rgba(210, 174, 245, 0) 99%, #EFDBFF 120%), #371C5F',
                // border: '1px solid rgba(255,255,255,0.57)',
                // boxShadow: '0 0 12px rgba(255, 255, 255, 0.5)',
            }}
            justify="space-between"
            as={Link}
            href={`/poker/${game._id}`}
        >
            <VStack align="flex-start" spacing={1}>
                <HStack>
                    {game.gameData.game_settings.game_mode === 0 ? (
                        <Image
                            src="/HoldemIcon.png"
                            alt="Holdem Icon"
                            boxSize="1.5rem"
                        />
                    ) : (
                        <GiPokerHand
                            size="1.5rem"
                            style={{ marginRight: '6px' }}
                        />
                    )}
                    <Text fontWeight="800" fontSize="1rem">
                        {game.gameData.game_settings.game_mode === 0
                            ? "TEXAS HOLD'EM"
                            : 'POT-LIMIT OMAHA'}
                    </Text>
                </HStack>
                <Text
                    fontSize="0.875rem"
                    fontWeight="600"
                    color="whiteAlpha.800"
                >
                    $
                    {formatMicroDollars(
                        game.gameData.game_settings.small_blind_value,
                    )}
                    /
                    {formatMicroDollars(
                        game.gameData.game_settings.big_blind_value,
                    )}{' '}
                    • {game.gameData.players?.length || 0}/9 Players
                </Text>
            </VStack>
            <FaArrowRight color="white" size="1.5rem" />
        </HStack>
    );
};

export const PublicGamesCard: React.FC = () => {
    const publicGames = useQuery(api.tasks.getPublicGames);
    return (
        <VStack
            w="100%"
            h="100%"
            p="1rem"
            align="center"
            overflowY="auto"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182"
            borderRadius="16px"
            border="0.3px solid rgba(47, 47, 54, 0.75)"
        >
            <HStack align="center">
                <FaGlobe color="white" size="1.25rem" />
                <Text fontSize="1.25rem" fontWeight="900">
                    PUBLIC GAMES
                </Text>
            </HStack>
            <VStack h="100%" w="100%" overflowY="auto" mt="0.5rem" spacing={3}>
                {publicGames?.map((game) => (
                    <PublicGameRow key={game._id} game={game} />
                ))}
            </VStack>
        </VStack>
    );
};
