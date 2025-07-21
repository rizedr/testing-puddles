import {
    Text,
    Box,
    Flex,
    useToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    Input,
    VStack,
    InputGroup,
    SlideFade,
    HStack,
    Image,
    Portal,
    useBreakpointValue,
    InputLeftElement,
    InputRightElement,
    Button,
} from '@chakra-ui/react';

import { usePokerGameState } from '../../../../../hooks/usePokerGameState';
import { isInSetup } from '../../../../../types/PokerGameState';

import useGameData from '../../../../../hooks/useGameData';
import { useRef, useState } from 'react';
import { Action, playerAction } from '../../../../../../client';
import { useCurrentUserBalance } from '../../../../../hooks/useCurrentBalance';
import APIButton from '../../../../../Shared/APIButton';
import { useHotkeyBlockingDisclosure } from '../../../../../hooks/useHotkeyBlockingDisclosure';
import useViewer from '../../../../../hooks/useViewer';

const activePlayerDropShadow = {
    filter: 'drop-shadow(0px 0px 23px rgba(124, 124, 124, 0.7))',
};

const Form = ({
    index,
    onClose,
    initialFocusRef,
}: {
    index: number;
    onClose: () => void;
    initialFocusRef: React.RefObject<any>;
}) => {
    const { gameId, gameSettings } = useGameData();
    const toast = useToast();

    const minBuyIn = gameSettings?.min_buy_in / 1e6;
    const maxBuyIn = gameSettings?.max_buy_in / 1e6;

    // console.log('Game settings loaded:', { minBuyIn, maxBuyIn, gameSettings });

    const [ingressAmount, setIngressAmount] = useState('');

    const { formattedBalance } = useCurrentUserBalance();
    // Clean and convert formattedBalance to a number (removing any currency formatting)
    const numericBalance = Number(formattedBalance.replace(/[^0-9.]/g, ''));

    // Make sure minBuyIn and maxBuyIn are proper numbers
    const minBuyInValue = Number(minBuyIn) || 0;
    const maxBuyInValue = Number(maxBuyIn) || 1000; // Default to 1000 if maxBuyIn is not available

    // Log balance and buy-in limits
    // console.log('Balance and limits:', { 
    //     formattedBalance,
    //     numericBalance, 
    //     minBuyInValue, 
    //     maxBuyInValue
    // });

    const isInvalidIngressAmount =
        ingressAmount !== '' && (
            Number(ingressAmount) < minBuyInValue ||
            Number(ingressAmount) > maxBuyInValue ||
            Number(ingressAmount) > numericBalance
        );

    const getErrorMessage = () => {
        if (
            Number(ingressAmount) < minBuyInValue ||
            Number(ingressAmount) > maxBuyInValue
        ) {
            return `Buy-in amount must be between $${minBuyIn} and $${maxBuyIn}`;
        }
        if (Number(ingressAmount) > numericBalance) {
            return 'Buy-in amount cannot exceed your balance';
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

    const handleMaxButtonClick = () => {
        try {
            // Calculate the maximum amount user can buy in with
            // Either their entire balance or the max buy-in, whichever is less
            const maxAmount = Math.min(numericBalance, maxBuyInValue);
            
            console.log('Max button clicked', { 
                maxAmount, 
                numericBalance, 
                maxBuyInValue,
                formattedBalance
            });
            
            // Format to 2 decimal places to avoid floating point issues
            const formattedAmount = maxAmount.toFixed(2);
            
            // Only set if we have a valid amount
            if (!isNaN(maxAmount) && maxAmount > 0) {
                console.log('Setting ingress amount to:', formattedAmount);
                
                // Update the state
                setIngressAmount(formattedAmount);
                
                // The state update won't be reflected immediately due to React's batching
                // We can't check the value right after setting it
                // The effect will be visible in the UI
            } else {
                console.error('Invalid max amount calculated:', maxAmount);
            }
        } catch (error) {
            console.error('Error in handleMaxButtonClick:', error);
        }
    };

    const onBuyInSuccess = () => {
        setIngressAmount('');
        onClose();
        toast({
            title: 'Buy-in successful',
            status: 'success',
            duration: 3000,
        });
    };

    const onBuyInError = (e: Error) => {
        toast({
            title: 'Buy-in failed',
            status: 'error',
            duration: 3000,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Only trigger if buy-in button is not disabled
            e.preventDefault();
            if (!isInvalidIngressAmount && ingressAmount !== '') {
                document.getElementById('buy-in-button')?.click();
            }
        }
    };

    return (
        <VStack
            bg="brand.darkGray"
            borderRadius="5px"
            p="1rem"
            spacing="1rem"
            w="100%"
            onKeyDown={handleKeyDown}
        >
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
                borderRadius="50px"
                w="100%"
                p="8px"
                bg="brand.lightestGray"
                overflow="hidden"
            >
                <InputGroup>
                    <InputLeftElement width="4.25rem" ml="-10px">
                        <Image
                            src="/GinzaCoin.png"
                            w="24px"
                            h="24px"
                            alt="Gold coin"
                            color="brand.accentWhite"
                        />
                    </InputLeftElement>
                    <Input
                        value={ingressAmount}
                        onChange={handleInputChange}
                        border="none"
                        focusBorderColor="transparent"
                        size="md"
                        fontSize="lg"
                        px="12px"
                        py="4px"
                        paddingRight="68px"
                        placeholder={`${minBuyIn} - ${maxBuyIn}`}
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        ref={initialFocusRef}
                        borderRadius="50px"
                        color="brand.accentWhite"
                        textOverflow="ellipsis"
                    />
                    <InputRightElement width="54px" mr="8px">
                        <Button 
                            h="32px" 
                            size="sm" 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleMaxButtonClick();
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
                    id="buy-in-button"
                    disabled={isInvalidIngressAmount || ingressAmount === ''}
                    w="100%"
                    variant="walletButton"
                    endpoint={playerAction}
                    params={{
                        path: {
                            game_id: gameId,
                        },
                        body: {
                            action: Action.JOIN_GAME,
                            amount: Math.floor(Number(ingressAmount) * 1e6),
                            seat_number: index,
                        },
                    }}
                    onSuccess={onBuyInSuccess}
                    onError={onBuyInError}
                >
                    Buy In
                </APIButton>
            </HStack>
        </VStack>
    );
};

const EmptySeat = ({ index }: { index: number }) => {
    const { userId, isAuthenticated } = useViewer();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();

    const { gameId, players, pendingPlayers } = useGameData();

    const gameState = usePokerGameState();
    const isInGameSetup = isInSetup(gameState);
    const initialFocusRef = useRef({ focus: () => {} });

    const isPlayerAlreadyInGame = players
        ?.map((p: { player_id?: string }) => p?.player_id || '')
        ?.includes(userId as string);

    const canClick =
        isAuthenticated &&
        !isPlayerAlreadyInGame &&
        !!gameId &&
        !pendingPlayers?.map((p: { player_id: string }) => p.player_id).includes(userId as string);

    return (
        <Popover
            isOpen={isOpen && canClick}
            initialFocusRef={initialFocusRef}
            onOpen={onOpen}
            onClose={onClose}
            placement="auto"
            isLazy
        >
            <PopoverTrigger>
                <Box
                    filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
                    cursor={canClick ? 'pointer' : 'not-allowed'}
                    onClick={onOpen}
                    opacity={isPlayerAlreadyInGame ? 0.7 : 1}
                    // h="100%"
                    w="100%"
                    minW={isPortrait ? '15vmax' : 'min(17.5vmin, 14vmax)'}
                    h={isPortrait ? '4.5vmax' : '4.5vmin'}
                    visibility={isPlayerAlreadyInGame ? 'hidden' : 'visible'}
                >
                    {isInGameSetup && (
                        <Text
                            position="absolute"
                            transform="translate(25%, -50%)"
                            color="white"
                            h="100%"
                        >
                            {index + 1}
                        </Text>
                    )}
                    <Flex
                        w="100%"
                        h="100%"
                        transition="width 0.5s ease, height 0.5s ease"
                        background="var(--Add-new, rgba(0, 0, 0, 0.40))"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        border="0.125rem dashed rgba(255, 255, 255, 0.25)"
                        borderRadius="100"
                        _hover={
                            canClick
                                ? {
                                      ...activePlayerDropShadow,
                                      border: '0.125rem solid white',
                                      boxShadow:
                                          'inset 0 0 20px rgba(255, 255, 255, 0.5)',
                                  }
                                : {}
                        }
                    >
                        <Text fontSize="lg" textAlign="center" color="white">
                            {!isPlayerAlreadyInGame && '+'}
                        </Text>
                    </Flex>
                </Box>
            </PopoverTrigger>
            <Box zIndex={'popover'} w="full" h="full" position={'relative'}>
                <Portal>
                    <PopoverContent
                        p={4}
                        w="80%"
                        bg="brand.lightGray"
                        borderRadius="16px"
                        border="none"
                        textColor="white"
                    >
                        <PopoverArrow
                            bg="brand.lightGray"
                            shadowColor="brand.lightGray"
                        />
                        <Form
                            index={index}
                            onClose={onClose}
                            initialFocusRef={initialFocusRef}
                        />
                    </PopoverContent>
                </Portal>
            </Box>
        </Popover>
    );
};

export default EmptySeat;
