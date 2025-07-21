'use client';

import {
    Box,
    VStack,
    Text,
    Image,
    useDisclosure,
    HStack,
    Spacer,
    Flex,
} from '@chakra-ui/react';

import { CreateTableModal } from '../../../Modals/CreateTableModal/CreateTableModal';
import { InviteLinkCard } from './InviteLinkCard';
import { GameMode } from '../../../../client';
import { useAuthModal } from '../../../Shared/AuthModalContext';
import useViewer from '../../../hooks/useViewer';

interface GameActionConfig {
    imageSrc: string;
    gameName: string;
    active: boolean;
}

const TEXAS_HOLD_EM = "TEXAS HOLD'EM";
const POT_LIMIT_OMAHA = 'POT-LIMIT OMAHA';

const GameCard = ({ gameConfig }: { gameConfig: GameActionConfig }) => {
    const {
        isOpen: isCreateTableModalOpen,
        onOpen: onOpenCreateTableModal,
        onClose: onCloseCreateTableModal,
    } = useDisclosure();
    const { isAuthenticated } = useViewer();
    const { open: openSignInModal } = useAuthModal();

    const handleClick = () => {
        if (!gameConfig.active) return;
        if (!isAuthenticated) {
            openSignInModal();
        } else {
            onOpenCreateTableModal();
        }
    };

    return (
        <VStack
            spacing={0}
            align="center"
            borderRadius="16px"
            border="1px solid rgba(137, 142, 150, 0.5)"
            position="relative"
            cursor="pointer"
            overflow="hidden"
            onClick={handleClick}
            _hover={{
                border: '1px solid rgba(255,255,255,0.57)',
                boxShadow: '0 0 12px rgba(212, 195, 221, 0.5)',
            }}
        >
            <Box w="100%" h="100%" position="relative">
                <Image
                    src={gameConfig.imageSrc}
                    fit="cover"
                    w="100%"
                    h="100%"
                    aspectRatio="0.86"
                    alt={`Thumbnail for ${gameConfig.gameName} game`}
                    userSelect="none"
                    draggable={false}
                />
            </Box>
            <CreateTableModal
                isOpen={isCreateTableModalOpen}
                onClose={onCloseCreateTableModal}
                gameMode={
                    gameConfig.gameName === TEXAS_HOLD_EM
                        ? GameMode.NLH
                        : gameConfig.gameName === POT_LIMIT_OMAHA
                          ? GameMode.PLO
                          : GameMode.NLH
                }
            />
        </VStack>
    );
};

export const GameMainCard = () => {
    const pokerConfigs: GameActionConfig[] = [
        {
            imageSrc: '../game_holdem.webp',
            gameName: TEXAS_HOLD_EM,
            active: true,
        },
        {
            imageSrc: '../game_plo.webp',
            gameName: POT_LIMIT_OMAHA,
            active: true,
        },
    ];

    const gameConfigs: GameActionConfig[] = [
        {
            imageSrc: '../game_twobirds_onestone.webp',
            gameName: 'TWO BIRDS ONE STONE',
            active: false,
        },
        {
            imageSrc: '../game_roulette.webp',
            gameName: 'ROULETTE',
            active: false,
        },
        {
            imageSrc: '../game_blackjack.webp',
            gameName: 'BLACKJACK',
            active: false,
        },
    ];

    const fillEmptySlots = (configs: GameActionConfig[], size: number) => {
        const filledConfigs = [...configs];
        while (filledConfigs.length < size) {
            filledConfigs.push({ imageSrc: '', gameName: '', active: false });
        }
        return filledConfigs;
    };

    return (
        <VStack w="100%" spacing="0.5rem">
            <Flex
                flexDirection="column"
                alignItems="flex-start"
                borderRadius="16px"
                background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182"
                px="1rem"
                pb="1rem"
                border="0.3px solid rgba(47, 47, 54, 0.75)"
                // boxShadow="0 0 0.5rem rgba(159, 136, 208, 0.2)"
            >
                <VStack w="100%" spacing="0.5rem">
                    <HStack
                        alignSelf="flex-start"
                        spacing="0.75rem"
                        justify="flex-start"
                    >
                        <Image
                            src="/Poker.png"
                            alt="Poker"
                            boxSize="32px"
                            transform="rotate(-10deg)"
                            userSelect="none"
                            draggable={false}
                        />
                        <Text
                            color="brand.textWhite"
                            fontSize="2rem"
                            fontWeight="900"
                            p="12px"
                            textAlign="left"
                            alignSelf="flex-start"
                            transform="translateX(-10px)"
                        >
                            GINZA POKER
                        </Text>
                    </HStack>
                    <Text
                        fontSize="1.05rem"
                        color="purple.100"
                        fontWeight="900"
                        px="0.5rem"
                        mt="-0.5rem"
                        mb="0.25rem"
                        textAlign="center"
                        alignSelf="flex-start"
                    >
                        CREATE NEW TABLE
                    </Text>
                    <HStack gap="1rem" w="100%" justify="space-between">
                        {fillEmptySlots(pokerConfigs, 3).map(
                            (config, index) => (
                                <Box key={index} flex="1" minW="0" h="100%">
                                    {config.gameName ? (
                                        <GameCard gameConfig={config} />
                                    ) : null}
                                </Box>
                            ),
                        )}
                    </HStack>
                    <Text
                        fontSize="1.05rem"
                        color="purple.100"
                        fontWeight="900"
                        px="0.5rem"
                        mt="0.5rem"
                        textAlign="center"
                        alignSelf="flex-start"
                    >
                        OR JOIN AN EXISTING GAME
                    </Text>
                    <InviteLinkCard />
                </VStack>
            </Flex>

            <Spacer></Spacer>

            <Flex
                flexDirection="column"
                alignItems="flex-start"
                borderRadius="16px"
                px="1rem"
                pb="1rem"
                background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -60%, #0C0A16 52%), #344182"
                border="0.3px solid rgba(47, 47, 54, 0.5)"
                // boxShadow="0 0 0.5rem rgba(159, 136, 208, 0.25)"
            >
                <HStack
                    alignSelf="flex-start"
                    spacing="0.75rem"
                    justify="flex-start"
                >
                    <Image src="/Games2.png" alt="Games" boxSize="28px" />
                    <Text
                        fontSize="1.5rem"
                        fontWeight="900"
                        p="12px"
                        textAlign="left"
                        alignSelf="flex-start"
                        transform="translateX(-10px)"
                        userSelect="none"
                        draggable={false}
                    >
                        MORE GAMES
                    </Text>
                    <Box
                        as="button"
                        disabled
                        bg="blue.600"
                        color="white"
                        fontSize="0.875rem"
                        fontWeight="bold"
                        px="8px"
                        py="4px"
                        borderRadius="8px"
                        ml="-1rem"
                        cursor="default"
                    >
                        Coming Soon
                    </Box>
                </HStack>
                <HStack gap="1rem" w="100%" justify="flex-start">
                    {gameConfigs.map((config, index) => (
                        <Box key={index} flex="1" minW="0" h="100%">
                            <GameCard gameConfig={config} />
                        </Box>
                    ))}
                </HStack>
            </Flex>
        </VStack>
    );
};
