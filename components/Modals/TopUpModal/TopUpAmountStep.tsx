'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
    VStack,
    useToast,
    Box,
    InputGroup,
    Input,
    SlideFade,
    Image,
    HStack,
    Text,
    InputLeftElement,
    InputRightElement,
    Button,
} from '@chakra-ui/react';
import APIButton from '../../Shared/APIButton';
import { useCurrentUserBalance } from '../../hooks/useCurrentBalance';
import { Action, playerAction } from '../../../client';
import useGameId from '../../hooks/useGameID';

interface TopUpAmountStepProps {
    maxTopUp: number;
    onClose: () => void;
}

const Form = ({
    onClose,
    min,
    max,
}: {
    onClose: () => void;
    min?: number;
    max?: number;
}) => {
    const gameId = useGameId();
    const toast = useToast();
    const effectiveMin = min ?? 0.01;

    const [ingressAmount, setIngressAmount] = useState('');
    const { formattedBalance } = useCurrentUserBalance();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const numericBalance = Number(formattedBalance.replace(/[^0-9.]/g, ''));

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const isInvalidIngressAmount =
        ingressAmount !== '' &&
        (Number(ingressAmount) < Number(effectiveMin) ||
        Number(ingressAmount) > Number(max) ||
        Number(ingressAmount) > Number(formattedBalance));

    const getErrorMessage = () => {
        if (
            Number(ingressAmount) < Number(effectiveMin) ||
            Number(ingressAmount) > Number(max)
        ) {
            return `Top-up amount must be between $${effectiveMin} and $${max}`;
        }
        if (Number(ingressAmount) > Number(formattedBalance)) {
            return 'Top-up amount cannot exceed your balance';
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and decimal point
        const value = e.target.value.replace(/[^0-9.]/g, '');

        // If value starts with a decimal, prepend a 0
        if (value.startsWith('.')) {
            setIngressAmount(`0${value}`);
            return;
        }

        // Prevent multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) {
            return;
        }

        // Limit decimal places to 2
        if (parts[1]?.length > 2) {
            return;
        }

        setIngressAmount(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isInvalidIngressAmount && ingressAmount !== '') {
                document.getElementById('top-up-button')?.click();
            }
        }
    };

    const onTopUpSuccess = () => {
        onClose();
        toast({
            title: 'Top-up successful',
            description: `$${ingressAmount} will be added to your stack next hand`,
            status: 'success',
            duration: 5000,
        });
    };

    const onTopUpError = (e: Error) => {
        toast({
            title: 'Top-up failed',
            status: 'error',
            duration: 3000,
        });
    };

    return (
        <VStack p="1rem" spacing="1rem" w="100%">
            <HStack alignSelf="flex-start" spacing="4px">
                <Text color="brand.gray10" fontSize="16px" fontWeight="bold">
                    Your Balance:
                </Text>
                <Image src="/GinzaCoin.png" w="16px" h="16px" alt="Gold coin" />
                <Text color="brand.accentWhite" fontSize="16px" fontWeight="bold">
                    {formattedBalance}
                </Text>
            </HStack>
            <Box
                borderWidth="1px"
                borderColor={isInvalidIngressAmount ? 'red' : 'white'}
                borderRadius="8px"
                w="100%"
                p="8px"
                bg="brand.lightestGray"
            >
                <InputGroup>
                    <InputLeftElement width="4.5rem" ml="-20px">
                        <Image
                            src="/GinzaCoin.png"
                            w="24px"
                            h="24px"
                            alt="Gold coin"
                            color="brand.accentWhite"
                        />
                    </InputLeftElement>
                    <Input
                        ref={inputRef}
                        value={ingressAmount}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        border="none"
                        focusBorderColor="transparent"
                        size="md"
                        fontSize="lg"
                        px="12px"
                        py="4px"
                        placeholder={`${effectiveMin} - ${max}`}
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                    />
                    <InputRightElement width="54px" mr="8px">
                        <Button
                            h="32px"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Calculate the maximum top-up allowed
                                const maxAmount = Math.min(numericBalance, Number(max));
                                const formattedAmount = maxAmount.toFixed(2);
                                if (!isNaN(maxAmount) && maxAmount > 0) {
                                    setIngressAmount(formattedAmount);
                                }
                            }}
                            bg="#222222"
                            color="white"
                            borderRadius="6px"
                            _hover={{ bg: "#1A1A1A" }}
                            fontWeight="bold"
                            px={2}
                            zIndex={2}
                            minW="48px"
                        >
                            Max
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Box>
            <Box height="24px">
                <SlideFade
                    in={isInvalidIngressAmount}
                    offsetY="-20px"
                    transition={{
                        enter: { duration: 0.4 },
                        exit: { duration: 0.3 },
                    }}
                >
                    <Text color="red" size="sm">
                        {isInvalidIngressAmount && getErrorMessage()}
                    </Text>
                </SlideFade>
            </Box>
            <HStack w="100%">
                <APIButton
                    id="top-up-button"
                    disabled={isInvalidIngressAmount || ingressAmount === ''}
                    variant="walletButton"
                    w="100%"
                    h="3rem"
                    endpoint={playerAction}
                    params={{
                        path: {
                            game_id: gameId,
                        },
                        body: {
                            action: Action.TOP_UP,
                            amount: Math.floor(Number(ingressAmount) * 1e6),
                        },
                    }}
                    onSuccess={onTopUpSuccess}
                    onError={onTopUpError}
                    _disabled={{
                        opacity: '0.5',
                        pointerEvents: 'none',
                        boxShadow: 'none',
                    }}
                >
                    <Text>Top Up</Text>
                </APIButton>
            </HStack>
        </VStack>
    );
};

export const TopUpAmountStep: React.FC<TopUpAmountStepProps> = ({
    maxTopUp,
    onClose,
}) => {
    return (
        <VStack spacing="8px" justify="center">
            <Form onClose={onClose} max={maxTopUp} />
        </VStack>
    );
};

export default TopUpAmountStep;
