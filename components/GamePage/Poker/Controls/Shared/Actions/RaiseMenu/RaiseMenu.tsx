import {
    SliderThumb,
    SliderFilledTrack,
    Slider,
    NumberInput,
    NumberInputField,
    VStack,
    SliderTrack,
    HStack,
    Box,
    Button,
    useBreakpointValue,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';

import { RaiseActionsGrid } from './RaiseActionsGrid';
import APIButton from '../../../../../../Shared/APIButton';
import { playerAction } from '../../../../../../../client/sdk.gen';
import { Action } from '../../../../../../../client/types.gen';
import { useHotkeys } from 'react-hotkeys-hook';
import useGameData from '../../../../../../hooks/useGameData';
import useHasPhysicalKeyboard from '../../../../../../hooks/useHasPhysicalKeyboard';
import { useGetPlayerRaise } from '../../../../../../hooks/useGetPlayerRaise';
import { useActionButtons } from '../../../../../../hooks/useActionButtons';
import { useGetCurrentPlayer } from '../../../../../../hooks/useGetCurrentPlayer';
import useViewer from '../../../../../../hooks/useViewer';

const RaiseMenu: React.FC<{ onCloseRaiseMenu: () => void }> = ({
    onCloseRaiseMenu,
}) => {
    const hasPhysicalKeyboard = useHasPhysicalKeyboard();
    const { streetPot, gameId, gameSettings, raiseOptions } = useGameData();
    const { minRaise, maxRaise } = useGetPlayerRaise();
    const currentPlayer = useGetCurrentPlayer();
    const currentUserAmount = currentPlayer?.amount || 0;
    const { isMinRaise } = useGetPlayerRaise();

    const isPLO = gameSettings?.game_mode === 1; // 1 is PLO
    const potLimit = raiseOptions?.pot_raise || 0;

    const { isCurrentlyDecidingPlayer } = useActionButtons(onCloseRaiseMenu);
    const inputRef = useRef<HTMLInputElement>(null);
    const fullKeyboardText = useBreakpointValue({
        base: false,
        lg: false,
        xl: true,
    });
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { user } = useViewer();
    const displayInBigBlinds =
        user?.pokerPreferences?.displayAmountsInBigBlinds;
    const bigBlindValue = gameSettings?.big_blind_value || 1000000; // Default to 1 if not available
    const keyboardShortcuts = user?.pokerPreferences?.keyboardShortcuts ?? true;

    const [selectedActionIdx, setSelectedActionIdx] = useState<number | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState<undefined | boolean>(
        undefined,
    );

    // Convert to display value based on user preference
    const toDisplayValue = (microDollars: number): number => {
        if (displayInBigBlinds) {
            return microDollars / bigBlindValue;
        }
        return microDollars / 1000000; // Convert to dollars
    };

    // Convert from display value back to microDollars
    const fromDisplayValue = (displayValue: number): number => {
        if (displayInBigBlinds) {
            return displayValue * bigBlindValue;
        }
        return displayValue * 1000000; // Convert from dollars to microDollars
    };

    const [value, setValue] = useState<number>(toDisplayValue(minRaise));

    const handleChange = (newValue: number | string) => {
        setValue(newValue);
        setSelectedActionIdx(null);
    };

    const handleGridValueSelect = (newValue: number, index: number) => {
        setValue(toDisplayValue(newValue));
        setSelectedActionIdx(index);
    };

    const noBet = streetPot === 0;
    const betText = noBet
        ? `Bet${hasPhysicalKeyboard && keyboardShortcuts && fullKeyboardText ? ' [Enter]' : ''}`
        : `Raise${hasPhysicalKeyboard && keyboardShortcuts && fullKeyboardText ? ' [Enter]' : ''}`;

    const params = {
        path: {
            game_id: gameId,
        },
        body: {
            action:
                fromDisplayValue(value) >= maxRaise || selectedActionIdx === 4
                    ? Action.ALL_IN
                    : Action.RAISE,
            amount: Math.trunc(fromDisplayValue(value)),
            is_min_raise: isMinRaise(Math.trunc(fromDisplayValue(value))),
        },
    };

    const handleEnterPress = async () => {
        if (!isInvalidRaise && !isSubmitting && isCurrentlyDecidingPlayer) {
            setIsSubmitting(true);
            await playerAction(params);
            onCloseRaiseMenu();
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isCurrentlyDecidingPlayer) {
            setIsSubmitting(false);
            onCloseRaiseMenu();
        }
    }, [isCurrentlyDecidingPlayer]);

    const isInvalidRaise =
        isNaN(value) ||
        value < toDisplayValue(minRaise) ||
        value > toDisplayValue(maxRaise) ||
        (isPLO && fromDisplayValue(value) > potLimit);

    useHotkeys('Enter', handleEnterPress, {
        preventDefault: true,
        enabled: !isInvalidRaise && keyboardShortcuts,
    });
    useHotkeys('Escape', onCloseRaiseMenu, { 
        preventDefault: true,
        enabled: keyboardShortcuts,
    });

    useEffect(() => {
        if (inputRef.current && !isPortrait) {
            inputRef.current.focus();
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.select();
                }
            }, 0);
        }
    }, [inputRef.current]);

    const getDynamicPrecision = (val: number): number => {
        if (displayInBigBlinds) {
            // For BB display, we want to show 2 decimal places
            return 2;
        }

        if (val > toDisplayValue(currentUserAmount)) return 6;
        if (val === 0) return 0;
        const decimalPart = val.toString().split('.')[1] || '';
        if (!decimalPart) {
            return 0;
        }
        return 2;
    };

    // Get the appropriate unit symbol based on display preference
    const getUnitSymbol = (): string => {
        return displayInBigBlinds ? 'BB' : '$';
    };

    const maxSliderValue = isPLO
        ? Math.min(toDisplayValue(potLimit), toDisplayValue(currentUserAmount))
        : toDisplayValue(currentUserAmount);

    return (
        <VStack
            alignItems="center"
            justifyContent="center"
            spacing="1rem"
            w="100%"
            zIndex={1}
            px="1rem"
        >
            <HStack w="100%" alignItems="start">
                <VStack
                    bg={isInvalidRaise || (isPLO && fromDisplayValue(value) > potLimit) ? 'red.500' : 'brand.modalGray'}
                    borderRadius="0.75rem"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    w="50%"
                    h="calc(3rem + 8px)"
                >
                    <NumberInput
                        value={value}
                        onChange={handleChange}
                        min={0}
                        max={toDisplayValue(maxRaise)}
                        precision={getDynamicPrecision(value)}
                        h="100%"
                        w="100%"
                        p="4px"
                        border="none"
                        focusBorderColor="rgba(255, 255, 255, 0.2)"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEnterPress();
                            } else if (e.key === 'Escape') {
                                onCloseRaiseMenu();
                            }
                        }}
                    >
                        <Box
                            position="absolute"
                            left="1rem"
                            top="0"
                            bottom="0"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="2rem"
                            h="100%"
                        >
                            <Text fontSize="1.2rem" fontWeight="bold">
                                {getUnitSymbol()}
                            </Text>
                        </Box>
                        <NumberInputField
                            borderRadius="0.6rem"
                            border="0.5px solid"
                            borderColor="rgba(255, 255, 255, 0)"
                            textColor="white"
                            h="100%"
                            pl="3rem"
                            bg="rgba(0, 0, 0, 0.2)"
                            ref={inputRef}
                        />
                    </NumberInput>
                </VStack>
                <Box position="relative" w="25%">
                    <Box
                        position="absolute"
                        w="100%"
                        h="3rem"
                        bg={isInvalidRaise ? 'brand.gray40' : 'blue.800'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={0}
                    />
                    <APIButton
                        w="100%"
                        h="3rem"
                        endpoint={playerAction}
                        params={params}
                        variant={isInvalidRaise ? 'primaryDark' : 'raiseButton'}
                        onSuccess={onCloseRaiseMenu}
                        disabled={isInvalidRaise || (isPLO && fromDisplayValue(value) > potLimit)}
                        fontWeight="bold"
                        aria-label="Confirm Raise"
                        loadingOverride={isSubmitting}
                    >
                        {betText}
                    </APIButton>
                </Box>
                <Box position="relative" w="25%">
                    <Box
                        position="absolute"
                        w="100%"
                        h="3rem"
                        bg={'brand.gray25'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={0}
                    />
                    <Button
                        w="100%"
                        h="3rem"
                        variant="primaryDark"
                        onClick={onCloseRaiseMenu}
                        zIndex={10}
                        textColor="brand.textWhite"
                        fontWeight={800}
                        position="relative"
                        disabled={isSubmitting}
                    >
                        {`Back${hasPhysicalKeyboard && keyboardShortcuts && fullKeyboardText ? ' [Esc]' : ''}`}
                    </Button>
                </Box>
            </HStack>
            <RaiseActionsGrid
                setValue={handleGridValueSelect}
                selectedActionIndex={selectedActionIdx}
                displayInBigBlinds={displayInBigBlinds}
                bigBlindValue={bigBlindValue}
            />
            <Slider
                flex="1"
                w="80%"
                value={value}
                onChange={handleChange}
                min={toDisplayValue(minRaise)}
                focusThumbOnChange={false}
                max={maxSliderValue}
                step={
                    displayInBigBlinds
                        ? 0.1 // For BB display, step by 0.1 BB
                        : Math.max(
                              gameSettings?.small_blind_value / 1000000 / 10,
                              0.01,
                          ) // For dollar display
                }
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </VStack>
    );
};

export default RaiseMenu;
