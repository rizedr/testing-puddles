'use client';

import {
    Box,
    VStack,
    Text,
    Button,
    useDisclosure,
    Stack,
    Collapse,
    Icon,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQConfig {
    question: string;
    response: string;
}

const FAQQuestionCard = ({ gameConfig }: { gameConfig: FAQConfig }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <VStack
            spacing={0}
            w="100%"
            border="1px solid rgba(255,255,255,0.2)"
            borderRadius="1rem"
            overflow="hidden"
            background="transparent"
            alignItems="flex-start"
        >
            <Button
                onClick={onToggle}
                w="100%"
                minH="60px"
                justifyContent="space-between"
                overflow="hidden"
                color="white"
                rightIcon={isOpen ? <Icon as={FaChevronUp} /> : <Icon as={FaChevronDown} />}
                fontSize="lg"
                fontWeight="800"
                background="linear-gradient(138.64deg, rgba(8, 9, 30, 0.9) 8.24%, rgba(47, 28, 70, 0.9) 98.03%), radial-gradient(60.52% 85.11% at 9.86% 66.12%, rgba(35, 17, 72, 0.75) 0%, rgba(22, 9, 49, 0) 10%)"
                _hover={{}}
                _active={{}}
            >
                {gameConfig.question}
            </Button>
            <Collapse in={isOpen} animateOpacity>
                <Box
                    p="16px"
                    color="white"
                    textAlign="left"
                    fontSize="lg"
                    fontWeight="600"
                >
                    {gameConfig.response}
                </Box>
            </Collapse>
        </VStack>
    );
};

export const FAQCard = () => {
    const gameConfigs: FAQConfig[] = [
        {
            question: "WHY PLAY POKER ON GINZA GAMING?",
            response: "Ginza Gaming is a free, safe, and transparent way to enjoy poker with your friends without the hassle of managing settlements. Our smart contract presents a simple solution to the counter-party risk of settlements. Additionally, a portion of the platform fees collected are redistributed back to hosts for inviting their friends.",
        },
        {
            question: "ARE MY FUNDS SAFE ON GINZA GAMING?",
            response: "Yes. All your funds are securely stored in a smart contract audited by Guardian, a trusted blockchain security firm that has secured smart contracts holding $3B+, presently. This ensures a high level of protection and transparency. Additionally, the platform maintains a 1:1 ratio between the total funds in all active games and the funds in the smart contract, and the team regularly conducts financial audits to ensure the integrity of the platform so that you can play with confidence knowing your money is always safeguarded.",
        },
        {
            question: "HOW FREQUENT ARE POKER GAMES?",
            response: "Our team regularly sends game links in the Comrades Telegram channel, but we strongly encourage you to gather your own Cabal to organize and play games as well!",
        },
        {
            question: "WHEN DO I GET SETTLED?",
            response: "Once you cash out of the game, your funds are settled at the end of the current hand, which you can play as you wait. Platform withdrawals are instant.",
        },
        {
            question: "HOW TO CONTACT THE TEAM?",
            response: "Most communications are in our discord or Comrades Telegram channel!",
        },
    ];

    return (
        <Stack w="100%" spacing="16px">
            <Text fontSize={{ base: "1.75rem", xl: "2rem" }} fontWeight="900" textAlign="center">
                FAQ
            </Text>
            <Text 
                fontSize={{ base: "1rem", xl: "1.25rem" }}
                fontWeight="500"
                color="brand.white90"
                alignContent="center"
                whiteSpace="normal"
                overflowWrap="break-word"
                maxWidth={{ base: "360px", md: '480px', xl: "730px" }}
                mx="auto"
            >
                Find answers to common questions about the platform.
            </Text>
            <VStack mt="12px" gap="16px" w="100%">
                {gameConfigs.map((config, index) => (
                    <FAQQuestionCard key={index} gameConfig={config} />
                ))}
            </VStack>
        </Stack>
    );
};