import {
    VStack,
    HStack,
    Text,
    InputGroup,
    Input,
    Image,
    Divider,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import APIButton from '../../../../components/Shared/APIButton';
import { Action, playerAction } from '../../../../client';
import {
    formatMicroDollars,
    toMicroDollars,
} from '../../../../components/utils/formatMoney';

interface PlayerControlsProps {
    totalBet: number;
    playerBet: number;
    targetTime: number;
    nonce: number;
}

export const PlayerControls = ({
    totalBet,
    playerBet,
    targetTime,
    nonce,
}: PlayerControlsProps) => {
    const [timeRemaining, setTimeRemaining] = useState('0:00');
    const [inputValue, setInputValue] = useState('');
    const isValidInput = /^\d*\.?\d+$|^\d+\.?\d*$/.test(inputValue);

    useEffect(() => {
        const timer = setInterval(() => {
            const timeRemainingInSeconds = Math.max(
                0,
                targetTime - Date.now() / 1000,
            );
            const minutes = Math.floor(timeRemainingInSeconds / 60);
            const seconds = Math.floor(timeRemainingInSeconds % 60);
            setTimeRemaining(
                `${minutes}:${seconds.toString().padStart(2, '0')}`,
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    return (
        <VStack h="100%" p={4} spacing={4}>
            <HStack
                w="100%"
                justifyContent="space-between"
                alignItems="flex-start"
            >
                <Text fontSize="lg" fontWeight="bold">
                    Round #{nonce}
                </Text>
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="red.400"
                    border="2px solid"
                    borderColor="red.400"
                    borderRadius="16px"
                    bg="rgba(255, 0, 0, 0.15)"
                    p={2}
                >
                    {timeRemaining}
                </Text>
            </HStack>

            <HStack w="100%" spacing={4} h="100%">
                <VStack w="50%" h="100%" spacing={4}>
                    <InputGroup>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            border={isValidInput ? 'none' : '2px solid'}
                            borderColor={
                                isValidInput ? 'transparent' : 'red.400'
                            }
                            focusBorderColor={
                                isValidInput ? 'transparent' : 'red.400'
                            }
                            borderWidth="1px"
                            borderRadius="8px"
                            w="100%"
                            bg="#1C1C1C"
                            size="lg"
                            fontSize="2xl"
                            px="12px"
                            placeholder="0"
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            color="white"
                        />
                    </InputGroup>
                    <APIButton
                        w="100%"
                        colorScheme="green"
                        size="md"
                        endpoint={playerAction}
                        params={{
                            path: {
                                game_id: 'degen_roulette',
                            },
                            body: {
                                action: Action.JOIN_GAME,
                                amount: toMicroDollars(Number(inputValue)),
                                seat_number: 0,
                            },
                        }}
                    >
                        Place Bet
                    </APIButton>
                </VStack>
                <Divider orientation="vertical" />
                <VStack w="50%" h="100%" spacing={4}>
                    <VStack w="100%" alignItems="flex-start" spacing={1}>
                        <HStack spacing={2}>
                            <Image
                                src="/GinzaCoin.png"
                                w="24px"
                                h="24px"
                                alt="Ginza Coin"
                                userSelect="none"
                                draggable={false}
                            />
                            <Text fontSize="lg" fontWeight="bold">
                                {formatMicroDollars(totalBet)}
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="whiteAlpha.600">
                            Total Prize Pool
                        </Text>
                    </VStack>
                    <HStack w="100%" justifyContent="space-between">
                        <VStack alignItems="flex-start" spacing={1}>
                            <HStack spacing={2}>
                                <Image
                                    src="/GinzaCoin.png"
                                    w="24px"
                                    h="24px"
                                    alt="Ginza Coin"
                                    userSelect="none"
                                    draggable={false}
                                />
                                <Text fontSize="lg" fontWeight="bold">
                                    {formatMicroDollars(playerBet)}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" color="whiteAlpha.600">
                                Your Bet
                            </Text>
                        </VStack>
                        <VStack alignItems="flex-start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold">
                                {playerBet > 0
                                    ? ((playerBet / totalBet) * 100).toFixed(2)
                                    : '0.00'}
                                %
                            </Text>
                            <Text fontSize="sm" color="whiteAlpha.600">
                                Win Chance
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
            </HStack>
        </VStack>
    );
};
